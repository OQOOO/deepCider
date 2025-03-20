import { React, useState } from 'react';

const OCR = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [responseText, setResponseText] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
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
            setResponseText(response.text());
        } catch (error) {
            console.error("Error:", error);
        }
    } 

    return (
        <div>
            <h1>글자 추출</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>업로드</button>
            <p>{responseText}</p>
        </div>
    )
};

export default OCR;