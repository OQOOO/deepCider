import torch
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from fastapi.responses import StreamingResponse
import asyncio

# 모델 로드
# text_generator = pipeline("text-generation", model="distilgpt2", device=0)  # GPU 사용
# text_generator = pipeline("text-generation", model="deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B", device=0)
text_generator = pipeline("text-generation", model="UNIVA-Bllossom/DeepSeek-llama3.1-Bllossom-8B", device=0, torch_dtype=torch.float16)

# FastAPI 인스턴스 생성
app = FastAPI()

# 요청 데이터 모델 정의
class PromptRequest(BaseModel):
    prompt: str

# 토큰을 스트리밍하는 제너레이터 함수
async def generate_stream(prompt: str):
    # 최대 길이를 설정하고, return_full_text=False 옵션 추가
    print("prompt:" + prompt)

    outputs = text_generator(prompt,batch_size=1, max_length=300, return_full_text=False, do_sample=True) # batch_size=n

    generated_text = outputs[0]["generated_text"]

    # 한 글자씩 스트리밍 전송
    for char in generated_text:
        yield f"data: {char}\n\n"  # data: 접두사를 추가
        await asyncio.sleep(0.05)  # 클라이언트에서 자연스럽게 출력되도록 딜레이 추가

# 스트리밍 API 엔드포인트
@app.post("/predict")
async def generate(request: PromptRequest):
    return StreamingResponse(generate_stream(request.prompt), media_type="text/event-stream")


'''
CommendLines


docker build -t cider-llm-endpoint-8b .

docker run --gpus all -p 5000:5000 cider-llm-endpoint-8b

http://localhost:5000/docs
'''
