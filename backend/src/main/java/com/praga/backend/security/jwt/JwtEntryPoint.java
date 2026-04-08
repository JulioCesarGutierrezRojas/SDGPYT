package com.praga.backend.security.jwt;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
public class JwtEntryPoint implements AuthenticationEntryPoint {
    private final static Logger logger = LoggerFactory.getLogger(JwtEntryPoint.class);
    private final HandlerExceptionResolver handlerExceptionResolver;

    public JwtEntryPoint(HandlerExceptionResolver handlerExceptionResolver) {
        this.handlerExceptionResolver = handlerExceptionResolver;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        String requestPath = request.getRequestURI();
        String authHeader = request.getHeader("Authorization");

        logger.error("❌ Error de autenticación");
        logger.error("   Ruta solicitada: {}", requestPath);
        logger.error("   Authorization header presente: {}", authHeader != null ? "Sí" : "No");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            logger.error("   Token (primeros 20 caracteres): {}", token.length() > 20 ? token.substring(0, 20) + "..." : token);
        }

        logger.error("   Detalle del error: {}", authException.getMessage());

        handlerExceptionResolver.resolveException(request, response, null, authException);
    }
}
