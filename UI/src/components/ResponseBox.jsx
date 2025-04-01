import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#ffffff',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease-in-out',
  minHeight: '100px',
  '&:hover': {
    boxShadow: theme.shadows[2],
    borderColor: '#1a237e',
  },
}));

const ResponseBox = ({ children }) => {
    return (
        <StyledPaper elevation={0}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                height: '100%',
            }}>
                <Typography 
                    variant="body1" 
                    color="text.primary"
                    sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        lineHeight: 1.6,
                        flex: 1,
                    }}
                >
                    {children || ''}
                </Typography>
            </Box>
        </StyledPaper>
    );
};

export default ResponseBox;