using Microsoft.AspNetCore.Mvc;
using OO_CoreServer.DTOs;
using OO_CoreServer.Services;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace OO_CoreServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModelApiController : ControllerBase
    {
        private LLMApiClientService _clientService;
        private ImageApiClientService _imageApiClientService;

        public ModelApiController(LLMApiClientService clientService,
                                  ImageApiClientService imageApiClientService)
        {
            _clientService = clientService;
            _imageApiClientService = imageApiClientService;
        }

        // GET: api/Main
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpPost("/validateLogic")]
        public async Task ValidateLogic([FromBody] MessageDTO dto)
        {
            Response.Headers.Append("Content-Type", "text/event-stream"); // SSE와 동일한 Content-Type 설정
            await foreach (var chunk in _clientService.PostToLLMServerStreamAsync(dto.Message))
            {
                await Response.WriteAsync(chunk);
                await Response.Body.FlushAsync(); // 💡 강제로 데이터를 클라이언트로 밀어냄
            }
        }

        [HttpPost("/OCR")]
        public async Task<IActionResult> OCR([FromForm] IFormFile file)
        {
            string port = "5200";

            var result = await _imageApiClientService.PostToImageModelServer(file, port);
            return Ok(result);
        }

        [HttpPost("/objectDetection")]
        public async Task<IActionResult> ObjectDetection([FromForm] IFormFile file)
        {
            string port = "5202";

            var result = await _imageApiClientService.PostToImageModelServer(file, port);
            return Ok(result);
        }

        // GPT api 사용할땐 'ThirdPartyApiController' 새로 작성. api 키는 로컬에(gitHub 안올라가는 위치) 따로 보관하고 경로 읽어서 사용하기
    }
}
