package com.praga.backend.modules.projects.controller.dto;


import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaveProjectDto {
    @NotNull(message = "El id es obligatorio")
    private String name;

    @NotNull(message = "las siglas son obligatorias")
    private String abbreviation;

    @NotNull(message = "la descripcion es obligatoria")
    private String description;

    private Boolean status;

    // ID del usuario que será administrador del proyecto (opcional)
    private Long adminUserId;
}
