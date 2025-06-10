package com.praga.backend.kernel;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaginationDto {
    @NotNull(message = "El valor de paginación es obligatorio")
    private String value;

    @Valid
    @NotNull(message = "El tipo de paginación es obligatorio")
    private PaginationType paginationType;

    @Override
    public String toString() {
        return "PaginationDto{" +
                "value='" + value + '\'' +
                ", paginationType=" + paginationType.toString() +
                '}';
    }
}
