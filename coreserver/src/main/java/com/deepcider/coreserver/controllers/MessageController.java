package com.deepcider.coreserver.controllers;

import ch.qos.logback.core.net.SyslogOutputStream;
import com.deepcider.coreserver.VOs.MessageVO;
import com.deepcider.coreserver.services.LLMApiClientService;
import com.deepcider.coreserver.services.PromptWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;


@RestController
@CrossOrigin(origins = "*")  // 모든 출처에서의 요청을 허용
public class MessageController {

    private final LLMApiClientService llmApiClientService;
    private final PromptWrapper promptWrapper;

    public MessageController(LLMApiClientService llmApiClientService,
                             PromptWrapper promptWrapper
    ) {
        this.llmApiClientService = llmApiClientService;
        this.promptWrapper = promptWrapper;
    }

    @PostMapping(value = "/validateLogic", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> validateLogic(@RequestBody MessageVO vo) {
        var pormpt = promptWrapper.validateLogic(vo.getMessage());
        return llmApiClientService.postToLLMServer(pormpt);
    }

    @PostMapping(value = "/explainMetaphor", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> explainMetaphor(@RequestBody MessageVO vo) {
        var prompt = promptWrapper.metaphor(vo.getMessage());
        return llmApiClientService.postToLLMServer(prompt);
    }
}
