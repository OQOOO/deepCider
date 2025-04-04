package com.deepcider.coreserver.services;

import org.springframework.stereotype.Service;

@Service
public class PromptWrapper {

    public String validateLogic(String message) {
        String prompt = String.format("""
            User: %s
            Assistant:
            """, message);

        return prompt;
    }

    public String metaphor(String message) {
        String prompt = String.format("""
            User: Whatever I say, just print 1. %s
            Assistant:
            """, message);

        return prompt;
    }
}
