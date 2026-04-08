package com.praga.backend.security.jwt;

import com.praga.backend.modules.auth.service.BlacklistService;
import com.praga.backend.security.service.UserDetailsServiceImpl;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final UserDetailsServiceImpl userDetailsService;
    private final HandlerExceptionResolver handlerExceptionResolver;
    private final BlacklistService blacklistService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException, UsernameNotFoundException {
        try{
            final String username;
            String jwt = jwtProvider.resolveToken(request);

            if (jwt != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                System.out.println("🔍 JWT Token encontrado en la petición");

                if (!jwtProvider.validateToken(jwt)) {
                    System.out.println("❌ Token inválido (estructura o firma incorrecta)");
                    filterChain.doFilter(request, response);
                     return;
                }

                if (blacklistService.isBlacklisted(jwt)) {
                    System.out.println("❌ Token está en la lista negra (sesión cerrada)");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }

                username = jwtProvider.extractUsername(jwt);
                System.out.println("✅ Token válido para usuario: " + username);

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtProvider.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("✅ Autenticación exitosa para: " + username);
                } else {
                    System.out.println("❌ Token expirado o no válido para el usuario: " + username);
                }
            } else if (jwt == null) {
                System.out.println("⚠️ No se encontró token JWT en la petición a: " + request.getRequestURI());
            }
        } catch (ExpiredJwtException | MalformedJwtException | UnsupportedJwtException e) {
            handlerExceptionResolver.resolveException(request, response, null, e);
            return;
        }
        filterChain.doFilter(request, response);
    }
}
