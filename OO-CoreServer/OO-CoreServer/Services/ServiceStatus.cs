namespace OO_CoreServer.Services
{
    public class ServiceStatus
    {
        public bool IsChatGPTEnabled { get; set; } = true;
        public bool IsLocalLLMEnabled { get; set; } = true;

        public bool IsOCREnabled { get; set; } = true;
        public bool IsObjectDetectionEnabled { get; set; } = true;
    }
}
