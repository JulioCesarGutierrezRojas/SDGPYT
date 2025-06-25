package com.praga.backend.modules.projects.model;

import org.springframework.data.jpa.repository.JpaRepository;

public interface IProjectUserRepository extends JpaRepository<ProjectUser, Long> {
}
