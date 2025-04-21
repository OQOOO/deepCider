using System.Net.Http;
using System.Text.Json;
using System.Text;
using System.Threading;

namespace OO_CoreServer.Services
{
    public class LocalLLMApiClient : ILLMApiClient
    {
        private readonly HttpClient _httpClient;
        public LocalLLMApiClient(HttpClient httpClient) 
        {
            _httpClient = httpClient;
        }

        public async IAsyncEnumerable<string> SendPromptAndStreamResponse(string request)
        {
            string prompt = $"""
                User: {request}
                Assistant :
                """;

            var payload = new { prompt = prompt };
            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

            using var response = await _httpClient.SendAsync(
                new HttpRequestMessage(HttpMethod.Post, "http://host.docker.internal:5000/generate")
                {
                    Content = content
                },
                HttpCompletionOption.ResponseHeadersRead // 헤더 수신 후 바로 반환 (스트리밍 가능)
            );

            using var stream = await response.Content.ReadAsStreamAsync();
            using var reader = new StreamReader(stream);

            while (!reader.EndOfStream)
            {
                string? line = await reader.ReadLineAsync();
                if (!string.IsNullOrEmpty(line))
                {        
                    yield return line; // 한 줄씩 반환 (스트리밍)
                }
            }
        }
    }
}
