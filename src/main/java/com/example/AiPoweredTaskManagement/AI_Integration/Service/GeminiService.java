package com.example.AiPoweredTaskManagement.AI_Integration.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.AiPoweredTaskManagement.AI_Integration.Dto.Content;
import com.example.AiPoweredTaskManagement.AI_Integration.Dto.GeminiRequest;
import com.example.AiPoweredTaskManagement.AI_Integration.Dto.Part;
import com.example.AiPoweredTaskManagement.AI_Integration.Dto.TaskSuggestionRequest;

import jakarta.annotation.PostConstruct;

@Service
public class GeminiService {
	private final WebClient webclient;
	
	@Value("${my.gemini.key}")
	private String apiKey;
	
	@Value("${gemini.url}")
	private String apiUrl;

	public GeminiService(WebClient client) {
		this.webclient = client;
	}
	// it is used to test methods which the post means after bean creation
//	@PostConstruct
//	public void testApiKey() {
//	    System.out.println("Gemini API Key = " + apiKey);
//	}

	// prompt preparation
	private String buildprompt(TaskSuggestionRequest request) {
		return """
				Task Title : %s

				Generate ONLY valid JSON.

				Required format:
				{
					"description" : "",
					"priority" : "",
					"estimatedTime" :""
				}

				Rules:
				        1. Priority must be LOW, or HIGH.
				        2. Estimated time must be realistic.
				        3. Do not return explanations.
				        4. Return only JSON.
				""".formatted(request.title());
	}
	
	private GeminiRequest createGeminirequest(TaskSuggestionRequest task) {
		
		String prompt = buildprompt(task);
		
		return new GeminiRequest(
				List.of(
						new Content(
								List.of(
										new Part(prompt)
										)
								)
						)
				);
	}
	
//	@PostConstruct
//	public void testapi() {
//		System.out.println("Gemini API Key = " + apiUrl);
//	}
	
	public String testGeminiConnection(TaskSuggestionRequest request) {
		GeminiRequest requests = createGeminirequest(request);
		return webclient.post()
				.uri(apiUrl + "?key=" + apiKey)
				.bodyValue(requests)
				.retrieve()
				.onStatus(status -> status.isError(), response -> response.bodyToMono(String.class).map(RuntimeException::new))
				.bodyToMono(String.class)
				.block();
				
	}
}
