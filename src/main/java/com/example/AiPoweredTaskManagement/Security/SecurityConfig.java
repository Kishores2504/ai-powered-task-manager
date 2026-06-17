package com.example.AiPoweredTaskManagement.Security;

import java.net.http.HttpRequest;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	@Autowired
	JwtFilter jwtfilter;
	
	
	@Bean
	public SecurityFilterChain secruityfilter(HttpSecurity httpsecurity) throws Exception{
		return httpsecurity
				.csrf(csrf -> csrf.disable())
				.formLogin(form -> form.disable())
				.cors(cors -> {})
				.authorizeHttpRequests(request -> {
					request.requestMatchers("/user/register","/user/login").permitAll();
					request.requestMatchers("/user/*").hasRole("USER");
					request.anyRequest().authenticated();
				})
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.addFilterBefore(jwtfilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}
	
	@Bean
	public CorsConfigurationSource corsconfig() {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(List.of("http://localhost:5173","http://ai-powered-task-manager-production.up.railway.app"));
		config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		config.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource urlconfig = new UrlBasedCorsConfigurationSource();
		urlconfig.registerCorsConfiguration("/**", config);
		return urlconfig;
	}
	
	@Bean 
	public PasswordEncoder passwordencoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
	public AuthenticationManager authmanager(AuthenticationConfiguration config) {
		return config.getAuthenticationManager();
	}
}
