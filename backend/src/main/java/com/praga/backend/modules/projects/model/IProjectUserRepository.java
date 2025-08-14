package com.praga.backend.modules.projects.model;

import com.praga.backend.modules.users.model.Role;
import com.praga.backend.modules.users.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IProjectUserRepository extends JpaRepository<ProjectUser, Long> {
    @Query("SELECT pu.projectId FROM ProjectUser pu WHERE pu.role = :role")
    List<Project> findProjectsByRole(Role role);
    
    @Query("SELECT pu FROM ProjectUser pu WHERE pu.userId = :user")
    List<ProjectUser> findProjectUsersByUser(@Param("user") User user);
    
    @Query("SELECT pu FROM ProjectUser pu WHERE pu.projectId = :project AND pu.role = :role")
    List<ProjectUser> findByProjectIdAndRole(@Param("project") Project project, @Param("role") Role role);
    
    @Query("SELECT pu FROM ProjectUser pu WHERE pu.projectId = :project AND pu.userId = :user")
    java.util.Optional<ProjectUser> findByProjectIdAndUserId(@Param("project") Project project, @Param("user") User user);
}
