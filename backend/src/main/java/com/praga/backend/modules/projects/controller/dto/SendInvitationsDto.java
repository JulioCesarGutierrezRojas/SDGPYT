package com.praga.backend.modules.projects.controller.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Email;
import java.util.List;

@Data
public class SendInvitationsDto {
    @NotNull(message = "El ID del proyecto es requerido")
    private Long projectId;
    
    @NotEmpty(message = "La lista de correos no puede estar vacía")
    private List<@Email(message = "Formato de correo inválido") String> emails;
}
