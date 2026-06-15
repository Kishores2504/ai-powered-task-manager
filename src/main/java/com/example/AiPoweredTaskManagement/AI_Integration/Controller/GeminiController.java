package com.example.AiPoweredTaskManagement.AI_Integration.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.AiPoweredTaskManagement.AI_Integration.Dto.TaskSuggestionRequest;
import com.example.AiPoweredTaskManagement.AI_Integration.Service.GeminiService;

@RestController
@RequestMapping("/ai")
@CrossOrigin(originPatterns = "http://localhost:5173")
public class GeminiController {
	@Autowired
	GeminiService geminiservice ; 
	
	
	@PostMapping("/taskSuggestion")
	public ResponseEntity<?> getapitested(@RequestBody TaskSuggestionRequest request){
		String response = geminiservice.testGeminiConnection(request);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}
}
