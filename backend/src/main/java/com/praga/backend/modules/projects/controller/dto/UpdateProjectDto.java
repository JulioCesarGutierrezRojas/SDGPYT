package com.praga.backend.modules.projects.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data

public class UpdateProjectDto {
    @NotNull(message = "El id es obligatorio")
    private Long id;

    @NotNull(message = "El nombre es obligatorio")
    private String name;

    @NotNull(message = "las siglas son obligatorias")
    private String abbreviation;

    @NotNull(message = "La descripción es obligatoria")
    private String description;
    
    private Long adminUserId; // ID del usuario que será administrador del proyecto
}
