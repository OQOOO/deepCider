namespace OO_CoreServer.Services.Clients
{
    public interface ILLMApiClient
    {
        IAsyncEnumerable<string> SendPromptAndStreamResponse(string input);
    }
}
