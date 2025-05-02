from ultralytics import YOLO
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import io
from PIL import Image
import numpy as np

# 사전 학습된 YOLOv8 모델 로드
# model = YOLO("yolov8n.pt")  # 가장 가벼운 모델

# # 이미지에서 객체 탐지 수행
# results = model("sample.jpg")

# # 탐지 결과 출력
# for box in results[0].boxes:
#     print(f"좌표: {box.xyxy.tolist()}, 신뢰도: {box.conf.item()}, 클래스: {int(box.cls.item())}")


#

model = YOLO("yolov8m.pt")

app = FastAPI()

@app.post("/predict")
async def ocr_endpoint(file: UploadFile = File(...)):
    if not file:
        return JSONResponse(content={"success": False, "message": "파일이 업로드되지 않았습니다."}, status_code=400)

    # 업로드된 파일을 메모리에서 읽기
    file_content = await file.read()
    image = io.BytesIO(file_content)
    pil_image = Image.open(image)
    pil_image = pil_image.convert('RGB')
    image_np = np.array(pil_image)

    # Object Detection 처리
    model_output = model(image_np)

    # 배치의 첫번째 값 (이미지 하나에 대한 결과)
    detection_data = model_output[0].boxes

    response_data = []
    if detection_data != [None]:
        for box in detection_data:
            response_data.append({
                "bounding_box": box.xyxy.tolist(),  # 감지된 텍스트
                "confidence": box.conf.item(),  # 신뢰도
                "class": int(box.cls.item())  # 클래스 번호
            })

    # 결과 반환
    return JSONResponse(content={"success": True, "message": "Object Detection 처리 완료", "data": response_data})

@app.get("/health")
async def health_check():
    return JSONResponse(
        content={
            "status": "healthy",
        },
        status_code=200
    )


'''
docker build -t yolo-endpoint:latest .

# ocr 엔드포인트 컨테이너
docker run --gpus all -it -p 5202:5202 yolo-endpoint
'''