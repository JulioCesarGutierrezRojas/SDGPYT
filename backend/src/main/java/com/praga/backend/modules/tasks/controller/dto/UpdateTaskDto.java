package com.praga.backend.modules.tasks.controller.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateTaskDto {
    
    @NotNull(message = "El ID de la tarea es obligatorio")
    private Long taskId;
    
    @NotNull(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede tener más de 100 caracteres")
    private String name;
    
    @Size(max = 1000, message = "La descripción no puede tener más de 1000 caracteres")
    private String description;
    
    @NotNull(message = "La categoría es obligatoria")
    private Long categoryId;
    
    @NotNull(message = "El usuario asignado es obligatorio")
    private Long userId;
}
