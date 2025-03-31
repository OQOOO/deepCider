import { useEffect, useRef } from "react";

const CanvasComponentForYolo = ({ imageSrc, ODData}) => {
  const canvasRef = useRef(null);

  // 테스트용 코드
  try {
    console.log("canvasComponent.ODdata", ODData);
  } catch (error) {
    console.error("Error:", error); 
  }

  
  // [x1, y1, x2, y2] 형식의 bounding box 그리기
  const drowBoundingBoxWith2point = (ctx, ODData, originalWidth, originalHeight) => {
    const targetSize = 640;

    let resizeRatio = 1; // 비율을 1로 초기화
    let pd = [0, 0, 0, 0]; // padding
    if (originalWidth > originalHeight) {
      resizeRatio = (originalWidth / targetSize);
      const padding = (originalWidth - originalHeight);
      pd = [0, padding, 0, padding]; // [x1, y1, x2, y2] 형식으로 padding 설정
      console.log("resizeRatio", resizeRatio, "padding", padding);

    }

    // 패딩(리사이징())
    ODData.forEach((data) => {
      let loc = data["bounding_box"][0];
      // loc[0] = (loc[0] * resizeRatio) + pd[0]; // x1
      // loc[1] = (loc[1] * resizeRatio) + pd[1]; // y1
      // loc[2] = (loc[2] * resizeRatio) + pd[2]; // x2
      // loc[3] = (loc[3] * resizeRatio) + pd[3]; // y2

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
    if (ODData && imageSrc) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      if (ODData != []) {     
          drowBoundingBoxWith2point(ctx, ODData, canvas.width, canvas.height); // ODData가 있을 때만 bounding box 그리기
      }
    }
  }, [ODData, imageSrc]);  // ODData 또는 imageSrc 변경 시 실행

  return <canvas ref={canvasRef} />;
};

export default CanvasComponentForYolo;