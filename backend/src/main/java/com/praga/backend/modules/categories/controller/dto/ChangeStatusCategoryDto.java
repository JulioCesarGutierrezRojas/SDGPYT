package com.praga.backend.modules.categories.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangeStatusCategoryDto {
    
    @NotNull(message = "El ID es obligatorio")
    private Long categoryId;
}
