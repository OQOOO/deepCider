import { React, useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import CanvasComponentForYolo from '../components/CanvasComponentForYolo';
import CanvasComponent from '../components/CanvasComponent';
import ResponseBox from '../components/ResponseBox';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: '#f8f9fa',
  border: '1px solid #e9ecef',
}));

const DropZone = styled(Box)(({ theme, isDragActive }) => ({
  border: `2px dashed ${isDragActive ? '#1a237e' : '#e9ecef'}`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: isDragActive ? 'rgba(26, 35, 126, 0.05)' : '#ffffff',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '#1a237e',
    backgroundColor: 'rgba(26, 35, 126, 0.05)',
  },
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
    // OD = Object Detection

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
        if (!file && !imageSrc) {
            console.log("파일 업데이트 안됨");
            return;
        }
        setUploadCount(uploadCount + 1);

        console.log("uploadCount", uploadCount);

        const formData = new FormData();
        if (file) {
            formData.append("file", file);
        } else if (imageSrc) {
            // base64 이미지를 Blob으로 변환
            const response = await fetch(imageSrc);
            const blob = await response.blob();
            formData.append("file", blob, "cropped_image.png");
        }
        try {
            const response = await fetch("http://localhost:37777/objectDetection", {
                method: "POST",
                body: formData
            });
            const data = await response.json();  // Promise 해제 후 저장
            setODResponse(data);
        } catch (error) {
            console.error("Error:", error);
        }
    } 

    // OD 응답에서 데이터 추출
    useEffect(() => {
        if (ODResponse && ODResponse?.data) {
            setODData(ODResponse["data"]);
            console.log(ODResponse["data"]);

            // 감지된 객체의 개수를 세는 로직
            const counts = {};
            ODResponse["data"].forEach((data) => {
                const className = data.class === 0 ? '사람' : 
                                data.class === 1 ? '자전거' : 
                                data.class === 2 ? '자동차' : 
                                data.class === 3 ? '오토바이' : 
                                data.class === 4 ? '비행기' : 
                                data.class === 5 ? '버스' : 
                                data.class === 6 ? '기차' : 
                                data.class === 7 ? '트럭' : 
                                data.class === 8 ? '보트' : 
                                data.class === 9 ? '신호등' : 
                                data.class === 10 ? '소화전' : 
                                data.class === 11 ? '정지 표지' : 
                                data.class === 12 ? '주차 미터' : 
                                data.class === 13 ? '벤치' : 
                                data.class === 14 ? '새' : 
                                data.class === 15 ? '고양이' : 
                                data.class === 16 ? '개' : 
                                data.class === 17 ? '말' : 
                                data.class === 18 ? '양' : 
                                data.class === 19 ? '소' : 
                                data.class === 20 ? '코끼리' : 
                                data.class === 21 ? '곰' : 
                                data.class === 22 ? '얼룩말' : 
                                data.class === 23 ? '기린' : 
                                data.class === 24 ? '가방' : 
                                data.class === 25 ? '우산' : 
                                data.class === 26 ? '핸드백' : 
                                data.class === 27 ? '넥타이' : 
                                data.class === 28 ? '서류가방' : 
                                data.class === 29 ? '프리스비' : 
                                data.class === 30 ? '스키' : 
                                data.class === 31 ? '스노보드' : 
                                data.class === 32 ? '공' : 
                                data.class === 33 ? '연' : 
                                data.class === 34 ? '야구 배트' : 
                                data.class === 35 ? '야구 글러브' : 
                                data.class === 36 ? '스케이트보드' : 
                                data.class === 37 ? '서핑보드' : 
                                data.class === 38 ? '테니스 라켓' : 
                                data.class === 39 ? '병' : 
                                data.class === 40 ? '와인잔' : 
                                data.class === 41 ? '컵' : 
                                data.class === 42 ? '포크' : 
                                data.class === 43 ? '나이프' : 
                                data.class === 44 ? '숟가락' : 
                                data.class === 45 ? '그릇' : 
                                data.class === 46 ? '바나나' : 
                                data.class === 47 ? '사과' : 
                                data.class === 48 ? '샌드위치' : 
                                data.class === 49 ? '오렌지' : 
                                data.class === 50 ? '브로콜리' : 
                                data.class === 51 ? '당근' : 
                                data.class === 52 ? '핫도그' : 
                                data.class === 53 ? '피자' : 
                                data.class === 54 ? '도넛' : 
                                data.class === 55 ? '케이크' : 
                                data.class === 56 ? '의자' : 
                                data.class === 57 ? '쇼파' : 
                                data.class === 58 ? '화분' : 
                                data.class === 59 ? '침대' : 
                                data.class === 60 ? '식탁' : 
                                data.class === 61 ? '화장실' : 
                                data.class === 62 ? '모니터' : 
                                data.class === 63 ? '노트북' : 
                                data.class === 64 ? '마우스' : 
                                data.class === 65 ? '리모컨' : 
                                data.class === 66 ? '키보드' : 
                                data.class === 67 ? '휴대폰' : 
                                data.class === 68 ? '전자레인지' : 
                                data.class === 69 ? '오븐' : 
                                data.class === 70 ? '토스터' : 
                                data.class === 71 ? '싱크대' : 
                                data.class === 72 ? '냉장고' : 
                                data.class === 73 ? '책' : 
                                data.class === 74 ? '시계' : 
                                data.class === 75 ? '꽃병' : 
                                data.class === 76 ? '가위' : 
                                data.class === 77 ? '테디베어' : 
                                data.class === 78 ? '헤어드라이어' : 
                                data.class === 79 ? '칫솔' : 
                                `객체 ${data.class}`;
                counts[className] = (counts[className] || 0) + 1;
            });
            setDetectionCounts(counts);

            let manCount = 0;
            ODResponse["data"].forEach((data) => {
                if (data.class == 0) {
                    manCount += 1;
                }
            });
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
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                    이미지에서 물체 탐지
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" paragraph>
                    이미지 속 물체를 탐지합니다.
                </Typography>

                <StyledPaper elevation={0} sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={2}>
                        <Button 
                            variant="contained" 
                            onClick={triggerFileInput}
                            sx={{
                                backgroundColor: '#1a237e',
                                '&:hover': {
                                    backgroundColor: '#000051',
                                },
                            }}
                        >
                            파일 선택
                        </Button>
                        <input ref={fileInputRef} type="file" onChange={handleFileChange} style={{display:'none'}}/>

                        <Button 
                            variant="contained" 
                            onClick={handleUpload}
                            sx={{
                                backgroundColor: '#1a237e',
                                '&:hover': {
                                    backgroundColor: '#000051',
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
                                sx={{
                                    borderColor: '#1a237e',
                                    color: '#1a237e',
                                    '&:hover': {
                                        borderColor: '#000051',
                                        backgroundColor: 'rgba(26, 35, 126, 0.04)',
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
                            {/* <CanvasComponentForYolo imageSrc={imageSrc} ODData={ODData}/> */}
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
                        <DropZone
                            isDragActive={isDragActive}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={triggerFileInput}
                        >
                            <Typography variant="h6" sx={{ color: '#1a237e', mb: 1 }}>
                                이미지를 드래그하여 업로드
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                또는 클릭하여 파일 선택
                            </Typography>
                        </DropZone>
                    )}
                </StyledPaper>
            </Box>
        </Container>
    );
};

export default ObjectDetection;