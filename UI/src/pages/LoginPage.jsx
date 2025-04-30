import React, { useState } from 'react';

const LoginPage = ({ setPage }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        // 간단한 유효성 검사
        if (!id || !password) {
            setError('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        // 로그인 로직 (예: API 호출)
        const backEndPort = 37777; // 백엔드 포트 번호
        const api = "login"; // API 엔드포인트
        const token = null;

        try {
            const response = await fetch(`http://localhost:${backEndPort}/${api}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    id: id,
                    password: password 
                }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token); // 토큰을 로컬 스토리지에 저장
                localStorage.setItem("role", data.user.role); // 사용자 ID를 로컬 스토리지에 저장
                setPage("dashboard"); // 로그인 성공 시 대시보드 페이지로 이동
            }
            else {
                const errorData = await response.text();
                console.error('로그인 실패:', errorData);
                setError(errorData);
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSignUp = () => {
        // 회원가입 페이지로 이동 (예: React Router 사용)
        setPage("signupPage");
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <h1>Login Page</h1>
            <p>Welcome to the login page!</p>
            <div style={{ marginBottom: '16px' }}>
                <input
                    type="id"
                    placeholder="이메일"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    }}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    }}
                />
            </div>
            {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}
            <button
                onClick={handleLogin}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#001529',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginBottom: '8px',
                }}
            >
                로그인
            </button>
            <button
                onClick={handleSignUp}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#f0f0f0',
                    color: '#001529',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                회원가입
            </button>
        </div>
    );
};

export default LoginPage;