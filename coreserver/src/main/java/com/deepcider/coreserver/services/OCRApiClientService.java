package com.deepcider.coreserver.services;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;
@Service
public class OCRApiClientService {

    private final WebClient webClient;

    public OCRApiClientService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://host.docker.internal:5200").build();
    }

    public Mono<String> postToOCRServer(MultipartFile file) {

        System.out.println(file);

        return Mono.fromCallable(() -> {
            // 파일을 ByteArrayResource로 변환하면서 파일명 지정
            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename(); // 파일명 추가
                }
            };

            // Multipart 데이터 생성
            MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
            bodyBuilder.part("file", fileResource)
                    .contentType(MediaType.MULTIPART_FORM_DATA);

            return bodyBuilder.build();
        }).flatMap(body -> webClient.post()
                .uri("/ocr") // OCR 서버의 엔드포인트
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .bodyValue(body)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class) // JSON 응답을 문자열로 변환
        );
    }
}
