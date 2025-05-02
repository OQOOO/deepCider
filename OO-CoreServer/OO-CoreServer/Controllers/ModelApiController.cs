using Microsoft.AspNetCore.Mvc;
using OO_CoreServer.DTOs;
using OO_CoreServer.Services;
using OO_CoreServer.Services.Clients;
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
        private OpenAiApiClient _openApiClient;
        private LocalLLMApiClient _localLLMApiClient;
        private ServiceStatus _serviceStatus;
        

        public ModelApiController(ImageApiClient imageApiClientService,
                                  OpenAiApiClient openApiClient,
                                  LocalLLMApiClient localLLMApiClient,
                                  ServiceStatus serviceStatus)
        {
            _imageApiClientService = imageApiClientService;
            _openApiClient = openApiClient;
            _localLLMApiClient = localLLMApiClient;
            _serviceStatus = serviceStatus;
        }

        [HttpPost("/validateLogic/openAI")]
        public async Task<IActionResult> ValidateLogicWithOpenAI([FromBody] MessageDTO dto)
        {
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
            if (!_serviceStatus.IsOCREnabled)
            {
                return StatusCode(503, "OCR 기능이 현재 비활성화되어 있습니다."); // 또는 Forbid(), BadRequest()
            }

            string port = "5200";
            var result = await _imageApiClientService.PostToImageModelServer(file, port);
            return Ok(result);
        }

        [HttpPost("/objectDetection")]
        public async Task<IActionResult> ObjectDetection([FromForm] IFormFile file)
        {
            if (!_serviceStatus.IsObjectDetectionEnabled)
            {
                return StatusCode(503, "ObjectDetection 기능이 현재 비활성화되어 있습니다."); // 또는 Forbid(), BadRequest()
            }

            string port = "5202";
            var result = await _imageApiClientService.PostToImageModelServer(file, port);
            return Ok(result);
        }

        //
        string serviceStatus = "/serviceStatus";

        [HttpGet("/serverHealth")]
        public async Task<IActionResult> ServerHealth()
        {
            Console.WriteLine("dfgasgaasf");
            return Ok(new
            {
                healthy = true
            });
        }

        [HttpGet("/serviceStatus/openAI")]
        public async Task<IActionResult> OpenAIStatus()
        {
            return Ok(new
            {
                enabled = _serviceStatus.IsChatGPTEnabled,
                healthy = await _openApiClient.ServerHealthCheck()
            });
        }

        [HttpGet("/serviceStatus/deepseek")]
        public async Task<IActionResult> DeepseekStatus()
        {
            return Ok(new 
            { 
                enabled = _serviceStatus.IsLocalLLMEnabled,
                healthy = await _localLLMApiClient.ServerHealthCheck()
            });
        }

        [HttpGet("/serviceStatus/OCR")]
        public async Task<IActionResult> ocrStatus()
        {

            // 모델: paddleocr
            string port = "5200";
            return Ok(new
            {
                enabled = _serviceStatus.IsOCREnabled,
                healthy = await _imageApiClientService.ServerHealthCheck(port)
            });
        }

        [HttpGet("/serviceStatus/objectDetection")]
        public async Task<IActionResult> objectDetectionStatus()
        {

            // 모델: paddleocr
            string port = "5202";

            return Ok(new
            {
                enabled = _serviceStatus.IsObjectDetectionEnabled,
                healthy = await _imageApiClientService.ServerHealthCheck(port)
            });
        }
    }
}
