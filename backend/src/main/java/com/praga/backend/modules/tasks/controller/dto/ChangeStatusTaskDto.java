package com.praga.backend.modules.tasks.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangeStatusTaskDto {
    
    @NotNull(message = "El ID de la tarea es obligatorio")
    private Long taskId;
}
