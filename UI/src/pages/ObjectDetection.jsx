import { React, useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import CanvasComponent from '../components/CanvasComponent';
import ResponseBox from '../components/ResponseBox';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ImageDropZone from '../components/ImageDropZone';
import { ImageClient } from '../client/ImageClient';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: '#f8f9fa',
  border: '1px solid #e9ecef',
}));

const DetectionCountBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(3),
  top: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(8px)',
  border: '1px solid #e9ecef',
}));

const ObjectDetection = () => {
    const [file, setFile] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [ODResponse, setODResponse] = useState(null);
    const [ODData, setODData] = useState(null);
    const [ODText, setODText] = useState(null);
    const [uploadCount, setUploadCount] = useState(0);
    const [originalImageSrc, setOriginalImageSrc] = useState(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [detectionCounts, setDetectionCounts] = useState({});

    const [isObjectDetectionEnabled, setIsObjectDetectionEnabled] = useState(true); // 서버 상태 체크
    const serverUrl = import.meta.env.VITE_CORE_SERVER_URL;
    
    useEffect(() => {
        const serverStatusCheck = async () => {
            try {
                const response = await fetch(serverUrl+ "/serviceStatus/objectDetection");
                if (!response.ok) throw new Error("서버 응답 오류");
                const data = await response.json();
                setIsObjectDetectionEnabled(data.enabled && data.healthy);
            } catch (error) {
                console.error("서버가 응답하지 않습니다.", error);
                setIsObjectDetectionEnabled(false); // 서버가 응답하지 않으면 비활성화
            }
        }
        serverStatusCheck();
    }, []);


    // 클래스 번호와 한글 이름을 매핑하는 Map... 서버측으로 이동?
    const classMap = new Map([
        [0, '사람'], [1, '자전거'], [2, '자동차'], [3, '오토바이'], [4, '비행기'],
        [5, '버스'], [6, '기차'], [7, '트럭'], [8, '보트'], [9, '신호등'],
        [10, '소화전'], [11, '정지 표지'], [12, '주차 미터'], [13, '벤치'], [14, '새'],
        [15, '고양이'], [16, '개'], [17, '말'], [18, '양'], [19, '소'],
        [20, '코끼리'], [21, '곰'], [22, '얼룩말'], [23, '기린'], [24, '가방'],
        [25, '우산'], [26, '핸드백'], [27, '넥타이'], [28, '서류가방'], [29, '프리스비'],
        [30, '스키'], [31, '스노보드'], [32, '공'], [33, '연'], [34, '야구 배트'],
        [35, '야구 글러브'], [36, '스케이트보드'], [37, '서핑보드'], [38, '테니스 라켓'], [39, '병'],
        [40, '와인잔'], [41, '컵'], [42, '포크'], [43, '나이프'], [44, '숟가락'],
        [45, '그릇'], [46, '바나나'], [47, '사과'], [48, '샌드위치'], [49, '오렌지'],
        [50, '브로콜리'], [51, '당근'], [52, '핫도그'], [53, '피자'], [54, '도넛'],
        [55, '케이크'], [56, '의자'], [57, '쇼파'], [58, '화분'], [59, '침대'],
        [60, '식탁'], [61, '화장실'], [62, '모니터'], [63, '노트북'], [64, '마우스'],
        [65, '리모컨'], [66, '키보드'], [67, '휴대폰'], [68, '전자레인지'], [69, '오븐'],
        [70, '토스터'], [71, '싱크대'], [72, '냉장고'], [73, '책'], [74, '시계'],
        [75, '꽃병'], [76, '가위'], [77, '테디베어'], [78, '헤어드라이어'], [79, '칫솔']
    ]);

    // 파일 선택
    const handleFileChange = (event) => {
        setUploadCount(0);
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            console.log("excuting selected file trigger")
            const reader = new FileReader();

            reader.onload = (e) => {
                setImageSrc(e.target.result);
                setOriginalImageSrc(e.target.result);
                // 파일이 새로 선택될 때 detection 관련 상태 초기화
                setODResponse(null);
                setODData(null);
                setODText(null);
                setDetectionCounts({});
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    // 서버에 전송 및 결과 받아오기
    const handleUpload = async () => { 
        let imageFile = file;

        // 파일 없으면, 이미지 src 없으면 종료
        if (!file && !imageSrc) {
            console.log("파일 업데이트 안됨");
            return;
        }
        setUploadCount(uploadCount + 1);

        // 파일 없으면 이미지 src를 Blob으로 변환
        if (!file) {
            const response = await fetch(imageSrc);
            const blob = await response.blob();
            imageFile = blob;
        }

        const data = await ImageClient("objectDetection", imageFile);
        setODResponse(data);
    } 

    // OD 응답에서 데이터 추출
    useEffect(() => {
        if (ODResponse && ODResponse?.data) {
            setODData(ODResponse["data"]);
            console.log(ODResponse["data"]);

            // 감지된 객체의 개수를 세는 로직
            const counts = {};
            ODResponse["data"].forEach((data) => {
                const className = classMap.get(data.class) || `객체 ${data.class}`;
                counts[className] = (counts[className] || 0) + 1;
            });
            setDetectionCounts(counts);

            // 사람 수 계산
            const manCount = counts['사람'] || 0;
            setODText(`사람 수: ${manCount}`);
        }
    }, [ODResponse]);

    // 버튼 눌러서 input 기능 실행
    const fileInputRef = useRef(null); // 파일 input을 참조하기 위한 useRef
    const triggerFileInput = () => {
        fileInputRef.current.click();
    }

    // 초기화 핸들러
    const handleReset = () => {
        if (originalImageSrc) {
            setImageSrc(originalImageSrc);
            setODResponse(null);
            setODData(null);
            setODText(null);
            setUploadCount(0);
            setFile(null);
        }
    }

    // 자른 이미지 처리
    const handleCropImage = (croppedImage) => {
        setImageSrc(croppedImage);
        setFile(null); // 원본 파일 초기화
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target.result);
                setOriginalImageSrc(e.target.result);
            };
            reader.readAsDataURL(droppedFile);
            setFile(droppedFile);
            setODResponse(null);
            setUploadCount(0);
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#001529' }}>
                    물체 탐지
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" paragraph>
                    이미지 속 물체를 탐지합니다.
                </Typography>

                {!isObjectDetectionEnabled && (
                    <Typography 
                        variant="h6" 
                        color="error" 
                        sx={{ textAlign: 'center', mb: 3 }}
                    >
                        지금은 사용할 수 없습니다
                    </Typography>
                )}

                <StyledPaper elevation={0} sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={2}>
                        <Button 
                            variant="contained" 
                            onClick={triggerFileInput}
                            disabled={!isObjectDetectionEnabled} // 버튼 비활성화
                            sx={{
                                backgroundColor: isObjectDetectionEnabled ? '#001529' : '#d3d3d3', // 비활성화 시 회색
                                color: isObjectDetectionEnabled ? 'white' : '#808080',
                                '&:hover': {
                                    backgroundColor: isObjectDetectionEnabled ? '#002140' : '#d3d3d3',
                                },
                            }}
                        >
                            파일 선택
                        </Button>
                        <input ref={fileInputRef} type="file" onChange={handleFileChange} style={{ display: 'none' }} />

                        <Button 
                            variant="contained" 
                            onClick={handleUpload}
                            disabled={!isObjectDetectionEnabled} // 버튼 비활성화
                            sx={{
                                backgroundColor: isObjectDetectionEnabled ? '#001529' : '#d3d3d3', // 비활성화 시 회색
                                color: isObjectDetectionEnabled ? 'white' : '#808080',
                                '&:hover': {
                                    backgroundColor: isObjectDetectionEnabled ? '#002140' : '#d3d3d3',
                                },
                            }}
                        >
                            물체 탐지
                        </Button>

                        {originalImageSrc && (
                            <Button 
                                variant="outlined" 
                                startIcon={<RestartAltIcon />}
                                onClick={handleReset}
                                disabled={!isObjectDetectionEnabled} // 버튼 비활성화
                                sx={{
                                    borderColor: isObjectDetectionEnabled ? '#001529' : '#d3d3d3',
                                    color: isObjectDetectionEnabled ? '#001529' : '#808080',
                                    '&:hover': {
                                        borderColor: isObjectDetectionEnabled ? '#002140' : '#d3d3d3',
                                        backgroundColor: isObjectDetectionEnabled ? 'rgba(0, 21, 41, 0.04)' : 'transparent',
                                    },
                                }}
                            >
                                초기화
                            </Button>
                        )}
                    </Stack>
                </StyledPaper>

                <StyledPaper elevation={0} sx={{ position: 'relative' }}>
                    {imageSrc ? (
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '400px',
                            backgroundColor: '#ffffff',
                            borderRadius: 1,
                            overflow: 'hidden'
                        }}> 
                            <CanvasComponent 
                                imageSrc={imageSrc} 
                                detectionData={ODData} 
                                pointNum={1} 
                                onCropImage={handleCropImage}
                            />
                            {Object.keys(detectionCounts).length > 0 && (
                                <DetectionCountBox>
                                    <Typography variant="subtitle2" sx={{ color: '#1a237e', mb: 1, fontWeight: 500 }}>
                                        감지된 객체
                                    </Typography>
                                    {Object.entries(detectionCounts).map(([className, count]) => (
                                        <Typography key={className} variant="body2" sx={{ color: '#666' }}>
                                            {className}: {count}
                                        </Typography>
                                    ))}
                                </DetectionCountBox>
                            )}
                        </Box>
                    ) : (
                        <ImageDropZone
                            isDragActive={isDragActive}
                            onDragEnter={isObjectDetectionEnabled ? handleDragEnter : undefined} // 드래그 비활성화
                            onDragLeave={isObjectDetectionEnabled ? handleDragLeave : undefined} // 드래그 비활성화
                            onDragOver={isObjectDetectionEnabled ? handleDragOver : undefined} // 드래그 비활성화
                            onDrop={isObjectDetectionEnabled ? handleDrop : undefined} // 드래그 비활성화
                            onClick={isObjectDetectionEnabled ? triggerFileInput : undefined} // 클릭 비활성화
                            disabled={!isObjectDetectionEnabled} // 드래그 영역 비활성화
                        />
                    )}
                </StyledPaper>
                {file && <Typography variant="subtitle1" color="text.secondary" paragraph>
                    이미지를 드래그하여 자를 수 있습니다.
                </Typography>}
            </Box>
        </Container>
    );
};

export default ObjectDetection;