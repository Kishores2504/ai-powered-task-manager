package com.example.AiPoweredTaskManagement.Security;

import java.io.IOException;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.AiPoweredTaskManagement.Repository.UserRepository;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter{
	
	@Autowired
	JwtUtility jwtutil;
	
	@Autowired
	UserRepository user_repo;
	
	@Autowired
	CustomUserDetailsService userdetails;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		String path = request.getServletPath();
		
		if(path.equals("/user/register") || path.equals("/user/login")) {
			filterChain.doFilter(request, response);
			return;
		}
		
		String header = request.getHeader("Authorization");
		String username = null;
		String token = null;
		
		if(header != null && header.startsWith("Bearer ")) {
			token = header.substring(7).trim();
			
			try {
				Claims claims = jwtutil.extract_claims(token);
				if(claims.isEmpty()) {
					filterChain.doFilter(request, response);
					return;
				}
				Date date = claims.getExpiration();
				
				if(jwtutil.is_expired(date)) {
					filterChain.doFilter(request, response);
					return;
				}
			} catch (Exception e) {
				System.out.println(e.getMessage());
				filterChain.doFilter(request, response);
				return;
			}
			
			username = jwtutil.extract_useremail(token);
			
			if(username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
				UserDetails user = userdetails.loadUserByUsername(username);
				if(jwtutil.is_token_valid(user, token)) {
					UsernamePasswordAuthenticationToken userpass = new UsernamePasswordAuthenticationToken(user,null,user.getAuthorities());
					userpass.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(userpass);
				}
			}
		}
		filterChain.doFilter(request, response);
	}
}
