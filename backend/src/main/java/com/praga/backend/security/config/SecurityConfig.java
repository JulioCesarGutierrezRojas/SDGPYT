package com.praga.backend.security.config;

import com.praga.backend.security.jwt.JwtAuthenticationFilter;
import com.praga.backend.security.jwt.JwtEntryPoint;
import com.praga.backend.security.jwt.JwtLogout;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final JwtEntryPoint jwtEntryPoint;
    private final JwtLogout jwtLogout;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req -> req
                        // Public endpoints - no authentication required
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users/").permitAll() // Registration endpoint
                        .requestMatchers("/api/projects/accept-invitation-guest").permitAll() // Guest invitation acceptance
                        .requestMatchers("/api/v1/invitations/redirect/**").permitAll() // Deep link redirect page

                        // Swagger UI endpoints
                        .requestMatchers("/swagger-ui.html").permitAll()
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/api-docs/**").permitAll()
                        .requestMatchers("/v3/api-docs/**").permitAll()

                        // Actuator health check endpoint (for monitoring and deployment)
                        .requestMatchers("/actuator/health").permitAll()
                        .requestMatchers("/actuator/health/**").permitAll()

                        // 🔧 FIX: Endpoints que solo requieren autenticación (sin roles específicos)
                        // Estos endpoints permiten que usuarios nuevos sin proyectos asignados puedan acceder
                        .requestMatchers("/api/projects/user-projects").authenticated() // Ver proyectos propios (puede ser lista vacía)
                        .requestMatchers(HttpMethod.POST, "/api/projects/create").authenticated() // Crear proyecto (se convierte en PROJECT_ADMIN)
                        .requestMatchers("/api/users/me").authenticated() // Ver perfil propio
                        .requestMatchers(HttpMethod.PUT, "/api/users/me").authenticated() // Actualizar perfil propio
                        .requestMatchers(HttpMethod.PATCH, "/api/users/fcm-token").authenticated() // Actualizar token FCM

                        // ROOT ONLY - Full system administration
                        .requestMatchers("/api/users/allUsers").hasAuthority("ROOT")
                        .requestMatchers(HttpMethod.PATCH, "/api/users/").hasAuthority("ROOT") // Change user status
                        .requestMatchers("/api/projects/send-invitations").hasAuthority("PROJECT_ADMIN")
                        .requestMatchers("/api/projects/").hasAuthority("ROOT") // Get all projects
                        .requestMatchers(HttpMethod.PATCH, "/api/projects/changestatus").hasAnyAuthority("ROOT", "PROJECT_ADMIN") // Change project status
                        .requestMatchers("/api/projects/assign-admin").hasAuthority("ROOT") // Assign project admin
                        .requestMatchers("/api/audit/**").hasAuthority("ROOT") // Audit logs
                        
                        // PROJECT_ADMIN and ROOT - Project management
                        .requestMatchers(HttpMethod.PUT, "/api/projects/update").hasAnyAuthority("ROOT", "PROJECT_ADMIN")
                        
                        // PROJECT_ADMIN and ROOT - Full category CRUD
                        .requestMatchers(HttpMethod.POST, "/api/categories/").hasAnyAuthority("ROOT", "PROJECT_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categories/").hasAnyAuthority("ROOT", "PROJECT_ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/categories/").hasAnyAuthority("ROOT", "PROJECT_ADMIN")
                        
                        // PROJECT_ADMIN and ROOT - Full task CRUD
                        .requestMatchers(HttpMethod.POST, "/api/tasks/").hasAnyAuthority("ROOT", "PROJECT_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/tasks/").hasAnyAuthority("ROOT", "PROJECT_ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/tasks/").hasAnyAuthority("ROOT", "PROJECT_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/tasks/**").hasAnyAuthority("ROOT", "PROJECT_ADMIN")
                        
                        // USER, PROJECT_ADMIN and ROOT - Profile and project management
                        .requestMatchers("/api/users/byId").hasAnyAuthority("ROOT", "PROJECT_ADMIN", "USER")
                        .requestMatchers("/api/projects/by-id").hasAnyAuthority("ROOT", "PROJECT_ADMIN", "USER")
                        .requestMatchers("/api/projects/accept-invitation").hasAnyAuthority("ROOT", "PROJECT_ADMIN", "USER")
                        
                        // USER, PROJECT_ADMIN and ROOT - View project categories
                        .requestMatchers("/api/categories/active").hasAnyAuthority("ROOT", "PROJECT_ADMIN", "USER")
                        .requestMatchers("/api/categories/by-project").hasAnyAuthority("ROOT", "PROJECT_ADMIN", "USER")
                        
                        // USER, PROJECT_ADMIN and ROOT - View and manage tasks
                        .requestMatchers(HttpMethod.GET, "/api/tasks/**").hasAnyAuthority("ROOT", "PROJECT_ADMIN", "USER")
                        .requestMatchers("/api/tasks/by-project").hasAnyAuthority("ROOT", "PROJECT_ADMIN", "USER")
                        .requestMatchers("/api/tasks/by-category").hasAnyAuthority("ROOT", "PROJECT_ADMIN", "USER")
                        .requestMatchers("/api/tasks/by-user").hasAnyAuthority("ROOT", "PROJECT_ADMIN", "USER")
                        
                        // USER, PROJECT_ADMIN and ROOT - Update task category (move tasks)
                        .requestMatchers(HttpMethod.PATCH, "/api/tasks/category").hasAnyAuthority("ROOT", "PROJECT_ADMIN", "USER")
                        
                        // PROJECT_ADMIN and ROOT - View users by project
                        .requestMatchers("/api/users/byProject").hasAnyAuthority("ROOT", "PROJECT_ADMIN")
                        
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults())
                .headers(header -> header
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtEntryPoint)
                )
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .addLogoutHandler(jwtLogout)
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                        }).permitAll()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
