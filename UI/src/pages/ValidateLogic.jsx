import React, { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { chatClient } from '../client/chatClient.jsx';

function ValidateLogic() {
    const inputRef = useRef(null);
    const [viewData, setViewData] = useState("");
    const [selectedService, setSelectedService] = useState("ChatGPT"); // 드롭다운 선택 상태

    // 서비스 상태 조회
    const [isChatGPTEnabled, setIsChatGPTEnabled] = useState(true);
    const [isDeepSeekEnabled, setIsDeepSeekEnabled] = useState(false);

    useEffect(() => {
        fetch("http://localhost:37777/serviceStatus")
            .then((res) => {
                if (!res.ok) throw new Error("서버 응답 오류");
                return res.json();
            })
            .then((data) => {
                setIsChatGPTEnabled(data.isChatGPTEnabled);
                setIsDeepSeekEnabled(data.isServerLLMEnabled); // DeepSeek == 서버 LLM이라고 가정
            })
            .catch((err) => {
                console.error("상태 조회 실패:", err);
            });
    }, []);

    // 입력 화면의 값을 받아 서버로 전송 -> 반환값 화면에 표시
    const sendMessage = () => {
        const apiMap = {
            ChatGPT: "validateLogic/openAI",
            Deepseek: "validateLogic/deepseek",
        };

        const api = apiMap[selectedService];
        console.log(api);

        setViewData(""); // 기존 데이터 초기화
        chatClient(inputRef.current.value, api, setViewData); // onMessageUpdate로 실시간 업데이트
    };

    return (
        <Container maxWidth="md" sx={{ textAlign: 'left' }}>
            <Box
                sx={{
                    py: 3,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    minHeight: '100%',
                    gap: 4, // 간격 유지
                }}
            >
                {/* 메인 콘텐츠 영역 */}
                <Box sx={{ width: '700px', flexShrink: 0 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            color: 'text.primary',
                        }}
                    >
                        논리적 오류 찾기
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        문장에서 논리적 오류를 찾아드립니다.
                    </Typography>

                    <Box sx={{ width: '100%' }}>
                        <TextField
                            id="outlined-multiline-static"
                            label="대화 입력"
                            inputRef={inputRef}
                            multiline
                            rows={5}
                            variant="standard"
                            sx={{
                                width: '100%',
                                mb: 2,
                            }}
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2, // 버튼과 드롭다운 간격
                            }}
                        >
                            <Button
                                variant="contained"
                                onClick={sendMessage}
                                size="large"
                                sx={{
                                    mb: 3,
                                    backgroundColor: '#001529',
                                    '&:hover': {
                                        backgroundColor: '#002140',
                                    },
                                    boxShadow: 1,
                                }}
                            >
                                논리적 오류 찾기
                            </Button>
                            <Select
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                sx={{
                                    minWidth: 150,
                                    height: 40,
                                    marginBottom: 3,
                                }}
                            >
                                <MenuItem value="ChatGPT" disabled={!isChatGPTEnabled}>
                                    {isChatGPTEnabled ? "ChatGPT" : "ChatGPT (현재 사용 불가)"}
                                </MenuItem>
                                <MenuItem value="Deepseek" disabled={!isDeepSeekEnabled}>
                                    {isDeepSeekEnabled ? "Deepseek" : "Deepseek (현재 사용 불가)"}
                                </MenuItem>
                            </Select>
                        </Box>

                        <Box>
                            주의: 정확하지 않은 결과가 나올 수 있습니다.
                        </Box>

                        <br />
                        <br />

                        <div dangerouslySetInnerHTML={{ __html: viewData }} />
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}

export default ValidateLogic;