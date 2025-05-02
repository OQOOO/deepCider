import React, { useState, useEffect } from 'react';
import ServerStatusChecker from '../client/ServerStatusChecker.jsx';
import ServiceCard from '../components/AdminPageComponents/ServiceCard.jsx';

const AdminPage = () => {
    const [serverStatus, setServerStatus] = useState(null);
    const [serverStatusMessage, setServerStatusMessage] = useState("서버 상태 확인 중...");


    // 카드별로 각각 서버 체크 등의 기능을 수행하는 컴포넌트로 분리
    let statusChecker = new ServerStatusChecker();
    useEffect(() => {
        const serverCheck = async () => {
            await statusChecker.checkServerStatus();
            setServerStatus(statusChecker); // 서버 상태 업데이트
            setServerStatusMessage(statusChecker.isServerRunning ? "서버가 정상 작동 중입니다." : "서버가 응답하지 않습니다.");
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