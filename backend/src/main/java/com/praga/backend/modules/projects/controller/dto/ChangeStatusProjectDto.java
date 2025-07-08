package com.praga.backend.modules.projects.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChangeStatusProjectDto {
    @NotNull(message = "El id es obligatorio")
    private Long id;
}
