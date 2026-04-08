package com.praga.backend.modules.tasks.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetTasksByCategoryDto {
    
    @NotNull(message = "El ID de la categoría es obligatorio")
    private Long categoryId;
}
