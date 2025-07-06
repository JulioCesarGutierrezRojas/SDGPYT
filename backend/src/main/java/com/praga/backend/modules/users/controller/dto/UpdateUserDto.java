package com.praga.backend.modules.users.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUserDto {
    @NotNull(message = "El id es necesario")
    private Long id;

    private String name;

    private String lastname;

    @NotNull(message = "El correo electrónico es obligatorio")
     private String email;

    @NotNull(message = "El número de teléfono es obligatorio")
    private String phoneNumber;

    private String password;
}
