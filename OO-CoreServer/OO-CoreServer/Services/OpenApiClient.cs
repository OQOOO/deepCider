using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;
using System.Reflection.PortableExecutable;
using Microsoft.AspNetCore.DataProtection.KeyManagement;

namespace OO_CoreServer.Services
{
    public class OpenApiClient
    {
        private readonly HttpClient _httpClient;
        private string _apiKey;
        public OpenApiClient(HttpClient httpClient) 
        { 
            string keyPath = @"C:\Users\igh07\Desktop\AK\OAK.txt";

            _httpClient = httpClient;
            _apiKey = System.IO.File.ReadAllText(keyPath).Trim();
        }

        public async IAsyncEnumerable<string> PostToOpenAIServerAsync(string input)
        {
            string prompt = $"""
                너는 논리학 전문가야. 입력 문장에서 논리적 오류가 있는지 분석해줘.

                출력은 반드시 아래 형식을 따라줘. 형식에 맞지 않는 추가 텍스트는 포함하지 마.
                논리적 오류가 없으면 '논리적 오류가 없습니다' 만 출력해.
                
                입력 문장: {input}

                형식:
                <h4>오류 종류 영어명...</h4>
                <h2>오류 종류 한글명...</h2>
                <div style="margin: 10px">
                    오류 종류에 대한 설명...
                </div>

                <h3>설명</h3>
                <div style="margin: 10px">
                    입력된 문장의 오류에 대한 설명...
                </div>

                <h3>반박</h3>
                <div style="margin: 10px">
                    상황에 맞는 반박문 작성...
                </div>
                """;

            /*
               <h3>반박(공격적)</h3>
                <div style="margin: 10px">
                    상황에 맞는 시원한 반박문 작성, 과장, 비유, 비꼬기를 사용할 수 있음, 상대방을 공격하진 말것...
                </div>
                // ... 너무 공격적임, 논리적으로 잘 맞지도 않음
                
             */

            // 전달할 데이터 형식 정의
            var requestBody = new
            {
                model = "gpt-4o-mini",
                stream = true,
                messages = new[]
                {
                    new { role = "user", content = prompt }
                }
            };

            // api 통신으로 ChatGPT에서 답변 가져오기
            string endpoint = "https://api.openai.com/v1/chat/completions";
            var sendContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            using var response = await _httpClient.SendAsync(
                new HttpRequestMessage(HttpMethod.Post, endpoint)
                {
                    Headers = { Authorization = new AuthenticationHeaderValue("Bearer", _apiKey) },
                    Content = sendContent
                },
                HttpCompletionOption.ResponseHeadersRead // 헤더 수신 후 바로 반환
            );

            using var stream = await response.Content.ReadAsStreamAsync();
            using var reader = new StreamReader(stream);

            // 스트림 데이터 받아서 적합한 형식으로 가공 후 컨트롤러로 넘겨주기
            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync();

                if (string.IsNullOrWhiteSpace(line))
                    continue;

                if (line.StartsWith("data: "))
                {
                    var json = line.Substring("data: ".Length);

                    if (json == "[DONE]") break;

                    // 받은 응답 청크(Json 형식) 에서 필요한 내용만 가져오기 (받은 글자)
                    var doc = JsonDocument.Parse(json);
                    var content = doc.RootElement
                                        .GetProperty("choices")[0]
                                        .GetProperty("delta")
                                        .GetProperty("content")
                                        .GetString();

                    if (!string.IsNullOrEmpty(content))
                    {
                        yield return $"data: {content}\n\n";
                    }
                }
            }
        }
    }
}

/*
gpt-4.5-preview	$75.00	-	최신 프리뷰 모델
gpt-4o 	        $30.00	$60.00	고성능 모델
gpt-4o-mini	    $15.00	$60.00	비용 효율적인 소형 모델
gpt-3.5-turbo	$1.50	$2.00   경제적인 모델
*/