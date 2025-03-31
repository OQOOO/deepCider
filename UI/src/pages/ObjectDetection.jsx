import { React, useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CanvasComponentForYolo from '../components/CanvasComponentForYolo';
import ResponseBox from '../components/ResponseBox';

const ObjectDetection = () => {
    const [file, setFile] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [ODResponse, setODResponse] = useState(null);
    const [ODData, setODData] = useState(null);
    const [ODText, setODText] = useState(null);
    const [uploadCount, setUploadCount] = useState(0);
    // OD = Object Detection

    // 파일 선택
    const handleFileChange = (event) => {
        setUploadCount(0);
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        // 이미지를 src로 변환해서 변수에 할당함 (시각화 위해 필요)
        if (selectedFile) {
            console.log("excuting selected file trigger")
            const reader = new FileReader();

            reader.onload = (e) => {
                setImageSrc(e.target.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    // 서버에 전송 및 결과 받아오기
    const handleUpload = async () => { 

        if (!file || uploadCount > 100000000) {
            console.log("파일 업데이트 안됨");
            return;
        }
        setUploadCount(uploadCount + 1);

        console.log("uploadCount", uploadCount);

        const formData = new FormData();
        formData.append("file", file);
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

    return (
        <div>
            <Box sx={{marginLeft:2}}>
                <h1>이미지에서 물체 탐지</h1>
                <p>
                    이미지 속 물체를 탐지합니다.
                </p>
            </Box>
            <Button variant="outlined" 
                    onClick={triggerFileInput}
                    sx={{
                        m: 2
                    }}
            >파일 선택</Button>
            <input ref={fileInputRef} type="file" onChange={handleFileChange} style={{display:'none'}}/>

            <Button variant="outlined" 
                    onClick={handleUpload}
                    sx={{
                        m: 2,
                        ml: 0
                    }}
            >물체 탐지</Button>
            
            <ResponseBox>{ODText}</ResponseBox>

            <Box sx={{m:2}}> 
                {imageSrc && <CanvasComponentForYolo imageSrc={imageSrc} ODData={ODData}/>}
            </Box>
        </div>

        
    )
};

export default ObjectDetection;