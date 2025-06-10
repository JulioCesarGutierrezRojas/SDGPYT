package com.praga.backend.kernel;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaginationType {
    @NotNull(message = "El filtro es obligatorio")
    private String filter;

    @NotNull(message = "La página es obligatoria")
    @Min(value = 0, message = "La página debe ser igual o mayor a 0")
    private int page;

    @NotNull(message = "El límite es obligatorio")
    @Min(value = 1, message = "El límite debe ser mayor a 0")
    private int limit;

    @NotNull(message = "El orden es obligatorio")
    private String order;

    @NotNull(message = "El ordenamiento es obligatorio")
    private String sortBy;

    @Override
    public String toString() {
        return "PaginationType{" +
                "filter='" + filter + '\'' +
                ", page=" + page +
                ", limit=" + limit +
                ", order='" + order + '\'' +
                ", sortBy='" + sortBy + '\'' +
                '}';
    }
}
