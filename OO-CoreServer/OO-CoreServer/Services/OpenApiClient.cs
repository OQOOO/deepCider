using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;
using System.Reflection.PortableExecutable;

namespace OO_CoreServer.Services
{
    public class OpenApiClient
    {
        private readonly HttpClient _httpClient;
        private string _apiKey;
        public OpenApiClient(HttpClient httpClient) 
        { 
            _httpClient = httpClient;
            string keyPath = @"C:\Users\igh07\Desktop\AK\OAK.txt";
            _apiKey = System.IO.File.ReadAllText(keyPath).Trim();
        }

        public async IAsyncEnumerable<string> PostToOpenAIServerAsync(string input)
        {
            var requestBody = new
            {
                model = "gpt-4o-mini",
                stream = true,
                messages = new[]
                {
                    new { role = "user", content = input }
                }
            };

            // 이런 부분도 반복적으로 구현되면 모듈로
            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
            request.Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            using var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);
            using var stream = await response.Content.ReadAsStreamAsync();
            using var reader = new StreamReader(stream);

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
