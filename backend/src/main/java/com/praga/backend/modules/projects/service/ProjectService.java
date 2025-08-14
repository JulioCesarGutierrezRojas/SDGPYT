package com.praga.backend.modules.projects.service;

import com.praga.backend.kernel.ApiResponse;
import com.praga.backend.kernel.TypesResponse;
import com.praga.backend.modules.projects.controller.dto.GetAssignedProjectsDto;
import com.praga.backend.modules.projects.controller.dto.GetProjectsDto;
import com.praga.backend.modules.projects.controller.dto.SaveProjectDto;
import com.praga.backend.modules.projects.controller.dto.UpdateProjectDto;
import com.praga.backend.modules.projects.controller.dto.ChangeStatusProjectDto;
import com.praga.backend.modules.projects.controller.dto.GetProjectByIdDto;
import com.praga.backend.modules.projects.controller.dto.AssignProjectAdminDto;
import com.praga.backend.modules.projects.model.IProjectRepository;
import com.praga.backend.modules.projects.model.IProjectUserRepository;
import com.praga.backend.modules.projects.model.Project;
import com.praga.backend.modules.projects.model.ProjectUser;
import com.praga.backend.modules.users.model.IUserRepository;
import com.praga.backend.modules.users.model.User;
import com.praga.backend.modules.users.model.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.sql.Types;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ProjectService {
    private final IProjectRepository projectRepository;
    private final IUserRepository userRepository;
    private final IProjectUserRepository iProjectUserRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getAllProjects() {
        List<GetProjectsDto> projects = projectRepository.findAll()
                .stream()
                .map(project -> {
                    // Buscar el administrador del proyecto
                    ProjectUser adminProjectUser = iProjectUserRepository
                            .findByProjectIdAndRole(project, Role.PROJECT_ADMIN)
                            .stream()
                            .findFirst()
                            .orElse(null);
                    
                    String adminName = null;
                    String adminEmail = null;
                    
                    if (adminProjectUser != null && adminProjectUser.getUserId() != null) {
                        User admin = adminProjectUser.getUserId();
                        adminName = admin.getName() + " " + admin.getLastname();
                        adminEmail = admin.getEmail();
                    }
                    
                    return new GetProjectsDto(
                            project.getProjectId(),
                            project.getName(),
                            project.getAbbreviation(),
                            project.getDescription(),
                            project.getStatus(),
                            adminName,
                            adminEmail
                    );
                })
                .collect(Collectors.toList());
        return new ResponseEntity<>(
                new ApiResponse<>(projects, TypesResponse.SUCCESS, "Lista de proyectos obtenida correctamente"), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> saveProject(SaveProjectDto dto) {
        if (Objects.isNull(dto.getName()) || dto.getName().trim().isEmpty()) {
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "El nombre del proyecto es obligatorio."), HttpStatus.BAD_REQUEST);
        }

        if (Objects.isNull(dto.getAbbreviation()) || dto.getAbbreviation().trim().isEmpty()) {
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "La abreviación del proyecto es obligatoria."), HttpStatus.BAD_REQUEST);
        }

        Project project = new Project();
        project.setName(dto.getName());
        project.setAbbreviation(dto.getAbbreviation());
        project.setDescription(dto.getDescription());
        project.setStatus(dto.getStatus() != null ? dto.getStatus() : true);

        projectRepository.save(project);

        // Si se especificó un administrador, asignarlo al proyecto
        if (dto.getAdminUserId() != null) {
            User adminUser = userRepository.findById(dto.getAdminUserId()).orElse(null);
            if (adminUser != null) {
                // Verificar si ya existe una relación ProjectUser para este usuario y proyecto
                ProjectUser existingProjectUser = iProjectUserRepository
                    .findByProjectIdAndUserId(project, adminUser)
                    .orElse(null);
                
                if (existingProjectUser == null) {
                    ProjectUser projectUser = new ProjectUser();
                    projectUser.setProjectId(project);
                    projectUser.setUserId(adminUser);
                    projectUser.setRole(Role.PROJECT_ADMIN); // Asignar rol de administrador
                    iProjectUserRepository.save(projectUser);
                }
            }
        }

        return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.SUCCESS, "Proyecto creado correctamente."), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> updateProject(UpdateProjectDto dto) {
        Project project = projectRepository.findById(dto.getId()).orElse(null);

        if (Objects.isNull(project)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No se encontró el proyecto con ID: " + dto.getId()),
                    HttpStatus.NOT_FOUND
            );
        }

        if (Objects.isNull(dto.getName()) || dto.getName().trim().isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El nombre del proyecto es obligatorio."),
                    HttpStatus.BAD_REQUEST
            );
        }

        if (Objects.isNull(dto.getAbbreviation()) || dto.getAbbreviation().trim().isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "La abreviación del proyecto es obligatoria."),
                    HttpStatus.BAD_REQUEST
            );
        }

        project.setName(dto.getName());
        project.setAbbreviation(dto.getAbbreviation());
        project.setDescription(dto.getDescription());
        //project.setStatus(dto.getStatus() != null ? dto.getStatus() : project.getStatus());

        projectRepository.save(project);

        // Gestionar la asignación del administrador
        if (dto.getAdminUserId() != null) {
            User adminUser = userRepository.findById(dto.getAdminUserId()).orElse(null);
            if (adminUser != null) {
                // Buscar si ya existe un administrador para este proyecto
                ProjectUser currentAdmin = iProjectUserRepository
                    .findByProjectIdAndRole(project, Role.PROJECT_ADMIN)
                    .stream()
                    .findFirst()
                    .orElse(null);
                
                // Si ya existe un administrador diferente, actualizar la relación
                if (currentAdmin != null) {
                    if (!currentAdmin.getUserId().getUserId().equals(dto.getAdminUserId())) {
                        // Cambiar el usuario administrador
                        currentAdmin.setUserId(adminUser);
                        iProjectUserRepository.save(currentAdmin);
                    }
                } else {
                    // No existe administrador, crear nueva relación
                    ProjectUser newAdminRelation = new ProjectUser();
                    newAdminRelation.setProjectId(project);
                    newAdminRelation.setUserId(adminUser);
                    newAdminRelation.setRole(Role.PROJECT_ADMIN);
                    iProjectUserRepository.save(newAdminRelation);
                }
            }
        } else {
            // Si adminUserId es null, eliminar el administrador actual
            ProjectUser currentAdmin = iProjectUserRepository
                .findByProjectIdAndRole(project, Role.PROJECT_ADMIN)
                .stream()
                .findFirst()
                .orElse(null);
            
            if (currentAdmin != null) {
                iProjectUserRepository.delete(currentAdmin);
            }
        }

        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Proyecto actualizado correctamente."),
                HttpStatus.OK
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getUserProjects() {
        try {
            // Obtener el usuario actual del contexto de seguridad
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.ERROR, "Usuario no autenticado"),
                        HttpStatus.UNAUTHORIZED
                );
            }

            String username = authentication.getName();
            if (username == null || username.equals("anonymousUser")) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.ERROR, "Usuario no autenticado"),
                        HttpStatus.UNAUTHORIZED
                );
            }

            User currentUser = userRepository.findByEmail(username).orElse(null);

            if (Objects.isNull(currentUser)) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.WARNING, "Usuario no encontrado: " + username),
                        HttpStatus.NOT_FOUND
                );
            }

            // Obtener todos los proyectos del usuario con sus roles
            List<ProjectUser> projectUsers = iProjectUserRepository.findProjectUsersByUser(currentUser);
            
            List<GetAssignedProjectsDto> userProjects = projectUsers.stream()
                    .filter(pu -> pu.getProjectId() != null) // Filtrar proyectos nulos
                    .map(pu -> new GetAssignedProjectsDto(
                            pu.getProjectId().getProjectId(),
                            pu.getProjectId().getName(),
                            pu.getProjectId().getAbbreviation(),
                            pu.getProjectId().getDescription(),
                            pu.getProjectId().getStatus(),
                            pu.getRole()
                    ))
                    .collect(Collectors.toList());
            
            return new ResponseEntity<>(
                    new ApiResponse<>(userProjects, TypesResponse.SUCCESS, "Proyectos del usuario obtenidos correctamente"),
                    HttpStatus.OK
            );
            
        } catch (Exception e) {
            e.printStackTrace(); // Para debug
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.ERROR, "Error al obtener proyectos del usuario: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getProjectById(GetProjectByIdDto dto) {
        Project project = projectRepository.findById(dto.getProjectId()).orElse(null);
        
        if (Objects.isNull(project)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No se encontró el proyecto con ID: " + dto.getProjectId()),
                    HttpStatus.NOT_FOUND
            );
        }
        
        // Buscar el administrador del proyecto
        ProjectUser adminProjectUser = iProjectUserRepository
                .findByProjectIdAndRole(project, Role.PROJECT_ADMIN)
                .stream()
                .findFirst()
                .orElse(null);
        
        String adminName = null;
        String adminEmail = null;
        
        if (adminProjectUser != null && adminProjectUser.getUserId() != null) {
            User admin = adminProjectUser.getUserId();
            adminName = admin.getName() + " " + admin.getLastname();
            adminEmail = admin.getEmail();
        }
        
        GetProjectsDto projectDto = new GetProjectsDto(
                project.getProjectId(),
                project.getName(),
                project.getAbbreviation(),
                project.getDescription(),
                project.getStatus(),
                adminName,
                adminEmail
        );
        
        return new ResponseEntity<>(
                new ApiResponse<>(projectDto, TypesResponse.SUCCESS, "Proyecto obtenido correctamente"),
                HttpStatus.OK
        );
    }
                               
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> changeProjectStatus(ChangeStatusProjectDto dto) {
        Project project = projectRepository.findById(dto.getId()).orElse(null);
        if (Objects.isNull(project)) {
            return new ResponseEntity<>(
            new ApiResponse<>(null, TypesResponse.WARNING, "No se encontró el proyecto con ID: " + dto.getId()), HttpStatus.NOT_FOUND);
        }
        project.setStatus(!project.getStatus());
        projectRepository.save(project);
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Estado del proyecto actualizado correctamente"), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> assignProjectAdmin(AssignProjectAdminDto dto) {
        // Verificar que el proyecto existe
        Project project = projectRepository.findById(dto.getProjectId()).orElse(null);
        if (Objects.isNull(project)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No se encontró el proyecto con ID: " + dto.getProjectId()),
                    HttpStatus.NOT_FOUND
            );
        }

        // Verificar que el usuario existe
        User adminUser = userRepository.findById(dto.getUserId()).orElse(null);
        if (Objects.isNull(adminUser)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No se encontró el usuario con ID: " + dto.getUserId()),
                    HttpStatus.NOT_FOUND
            );
        }

        // Verificar si ya existe una relación ProjectUser para este usuario y proyecto
        ProjectUser existingProjectUser = iProjectUserRepository
                .findByProjectIdAndUserId(project, adminUser)
                .orElse(null);

        if (existingProjectUser != null) {
            // Si ya existe, actualizar el rol a PROJECT_ADMIN
            existingProjectUser.setRole(Role.PROJECT_ADMIN);
            iProjectUserRepository.save(existingProjectUser);
        } else {
            // Si no existe, crear nueva relación
            ProjectUser projectUser = new ProjectUser();
            projectUser.setProjectId(project);
            projectUser.setUserId(adminUser);
            projectUser.setRole(Role.PROJECT_ADMIN);
            iProjectUserRepository.save(projectUser);
        }

        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Administrador asignado al proyecto correctamente"),
                HttpStatus.OK
        );
    }

}
