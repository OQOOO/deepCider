import { React } from 'react';
import { Container, Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { formatDateWithDay } from '../utils/dateUtils';
import TodayToFuture from '../components/DateCalculatorComponents/TodayToFuture';
import TodayToSelected from '../components/DateCalculatorComponents/TodayToSelected';
import SelectedToFuture from '../components/DateCalculatorComponents/SelectedToFuture';
import DateRange from '../components/DateCalculatorComponents/DateRange';

const DateCalculator = () => {
    const today = dayjs();

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ 
                    fontWeight: 'bold', 
                    color: '#001529',
                    mb: 1.5
                }}>
                    날짜 계산기
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" paragraph sx={{ 
                    mb: 4
                }}>
                    입력란에 날짜를 입력하면 계산됩니다.
                </Typography>

                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    mb: 1
                }}>
                    <Typography variant="h4" sx={{ color: '#001529', mb: 0.1, fontWeight: 'bold'}}>
                        <Typography component="span" variant="h5" 
                            sx={{ 
                                color: '#001529',
                                opacity: 0.6,
                                mr: 1,
                                fontWeight: 'medium'
                            }}
                        >
                            Today
                        </Typography>
                        {formatDateWithDay(today)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                        display: 'block',
                        opacity: 0.7
                    }}>
                        (한국 시간 기준)
                    </Typography>
                </Box>

                {/* 오늘부터 몇일 후 */}
                <TodayToFuture />
                <TodayToSelected />

                <Box sx={{ mt: 10, mb: 1 }}>
                    <Typography 
                        component="span" 
                        variant="h6" 
                        sx={{ 
                            color: '#001529',
                            opacity: 0.6,
                            mb:1,
                        }}
                    >
                        임의 시작일
                    </Typography>
                </Box>

                <SelectedToFuture />

                <DateRange />
            </Box>
        </Container>
    );
};

export default DateCalculator;
