package com.Api_Crafter.Rest_Spring.AdvanceSearch;

import org.springframework.web.reactive.function.client.WebClient;

import com.Api_Crafter.Rest_Spring.DTO.Route;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class ApiService {

    private final WebClient webClient;

    public ApiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://127.0.0.1:5000").build();
    }

    public Mono<AdvanceResponseDTO> performAdvanceSearch(AdvanceSearchDTO advanceSearchDTO) {
    
        return webClient.post()
                .uri("/AdvanceSearch")
                .bodyValue(advanceSearchDTO)
                .retrieve()
                .bodyToMono(AdvanceResponseDTO.class);  // Change here to return String
    }
}
