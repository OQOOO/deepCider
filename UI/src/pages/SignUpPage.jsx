import React, { useState } from 'react';

const SignUpPage = () => {
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        // 간단한 유효성 검사
        if (!username || !password) {
            setError('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        console.log(password, username)

        const backEndPort = 37777; // 백엔드 포트 번호
        const api = "signup"; // API 엔드포인트
        
        try {
            const response = await fetch(`http://localhost:${backEndPort}/${api}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    id: id,
                    username: username, 
                    password: password 
                }),
            });
        } catch (error) {
            console.error('Error:', error);
        }

        console.log('회원가입 시도:', { username, password });
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <h1>회원가입 (임시)</h1>
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
                    type="text"
                    placeholder="활동명"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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