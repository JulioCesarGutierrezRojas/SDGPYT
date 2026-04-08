package com.praga.backend.modules.categories.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetCategoriesDto {
    private Long categoryId;
    private String name;
    private String description;
    private Boolean status;
}
