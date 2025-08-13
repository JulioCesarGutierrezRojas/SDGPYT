package com.praga.backend.modules.auth.service;

import com.praga.backend.kernel.ApiResponse;
import com.praga.backend.kernel.EmailService;
import com.praga.backend.kernel.TypesResponse;
import com.praga.backend.modules.auth.controller.dto.LoginDto;
import com.praga.backend.modules.auth.controller.dto.SendPasswordRecoveryEmailDto;
import com.praga.backend.modules.auth.controller.dto.ValidateRecoveryTokenDto;
import com.praga.backend.modules.auth.controller.dto.ResetPasswordDto;
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

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.ZoneId;
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
    private final EmailService emailService;

    private static final int BLOCK_TIME_MINUTES = 30;
    private static final int MAX_ATTEMPTS = 3;

    @Transactional(rollbackFor = {SQLException.class})
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

            user.setAttempts(user.getAttempts() + 1);
            
            if (user.getAttempts() >= MAX_ATTEMPTS) {
                user.setTimeBlocked(new Date());
                userRepository.save(user);

                return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.ERROR, "Usuario bloqueado por demasiados intentos fallidos"), HttpStatus.BAD_REQUEST);
            } else {
                userRepository.save(user);

                return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.ERROR, "Sus Credenciales son incorrectas, Intente nuevamente"), HttpStatus.BAD_REQUEST);
            }
        }
    }

    /**
     * Genera un token aleatorio de 5 caracteres con números, mayúsculas y minúsculas
     */
    private String generateRecoveryToken() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder token = new StringBuilder();
        for (int i = 0; i < 5; i++) {
            token.append(chars.charAt(random.nextInt(chars.length())));
        }
        return token.toString();
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> sendPasswordRecoveryEmail(SendPasswordRecoveryEmailDto dto) {
        try {
            Optional<User> optionalUser = userRepository.findByEmail(dto.getEmail());
            if (optionalUser.isEmpty()) {
                return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "No se encontró un usuario con ese correo"), HttpStatus.NOT_FOUND);
            }

            User user = optionalUser.get();
            
            // Generar token de recuperación
            String recoveryToken = generateRecoveryToken();
            
            // Establecer fecha de expiración (15 minutos)
            LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(15);
            Date expirationDate = Date.from(expirationTime.atZone(ZoneId.systemDefault()).toInstant());
            
            user.setToken(recoveryToken);
            user.setDateExpiration(expirationDate);
            userRepository.save(user);

            // Enviar el correo de recuperación
            boolean emailSent = emailService.sendPasswordRecoveryEmail(
                user.getEmail(), 
                user.getName() + " " + user.getLastname(), 
                recoveryToken
            );
            
            if (!emailSent) {
                logger.warn("No se pudo enviar el correo de recuperación a: {}", user.getEmail());
                // Optionally, you could still return success since the token was saved
            }
            
            logger.info("Token de recuperación generado para usuario: {} - Token: {}", user.getEmail(), recoveryToken);
            
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.SUCCESS, "Se ha enviado un código de verificación a tu correo electrónico"), HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al enviar correo de recuperación: {}", e.getMessage());
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.ERROR, "Error interno del servidor"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> validateRecoveryToken(ValidateRecoveryTokenDto dto) {
        try {
            Optional<User> optionalUser = userRepository.findByToken(dto.getToken());
            if (optionalUser.isEmpty()) {
                return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "Token inválido"), HttpStatus.BAD_REQUEST);
            }

            User user = optionalUser.get();
            
            // Verificar si el token ha expirado
            if (user.getDateExpiration() == null || new Date().after(user.getDateExpiration())) {
                return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "El token ha expirado"), HttpStatus.BAD_REQUEST);
            }

            // Devolver información del usuario (sin datos sensibles)
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getUserId());
            userData.put("email", user.getEmail());
            userData.put("name", user.getName());
            userData.put("lastname", user.getLastname());
            
            return new ResponseEntity<>(new ApiResponse<>(userData, TypesResponse.SUCCESS, "Token válido"), HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al validar token: {}", e.getMessage());
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.ERROR, "Error interno del servidor"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> resetPassword(ResetPasswordDto dto) {
        try {
            // Validar que las contraseñas coincidan
            if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
                return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "Las contraseñas no coinciden"), HttpStatus.BAD_REQUEST);
            }

            Optional<User> optionalUser = userRepository.findByEmail(dto.getEmail());
            if (optionalUser.isEmpty()) {
                return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "Usuario no encontrado"), HttpStatus.NOT_FOUND);
            }

            User user = optionalUser.get();
            
            // Verificar que el usuario tenga un token válido y no haya expirado
            if (user.getToken() == null || user.getDateExpiration() == null || new Date().after(user.getDateExpiration())) {
                return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "No hay una solicitud de recuperación válida para este usuario"), HttpStatus.BAD_REQUEST);
            }

            // Actualizar la contraseña
            user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
            
            // Limpiar el token de recuperación
            user.setToken(null);
            user.setDateExpiration(null);
            
            // Reiniciar intentos de bloqueo
            user.setAttempts(0);
            user.setTimeBlocked(null);
            
            userRepository.save(user);
            
            // Enviar correo de confirmación
            emailService.sendPasswordChangeConfirmation(
                user.getEmail(), 
                user.getName() + " " + user.getLastname()
            );
            
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.SUCCESS, "Contraseña restablecida exitosamente"), HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al restablecer contraseña: {}", e.getMessage());
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.ERROR, "Error interno del servidor"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
