package com.example.AiPoweredTaskManagement.AI_Integration.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import jakarta.annotation.PostConstruct;

@Service
public class GeminiService {
	private final WebClient webclient ;
	@Value("${my.gemini.secret.key}")
	private String apiKey;
	
	public GeminiService(WebClient client) {
		this.webclient = client;
	}
	// it is used to test methods which the post means after bean creation 
//	@PostConstruct
//	public void testApiKey() {
//	    System.out.println("Gemini API Key = " + apiKey);
//	}
}
