import { React, useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import {chatClient} from '../client/chatClient.jsx';
import ResponseBox from '../components/ResponseBox.jsx';


function ValidateLogic() {
    const inputRef = useRef(null);
    const [viewData01, setViewData01] = useState("");
    const [viewData02, setViewData02] = useState("");

    // 입력 화면의 값을 받아 서버로 전송 -> 반환값 화면에 표시
    const sendMessage = (bottonNum) => {
        const apiMap = { // api 연결에 사용할 path
            //1:"validateLogic",
            1:"tApi/openAI",
            2:"2"
        };

        const viewMap = { // 반환값 화면에 표시할 컴포넌트 선택
            1: setViewData01,
            2: setViewData02
        };

        let api = apiMap[bottonNum];
        let setViewData = viewMap[bottonNum];

        setViewData(""); // 기존 데이터 초기화
        chatClient(inputRef.current.value, api, setViewData); // onMessageUpdate로 실시간 업데이트
        //AspNetChatClient(inputRef.current.value, api, setViewData);
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ 
                py: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                minHeight: '100%'
            }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#001529' }}>
                    논리적 오류 찾기 (Beta)
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" paragraph>
                    문장에서 논리적 오류를 찾아드립니다.
                </Typography>

                <Box sx={{ width: '100%', maxWidth: 700 }}>
                    <TextField
                        id="standard-multiline-static"
                        label="대화 입력"
                        inputRef={inputRef}
                        multiline
                        rows={4}
                        sx={{
                            width: "100%",
                            mb: 2
                        }}
                        variant="standard"
                    />

                    <Button 
                        variant="contained" 
                        onClick={() => sendMessage(1)}
                        sx={{
                            mb: 2,
                            backgroundColor: '#001529',
                            '&:hover': {
                                backgroundColor: '#002140',
                            },
                        }}
                    >
                        논리적 오류 찾기
                    </Button>

                    <ResponseBox>{viewData01}</ResponseBox>
                </Box>
            </Box>
        </Container>
    );
}

export default ValidateLogic;