package com.praga.backend.modules.projects.controller;

import com.praga.backend.modules.projects.controller.dto.SaveProjectDto;
import com.praga.backend.modules.projects.controller.dto.UpdateProjectDto;
import com.praga.backend.modules.projects.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<Object> getProjects() {
        return projectService.getAllProjects();
    }

    @PostMapping
    public ResponseEntity<Object> createProject(@RequestBody SaveProjectDto dto) {
        return projectService.saveProject(dto);
    }

    @PutMapping
    public ResponseEntity<Object> updateProject(@RequestBody UpdateProjectDto dto) {
        return projectService.updateProject(dto);
    }

}
