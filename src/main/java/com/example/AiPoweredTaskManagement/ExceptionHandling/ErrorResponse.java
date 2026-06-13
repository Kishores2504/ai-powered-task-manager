package com.example.AiPoweredTaskManagement.ExceptionHandling;

import java.time.LocalDateTime;

public class ErrorResponse {
	private String message;
	private int status_code;
	private LocalDateTime dateandtime;
	
	public ErrorResponse(String message, int status_code, LocalDateTime dateandtime) {
		this.message = message;
		this.status_code = status_code;
		this.dateandtime = dateandtime;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public int getStatus_code() {
		return status_code;
	}
	public void setStatus_code(int status_code) {
		this.status_code = status_code;
	}
	public LocalDateTime getDateandtime() {
		return dateandtime;
	}
	public void setDateandtime(LocalDateTime dateandtime) {
		this.dateandtime = dateandtime;
	}
	
	
}
