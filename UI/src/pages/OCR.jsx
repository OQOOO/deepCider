import { React, useState, useEffect, useRef } from 'react';
import CanvasComponent from '../components/CanvasComponent';

const OCR = () => {
    const [file, setFile] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [message, setMessage] = useState("");
    const [ocrResult, setocrResult] = useState(null);
    const [ocrText, setocrText] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            console.log("excuting selected file trigger")
            const reader = new FileReader();

            reader.onload = (e) => {
                setImageSrc(e.target.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUpload = async () => { 
        if (!file) {
            setMessage("파일을 선택해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:37777/ocr", {
                method: "POST",
                body: formData
            });
            const data = await response.json();  // Promise 해제 후 저장
            setocrResult(data);
        } catch (error) {
            console.error("Error:", error);
        }
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

    useEffect(() => {
        console.log("ocrResult: ", ocrResult);
        if (ocrResult && ocrResult?.data) {
            let text = "";
            ocrResult["data"].forEach((data) => {
                text += data["text"] + " ";
            });
            setocrText(text);
        }
    }, [ocrResult]);

    return (
        <div>
            <h1>글자 추출</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>업로드</button>
            
            {/* <p>{JSON.stringify(ocrResult)}</p> */}
            <p>{ocrText}</p>

            {/* test 
                인자값으로 박스 위치값 넘겨준 후, 내부에서 처리 (구현예정)
            */}
            <div> 
                {imageSrc && <CanvasComponent imageSrc={imageSrc} ocrData={ocrResult}/>}
            </div>
        </div>

        
    )
};

export default OCR;