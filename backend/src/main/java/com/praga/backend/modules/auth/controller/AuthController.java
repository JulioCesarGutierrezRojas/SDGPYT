package com.praga.backend.modules.auth.controller;

import com.praga.backend.modules.auth.controller.dto.LoginDto;
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
}
