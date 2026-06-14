package com.example.AiPoweredTaskManagement.ExceptionHandling;

public class TokenError extends RuntimeException{
		public TokenError(String message) {
			super(message);
	}
}
