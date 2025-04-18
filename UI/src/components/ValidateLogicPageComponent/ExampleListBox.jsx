import { React } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ExampleListBox = () => {

    return (
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
    );
}

export default ExampleListBox;