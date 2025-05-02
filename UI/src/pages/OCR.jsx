import { React, useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
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

const OCR = () => {
    const [file, setFile] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [OCRResponse, setOCRResponse] = useState(null);
    const [OCRData, setOCRData] = useState(null);
    const [OCRText, setOCRText] = useState(null);
    const [uploadCount, setUploadCount] = useState(0);
    const [originalImageSrc, setOriginalImageSrc] = useState(null);  // 원본 이미지 URL 저장
    const [isDragActive, setIsDragActive] = useState(false);

    const [isOcrEnabled, setIsOcrEnabled] = useState(true); // OCR 서비스 활성화 여부
    const serverUrl = import.meta.env.VITE_CORE_SERVER_URL;

    useEffect(() => {
        const ocrStatusCheck = async () => {
            try {
                const response = await fetch(serverUrl + "/serviceStatus/OCR");
                if (!response.ok) throw new Error("서버 응답 오류");
                const data = await response.json();
                setIsOcrEnabled(data.enabled && data.healthy);
            } catch (error) {
                console.error("서버가 응답하지 않습니다.", error);
                setIsOcrEnabled(false); // 서버가 응답하지 않으면 비활성화
            }
        }
        ocrStatusCheck();
        // 서버 상태 체크
    }, []);

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
                // 파일이 새로 선택될 때 OCR 관련 상태 초기화
                setOCRResponse(null);
                setOCRData(null);
                setOCRText(null);
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

        const data = await ImageClient("OCR", imageFile);
        setOCRResponse(data);
    } 

    /**
     * json 형식
     * {
     *  sucess: true,
     *  message: "성공",
     *  data: [
     *  {
     *   text: "안녕하세요",
     *   box: [[0, 0], [100, 0], [100, 100], [0, 100]]
     *  },
     *  {
     *   text: "반갑습니다",
     *   box: [[100, 0], [200, 0], [200, 100], [100, 100]]
     *  }
     * ]
     * 
     * 지금 검출된 글자가 없는경우 CanvasComponet와 여기 화면표시 로직에서 ?. 를 사용해 처리중임
     * 해당 부분은 추후 수정예정 (여기서 수정해서 넘겨주는 방식)
     */

    // OCR 응답에서 데이터 추출
    useEffect(() => {
        if (OCRResponse && OCRResponse?.data) {
            setOCRData(OCRResponse["data"]);
            console.log(OCRResponse["data"]);
        }
    }, [OCRResponse]);


    // OCR 데이터에서 텍스트 추출
    useEffect(() => {
        if (OCRData) {
            let text = "";
            OCRResponse["data"].forEach((data) => {
                text += data["text"] + " ";
            });
            setOCRText(text);
        }
    }, [OCRData]);

    // 버튼 눌러서 input 기능 실행
    const fileInputRef = useRef(null); // 파일 input을 참조하기 위한 useRef
    const triggerFileInput = () => {
        fileInputRef.current.click();
    }

    // 자른 이미지 처리
    const handleCropImage = (croppedImage) => {
        setImageSrc(croppedImage);
        setFile(null); // 원본 파일 초기화
    };

    // 초기화 핸들러
    const handleReset = () => {
        if (originalImageSrc) {
            setImageSrc(originalImageSrc);
            setOCRResponse(null);
            setOCRData(null);
            setOCRText(null);
            setUploadCount(0);
            setFile(null);
        }
    }

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
            setOCRResponse(null);
            setUploadCount(0);
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#001529' }}>
                    글자 추출
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" paragraph>
                    이미지 속 글자를 복사 가능한 텍스트로 추출합니다.
                </Typography>

                {!isOcrEnabled && (
                    <Typography 
                        variant="h6" 
                        color="error" 
                        sx={{ textAlign: 'center', mb: 3 }}
                    >
                        지금은 사용할 수 없습니다
                    </Typography>
                )}

                <StyledPaper elevation={0} sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={2} sx={{ mb: OCRResponse ? 2 : 0 }}>
                        <Button 
                            variant="contained" 
                            onClick={triggerFileInput}
                            disabled={!isOcrEnabled} // 버튼 비활성화
                            sx={{
                                backgroundColor: isOcrEnabled ? '#001529' : '#d3d3d3', // 비활성화 시 회색
                                color: isOcrEnabled ? 'white' : '#808080',
                                '&:hover': {
                                    backgroundColor: isOcrEnabled ? '#002140' : '#d3d3d3',
                                },
                            }}
                        >
                            파일 선택
                        </Button>
                        <input ref={fileInputRef} type="file" onChange={handleFileChange} style={{ display: 'none' }} />

                        <Button 
                            variant="contained" 
                            onClick={handleUpload}
                            disabled={!isOcrEnabled} // 버튼 비활성화
                            sx={{
                                backgroundColor: isOcrEnabled ? '#001529' : '#d3d3d3', // 비활성화 시 회색
                                color: isOcrEnabled ? 'white' : '#808080',
                                '&:hover': {
                                    backgroundColor: isOcrEnabled ? '#002140' : '#d3d3d3',
                                },
                            }}
                        >
                            글자 추출
                        </Button>

                        {originalImageSrc && (
                            <Button 
                                variant="outlined" 
                                startIcon={<RestartAltIcon />}
                                onClick={handleReset}
                                disabled={!isOcrEnabled} // 버튼 비활성화
                                sx={{
                                    borderColor: isOcrEnabled ? '#001529' : '#d3d3d3',
                                    color: isOcrEnabled ? '#001529' : '#808080',
                                    '&:hover': {
                                        borderColor: isOcrEnabled ? '#002140' : '#d3d3d3',
                                        backgroundColor: isOcrEnabled ? 'rgba(0, 21, 41, 0.04)' : 'transparent',
                                    },
                                }}
                            >
                                초기화
                            </Button>
                        )}
                    </Stack>

                    {OCRResponse && (
                        <>
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    fontWeight: 500,
                                    color: '#1a237e',
                                    mb: 1
                                }}
                            >
                                추출된 텍스트
                            </Typography>
                            <ResponseBox>{OCRText}</ResponseBox>
                        </>
                    )}
                </StyledPaper>
                

                <StyledPaper elevation={0}>
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
                                detectionData={OCRData} 
                                pointNum={4}
                                onCropImage={handleCropImage}
                            />
                        </Box>
                    ) : (
                        <ImageDropZone
                            isDragActive={isDragActive}
                            onDragEnter={isOcrEnabled ? handleDragEnter : undefined} // 드래그 비활성화
                            onDragLeave={isOcrEnabled ? handleDragLeave : undefined} // 드래그 비활성화
                            onDragOver={isOcrEnabled ? handleDragOver : undefined} // 드래그 비활성화
                            onDrop={isOcrEnabled ? handleDrop : undefined} // 드래그 비활성화
                            onClick={isOcrEnabled ? triggerFileInput : undefined} // 클릭 비활성화
                            disabled={!isOcrEnabled} // 드래그 영역 비활성화
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

export default OCR;