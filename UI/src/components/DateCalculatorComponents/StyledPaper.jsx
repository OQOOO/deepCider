import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    marginBottom: theme.spacing(3)
}));

export { StyledPaper }; 