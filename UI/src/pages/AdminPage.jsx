import React, { useState, useEffect } from 'react';
import ServiceCard from '../components/AdminPageComponents/ServiceCard.jsx';

const AdminPage = () => {
    const [serverStatus, setServerStatus] = useState(false);
    const [serverStatusMessage, setServerStatusMessage] = useState("서버 상태 확인 중...");


    // 카드별로 각각 서버 체크 등의 기능을 수행하는 컴포넌트로 분리
    useEffect(() => {
        const serverCheck = async () => {

            try {
                const response = await fetch("http://localhost:37777/serverHealth");
                if (!response.ok) throw new Error("서버 응답 오류");
                const data = await response.json();
                console.log(data.healthy);

                setServerStatus(data.healthy); // 서버 상태 업데이트
                setServerStatusMessage("서버가 정상 작동 중입니다."); // 서버 상태 메시지 업데이트  
            } catch (error) {
                console.error("서버가 응답하지 않습니다.", error);
                setServerStatus(false); // 서버가 응답하지 않으면 비활성화
                setServerStatusMessage("서버가 응답하지 않습니다."); // 서버 상태 메시지 업데이트
            }
            
            console.log("서버 상태:", serverStatus);
        };
        serverCheck();
    }, []);


    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ marginBottom: '20px', color: '#001529' }}>관리자 화면</h1>
            <p style={{ marginBottom: '40px', color: '#555' }}>{serverStatusMessage}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                {/* ChatGPT 관리 카드 */}
              
                <ServiceCard serviceName="ChatGPT" statusApi="/serviceStatus/openAI" toggleApi="/setServiceStatus/chatGPT"/>
                <ServiceCard serviceName="Deepseek" statusApi="/serviceStatus/deepseek" toggleApi="/setServiceStatus/deepseek"/>
                <ServiceCard serviceName="PaddleOCR" statusApi="/serviceStatus/OCR" toggleApi="/setServiceStatus/OCR"/>
                <ServiceCard serviceName="Yolo" statusApi="/serviceStatus/objectDetection" toggleApi="/setServiceStatus/objectDetection"/>
            </div>
        </div>
    );
};

export default AdminPage;