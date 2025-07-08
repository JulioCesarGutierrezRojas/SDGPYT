package com.praga.backend.modules.projects.controller;

import com.praga.backend.modules.projects.controller.dto.SaveProjectDto;
import com.praga.backend.modules.projects.controller.dto.UpdateProjectDto;
import com.praga.backend.modules.projects.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "projects", description = "Endpoints para gestión de proyectos")
public class ProjectController {
    private final ProjectService projectService;

    @GetMapping("/")
    @Operation(summary = "Obtener todos los proyectos", description = "Lista todos los proyectos del sistema admin root")
    public ResponseEntity<Object> getProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/projectbyadmin")
    @Operation(summary = "Obtener todos los proyectos para admin", description = "Lista todos los proyectos del sistema admin")
    public ResponseEntity<Object> getProjectsByAdmin() {
        return projectService.getProjectsByAdminRole();
    }

    @PostMapping("/create")
    @Operation(summary = "Crear proyectos", description = "Creación de proyectos")
    public ResponseEntity<Object> createProject(@RequestBody SaveProjectDto dto) {
        return projectService.saveProject(dto);
    }

    @PutMapping("/update")
    @Operation(summary = "Actualizar proyectos", description = "actualiza los proyectos")
    public ResponseEntity<Object> updateProject(@RequestBody UpdateProjectDto dto) {
        return projectService.updateProject(dto);
    }

    @PatchMapping("/changestatus")
    @Operation(summary = "status del proyecto", description = "Actualiza el proyecto")
    public ResponseEntity<Object> changeProjectStatus(@Validated @RequestBody UpdateProjectDto dto) {
        return projectService.changeProjectStatus(dto);
    }

}
