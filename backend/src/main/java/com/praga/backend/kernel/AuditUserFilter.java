package com.praga.backend.kernel;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AuditUserFilter extends OncePerRequestFilter {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        try {
            String user = request.getUserPrincipal() != null ? request.getUserPrincipal().getName() : "anonymous";

            Query query = entityManager.createNativeQuery("SELECT set_config('app.current_user', ?1, false)");
            query.setParameter(1, user);
            query.getResultList();
        } catch (Exception e) {
            logger.error("Failed to set audit user", e);
        }

        filterChain.doFilter(request, response);
    }
}
