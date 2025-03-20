from paddleocr import PaddleOCR
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import io
from PIL import Image
import numpy as np

app = FastAPI()

# PaddleOCR 인스턴스 생성 (한국어 설정)
ocr = PaddleOCR(use_angle_cls=False, lang='korean')  # 또는 lang='ko'

@app.post("/ocr")
async def ocr_endpoint(file: UploadFile = File(...)):
    if not file:
        return JSONResponse(content={"success": False, "message": "파일이 업로드되지 않았습니다."}, status_code=400)

    # 업로드된 파일을 메모리에서 읽기
    file_content = await file.read()
    image = io.BytesIO(file_content)

    # 이미지 파일을 PIL 이미지 객체로 변환
    pil_image = Image.open(image)

    # PIL 이미지를 numpy 배열로 변환
    image_np = np.array(pil_image)

    # OCR 처리
    result = ocr.ocr(image_np, cls=True)

    # OCR 결과 추출
    detected_text = []
    for line in result[0]:
        detected_text.append({
            "text": line[1][0],  # 감지된 텍스트
            "confidence": line[1][1]  # 신뢰도
        })

    # 결과 반환
    return JSONResponse(content={"success": True, "message": "OCR 처리 완료", "data": detected_text})

# # PaddleOCR 인스턴스 생성 (한국어 설정)
# async def processing():
#     ocr = PaddleOCR(use_angle_cls=False, lang='korean')  # 또는 lang='ko'

#     # 이미지 파일로 텍스트 추출
#     img_path = 'example01.jpg'

#     result = ocr.ocr(img_path, cls=True)

#     # 결과 출력
#     for line in result[0]:
#         print(f"Detected text: {line[1][0]} with confidence: {line[1][1]}")

# @app.post("/ocr")
# async def ocr(file: UploadFile = File(...)):

#     if not file:
#         return JSONResponse(content={"success": False, "message": "파일이 업로드되지 않았습니다."}, status_code=400)

#     return JSONResponse(content={"success": True, "filename": file.filename, "message": "파일 업로드 성공"})


'''
CommendLines

docker build -t ocr-endpoint:latest .

# ocr 엔드포인트 컨테이너
docker run --gpus all -it -p 5200:5200 ocr-endpoint

http://localhost:5200/docs
'''