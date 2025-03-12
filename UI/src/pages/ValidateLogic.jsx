
import { React, useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import {chatClient} from '../client/chatClient.jsx';
import ResponseBox from '../components/ResponseBox.jsx';


function ValidateLogic() {
    const inputRef = useRef(null);
    const [viewData01, setViewData01] = useState("");
    const [viewData02, setViewData02] = useState("");

    // 입력 화면의 값을 받아 서버로 전송 -> 반환값 화면에 표시
    const sendMessage = (bottonNum) => {
        const apiMap = { // 버튼 번호에 따른 api 연결
            1:"validateLogic",
            2:"explainMetaphor"
        };

        const viewMap = { // 버튼 번호에 따른 할당값 연결
            1: setViewData01,
            2: setViewData02
        };

        let api = apiMap[bottonNum];
        let setViewData = viewMap[bottonNum];

        setViewData(""); // 기존 데이터 초기화
        chatClient(inputRef.current.value, api, setViewData); // onMessageUpdate로 실시간 업데이트
    };

    return (
        <div>
            <Box sx={{marginLeft:2}}>
                <h2>논리적 오류 찾기 (Beta)</h2>
                문장에서 논리적 오류를 찾아드립니다.
            </Box>
            <div>
                <TextField
                    id="standard-multiline-static"
                    label="대화 입력"
                    inputRef={inputRef}
                    multiline
                    rows={4}
                    sx={{ 
                        width: "700px",
                        m: 2 
                    }}
                    variant="standard"
                />
            </div>

            <Button variant="contained" onClick={() => sendMessage(1)}
                sx={{ 
                    m: 2 
                }}
            >논리적 오류 찾기</Button>

            <ResponseBox>{viewData01}</ResponseBox>

            <Button variant="contained" onClick={() => sendMessage(2)}
                sx={{ 
                    m: 2 
                }}
            >비유를 통한 반박</Button>
            <ResponseBox>{viewData02}</ResponseBox>


        </div>


    );
}

export default ValidateLogic;