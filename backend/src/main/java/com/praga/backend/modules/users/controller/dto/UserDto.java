package com.praga.backend.modules.users.controller.dto;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class UserDto {
    @NotNull(message = "El id es obligatorio")
    private int userId;

    @NotNull(message = "El nombre es obligatorio")
    private String name;

    @NotNull(message = "El apellido es obligatorio")
    private String lastname;

    @NotNull(message = "El correo es obligatorio")
    private String email;

    @NotNull(message = "El numero de telefono es obligatorio")
    private int phoneNumber;

    @NotNull(message = "El Rol es obligatorio")
    private String role;

}
