import { React, useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StyledPaper } from './StyledPaper';
import { formatDateWithDay } from '../../utils/dateUtils';

const SelectedToFuture = () => {
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [daysAfterSelected, setDaysAfterSelected] = useState('');

    // 선택한 날짜로부터의 일수 입력 처리
    const handleDaysAfterSelectedChange = (event) => {
        const value = event.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            setDaysAfterSelected(value);
        }
    };

    // 선택한 날짜로부터의 일수 후 날짜 계산
    const getDateAfterSelected = () => {
        if (!selectedStartDate || !daysAfterSelected) return '';
        const futureDate = selectedStartDate.add(parseInt(daysAfterSelected), 'day');
        return formatDateWithDay(futureDate);
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
                    <DatePicker
                        value={selectedStartDate}
                        onChange={(newValue) => setSelectedStartDate(newValue)}
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
                    <Typography>부터</Typography>
                    <TextField
                        value={daysAfterSelected}
                        onChange={handleDaysAfterSelectedChange}
                        variant="standard"
                        sx={{ width: '100px' }}
                        inputProps={{ style: { textAlign: 'center' } }}
                    />
                    <Typography>일 후는</Typography>
                    <Typography sx={{ color: '#001529', fontWeight: 'bold' }}>
                        {getDateAfterSelected() || '___'}
                    </Typography>
                    <Typography>입니다.</Typography>
                </Box>
            </LocalizationProvider>
        </StyledPaper>
    );
};

export default SelectedToFuture; 