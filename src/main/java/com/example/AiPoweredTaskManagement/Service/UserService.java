package com.example.AiPoweredTaskManagement.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.AiPoweredTaskManagement.DataTransferObjects.RegisterDto;
import com.example.AiPoweredTaskManagement.Entity.UserEntity;
import com.example.AiPoweredTaskManagement.Repository.TaskRepository;
import com.example.AiPoweredTaskManagement.Repository.UserRepository;

@Service
public class UserService {
	
	@Autowired 
	UserRepository user_repo;
	
	@Autowired
	TaskRepository task_repo;
	
	public ResponseEntity<String> register(RegisterDto registerdto) {
		Optional<UserEntity> isuser = user_repo.findByuser_email(registerdto.email());
		if(isuser.isEmpty()) {
			UserEntity user = new UserEntity();
			user.setUser_name(registerdto.name());
			user.setUser_email(registerdto.email());
			user.setUser_password(registerdto.password());
			user_repo.save(user);
			return ResponseEntity.status(HttpStatus.OK).body("Registered Successfully.");
		}
		return ResponseEntity.status(HttpStatus.FOUND).body("User Found. Please Login");	
	}

}
