package com.example.AiPoweredTaskManagement.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
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
import com.example.AiPoweredTaskManagement.DataTransferObjects.addTaskDto;
import com.example.AiPoweredTaskManagement.Entity.TaskEntity;
import com.example.AiPoweredTaskManagement.Entity.UserEntity;
import com.example.AiPoweredTaskManagement.Enumurated.Priority;
import com.example.AiPoweredTaskManagement.Enumurated.Role;
import com.example.AiPoweredTaskManagement.Enumurated.Status;
import com.example.AiPoweredTaskManagement.ExceptionHandling.TaskError;
import com.example.AiPoweredTaskManagement.ExceptionHandling.TokenError;
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
		if (isuser.isEmpty()) {
			UserEntity user = new UserEntity();
			user.setUser_name(registerdto.name());
			user.setUser_email(registerdto.email());
			user.setUser_password(encoder.encode(registerdto.password()));
			user.setRole(Role.USER);
			user_repo.save(user);
			return ResponseEntity.status(HttpStatus.OK).body("Registered Successfully.");
		}
		return ResponseEntity.status(HttpStatus.CONFLICT).body("User Found. Please Login");
	}

	public ResponseEntity<?> login(LoginDto logindto) {
		Optional<UserEntity> isuser = user_repo.findByuser_email(logindto.email());
		if (isuser.isEmpty()) {
			throw new UserNotFoundException("User Not Found Register");
		}
		Authentication auth = authmanager
				.authenticate(new UsernamePasswordAuthenticationToken(logindto.email(), logindto.password()));
		String token = jwtutil.generate_token(auth.getName());
		String role = auth.getAuthorities().iterator().next().getAuthority();

		if (role.startsWith("ROLE_")) {
			role = role.substring(5);
		}
		return ResponseEntity.status(HttpStatus.OK).body(Map.of("token", token, "role", role));
	}

	public ResponseEntity<?> addtask(addTaskDto taskdto, String token) {

		String token_trimmed = token.substring(7);
		if (token == null || !token.startsWith("Bearer ") || jwtutil.is_expired(jwtutil.get_expiry(token_trimmed))) {
//			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Token");
			throw new TokenError("Invalid Credentials");
		}
		if(LocalDate.parse(taskdto.dueDate()).isBefore(LocalDate.now())) {
			throw new TaskError("Due Date Should Be 1 day after today");
		}
		String username = jwtutil.extract_useremail(token_trimmed);
		UserEntity user = user_repo.findByuser_email(username)
				.orElseThrow(() -> new UserNotFoundException("User Not Found"));
		Optional<TaskEntity> istask = task_repo.findBy_task_title(taskdto.title());
		System.out.println(istask.isPresent());
		if (istask.isPresent()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Task Already Exist");
		}

		TaskEntity task = new TaskEntity();
		task.setTask_title(taskdto.title());
		task.setTask_description(taskdto.description());
		task.setTask_createdAt();
		task.setTask_dueDate(LocalDate.parse(taskdto.dueDate()));
		task.setTask_priority(Priority.valueOf(taskdto.priority()));
		task.setTask_status(Status.valueOf(taskdto.status()));
		task.setUser(user);
		task_repo.save(task);
		return ResponseEntity.status(HttpStatus.OK).body("Task Added Successfully.");
	}

	public ResponseEntity<?> alltasks(String header) {
		String token = header.substring(7).trim();
		if (header == null || !header.startsWith("Bearer ") || jwtutil.is_expired(jwtutil.get_expiry(token))) {
			throw new TokenError("Invalid Credentials");
		}
		Optional<UserEntity> isuser = user_repo.findByuser_email(jwtutil.extract_useremail(token));
		if (isuser.isEmpty()) {
			throw new UserNotFoundException("User Not Found");
		}
		UserEntity user = isuser.get();

		List<TaskEntity> tasklist = task_repo.findBy_user_id(user.getUserid());

		if (tasklist.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Task's Created");
		} else {

			List<TaskDto> dtos = tasklist.stream().map((element) -> {
				TaskDto taskdto = new TaskDto(element.getTask_id(),element.getTask_title(), element.getTask_description(),
						element.getTask_priority().toString(), String.valueOf(element.getTask_createdAt()),
						String.valueOf(element.getTask_dueDate()), element.getTask_status().toString());
				System.out.println(taskdto);
				return taskdto;
			}).toList();
			return ResponseEntity.status(HttpStatus.OK).body(dtos);
		}
	}

	public ResponseEntity<?> deletetask(String header, int taskid) {
		String token = header.substring(7).trim();
		if (header == null || !header.startsWith("Bearer ") || jwtutil.is_expired(jwtutil.get_expiry(token))) {
			throw new TokenError("Invalid Credentials");
		}
		Optional<UserEntity> isuser = user_repo.findByuser_email(jwtutil.extract_useremail(token));
		if (isuser.isEmpty()) {
			throw new UserNotFoundException("User Not Found");
		}
		UserEntity user = isuser.get();
		Optional<TaskEntity> istask = task_repo.findById(taskid);
		if (istask.isEmpty()) {
			throw new TaskError("Task Error");
		}
		TaskEntity task = istask.get();

		if (!(task.getUser().getUserid() == user.getUserid())) {
			throw new UserNotFoundException("Invalid Credentials");
		}
		task_repo.delete(task);
		return ResponseEntity.status(HttpStatus.OK).body("Task Deleted Succesfully");
	}

	public ResponseEntity<?> updatetask(String header, int taskid, addTaskDto taskdto) {
		String token = header.substring(7).trim();
		if (header == null || !header.startsWith("Bearer ") || jwtutil.is_expired(jwtutil.get_expiry(token))) {
			throw new TokenError("Invalid Credentials");
		}
		Optional<TaskEntity> istask = task_repo.findById(taskid);
		if (istask.isEmpty()) {
			throw new TaskError("Task Not Found");
		}
		TaskEntity task = istask.get();
		
		if (!task.getUser().getUser_email().equals(jwtutil.extract_useremail(token))) {
			throw new UserNotFoundException("Invalid Credentials");
		}
		task.setTask_title(
				taskdto.title() == null || taskdto.title().equals("") ? task.getTask_title() : taskdto.title());
		task.setTask_description(
				taskdto.description() == null || taskdto.description().equals("") ? task.getTask_description()
						: taskdto.description());
		task.setTask_priority(taskdto.priority() == null || taskdto.priority().equals("") ? task.getTask_priority()
				: Priority.valueOf(taskdto.priority()));
		task.setTask_createdAt();
		task.setTask_dueDate(taskdto.dueDate() == null || taskdto.dueDate().equals("") ? task.getTask_dueDate()
				: LocalDate.parse(taskdto.dueDate()));
		task.setTask_status(taskdto.status() == null || taskdto.status().equals("") ? task.getTask_status()
				: Status.valueOf(taskdto.status()));
		task_repo.save(task);
		return ResponseEntity.status(HttpStatus.OK).body("Task Updated Successfully");
	}

}
