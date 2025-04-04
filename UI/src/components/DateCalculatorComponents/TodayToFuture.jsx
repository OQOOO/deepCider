import { React, useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { StyledPaper } from './StyledPaper';
import { formatDateWithDay } from '../../utils/dateUtils';
import dayjs from 'dayjs';

const TodayToFuture = () => {
    const today = dayjs();
    const [daysToAdd, setDaysToAdd] = useState('');

    // 입력된 일수 후의 날짜 계산
    const getFutureDate = () => {
        if (!daysToAdd) return '';
        const futureDate = today.add(parseInt(daysToAdd), 'day');
        return formatDateWithDay(futureDate);
    };

    // 숫자만 입력 가능하도록 처리
    const handleDaysChange = (event) => {
        const value = event.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            setDaysToAdd(value);
        }
    };

    return (
        <StyledPaper elevation={0}>
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                minHeight: '56px'
            }}>
                <Typography>오늘부터</Typography>
                <TextField
                    value={daysToAdd}
                    onChange={handleDaysChange}
                    variant="standard"
                    sx={{ width: '100px' }}
                    inputProps={{ style: { textAlign: 'center' } }}
                />
                <Typography>일 후는</Typography>
                <Typography sx={{ color: '#001529', fontWeight: 'bold' }}>
                    {getFutureDate() || '___'}
                </Typography>
                <Typography>입니다.</Typography>
            </Box>
        </StyledPaper>
    );
};

export default TodayToFuture; 