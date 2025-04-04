import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const DropZone = styled(Box)(({ theme, isDragActive }) => ({
    border: `2px dashed ${isDragActive ? '#001529' : '#e9ecef'}`,
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(4),
    textAlign: 'center',
    backgroundColor: isDragActive ? 'rgba(0, 21, 41, 0.05)' : '#ffffff',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
        borderColor: '#001529',
        backgroundColor: 'rgba(0, 21, 41, 0.05)',
    },
}));

const ImageDropZone = ({ 
    isDragActive, 
    onDragEnter, 
    onDragLeave, 
    onDragOver, 
    onDrop, 
    onClick 
}) => {
    return (
        <DropZone
            isDragActive={isDragActive}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={onClick}
        >
            <Typography variant="h6" sx={{ color: '#001529', mb: 1 }}>
                이미지를 드래그하여 업로드
            </Typography>
            <Typography variant="body2" color="text.secondary">
                또는 클릭하여 파일 선택
            </Typography>
        </DropZone>
    );
};

export default ImageDropZone; 