package com.example.AiPoweredTaskManagement.ExceptionHandling;

public class TaskError extends RuntimeException{
	public TaskError(String mess) {
		super(mess);
	}
}
