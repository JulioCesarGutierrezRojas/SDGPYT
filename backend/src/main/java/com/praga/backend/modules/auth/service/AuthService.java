package com.praga.backend.modules.auth.service;

import com.praga.backend.kernel.ApiResponse;
import com.praga.backend.kernel.TypesResponse;
import com.praga.backend.modules.auth.controller.dto.LoginDto;
import com.praga.backend.modules.users.model.IUserRepository;
import com.praga.backend.modules.users.model.User;
import com.praga.backend.security.jwt.JwtProvider;
import com.praga.backend.security.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {
    private final static Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final IUserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    private static final int BLOCK_TIME_MINUTES = 30;
    private static final int MAX_ATTEMPTS = 3;

    @Transactional(readOnly = true)
    public ResponseEntity<Object> login(LoginDto loginDto) {
        User user = userRepository.findByEmail(loginDto.getEmail()).orElseThrow(() -> new RuntimeException("No se encontró el usuario"));

        try{
            if (user.getTimeBlocked() != null){
                Calendar now = Calendar.getInstance();
                now.setTime(new Date());
                Calendar blockedUntil = Calendar.getInstance();
                blockedUntil.setTime(user.getTimeBlocked());
                blockedUntil.add(Calendar.MINUTE, BLOCK_TIME_MINUTES);

                if (blockedUntil.after(now))
                    return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.ERROR, "Usuario bloqueado"), HttpStatus.BAD_REQUEST);

                user.setTimeBlocked(null);
                user.setAttempts(0);
            }

            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String token = jwtProvider.generateToken(userDetails, user);

            user.setAttempts(0);
            userRepository.save(user);

            List<Map<String, String>> roles = user.getProjectUsers()
                    .stream()
                    .map(pu -> {
                        Map<String, String> map = new HashMap<>();
                        map.put("role", pu.getRole().name());
                        map.put("project", pu.getProjectId() != null ? pu.getProjectId().getName() : "GLOBAL");
                        return map;
                    })
                    .toList();

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("id", user.getUserId());
            response.put("fullName", user.getName() + " " + user.getLastname());
            response.put("roles", roles);

            return new ResponseEntity<>(new ApiResponse<>(response, TypesResponse.SUCCESS, "Ha iniciado sesión Correctamente"), HttpStatus.OK);
        }catch (AuthenticationException e){
            logger.error("Error de Autenticación {}" , e.getMessage());

            if (user.getAttempts() >= MAX_ATTEMPTS) {
                user.setTimeBlocked(new Date());
                userRepository.save(user);

                return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.ERROR, "Usuario bloqueado por demasiados intentos fallidos"), HttpStatus.BAD_REQUEST);
            } else {
                user.setAttempts(user.getAttempts() + 1);
                userRepository.save(user);

                return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "Sus Credenciales son incorrectas, Intente nuevamente"), HttpStatus.UNAUTHORIZED);
            }
        }
    }
}
