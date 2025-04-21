namespace OO_CoreServer.Services
{
    public interface ILLMApiClient
    {
        IAsyncEnumerable<string> SendPromptAndStreamResponse(string input);
    }
}
