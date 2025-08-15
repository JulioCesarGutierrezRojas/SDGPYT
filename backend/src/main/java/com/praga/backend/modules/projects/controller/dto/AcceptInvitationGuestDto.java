package com.praga.backend.modules.projects.controller.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AcceptInvitationGuestDto {
    
    @NotNull(message = "El ID del proyecto es obligatorio")
    private Long projectId;
    
    @NotNull(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    private String email;
}
