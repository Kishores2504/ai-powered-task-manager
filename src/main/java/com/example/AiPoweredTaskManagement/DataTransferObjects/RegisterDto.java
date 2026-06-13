package com.example.AiPoweredTaskManagement.DataTransferObjects;

public record RegisterDto(
		String name,
		String email,
		String password
		) {}