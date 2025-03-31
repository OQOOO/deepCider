import { useEffect, useRef } from "react";

const CanvasComponent = ({ imageSrc, OCRData, pointNum}) => {
  const canvasRef = useRef(null);

  // 테스트용 코드
  try {
    console.log("canvasComponent.OCRdata", OCRData);
  } catch (error) {
    console.error("Error:", error); 
  }
  
  // bounding box 그리기
  // [x1, y1], [x2, y2], [x3, y3], [x4, y4] 형식의 bounding box 그리기
  const drowBoundingBoxWith4point = (ctx, OCRData) => {
    OCRData.forEach((data) => {
      let loc = data["bounding_box"];

      ctx.beginPath();
      ctx.strokeStyle = "blue";
      ctx.moveTo(loc[0][0], loc[0][1]);
      ctx.lineTo(loc[1][0], loc[1][1]); // 오른쪽 위
      ctx.lineTo(loc[2][0], loc[2][1]); // 오른쪽 아래
      ctx.lineTo(loc[3][0], loc[3][1]); // 왼쪽 아래
      ctx.closePath(); // 처음으로 돌아가서 닫기
      ctx.stroke();
    });
  }

  // [x1, y1, x2, y2] 형식의 bounding box 그리기
  const drowBoundingBoxWith2point = (ctx, OCRData) => {
    OCRData.forEach((data) => {
      let loc = data["bounding_box"][0];
      
      const x1 = loc[0], y1 = loc[1];
      const x2 = loc[2], y2 = loc[3];
      
      const width = x2 - x1; // 사각형 크기 계산
      const height = y2 - y1;

      ctx.beginPath();
      ctx.strokeStyle = "blue";
      ctx.rect(x1, y1, width, height); // xy 위치에 width, height 크기의 사각형 그리기기
      ctx.stroke();

    });
  }

  // 이미지 변경 시 실행
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageSrc;
  
    img.onload = () => {
      // 이미지 그리기
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, img.width, img.height);
    };
  }, [imageSrc]);
  
  useEffect(() => {
    if (OCRData && imageSrc) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      if (OCRData != []) {
        if (pointNum == 2) {        
          drowBoundingBoxWith2point(ctx, OCRData);
        } else if (pointNum == 4) {
          drowBoundingBoxWith4point(ctx, OCRData);
        }
      }
    }
  }, [OCRData, imageSrc]);  // OCRData 또는 imageSrc 변경 시 실행

  return <canvas ref={canvasRef} />;
};

export default CanvasComponent;