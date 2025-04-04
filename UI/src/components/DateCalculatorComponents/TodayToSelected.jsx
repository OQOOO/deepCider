import { React, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StyledPaper } from './StyledPaper';
import dayjs from 'dayjs';

const TodayToSelected = () => {
    const today = dayjs();
    const [selectedDate, setSelectedDate] = useState(null);

    // 과거/미래 날짜에 따른 텍스트 반환
    const getDateText = () => {
        if (!selectedDate) return '까지';
        return selectedDate.isBefore(today) ? '부터' : '까지';
    };

    return (
        <StyledPaper elevation={0}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    minHeight: '56px'
                }}>
                    <Typography>
                        {selectedDate && selectedDate.isBefore(today) ? '오늘은' : '오늘부터'}
                    </Typography>
                    <DatePicker
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        format="YYYY년 MM월 DD일 (ddd)"
                        slotProps={{
                            textField: {
                                placeholder: '날짜 선택',
                                size: 'small'
                            }
                        }}
                        sx={{ 
                            '& .MuiInputBase-root': { 
                                width: '220px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#001529'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#002140'
                                }
                            }
                        }}
                    />
                    <Typography>{getDateText()}</Typography>
                    <Typography sx={{ color: '#001529', fontWeight: 'bold' }}>
                        {selectedDate ? 
                            (selectedDate.isSame(today, 'day') ? '0일' : 
                             selectedDate.isBefore(today) ? 
                                `${Math.abs(selectedDate.diff(today, 'day'))}일` : 
                                `${Math.abs(selectedDate.diff(today, 'day')) + 1}일`) 
                            : '___ 일'}
                    </Typography>
                    <Typography>
                        {selectedDate ? 
                            (selectedDate.isBefore(today) ? '지났습니다' : '남았습니다') : 
                            '남았습니다'
                        }
                    </Typography>
                </Box>
            </LocalizationProvider>
        </StyledPaper>
    );
};

export default TodayToSelected; 