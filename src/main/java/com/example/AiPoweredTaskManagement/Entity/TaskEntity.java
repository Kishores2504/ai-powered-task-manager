package com.example.AiPoweredTaskManagement.Entity;

import java.time.LocalDate;

import com.example.AiPoweredTaskManagement.DataTransferObjects.TaskDto;
import com.example.AiPoweredTaskManagement.Enumurated.Priority;
import com.example.AiPoweredTaskManagement.Enumurated.Status;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class TaskEntity {
	@Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int task_id;
	private String task_title;
	private String task_description;
	private Priority task_priority;
	private LocalDate task_createdAt;
	private LocalDate task_dueDate;
	private Status task_status;
	@ManyToOne(fetch = FetchType.LAZY )
	@JoinColumn(name = "user_id")
	private UserEntity user;
	
	
	public TaskEntity(int task_id, String task_title, String task_description, Priority task_priority,
			 LocalDate task_createdAt ,LocalDate task_dueDate, Status task_status,UserEntity user) {
		this.task_id = task_id;
		this.task_title = task_title;
		this.task_description = task_description;
		this.task_priority = task_priority;
		this.task_createdAt = task_createdAt;
		this.task_dueDate = task_dueDate;
		this.task_status = task_status;
		this.user = user;
	}
	public TaskEntity() {};
	
	public UserEntity getUser() {
		return user;
	}

	public void setUser(UserEntity user) {
		this.user = user;
	}


	public int getTask_id() {
		return task_id;
	}

	public void setTask_id(int task_id) {
		this.task_id = task_id;
	}

	public String getTask_title() {
		return task_title;
	}

	public void setTask_title(String task_title) {
		this.task_title = task_title;
	}

	public String getTask_description() {
		return task_description;
	}

	public void setTask_description(String task_description) {
		this.task_description = task_description;
	}

	public Priority getTask_priority() {
		return task_priority;
	}

	public void setTask_priority(Priority task_priority) {
		this.task_priority = task_priority;
	}

	public LocalDate getTask_createdAt() {
		return task_createdAt;
	}

	public void setTask_createdAt() {
		this.task_createdAt = LocalDate.now();
	}

	public LocalDate getTask_dueDate() {
		return task_dueDate;
	}

	public void setTask_dueDate(LocalDate task_dueDate) {
		this.task_dueDate = task_dueDate;
	}

	public Status getTask_status() {
		return task_status;
	}

	public void setTask_status(Status task_status) {
		this.task_status = task_status;
	} 
	
}
