using System.Net.Http;
using System.Text.Json;
using System.Text;
using System.Threading;
using Microsoft.AspNetCore.Mvc;

namespace OO_CoreServer.Services.Clients
{
    public class LocalLLMApiClient : ILLMApiClient
    {
        private readonly HttpClient _httpClient;
        private ServiceStatus _status;
        public LocalLLMApiClient(HttpClient httpClient, ServiceStatus status)
        {
            _httpClient = httpClient;
            _status = status;
        }

        public async Task<bool> ServerHealthCheck()
        {

            try
            {
                var response = await _httpClient.GetAsync("http://host.docker.internal:5000/health");
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async IAsyncEnumerable<string> SendPromptAndStreamResponse(string request)
        {
            string prompt = $"""
                User: {request}
                Assistant :
                """;

            var payload = new { prompt };
            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

            using var response = await _httpClient.SendAsync(
                new HttpRequestMessage(HttpMethod.Post, "http://host.docker.internal:5000/predict")
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
