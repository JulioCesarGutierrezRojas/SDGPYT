package com.praga.backend.modules.tasks.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetTasksDto {
    private Long taskId;
    private String name;
    private String description;
    private Boolean status;
    private String photo;
    private String location;
    private String categoryName;
    private Long categoryId;
    private String projectName;
    private Long projectId;
    private String userName;
    private Long userId;
}
