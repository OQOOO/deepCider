package com.deepcider.coreserver.controllers;

import com.deepcider.coreserver.services.ImageApiClientService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

@RestController
@CrossOrigin(origins = "*")
public class ImageController {

    private final ImageApiClientService imageApiClientService;

    public ImageController(ImageApiClientService imageApiClientService) {
        this.imageApiClientService = imageApiClientService;
    }

    @PostMapping(value = "/ocr")
    public Mono<String> OCR(@RequestParam("file") MultipartFile file) {
        // ocrEndpoint
        String port = "5200";
        String path = "/ocr";

        return this.imageApiClientService.postToOCRServer(file, port, path);

    }

    @PostMapping(value = "/objectDetection")
    public Mono<String> objectDetection(@RequestParam("file") MultipartFile file) {
        // ODEndpoint
        String port = "5202";
        String path = "/yolo";

        return this.imageApiClientService.postToOCRServer(file, port, path);
    }

}
