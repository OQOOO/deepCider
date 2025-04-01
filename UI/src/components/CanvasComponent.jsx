import { useEffect, useRef, useState } from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ImageIcon from '@mui/icons-material/Image';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CropIcon from '@mui/icons-material/Crop';
import CancelIcon from '@mui/icons-material/Cancel';

// 상수 정의
const PADDING = 20;
const MIN_DRAG_DISTANCE = 3;
const BUTTON_MARGIN = 8;

const COLORS = {
  HIGH_CONFIDENCE: 'rgb(0, 0, 255)',
  LOW_CONFIDENCE: '#ffd700',
  SELECTION_BORDER: '#1a237e',
  SELECTION_OVERLAY: 'rgba(0, 0, 0, 0.3)',
  BACKGROUND: '#ffffff'
};

const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.99,
  LOW: 0.95
};

const StyledCanvas = styled('canvas')(({ theme }) => ({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const EmptyStateBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  backgroundColor: '#f8f9fa',
  borderRadius: theme.shape.borderRadius,
  border: `2px dashed ${theme.palette.divider}`,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

// 유틸리티 함수들
const getScaledCoordinates = (event, canvas) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
};

const getBoundingBoxColor = (confidence) => {
  if (confidence >= CONFIDENCE_THRESHOLDS.HIGH) {
    return COLORS.HIGH_CONFIDENCE;
  } 
  if (confidence <= CONFIDENCE_THRESHOLDS.LOW) {
    return COLORS.LOW_CONFIDENCE;
  }
  
  // 그라데이션 계산
  const ratio = (confidence - CONFIDENCE_THRESHOLDS.LOW) / (CONFIDENCE_THRESHOLDS.HIGH - CONFIDENCE_THRESHOLDS.LOW);
  const blueColor = [0, 0, 255];
  const yellowColor = [255, 215, 0];
  
  const r = Math.round(blueColor[0] + (yellowColor[0] - blueColor[0]) * ratio);
  const g = Math.round(blueColor[1] + (yellowColor[1] - blueColor[1]) * ratio);
  const b = Math.round(blueColor[2] + (yellowColor[2] - blueColor[2]) * ratio);

  return `rgb(${r}, ${g}, ${b})`;
};

const drawBoundingBox = (ctx, data, pointNum) => {
  const { bounding_box, confidence } = data;
  ctx.beginPath();
  ctx.strokeStyle = getBoundingBoxColor(confidence);
  ctx.lineWidth = 2;

  if (pointNum === 4) {
    // 4점 바운딩 박스 그리기
    ctx.moveTo(bounding_box[0][0] + PADDING, bounding_box[0][1] + PADDING);
    for (let i = 1; i < 4; i++) {
      ctx.lineTo(bounding_box[i][0] + PADDING, bounding_box[i][1] + PADDING);
    }
    ctx.closePath();
  } else {
    // 2점 바운딩 박스 그리기
    const [x1, y1, x2, y2] = bounding_box[0];
    const width = x2 - x1;
    const height = y2 - y1;
    ctx.rect(x1 + PADDING, y1 + PADDING, width, height);
  }
  ctx.stroke();
};

const drawCanvas = (canvas, image, detectionData, pointNum, selection = null) => {
  const ctx = canvas.getContext('2d');
  
  // 캔버스 초기화
  ctx.fillStyle = COLORS.BACKGROUND;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 이미지 그리기
  ctx.drawImage(image, PADDING, PADDING);
  
  // OCR 바운딩 박스 그리기
  if (detectionData?.length > 0) {
    detectionData.forEach(data => drawBoundingBox(ctx, data, pointNum));
  }
  
  // 선택 영역 그리기
  if (selection) {
    const { x, y, width, height } = selection;
    ctx.save();
    ctx.fillStyle = COLORS.SELECTION_OVERLAY;
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.rect(x, y, width, height);
    ctx.fill('evenodd');
    ctx.strokeStyle = COLORS.SELECTION_BORDER;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
  }
};

/////////////////////////////////////
const CanvasComponent = ({ imageSrc, detectionData, pointNum, onCropImage }) => {
  const canvasRef = useRef(null);
  const componentRef = useRef(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [originalImage, setOriginalImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // 테스트용 코드
  try {
    console.log("canvasComponent.OCRdata", detectionData);
  } catch (error) {
    console.error("Error:", error); 
  }
  
  const handleCancel = () => {
    setSelection(null);
    if (canvasRef.current && originalImage) {
      drawCanvas(canvasRef.current, originalImage, detectionData, pointNum);
    }
  };

  const handleCrop = () => {
    if (!selection || !originalImage) return;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCanvas.width = selection.width;
    tempCanvas.height = selection.height;
    
    tempCtx.drawImage(
      originalImage,
      selection.x - PADDING,
      selection.y - PADDING,
      selection.width,
      selection.height,
      0,
      0,
      selection.width,
      selection.height
    );
    
    onCropImage(tempCanvas.toDataURL('image/png'));
    handleCancel();
  };

  const handleMouseDown = (e) => {
    const coords = getScaledCoordinates(e, canvasRef.current);
    setIsDragging(false);

    if (selection) {
      const isOutsideSelection = 
        coords.x < selection.x || 
        coords.x > selection.x + selection.width || 
        coords.y < selection.y || 
        coords.y > selection.y + selection.height;

      if (isOutsideSelection) {
        handleCancel();
        setIsSelecting(true);
        setStartPos(coords);
      }
      return;
    }
    
    setIsSelecting(true);
    setStartPos(coords);
    setSelection(null);
  };

  const handleMouseMove = (e) => {
    if (!isSelecting || !originalImage) return;

    setIsDragging(true);
    const coords = getScaledCoordinates(e, canvasRef.current);
    drawCanvas(canvasRef.current, originalImage, detectionData, pointNum, {
      x: Math.min(startPos.x, coords.x),
      y: Math.min(startPos.y, coords.y),
      width: Math.abs(coords.x - startPos.x),
      height: Math.abs(coords.y - startPos.y)
    });
  };

  const handleMouseUp = (e) => {
    if (!isSelecting) return;

    const coords = getScaledCoordinates(e, canvasRef.current);
    const width = Math.abs(coords.x - startPos.x);
    const height = Math.abs(coords.y - startPos.y);

    if (width <= MIN_DRAG_DISTANCE && height <= MIN_DRAG_DISTANCE) {
      if (selection) {
        handleCancel();
      }
    } else {
      setSelection({
        x: Math.min(startPos.x, coords.x),
        y: Math.min(startPos.y, coords.y),
        width,
        height
      });
    }
    
    setIsSelecting(false);
    setIsDragging(false);
  };

  // 이미지 로드 효과
  useEffect(() => {
    if (!imageSrc) return;

    const canvas = canvasRef.current;
    const img = new Image();
    img.src = imageSrc;
  
    img.onload = () => {
      canvas.width = img.width + (PADDING * 2);
      canvas.height = img.height + (PADDING * 2);
      drawCanvas(canvas, img, detectionData, pointNum);
      setOriginalImage(img);
    };
  }, [imageSrc, detectionData, pointNum]);

  // 외부 클릭 감지
  useEffect(() => {
    if (!selection) return;

    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        handleCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selection]);

  // 버튼 그룹 렌더링
  const renderButtonGroup = () => {
    if (!selection || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleY = rect.height / canvas.height;
    const scaleX = rect.width / canvas.width;

    return (
      <ButtonGroup
        disableElevation
        sx={{
          position: 'absolute',
          top: `${(selection.y + selection.height + BUTTON_MARGIN) * scaleY}px`,
          left: `${Math.min(
            Math.max(
              (selection.x + selection.width - 200) * scaleX,
              BUTTON_MARGIN
            ),
            rect.width - 300
          )}px`,
          zIndex: 1000,
          transform: 'scale(1)',
          transformOrigin: 'top left',
          display: 'flex',
          flexDirection: 'row',
          '& > button': {
            marginRight: `${BUTTON_MARGIN}px`,
            whiteSpace: 'nowrap',
            borderRadius: '3px',
            '&:first-of-type': {
              borderTopLeftRadius: '3px',
              borderBottomLeftRadius: '3px'
            },
            '&:last-of-type': {
              borderTopRightRadius: '3px',
              borderBottomRightRadius: '3px'
            }
          }
        }}
      >
        <Button
          variant="contained"
          startIcon={<CropIcon />}
          onClick={handleCrop}
          sx={{
            backgroundColor: COLORS.SELECTION_BORDER,
            '&:hover': {
              backgroundColor: '#000051',
            },
          }}
        >
          선택 영역 자르기
        </Button>
        <Button
          variant="contained"
          startIcon={<CancelIcon />}
          onClick={handleCancel}
          sx={{
            backgroundColor: COLORS.BACKGROUND,
            color: COLORS.SELECTION_BORDER,
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          }}
        >
          취소
        </Button>
      </ButtonGroup>
    );
  };

  if (!imageSrc) {
    return (
      <EmptyStateBox>
        <ImageIcon sx={{ fontSize: 60, mb: 2, color: COLORS.SELECTION_BORDER }} />
        <Typography variant="h6" gutterBottom sx={{ color: COLORS.SELECTION_BORDER, fontWeight: 500 }}>
          이미지를 선택해 주세요
        </Typography>
        <Typography variant="body2" color="text.secondary">
          파일 선택 버튼을 클릭하여 이미지를 업로드하세요
        </Typography>
      </EmptyStateBox>
    );
  }

  return (
    <Box 
      ref={componentRef}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        gap: 2
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <StyledCanvas 
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        {renderButtonGroup()}
      </Box>
    </Box>
  );
};

export default CanvasComponent;