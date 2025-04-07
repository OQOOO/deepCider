using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

namespace OO_CoreServer.Services
{
    public class ImageApiClientService
    {
        private HttpClient _httpClient;
        public ImageApiClientService(HttpClient httpClient) 
        {
            _httpClient = httpClient;
        }

        public async Task<string> PostToImageModelServer(IFormFile file, string port, string path="/predict")
        {
            string url = $"http://host.docker.internal:{port}{path}";

            using var content = new MultipartFormDataContent();

            // 파일 스트림을 HttpContent로 변환
            await using var stream = file.OpenReadStream();
            var fileContent = new StreamContent(stream);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType ?? "application/octet-stream");

            content.Add(fileContent, "file", file.FileName); // name="file", 파일 이름 설정

            // HTTP POST 요청
            var response = await _httpClient.PostAsync(url, content);
            response.EnsureSuccessStatusCode(); // 실패 시 예외 발생

            return await response.Content.ReadAsStringAsync();
        }
    }
}
