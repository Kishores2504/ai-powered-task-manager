package com.example.AiPoweredTaskManagement.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.AiPoweredTaskManagement.DataTransferObjects.RegisterDto;
import com.example.AiPoweredTaskManagement.Service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {
	
	@Autowired
	UserService user_service ;
	
	@PostMapping("/register")
	public ResponseEntity<String> user_register(@RequestBody RegisterDto registerdto){
		return user_service.register(registerdto);
	}
	
	
}
