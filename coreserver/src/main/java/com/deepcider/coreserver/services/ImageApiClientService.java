package com.deepcider.coreserver.services;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class ImageApiClientService {

    private final WebClient webClient;

    public ImageApiClientService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public Mono<String> postToOCRServer(MultipartFile file, String port, String path) {

        System.out.println(file);

        String url = "http://host.docker.internal:"+ port + path;

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
                .uri(url) // OCR 서버의 엔드포인트
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .bodyValue(body)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class) // JSON 응답을 문자열로 변환
        );
    }
}
