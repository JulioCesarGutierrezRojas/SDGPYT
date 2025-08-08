package com.praga.backend.modules.categories.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetCategoriesByProjectDto {
    
    @NotNull(message = "El ID del proyecto es obligatorio")
    private Long projectId;
}
