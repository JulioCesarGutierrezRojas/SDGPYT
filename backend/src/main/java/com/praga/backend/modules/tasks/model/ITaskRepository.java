package com.praga.backend.modules.tasks.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ITaskRepository extends JpaRepository<Task, Long> {
    
    @Query("SELECT t FROM Task t WHERE t.project.projectId = :projectId")
    List<Task> findTasksByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT t FROM Task t WHERE t.category.categoryId = :categoryId")
    List<Task> findTasksByCategory(@Param("categoryId") Long categoryId);
    
    @Query("SELECT t FROM Task t WHERE t.user.userId = :userId")
    List<Task> findTasksByUser(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Task t WHERE t.name = :name AND t.taskId != :taskId")
    Task findByNameAndTaskIdNot(@Param("name") String name, @Param("taskId") Long taskId);
    
    Task findByName(String name);
    
    @Query("SELECT t FROM Task t WHERE t.name = :name AND t.project.projectId = :projectId")
    Task findByNameAndProject(@Param("name") String name, @Param("projectId") Long projectId);
    
    @Query("SELECT t FROM Task t WHERE t.name = :name AND t.project.projectId = :projectId AND t.taskId != :taskId")
    Task findByNameAndProjectAndTaskIdNot(@Param("name") String name, @Param("projectId") Long projectId, @Param("taskId") Long taskId);
}
