package com.example.AiPoweredTaskManagement.AI_Integration.Dto;

import java.util.List;

public record GeminiRequest(
		List<Content> contents
		) {}