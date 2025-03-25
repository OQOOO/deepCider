import { useEffect, useRef } from "react";

const CanvasComponent = ({ imageSrc, ocrData }) => {
  const canvasRef = useRef(null);

  // 테스트용 코드
  try {
    console.log("canvasComponent.ocrdata", ocrData);
  } catch (error) {
    console.error("Error:", error); 
  }
  
  // bounding box 그리기
  const drowBoundingBox = (ctx, ocrData) => {
    ocrData.forEach((data) => {
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageSrc;
  
    img.onload = () => {
      // 캔버스 크기를 이미지 크기에 맞춤
      canvas.width = img.width;
      canvas.height = img.height;
      // 이미지 그리기
      ctx.clearRect(0, 0, canvas.width, canvas.height); // 이전 내용 지우기
      ctx.drawImage(img, 0, 0, img.width, img.height);
    };
  }, [imageSrc]);  // 이미지 변경 시 실행
  
  useEffect(() => {
    if (ocrData && imageSrc && ocrData?.data) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      // 바운딩 박스 그리기
      drowBoundingBox(ctx, ocrData["data"]);
    }
  }, [ocrData, imageSrc]);  // ocrData 또는 imageSrc 변경 시 실행

  return <canvas ref={canvasRef} />;
};

export default CanvasComponent;