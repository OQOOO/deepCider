import { React, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StyledPaper } from './StyledPaper';

const DateRange = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    return (
        <StyledPaper elevation={0}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    minHeight: '56px'
                }}>
                    <DatePicker
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        format="YYYY년 MM월 DD일 (ddd)"
                        slotProps={{
                            textField: {
                                placeholder: '시작일',
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
                    <Typography>부터</Typography>
                    <DatePicker
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        format="YYYY년 MM월 DD일 (ddd)"
                        slotProps={{
                            textField: {
                                placeholder: '종료일',
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
                    <Typography>까지의 기간은</Typography>
                    <Typography sx={{ color: '#001529', fontWeight: 'bold' }}>
                        {startDate && endDate ? `${Math.abs(endDate.diff(startDate, 'day'))}일` : '___ 일'}
                    </Typography>
                    <Typography>입니다.</Typography>
                </Box>
            </LocalizationProvider>
        </StyledPaper>
    );
};

export default DateRange; 