package com.example.AiPoweredTaskManagement.AI_Integration.Dto;

public record TaskSuggestionResponse(
		String description,
		String priority,
		String estimatedTime
		) {}