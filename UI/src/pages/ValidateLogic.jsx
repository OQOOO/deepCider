import { React, useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import {chatClient} from '../client/chatClient.jsx';
import ResponseBox from '../components/ResponseBox.jsx';
import ExampleListBox from '../components/ValidateLogicPageComponent/ExampleListBox.jsx';

const scrollDown = {
    '@keyframes scrollDown': {
        '0%': {
            transform: 'translateY(0)',
        },
        '100%': {
            transform: 'translateY(-50%)', // 전체 높이의 절반만큼 이동 (콘텐츠 복제 시)
            // 만약 복제하지 않는다면, 이 값은 전체 콘텐츠 높이만큼이어야 합니다.
            // 예: transform: 'translateY(-800px)'
        },
    },
};

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
        <Container maxWidth="md" sx={{ textAlign: 'left' }}>
            <Box sx={{ 
                py: 3,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                minHeight: '100%',
                gap: 4 // 간격 유지
            }}>
                

                {/* 메인 콘텐츠 영역 */}
                <Box sx={{ width: '700px', flexShrink: 0 }}> 
                    <Typography variant="h4" component="h1" gutterBottom sx={{ 
                        fontWeight: 'bold', 
                        color: 'text.primary' 
                    }}>
                        논리적 오류 찾기
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
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
                                width: "100%",
                                mb: 2
                            }}
                            
                        />

                        <Button 
                            variant="contained" 
                            onClick={() => sendMessage(1)} 
                            size="large" 
                            sx={{
                                mb: 3, 
                                backgroundColor: '#001529',
                                '&:hover': {
                                    backgroundColor: '#002140',
                                },
                                boxShadow: 1 
                            }}
                        >
                            논리적 오류 찾기
                        </Button>
                        <Box>
                            주의: 정확하지 않은 결과가 나올 수 있습니다.
                        </Box>

                        <br/>
                        <br/>

                        {/* <ResponseBox sx={{ 
                            border: '1px solid', 
                            borderColor: 'divider', 
                            p: 2, 
                            borderRadius: 1, 
                            minHeight: 150 
                        }}>
                            {viewData01}
                        </ResponseBox> */}
                        <div dangerouslySetInnerHTML={{ __html: viewData01 }} />
                    </Box>
                </Box>

                {/* 논리적 오류 예시 박스 영역 (애니메이션 적용) */}
                {/* <ExampleListBox /> */}
            </Box>
        </Container>
    );
}

export default ValidateLogic;