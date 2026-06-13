package com.example.AiPoweredTaskManagement.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.AiPoweredTaskManagement.DataTransferObjects.LoginDto;
import com.example.AiPoweredTaskManagement.DataTransferObjects.RegisterDto;
import com.example.AiPoweredTaskManagement.DataTransferObjects.TaskDto;
import com.example.AiPoweredTaskManagement.Entity.TaskEntity;
import com.example.AiPoweredTaskManagement.Entity.UserEntity;
import com.example.AiPoweredTaskManagement.Enumurated.Priority;
import com.example.AiPoweredTaskManagement.Enumurated.Role;
import com.example.AiPoweredTaskManagement.Enumurated.Status;
import com.example.AiPoweredTaskManagement.ExceptionHandling.UserNotFoundException;
import com.example.AiPoweredTaskManagement.Repository.TaskRepository;
import com.example.AiPoweredTaskManagement.Repository.UserRepository;
import com.example.AiPoweredTaskManagement.Security.CustomUserDetails;
import com.example.AiPoweredTaskManagement.Security.JwtUtility;

@Service
public class UserService {
	
	@Autowired 
	UserRepository user_repo;
	
	@Autowired
	TaskRepository task_repo;
	
	@Autowired
	AuthenticationManager authmanager;
	
	@Autowired
	PasswordEncoder encoder;
	
	@Autowired
	JwtUtility jwtutil;
	
	public ResponseEntity<String> register(RegisterDto registerdto) {
		Optional<UserEntity> isuser = user_repo.findByuser_email(registerdto.email());
		if(isuser.isEmpty()) {
			UserEntity user = new UserEntity();
			user.setUser_name(registerdto.name());
			user.setUser_email(registerdto.email());
			user.setUser_password(encoder.encode(registerdto.password()));
			user.setRole(Role.user);
			user_repo.save(user);
			return ResponseEntity.status(HttpStatus.OK).body("Registered Successfully.");
		}
		return ResponseEntity.status(HttpStatus.FOUND).body("User Found. Please Login");	
	}

	public ResponseEntity<?> login(LoginDto logindto) {
		Optional<UserEntity> isuser = user_repo.findByuser_email(logindto.email());
		if(isuser.isEmpty()) {
			throw new UserNotFoundException("User Not Found Register");
		}
		Authentication auth = authmanager.authenticate(new UsernamePasswordAuthenticationToken(
														logindto.email(),
														logindto.password()));
		String token = jwtutil.generate_token(auth.getName());
		String role = auth.getAuthorities().iterator().next().getAuthority();
		
		if(role.startsWith("ROLE_")) {
			role = role.substring(5);
		}
		return ResponseEntity.status(HttpStatus.OK).body(Map.of("token",token , "role",role));
	}

	public ResponseEntity<?> addtask(TaskDto taskdto , String token) {
		if(token == null || !token.startsWith("Bearer ") || !jwtutil.is_expired(jwtutil.get_expiry(token))) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Token");
		}
		String username = jwtutil.extract_useremail(token);
		UserEntity user = user_repo.findByuser_email(username).orElseThrow(()-> new UserNotFoundException("User Not Found"));
		Optional<TaskEntity> istask = task_repo.findBy_task_title(taskdto.title());
		if(istask.isPresent()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Task Already Exist");
		}
		System.out.println(taskdto.createdat());
		System.out.println(LocalDate.parse(taskdto.createdat()));
		System.out.println(LocalDate.parse(taskdto.dueDate()));
		System.out.println(Priority.valueOf(taskdto.priority()));
		 
		TaskEntity task = new TaskEntity();
		task.setTask_title(taskdto.title());
		task.setTask_description(taskdto.description());
		task.setTask_createdAt(LocalDate.parse(taskdto.createdat()));
		task.setTask_dueDate(LocalDate.parse(taskdto.dueDate()));
		task.setTask_priority(Priority.valueOf(taskdto.priority()));
		task.setTask_status(Status.valueOf(taskdto.status()));
		
		return null;
	}
	
}
