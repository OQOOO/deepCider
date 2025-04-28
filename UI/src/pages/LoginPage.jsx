import React, { useState } from 'react';

const LoginPage = ({ setPage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        // 간단한 유효성 검사
        if (!email || !password) {
            setError('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        // 로그인 로직 (예: API 호출)
        console.log('로그인 시도:', { email, password });
        setError(''); // 에러 초기화
        alert('로그인 성공!');
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
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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