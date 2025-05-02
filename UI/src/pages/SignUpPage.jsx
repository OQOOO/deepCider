import React, { useState } from 'react';

const SignUpPage = ({ setPage }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        // 간단한 유효성 검사
        if (!id || !password) {
            setError('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        console.log(password, id)

        const backEndPort = 37777; // 백엔드 포트 번호
        const api = "signup"; // API 엔드포인트
        
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
                const data = await response.text();
                console.log('회원가입 성공:', data);
                setPage("dashboard"); // 회원가입 성공 시 로그인 페이지로 이동
            }
            else {
                const errorData = await response.text();
                console.error('회원가입 실패:', errorData);
                setError(errorData);
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <h1>회원가입</h1>
            <p>Create your account</p>
            <div style={{ marginBottom: '16px' }}>
                <input
                    type="text"
                    placeholder="아이디"
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
                onClick={handleSignUp}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#001529',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                회원가입
            </button>
        </div>
    );
};

export default SignUpPage;