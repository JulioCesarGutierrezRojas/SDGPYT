package com.praga.backend.modules.projects.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT pu FROM ProjectUser pu WHERE pu.userId.userId = :userId")
    List<ProjectUser> findProjectUsersByUserId(@Param("userId") Long userId);

}
