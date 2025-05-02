class ServerStatusChecker {
    constructor() {
        this.isServerRunning = false;
        this.isChatGPTEnabled = false;
        this.isDeepseekEnabled = false;
        this.isDeepseekModuleHealthy = false;
    }

    async checkServerStatus() {
        try {
            const response = await fetch("http://localhost:37777/serviceStatus");
            if (!response.ok) throw new Error("서버 응답 오류");
            const data = await response.json();

            // core server healthy
            this.isServerRunning = true; // 서버가 정상적으로 응답하면 true로 설정

            // ai module healty
            this.isOpenAIServerHealthy = data.isOpenAIServerHealthy;
            this.isDeepseekModuleHealthy = data.isServerLLMHealthy;

            // enabled
            this.isChatGPTEnabled = data.isChatGPTEnabled;
            this.isDeepseekEnabled = data.isServerLLMEnabled;

        } catch {
            console.log("서버가 응답하지 않습니다.");
        }
    }
}

export default ServerStatusChecker;