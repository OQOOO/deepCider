package com.deepcider.coreserver.controllers;

import com.deepcider.coreserver.services.OCRApiClientService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

@RestController
@CrossOrigin(origins = "*")
public class ImageController {

    private final OCRApiClientService ocrApiClientService;

    public ImageController(OCRApiClientService ocrApiClientService) {
        this.ocrApiClientService = ocrApiClientService;
    }

    @PostMapping(value = "/ocr")
    public Mono<String> OCR(@RequestParam("file") MultipartFile file) {
        return this.ocrApiClientService.postToOCRServer(file);

    }

}
