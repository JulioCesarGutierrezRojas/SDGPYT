package com.praga.backend.modules.users.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class SaveUserDto {
    @NotNull(message = "El nombre es obligatorio")
    private String name;

    @NotNull(message = "El apellido es obligatorio")
    private String lastname;

    @NotNull(message = "El correo electrónico es obligatorio")
    private String email;

    @NotNull(message = "El número de teléfono es obligatorio")
    private String phoneNumber;

    @NotNull(message = "La contraseña es obligatoria")
    private String password;
}
