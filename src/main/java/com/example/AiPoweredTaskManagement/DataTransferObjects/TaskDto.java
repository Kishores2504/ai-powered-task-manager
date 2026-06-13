package com.example.AiPoweredTaskManagement.DataTransferObjects;

public record TaskDto(
		int id ,
		String title ,
		String description,
		String priority ,
		String createdat,
		String dueDate,
		String status
		) {}