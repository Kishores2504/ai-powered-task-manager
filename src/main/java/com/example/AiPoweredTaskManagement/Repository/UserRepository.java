package com.example.AiPoweredTaskManagement.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.AiPoweredTaskManagement.Entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer>{
	@Query("select u from UserEntity u where u.user_email = ?1")
	// this 1 in the query mentions the first parameter should be passed to the query.
	Optional<UserEntity>findByuser_email(String useremail);
}
