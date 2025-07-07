package com.praga.backend.modules.projects.service;

import com.praga.backend.kernel.ApiResponse;
import com.praga.backend.kernel.TypesResponse;
import com.praga.backend.modules.projects.controller.dto.GetProjectsDto;
import com.praga.backend.modules.projects.controller.dto.SaveProjectDto;
import com.praga.backend.modules.projects.controller.dto.UpdateProjectDto;
import com.praga.backend.modules.projects.model.IProjectRepository;
import com.praga.backend.modules.projects.model.Project;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
        project.setStatus(dto.getStatus() != null ? dto.getStatus() : project.getStatus());

        projectRepository.save(project);

        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Proyecto actualizado correctamente."),
                HttpStatus.OK
        );
    }

}
