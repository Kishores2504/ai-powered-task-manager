package com.example.AiPoweredTaskManagement.Security;

import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtility {
	
	@Value("${my.secret.key}")
	private static String privatekey;
	
	public Key getSignKey() {
		return Keys.hmacShaKeyFor(privatekey.getBytes());
	}
	
	public String generate_token(String useremail) {
		return Jwts.builder()
				.signWith(getSignKey(), SignatureAlgorithm.HS256)
				.setSubject(useremail)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() * 1000 * 60 * 60))
				.compact();
	}
}
