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
        private ImageApiClient _imageApiClientService;

        private OpenApiClient _openApiClient;
        private LocalLLMApiClient _localLLMApiClient;
        private ServiceStatus _serviceStatus;
        

        public ModelApiController(ImageApiClient imageApiClientService,
                                  OpenApiClient openApiClient,
                                  LocalLLMApiClient localLLMApiClient,
                                  ServiceStatus serviceStatus)
        {
            _imageApiClientService = imageApiClientService;

            _openApiClient = openApiClient;
            _localLLMApiClient = localLLMApiClient;
            _serviceStatus = serviceStatus;
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
            /*var clientMap = new Dictionary<string, ILLMApiClient>()
            {
                {"ChatGPT", _openApiClient },
                {"Deepseek", _localLLMApiClient }
            };

            ILLMApiClient llmApiClient = clientMap[dto.Model];

            Response.Headers.Append("Content-Type", "text/event-stream"); // SSE와 동일한 Content-Type 설정
            await foreach (var chunk in llmApiClient.SendPromptAndStreamResponse(dto.Message))
            {
                await Response.WriteAsync(chunk);
                await Response.Body.FlushAsync(); // 강제로 데이터를 클라이언트로 밀어냄
            }*/
        }

        [HttpPost("/validateLogic/openAI")]
        public async Task<IActionResult> ValidateLogicWithOpenAI([FromBody] MessageDTO dto)
        {
            Console.WriteLine("newAPI 성공!");
            if (!_serviceStatus.IsChatGPTEnabled)
            {
                return StatusCode(503, "ChatGPT 기능이 현재 비활성화되어 있습니다."); // 또는 Forbid(), BadRequest()
            }

            Response.Headers.Append("Content-Type", "text/event-stream"); // SSE와 동일한 Content-Type 설정
            await foreach (var chunk in _openApiClient.SendPromptAndStreamResponse(dto.Message))
            {
                await Response.WriteAsync(chunk);
                await Response.Body.FlushAsync(); // 강제로 데이터를 클라이언트로 밀어냄
            }

            return new EmptyResult(); // SSE 종료 후 반환할 값
        }

        [HttpPost("/validateLogic/deepseek")]
        public async Task<IActionResult> ValidateLogicWithDeepseek([FromBody] MessageDTO dto)
        {
            Console.WriteLine("newAPI 성공!");
            if (!_serviceStatus.IsLocalLLMEnabled)
            {
                return StatusCode(503, "Deepseek 기능이 현재 비활성화되어 있습니다."); // 또는 Forbid(), BadRequest()
            }

            Response.Headers.Append("Content-Type", "text/event-stream"); // SSE와 동일한 Content-Type 설정
            await foreach (var chunk in _localLLMApiClient.SendPromptAndStreamResponse(dto.Message))
            {
                await Response.WriteAsync(chunk);
                await Response.Body.FlushAsync(); // 강제로 데이터를 클라이언트로 밀어냄
            }

            return new EmptyResult(); // SSE 종료 후 반환할 값
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
