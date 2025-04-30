using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OO_CoreServer.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace OO_CoreServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private ServiceStatus _status;
        public AdminController(ServiceStatus status) 
        { 
            _status = status;
        }

        // GET: api/<AdminController>
        [HttpGet("/serviceStatus")]
        public IActionResult GetServiceStatus()
        {
            return Ok(new
            {
                isChatGPTEnabled = _status.IsChatGPTEnabled,
                isServerLLMEnabled = _status.IsLocalLLMEnabled
            });
        }

        [Authorize(Roles = "admin")]
        [HttpPost("/setServiceStatus/chatGPT")]
        public IActionResult SetChatGPTEnabled([FromBody] bool enabled)
        {
            _status.IsChatGPTEnabled = enabled;
            Console.WriteLine("_status.IsChatGPTEnabled: "+_status.IsChatGPTEnabled);

            return Ok(_status.IsChatGPTEnabled);
        }

        [Authorize(Roles = "admin")]
        [HttpPost("/setServiceStatus/deepseek")]
        public IActionResult SetDeepseekEnabled([FromBody] bool enabled)
        {
            _status.IsLocalLLMEnabled = enabled;
            Console.WriteLine("_status.IsLocalLLMEnabled: " + _status.IsLocalLLMEnabled);

            return Ok(_status.IsLocalLLMEnabled);
        }

    }
}
