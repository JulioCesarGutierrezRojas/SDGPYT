package com.praga.backend.modules.projects.controller.dto;

import com.praga.backend.modules.users.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAssignedProjectsDto {
    private Long projectId;
    private String name;
    private String abbreviation;
    private String description;
    private Boolean status;
    private Role role;
}
