package com.praga.backend.modules.auth.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginDto {
    @NotNull(message = "El correo es requerido")
    private String email;
    @NotNull(message = "La contraseña es requerida")
    private String password;
    
}
