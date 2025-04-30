import React, { useState, useEffect } from 'react';

const AdminPage = () => {
    // 서비스 상태 조회
    const [isChatGPTEnabled, setIsChatGPTEnabled] = useState(true);
    const [isDeepSeekEnabled, setIsDeepSeekEnabled] = useState(true);

    useEffect(() => {

        fetch("http://localhost:37777/serviceStatus")
        .then((res) => {
            if (!res.ok) throw new Error("서버 응답 오류");
            return res.json();
        }).then((data) => {
            setIsChatGPTEnabled(data.isChatGPTEnabled);
            setIsDeepSeekEnabled(data.isServerLLMEnabled); // DeepSeek == 서버 LLM이라고 가정
        }).catch((err) => {
            console.error("상태 조회 실패:", err);
        });
    }, []);


    const toggleChatGPT = async () => {
        const token = localStorage.getItem("token");
        const backEndPort = "37777";
        const api = "setServiceStatus/chatGPT"; // API 엔드포인트
        const response = await fetch(`http://localhost:${backEndPort}/${api}`, {
            method: "POST",
            headers: { "Content-Type": "application/json",
                       "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(!isChatGPTEnabled), // 현재 상태 반전
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            setIsChatGPTEnabled(data); // 상태 업데이트
        }
        else {
            const errorData = await response.text();
        }
    };

    const toggleDeepSeek = async () => {
        const token = localStorage.getItem("token");
        const backEndPort = "37777";
        const api = "setServiceStatus/deepseek"; // API 엔드포인트
        const response = await fetch(`http://localhost:${backEndPort}/${api}`, {
            method: "POST",
            headers: { "Content-Type": "application/json",
                       "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(!isDeepSeekEnabled), // 현재 상태 반전
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            setIsDeepSeekEnabled(data); // 상태 업데이트
        }
        else {
            const errorData = await response.text();
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ marginBottom: '20px', color: '#001529' }}>관리자 화면</h1>
            <p style={{ marginBottom: '40px', color: '#555' }}>AI 서비스 상태를 관리할 수 있습니다.</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                {/* ChatGPT 관리 카드 */}
                <div style={{
                    flex: 1,
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#fff',
                }}>
                    <h3 style={{ marginBottom: '10px', color: '#001529' }}>ChatGPT</h3>
                    <p style={{ color: isChatGPTEnabled ? '#4CAF50' : '#f44336', fontWeight: 'bold', marginBottom: '20px' }}>
                        {isChatGPTEnabled ? '제공 중' : '제공 중단됨'}
                    </p>
                    <button
                        onClick={toggleChatGPT}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: isChatGPTEnabled ? '#808080' : '#4CAF50', // 회색(#808080)으로 변경
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px',
                        }}
                    >
                        {isChatGPTEnabled ? '제공 중단' : '제공'}
                    </button>
                </div>

                {/* deepseek 관리 카드 */}
                <div style={{
                    flex: 1,
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#fff',
                }}>
                    <h3 style={{ marginBottom: '10px', color: '#001529' }}>deepseek</h3>
                    <p style={{ color: isDeepSeekEnabled ? '#4CAF50' : '#f44336', fontWeight: 'bold', marginBottom: '20px' }}>
                        {isDeepSeekEnabled ? '제공 중' : '제공 중단됨'}
                    </p>
                    <button
                        onClick={toggleDeepSeek}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: isDeepSeekEnabled ? '#808080' : '#4CAF50', // 회색(#808080)으로 변경
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px',
                        }}
                    >
                        {isDeepSeekEnabled ? '제공 중단' : '제공'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;