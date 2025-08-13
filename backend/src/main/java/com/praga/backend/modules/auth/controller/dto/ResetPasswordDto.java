package com.praga.backend.modules.auth.controller.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResetPasswordDto {
    @NotNull(message = "El correo es requerido")
    @Email(message = "El formato del correo es inválido")
    private String email;
    
    @NotNull(message = "La nueva contraseña es requerida")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String newPassword;
    
    @NotNull(message = "La confirmación de contraseña es requerida")
    private String confirmPassword;
}
