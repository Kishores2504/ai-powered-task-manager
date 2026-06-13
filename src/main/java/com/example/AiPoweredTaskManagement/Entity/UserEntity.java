package com.example.AiPoweredTaskManagement.Entity;

import com.example.AiPoweredTaskManagement.Enumurated.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class UserEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int userid ;
	private String user_name;
	@Column(unique = true , nullable = false)
	private String user_email;
	private String user_password;
	private Role role;
	
	public UserEntity(int userid, String user_name, String user_email, String user_password,Role role) {
		this.userid = userid;
		this.user_name = user_name;
		this.user_email = user_email;
		this.user_password = user_password;
		this.role = role;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
	public UserEntity() {}
	
	public int getUserid() {
		return userid;
	}
	public void setUserid(int userid) {
		this.userid = userid;
	}
	public String getUser_name() {
		return user_name;
	}
	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}
	public String getUser_email() {
		return user_email;
	}
	public void setUser_email(String user_email) {
		this.user_email = user_email;
	}
	public String getUser_password() {
		return user_password;
	}
	public void setUser_password(String user_password) {
		this.user_password = user_password;
	};
	
	
}
