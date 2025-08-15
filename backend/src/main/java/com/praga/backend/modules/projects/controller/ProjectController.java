package com.praga.backend.modules.projects.controller;

import com.praga.backend.modules.projects.controller.dto.SaveProjectDto;
import com.praga.backend.modules.projects.controller.dto.UpdateProjectDto;
import com.praga.backend.modules.projects.controller.dto.ChangeStatusProjectDto;
import com.praga.backend.modules.projects.controller.dto.GetProjectByIdDto;
import com.praga.backend.modules.projects.controller.dto.AssignProjectAdminDto;
import com.praga.backend.modules.projects.controller.dto.SendInvitationsDto;
import com.praga.backend.modules.projects.controller.dto.AcceptInvitationDto;
import com.praga.backend.modules.projects.controller.dto.AcceptInvitationGuestDto;
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
  
    @GetMapping("/user-projects")
    @Operation(summary = "Obtener proyectos del usuario", description = "Lista todos los proyectos del usuario autenticado con su rol en cada proyecto")
    public ResponseEntity<Object> getUserProjects() {
        return projectService.getUserProjects();
    }

    @PostMapping("/by-id")
    @Operation(summary = "Obtener proyecto por ID", description = "Devuelve un proyecto específico por su ID")
    public ResponseEntity<Object> getProjectById(@Validated @RequestBody GetProjectByIdDto dto) {
        return projectService.getProjectById(dto);
    }
  
    @PatchMapping("/changestatus")
    @Operation(summary = "status del proyecto", description = "Actualiza el proyecto")
    public ResponseEntity<Object> changeProjectStatus(@Validated @RequestBody ChangeStatusProjectDto dto) {
        return projectService.changeProjectStatus(dto);
    }

    @PostMapping("/assign-admin")
    @Operation(summary = "Asignar administrador a proyecto", description = "Asigna un usuario como administrador de un proyecto específico")
    public ResponseEntity<Object> assignProjectAdmin(@Validated @RequestBody AssignProjectAdminDto dto) {
        return projectService.assignProjectAdmin(dto);
    }

    @PostMapping("/send-invitations")
    @Operation(summary = "Enviar invitaciones al proyecto", description = "Envía invitaciones por correo electrónico a múltiples usuarios para unirse al proyecto")
    public ResponseEntity<Object> sendProjectInvitations(@Validated @RequestBody SendInvitationsDto dto) {
        return projectService.sendProjectInvitations(dto);
    }

    @PostMapping("/accept-invitation")
    @Operation(summary = "Aceptar invitación al proyecto", description = "Permite a un usuario unirse al proyecto como colaborador con rol USER")
    public ResponseEntity<Object> acceptProjectInvitation(@Validated @RequestBody AcceptInvitationDto dto) {
        return projectService.acceptProjectInvitation(dto);
    }

    @PostMapping("/accept-invitation-guest")
    @Operation(summary = "Aceptar invitación como invitado", description = "Permite a un usuario no registrado aceptar una invitación que se procesará cuando se registre")
    public ResponseEntity<Object> acceptProjectInvitationAsGuest(@Validated @RequestBody AcceptInvitationGuestDto dto) {
        return projectService.acceptProjectInvitationAsGuest(dto);
    }

}
