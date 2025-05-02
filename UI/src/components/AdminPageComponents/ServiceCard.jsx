import React, { useState, useEffect } from 'react';

const ServiceCard = ({serviceName, statusApi, toggleApi}) => {
    const [isServerRunning, setIsServerRunning] = useState(false);
    const [isServiceEnabled, setIsServiceEnabled] = useState(true);
    const [isModuleHealthy, setIsModuleHealthy] = useState(true);

    const [cardMessage, setCardMessage] = useState("상태 확인중...");
    const [buttonText, setButtonText] = useState("대기중"); // 버튼 텍스트 상태

    const serverURL = "http://localhost:37777";

    useEffect(() => {

        const checkServiceStatus = async () => {
            try {
                const response = await fetch(serverURL+statusApi);
                if (!response.ok) throw new Error("서버 응답 오류");
                const data = await response.json();
                setIsServerRunning(true);

                setIsServiceEnabled(data.enabled);
                setIsModuleHealthy(data.healthy);

                if (!data.healthy) {
                    setCardMessage("모듈 종료됨");
                    setButtonText("제공 불가");
                } else {
                    setCardMessage(data.enabled ? "제공 중" : "제공 중단됨");
                    setButtonText(data.enabled ? "제공 중단" : "제공");
                }
            } catch (error) {
                console.error("서버가 응답하지 않습니다.", error);
                setIsServerRunning(false);
            }
        }
        checkServiceStatus();

    }, []);

    const toggleEnabled = async () => {
        if (!isServerRunning) return; // 서버가 응답하지 않을 경우 동작하지 않음
        const token = localStorage.getItem("token");
        // const backEndPort = "37777";
        // const api = "setServiceStatus/deepseek"; // API 엔드포인트
        const response = await fetch(serverURL+toggleApi, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(!isServiceEnabled), // 현재 상태 반전
        });

        if (response.ok) {
            const data = await response.json();
            setIsServiceEnabled(data.serviceEnabled); // 상태 업데이트
            setCardMessage(data.serviceEnabled ? "제공 중" : "제공 중단됨");
            setButtonText(data.serviceEnabled ? "제공 중단" : "제공"); // 버튼 텍스트 업데이트
        } else {
            const errorData = await response.text();
            console.error(errorData);
        }
    };




    return (
        <div style={{
            display: 'flex',
            width: '500px'
        }}>
            <div style={{
                flex: 1,
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
            }}>
                <h3 style={{ marginBottom: '10px', color: '#001529' }}>{serviceName}</h3>
                <p style={{ color: isModuleHealthy && isServiceEnabled && isServerRunning ? '#4CAF50' : '#f44336', fontWeight: 'bold', marginBottom: '20px' }}>
                    { cardMessage}
                </p>
                <button
                    onClick={toggleEnabled}
                    disabled={!isModuleHealthy || !isServerRunning} // 모듈 상태가 비정상일 경우 버튼 비활성화
                    style={{
                        padding: '10px 20px',
                        backgroundColor: isModuleHealthy && isServerRunning
                            ? (isServiceEnabled ? '#808080' : '#4CAF50') // 서버가 응답할 때만 색상 변경
                            : '#d3d3d3', // 모듈 상태가 비정상일 경우 회색
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: isModuleHealthy && isServerRunning ? 'pointer' : 'not-allowed', // 모듈 상태가 비정상일 경우 커서 변경
                        fontSize: '16px',
                    }}
                >
                    {buttonText} {/* 버튼 텍스트 상태 사용 */}
                </button>
            </div>
        </div>
    );
};

export default ServiceCard;