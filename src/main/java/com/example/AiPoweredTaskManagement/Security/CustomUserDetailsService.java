package com.example.AiPoweredTaskManagement.Security;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.AiPoweredTaskManagement.Entity.UserEntity;
import com.example.AiPoweredTaskManagement.ExceptionHandling.UserNotFoundException;
import com.example.AiPoweredTaskManagement.Repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService{
	@Autowired 
	UserRepository user_repo;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<UserEntity> isuser = user_repo.findByuser_email(username);
		if(isuser.isEmpty()) {
			throw new UserNotFoundException("User not Found");
		}
		return new CustomUserDetails(isuser.get());
	}

}
