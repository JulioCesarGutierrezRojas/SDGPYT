package com.praga.backend.modules.projects.model;

import com.praga.backend.modules.users.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IProjectUserRepository extends JpaRepository<ProjectUser, Long> {
    @Query("SELECT pu.projectId FROM ProjectUser pu WHERE pu.role = :role")
    List<Project> findProjectsByRole(Role role);
}
