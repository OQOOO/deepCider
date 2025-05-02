using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OO_CoreServer.Services;
using OO_CoreServer.Services.Clients;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace OO_CoreServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private ServiceStatus _status;
        public OpenAiApiClient _openAiApiClient;
        public LocalLLMApiClient _localLLMApiClient;
        public AdminController(ServiceStatus status, LocalLLMApiClient localLLMApiClient, OpenAiApiClient openAiApiClient) 
        { 
            _status = status;
            _openAiApiClient = openAiApiClient;
            _localLLMApiClient = localLLMApiClient;
        }

        [Authorize(Roles = "admin")]
        [HttpPost("/setServiceStatus/chatGPT")]
        public IActionResult SetChatGPTEnabled([FromBody] bool enabled)
        {
            _status.IsChatGPTEnabled = enabled;
            Console.WriteLine("_status.IsChatGPTEnabled: "+_status.IsChatGPTEnabled);

            return Ok(new
                {
                    serviceEnabled = _status.IsChatGPTEnabled
                }
            );
        }

        [Authorize(Roles = "admin")]
        [HttpPost("/setServiceStatus/deepseek")]
        public async Task<IActionResult> SetDeepseekEnabled([FromBody] bool enabled)
        {
            _status.IsLocalLLMEnabled = enabled;
            Console.WriteLine("_status.IsLocalLLMEnabled: " + _status.IsLocalLLMEnabled);

            // return Ok(_status.IsLocalLLMEnabled);

            return Ok(new 
                { 
                    serviceEnabled = _status.IsLocalLLMEnabled,
                }
            );
        }

        [Authorize(Roles = "admin")]
        [HttpPost("/setServiceStatus/OCR")]
        public async Task<IActionResult> SetOCREnabled([FromBody] bool enabled)
        {
            _status.IsOCREnabled = enabled;
            Console.WriteLine("OCREnabled:" + enabled);

            return Ok(new {
                serviceEnabled = _status.IsOCREnabled,
            });
        }

        [Authorize(Roles = "admin")]
        [HttpPost("/setServiceStatus/ObjectDetection")]
        public async Task<IActionResult> SetObjectDetectionEnabled([FromBody] bool enabled)
        {
            _status.IsObjectDetectionEnabled = enabled;

            return Ok(new
            {
                serviceEnabled = _status.IsObjectDetectionEnabled,
            });
        }

    }
}
