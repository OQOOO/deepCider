using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OO_CoreServer.DTOs;
using System;
using System.IO;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;
using System.Net.Http;

namespace OO_CoreServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThirdPartyApiController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private string _gptApiKey;
        public ThirdPartyApiController(HttpClient httpClient)
        {
            _httpClient = httpClient;

            string keyPath = @"C:\Users\igh07\Desktop\AK\OAK.txt";
            _gptApiKey = System.IO.File.ReadAllText(keyPath).Trim();
        }

        [HttpGet("/test")]
        public string Test()
        {
            return "test";
        }

        [HttpPost("/tApi/chat")]
        public async Task sendMessageToChatGPT([FromBody] MessageDTO dto)
        {
            string message = dto.Message;
            Console.WriteLine("메시지: ", message);

            Response.ContentType = "text/event-stream"; // SSE 형식

            var requestBody = new
            {
                model = "gpt-4o-mini",
                stream = true,
                messages = new[]
                {
                    new { role = "user", content = message }
                }
            };

            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _gptApiKey);
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

                    try
                    {
                        var doc = JsonDocument.Parse(json);
                        var content = doc.RootElement
                                         .GetProperty("choices")[0]
                                         .GetProperty("delta")
                                         .GetProperty("content")
                                         .GetString();

                        if (!string.IsNullOrEmpty(content))
                        {
                            // 클라이언트가 읽을 수 있도록 data: prefix + 줄바꿈으로 전송
                            await Response.WriteAsync($"data: {content}\n\n");
                            await Response.Body.FlushAsync();
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("파싱 실패: " + ex.Message);
                    }
                }
            }
        }
    }
}