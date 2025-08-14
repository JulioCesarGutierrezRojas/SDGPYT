package com.praga.backend.modules.projects.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssignProjectAdminDto {
    @NotNull(message = "El ID del proyecto es obligatorio")
    private Long projectId;
    
    @NotNull(message = "El ID del usuario administrador es obligatorio")
    private Long userId;
}
