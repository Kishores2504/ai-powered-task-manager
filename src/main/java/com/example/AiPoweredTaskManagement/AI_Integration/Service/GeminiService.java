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
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

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
				        4. Return ONLY valid JSON. No markdown, no code block, no explanation.
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
		String rawresponse = webclient.post()
				.uri(apiUrl + "?key=" + apiKey)
				.bodyValue(requests)
				.retrieve()
				.bodyToMono(String.class)
				.block();
		return extractTaskSuggestion(rawresponse);	
	}
	private String extractTaskSuggestion(String geminiresponse) {
		try {
			ObjectMapper mapper = new ObjectMapper(); // used to convert btw json and java obj
			JsonNode root = mapper.readTree(geminiresponse);//  json node parse the raw
			// json into a tree like structure root represent the entire root of the json obj
			
			String textcontent = root.path("candidates") // we get the root and going into it
 								 .path(0) 		//get the first candidate
								 .path("content") // get content obj
								 .path("parts") // get parts array
								 .path(0) 	// get first part 
								 .path("text") // get text inside the part
								 .asText();	// convert to java string
			
			JsonNode sugesstionjson = mapper.readTree(textcontent); // again coverting it to json because we converted
			// it to string and now we again convert it to json 
			return mapper.writeValueAsString(sugesstionjson); // convert the json into
			// clear json string
		} catch (Exception e) {
			throw new RuntimeException("Failed to parse Gemini Response", e);
		}
	}
}
