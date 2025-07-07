package com.praga.backend.modules.projects.controller.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaveProjectDto {
    private String name;
    private String abbreviation;
    private String description;
    private Boolean status;
}
