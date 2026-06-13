package com.example.AiPoweredTaskManagement.DataTransferObjects;

public record TaskDto(
		String title ,
		String description,
		String priority ,
		String createdat,
		String dueDate,
		String status
		) {}