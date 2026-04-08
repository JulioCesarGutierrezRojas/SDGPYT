package com.praga.backend.modules.projects.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetProjectsDto {
    private Long id;
    private String name;
    private String abbreviation;
    private String description;
    private Boolean status;
    private String adminName;
    private String adminEmail;
}
