package com.praga.backend.modules.auth.controller;

import com.praga.backend.modules.auth.controller.dto.LoginDto;
import com.praga.backend.modules.auth.controller.dto.SendPasswordRecoveryEmailDto;
import com.praga.backend.modules.auth.controller.dto.ValidateRecoveryTokenDto;
import com.praga.backend.modules.auth.controller.dto.ResetPasswordDto;
import com.praga.backend.modules.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
@Tag(name = "authentication", description = "Endpoint para la autenticacion de usuarios")

public class AuthController {
    private final AuthService authService;

    @Operation(summary = "Inicio de sesión", description = "Endpoint para el inicio de sesión")
    @PostMapping("/login")
    public ResponseEntity<Object> login(@Validated @RequestBody LoginDto loginDto) {
        return authService.login(loginDto);
    }

    @Operation(summary = "Enviar correo de recuperación", description = "Endpoint para enviar el token de recuperación por correo")
    @PostMapping("/send-email")
    public ResponseEntity<Object> sendPasswordRecoveryEmail(@Validated @RequestBody SendPasswordRecoveryEmailDto sendPasswordRecoveryEmailDto) {
        return authService.sendPasswordRecoveryEmail(sendPasswordRecoveryEmailDto);
    }

    @Operation(summary = "Validar token de recuperación", description = "Endpoint para validar el token de recuperación")
    @PostMapping("/validate-recovery-token")
    public ResponseEntity<Object> validateRecoveryToken(@Validated @RequestBody ValidateRecoveryTokenDto validateRecoveryTokenDto) {
        return authService.validateRecoveryToken(validateRecoveryTokenDto);
    }

    @Operation(summary = "Restablecer contraseña", description = "Endpoint para restablecer la contraseña")
    @PostMapping("/reset-password")
    public ResponseEntity<Object> resetPassword(@Validated @RequestBody ResetPasswordDto resetPasswordDto) {
        return authService.resetPassword(resetPasswordDto);
    }
}
