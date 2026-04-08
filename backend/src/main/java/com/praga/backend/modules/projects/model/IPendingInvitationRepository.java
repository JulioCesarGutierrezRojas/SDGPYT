package com.praga.backend.modules.projects.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IPendingInvitationRepository extends JpaRepository<PendingInvitation, Long> {
    
    /**
     * Buscar invitaciones pendientes por email y proyecto
     */
    Optional<PendingInvitation> findByEmailAndProjectIdAndUsedFalseAndExpiresAtAfter(
        String email, 
        Project project, 
        LocalDateTime now
    );
    
    /**
     * Buscar todas las invitaciones pendientes por email (no usadas y no expiradas)
     */
    @Query("SELECT pi FROM PendingInvitation pi WHERE pi.email = :email AND pi.used = false AND pi.expiresAt > :now")
    List<PendingInvitation> findPendingInvitationsByEmail(@Param("email") String email, @Param("now") LocalDateTime now);
    
    /**
     * Marcar como usadas todas las invitaciones pendientes de un email
     */
    @Query("UPDATE PendingInvitation pi SET pi.used = true WHERE pi.email = :email AND pi.used = false")
    void markAllAsUsedByEmail(@Param("email") String email);
    
    /**
     * Limpiar invitaciones expiradas
     */
    @Query("DELETE FROM PendingInvitation pi WHERE pi.expiresAt < :now")
    void deleteExpiredInvitations(@Param("now") LocalDateTime now);
}
