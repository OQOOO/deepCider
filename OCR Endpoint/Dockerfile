FROM registry.baidubce.com/paddlepaddle/paddle:3.0.0b1-gpu-cuda12.3-cudnn9.0-trt8.6

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 패키지 설치
RUN pip install --no-cache-dir paddleocr \
    fastapi \
    uvicorn \
    python-multipart  # 🔹 파일 업로드 지원을 위한 패키지 추가

# 프로젝트 파일 복사
COPY . /app

# 실행 명령어 지정
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5200"]