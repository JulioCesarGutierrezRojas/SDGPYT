package com.praga.backend.modules.categories.controller.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaveCategoryDto {
    
    @NotNull(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede tener más de 100 caracteres")
    private String name;
    
    @Size(max = 500, message = "La descripción no puede tener más de 500 caracteres")
    private String description;
    
    private Boolean status;
    
    @NotNull(message = "El proyecto es obligatorio")
    private Long projectId;
}
