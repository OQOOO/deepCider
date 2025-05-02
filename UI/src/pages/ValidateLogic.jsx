import React, { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { chatGPTClient } from '../client/chatGPTClient.jsx';
import { deepseekClient } from '../client/deepseekClient.jsx';
import ServerStatusChecker from '../client/ServerStatusChecker.jsx';

function ValidateLogic() {
    const inputRef = useRef(null);
    const [viewData, setViewData] = useState("");
    const [selectedService, setSelectedService] = useState("ChatGPT"); // 드롭다운 선택 상태

    // 서비스 상태 조회
    const [isChatGPTEnabled, setIsChatGPTEnabled] = useState(true);
    const [isDeepseekEnabled, setIsDeepseekEnabled] = useState(false);

    const serverURL = "http://localhost:37777";

    useEffect(() => {

        const chatGPTStatusCheck = async () => {
            try {
                const response = await fetch(serverURL + "/serviceStatus/openAI");
                if (!response.ok) throw new Error("서버 응답 오류");
                const data = await response.json();
                setIsChatGPTEnabled(data.enabled && data.healthy);
            } catch (error) {
                console.error("서버가 응답하지 않습니다.", error);
                setIsChatGPTEnabled(false); // 서버가 응답하지 않으면 비활성화
            }
        }
        chatGPTStatusCheck();
        const deepseekStatusCheck = async () => {
            try {
                const response = await fetch(serverURL + "/serviceStatus/deepseek");
                if (!response.ok) throw new Error("서버 응답 오류");
                const data = await response.json();
                setIsDeepseekEnabled(data.enabled && data.healthy);
            } catch (error) {
                console.error("서버가 응답하지 않습니다.", error);
                setIsDeepseekEnabled(false); // 서버가 응답하지 않으면 비활성화
            }
        }
        deepseekStatusCheck();

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
        if (selectedService === "ChatGPT") {
            chatGPTClient(inputRef.current.value, api, setViewData); // onMessageUpdate로 실시간 업데이트     
        } else if (selectedService === "Deepseek") {
            deepseekClient(inputRef.current.value, api, setViewData); // onMessageUpdate로 실시간 업데이트
        }
        
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
                                    {isChatGPTEnabled ? "ChatGPT-4o-mini" : "ChatGPT (현재 사용 불가)"}
                                </MenuItem>
                                <MenuItem value="Deepseek" disabled={!isDeepseekEnabled}>
                                    {isDeepseekEnabled ? "DeepSeek-R1-Distill-Qwen-1.5B" : "Deepseek (현재 사용 불가)"}
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