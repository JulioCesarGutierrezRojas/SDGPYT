package com.praga.backend.modules.projects.service;

import com.praga.backend.kernel.ApiResponse;
import com.praga.backend.kernel.TypesResponse;
import com.praga.backend.modules.projects.controller.dto.GetAssignedProjectsDto;
import com.praga.backend.modules.projects.controller.dto.GetProjectsDto;
import com.praga.backend.modules.projects.controller.dto.SaveProjectDto;
import com.praga.backend.modules.projects.controller.dto.UpdateProjectDto;
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
                .map(project -> new GetProjectsDto(
                project.getProjectId(),
                project.getName(),
                project.getAbbreviation(),
                project.getDescription(),
                project.getStatus()
        ))
                .collect(Collectors.toList());
        return new ResponseEntity<>(
                new ApiResponse<>(projects, TypesResponse.SUCCESS, "Lista de proyectos obtenida correctamente"), HttpStatus.OK);
    }
//Para solo admin
    @Transactional(readOnly = true)
    public ResponseEntity<Object> getProjectsByAdminRole() {
        List<Project> projects = iProjectUserRepository.findProjectsByRole(Role.ADMIN);

        List<GetProjectsDto> result = projects.stream()
                .map(p -> new GetProjectsDto(
                        p.getProjectId(),
                        p.getName(),
                        p.getAbbreviation(),
                        p.getDescription(),
                        p.getStatus()
                ))
                .collect(Collectors.toList());

        return new ResponseEntity<>(
                new ApiResponse<>(result, TypesResponse.SUCCESS, "Proyectos de administradores obtenidos correctamente."),
                HttpStatus.OK
        );
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

        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Proyecto actualizado correctamente."),
                HttpStatus.OK
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getAssignedProjects() {
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

            // Por ahora retornamos información básica del usuario para debug
            return new ResponseEntity<>(
                    new ApiResponse<>(List.of(), TypesResponse.SUCCESS, "Usuario encontrado: " + currentUser.getName() + " " + currentUser.getLastname()),
                    HttpStatus.OK
            );
            
        } catch (Exception e) {
            e.printStackTrace(); // Para debug
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.ERROR, "Error al obtener proyectos asignados: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
                               
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> changeProjectStatus(UpdateProjectDto dto) {
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

}
