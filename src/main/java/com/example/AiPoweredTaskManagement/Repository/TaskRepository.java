package com.example.AiPoweredTaskManagement.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.AiPoweredTaskManagement.Entity.TaskEntity;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, Integer>{
	
	@Query("select t from TaskEntity t where t.task_title = ?1")
	Optional<TaskEntity> findBy_task_title(String title);
}