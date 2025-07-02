package com.praga.backend.security.jwt;

import com.praga.backend.modules.auth.service.BlacklistService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class JwtLogout implements LogoutHandler {
    private final JwtProvider jwtProvider;
    private final BlacklistService blacklistService;

    public JwtLogout(JwtProvider jwtProvider, BlacklistService blacklistService) {
        this.jwtProvider = jwtProvider;
        this.blacklistService = blacklistService;
    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        String token = jwtProvider.resolveToken(request);

        if (token != null && jwtProvider.validateToken(token)) {
            Instant expiry = jwtProvider.getExpiryFromToken(token);
            blacklistService.blacklistToken(token, expiry);
        }

        SecurityContextHolder.clearContext();
    }
}
