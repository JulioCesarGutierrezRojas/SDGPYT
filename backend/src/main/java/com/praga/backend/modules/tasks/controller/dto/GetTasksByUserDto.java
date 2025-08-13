package com.praga.backend.modules.tasks.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetTasksByUserDto {
    
    @NotNull(message = "El ID del usuario es obligatorio")
    private Long userId;
}
