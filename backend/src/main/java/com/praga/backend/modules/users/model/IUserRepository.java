package com.praga.backend.modules.users.model;

import com.praga.backend.modules.projects.model.ProjectUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IUserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByToken(String token);
    Optional<User> findByPhoneNumber(String phoneNumber);
    boolean existsByPhoneNumber(String phoneNumber);
    
    @Query("SELECT u FROM User u JOIN ProjectUser pu ON u.userId = pu.userId.userId WHERE pu.projectId.projectId = :projectId AND u.status = true")
    List<User> findUsersByProjectId(@Param("projectId") Long projectId);
}
