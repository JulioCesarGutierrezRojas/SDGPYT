package com.praga.backend.modules.auth.controller.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SendPasswordRecoveryEmailDto {
    @NotNull(message = "El correo es requerido")
    @Email(message = "El formato del correo es inválido")
    private String email;
}
