package com.example.AiPoweredTaskManagement.ExceptionHandling;

public class UserNotFoundException extends RuntimeException{
	
	public UserNotFoundException(String message) {
		super(message);
	}
}
