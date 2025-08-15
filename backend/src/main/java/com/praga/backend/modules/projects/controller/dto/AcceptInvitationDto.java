package com.praga.backend.modules.projects.controller.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class AcceptInvitationDto {
    @NotNull(message = "El ID del proyecto es requerido")
    private Long projectId;
}
