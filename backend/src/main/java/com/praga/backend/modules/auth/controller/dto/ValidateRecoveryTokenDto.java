package com.praga.backend.modules.auth.controller.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ValidateRecoveryTokenDto {
    @NotNull(message = "El token es requerido")
    @Size(min = 5, max = 5, message = "El token debe tener exactamente 5 caracteres")
    private String token;
}
