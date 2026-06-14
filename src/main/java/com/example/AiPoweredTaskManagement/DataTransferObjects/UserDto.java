package com.example.AiPoweredTaskManagement.DataTransferObjects;

public record UserDto(
		int id ,
		String name,
		String email,
		String password
		) {}