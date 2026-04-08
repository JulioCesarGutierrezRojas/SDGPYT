package com.praga.backend.modules.projects.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetProjectByIdDto {
    
    @NotNull(message = "El ID del proyecto es obligatorio")
    private Long projectId;
}
