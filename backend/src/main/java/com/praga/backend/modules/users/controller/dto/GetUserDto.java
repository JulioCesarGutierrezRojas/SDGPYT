package com.praga.backend.modules.users.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GetUserDto {
    @NotNull(message = "El id es obligatorio")
    private Long id;
}
