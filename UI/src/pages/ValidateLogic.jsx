import { React, useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import {chatClient} from '../client/chatClient.jsx';
import ResponseBox from '../components/ResponseBox.jsx';

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
        <Container maxWidth="lg" sx={{ textAlign: 'left' }}>
            <Box sx={{ 
                py: 3,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                minHeight: '100%',
                gap: 4 // 간격 유지
            }}>
                

                {/* 오른쪽 메인 콘텐츠 영역 */}
                <Box sx={{ width: '700px', flexShrink: 0 }}> 
                    <Typography variant="h4" component="h1" gutterBottom sx={{ 
                        fontWeight: 'bold', 
                        color: 'text.primary' 
                    }}>
                        논리적 오류 찾기
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" paragraph sx={{ mb: 3 }}>
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
                {/* 왼쪽 논리적 오류 예시 박스 영역 (애니메이션 적용) */}
                <Box sx={{ 
                    width: '250px', 
                    height: '520px',
                    overflow: 'hidden', // 넘치는 내용 숨김
                    flexShrink: 0, 
                    position: 'relative', // 내부 요소 위치 기준점
                    mt: 13.5 // 상단 마진 추가 (대화 입력창과 정렬되도록 값 조절)
                }}>
                    <Box sx={{ // 애니메이션 적용될 내부 컨테이너
                        position: 'absolute',
                        width: '100%',
                        animation: `scrollDown 40s linear infinite`, // 애니메이션 적용 (속도 조절 필요)
                        '&:hover': {
                            animationPlayState: 'paused', // 마우스 올리면 멈춤
                        },
                    }}>
                        {
                            // 예시 목록 (원활한 반복을 위해 두 번 렌더링)
                            [...Array(2)].map((_, repeatIndex) => (
                                [
                                    { title: "허수아비 공격", text: "상대방의 주장을 왜곡하거나 과장하여 반박하는 오류." },
                                    { title: "인신 공격", text: "상대방의 주장 대신 그 사람의 성격이나 행동을 공격하는 오류." },
                                    { title: "감정에 호소", text: "논리적 근거 대신 감정에 호소하여 설득하려는 오류." },
                                    { title: "미끄러운 경사길", text: "어떤 행동이 연속적으로 부정적인 결과를 초래할 것이라고 주장하는 오류." },
                                    { title: "성급한 일반화", text: "적은 사례를 바탕으로 일반적인 결론을 내리는 오류." },
                                    { title: "잘못된 유비추론", text: "두 대상이 유사하다는 이유로 동일한 결론을 내리는 오류." },
                                    { title: "권위에 호소", text: "권위 있는 사람이나 기관의 의견을 무조건적으로 따르는 오류." },
                                    { title: "원천 봉쇄의 오류", text: "상대방의 주장을 편견으로 간주하여 무시하는 오류." },
                                    { title: "피장파장의 오류", text: "상대방의 잘못을 근거로 자신의 잘못을 정당화하는 오류." },
                                    { title: "흑백 논리", text: "중간 지점 없이 두 가지 선택지 중 하나만 가능하다고 주장하는 오류." },
                                    { title: "순환 논증", text: "주장의 근거가 주장을 반복하는 오류." },
                                ].map((item, index) => (
                                    <Box key={`${repeatIndex}-${index}`} sx={{ 
                                        minHeight: 60, 
                                        backgroundColor: 'background.paper', 
                                        borderRadius: 1, 
                                        p: 1.5, 
                                        mb: 2, // 박스 간 간격 추가
                                        boxShadow: 1, 
                                        border: '1px solid', 
                                        borderColor: 'divider', 
                                    }}>
                                        <Typography variant="caption" display="block" gutterBottom sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ lineHeight: 1.4 }}> 
                                            {item.text}
                                        </Typography>
                                    </Box>
                                ))
                            ))
                        }
                    </Box>
                    {/* Keyframes 스타일 적용 (MUI sx prop 방식) */}
                    <style>{`
                        @keyframes scrollDown {
                            0% { transform: translateY(0); }
                            100% { transform: translateY(-50%); }
                        }
                    `}</style>
                </Box>
            </Box>
        </Container>
    );
}

export default ValidateLogic;