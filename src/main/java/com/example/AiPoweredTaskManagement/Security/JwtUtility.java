package com.example.AiPoweredTaskManagement.Security;

import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtility {
	
	@Value("${my.secret.key}")
	private String privatekey;
	
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
	
	public String extract_useremail(String toke) {
		return Jwts.parserBuilder()
				.setSigningKey(getSignKey())
				.build()
				.parseClaimsJws(toke)
				.getBody()
				.getSubject();
	}
	
	public Claims extract_claims(String token) {
		return Jwts.parserBuilder()
				.setSigningKey(getSignKey())
				.build()
				.parseClaimsJws(token)
				.getBody();
	}
	
	public Date get_expiry(String token) {
		return extract_claims(token).getExpiration();
	}
	
	public boolean is_expired(Date date) {
		return date.before(new Date());
	}
	
	public boolean is_token_valid(UserDetails user , String token) {
		String useremail = extract_useremail(token);
		Date date = get_expiry(token);
		return user.getUsername().equals(useremail) && !is_expired(date);
	}
}
