package com.praga.backend.modules.categories.service;

import com.praga.backend.kernel.ApiResponse;
import com.praga.backend.kernel.TypesResponse;
import com.praga.backend.modules.categories.controller.dto.GetCategoriesDto;
import com.praga.backend.modules.categories.controller.dto.GetCategoriesByProjectDto;
import com.praga.backend.modules.categories.controller.dto.UpdateCategoryDto;
import com.praga.backend.modules.categories.controller.dto.SaveCategoryDto;
import com.praga.backend.modules.categories.controller.dto.ChangeStatusCategoryDto;
import com.praga.backend.modules.categories.model.ICategoryRepository;
import com.praga.backend.modules.categories.model.Category;
import com.praga.backend.modules.projects.model.IProjectRepository;
import com.praga.backend.modules.projects.model.Project;
import com.praga.backend.modules.tasks.model.ITaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoryService {
    
    private final ICategoryRepository categoryRepository;
    private final IProjectRepository projectRepository;
    private final ITaskRepository taskRepository;
    
    @Transactional(readOnly = true)
    public ResponseEntity<Object> getActiveCategories() {
        List<GetCategoriesDto> activeCategories = categoryRepository.findActiveCategories()
                .stream()
                .map(category -> new GetCategoriesDto(
                        category.getCategoryId(),
                        category.getName(),
                        category.getDescription(),
                        category.getStatus()
                ))
                .collect(Collectors.toList());
        
        return new ResponseEntity<>(
                new ApiResponse<>(activeCategories, TypesResponse.SUCCESS, "Categorías activas obtenidas correctamente"), 
                HttpStatus.OK
        );
    }
    
    @Transactional(readOnly = true)
    public ResponseEntity<Object> getCategoriesByProject(GetCategoriesByProjectDto dto) {
        // Validar que el proyecto existe
        if (!projectRepository.existsById(dto.getProjectId())) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El proyecto no existe"), 
                    HttpStatus.NOT_FOUND
            );
        }
        
        List<GetCategoriesDto> categoriesInProject = categoryRepository.findCategoriesByProject(dto.getProjectId())
                .stream()
                .map(category -> new GetCategoriesDto(
                        category.getCategoryId(),
                        category.getName(),
                        category.getDescription(),
                        category.getStatus()
                ))
                .collect(Collectors.toList());
        
        return new ResponseEntity<>(
                new ApiResponse<>(categoriesInProject, TypesResponse.SUCCESS, "Categorías del proyecto obtenidas correctamente"), 
                HttpStatus.OK
        );
    }
    
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> updateCategory(UpdateCategoryDto dto) {
        // Buscar la categoría por ID
        Category category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
        
        if (Objects.isNull(category)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No se encontró la categoría con ID: " + dto.getCategoryId()),
                    HttpStatus.NOT_FOUND
            );
        }
        
        // Validaciones adicionales
        if (Objects.isNull(dto.getName()) || dto.getName().trim().isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El nombre de la categoría es obligatorio."),
                    HttpStatus.BAD_REQUEST
            );
        }
        
        // Verificar si ya existe otra categoría con el mismo nombre en el mismo proyecto (excluyendo la actual)
        Category existingCategory = categoryRepository.findByNameAndCategoryIdNotAndProject(dto.getName(), dto.getCategoryId(), category.getProject());
        if (!Objects.isNull(existingCategory)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "Ya existe una categoría con ese nombre en este proyecto."),
                    HttpStatus.BAD_REQUEST
            );
        }
        
        // Actualizar los campos
        category.setName(dto.getName().trim());
        category.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : null);
        
        categoryRepository.save(category);
        
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Categoría actualizada correctamente."),
                HttpStatus.OK
        );
    }
    
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> saveCategory(SaveCategoryDto dto) {
        // Validaciones de entrada
        if (Objects.isNull(dto.getName()) || dto.getName().trim().isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El nombre de la categoría es obligatorio."),
                    HttpStatus.BAD_REQUEST
            );
        }
        
        // Validar que el proyecto existe
        Project project = projectRepository.findById(dto.getProjectId()).orElse(null);
        if (Objects.isNull(project)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El proyecto especificado no existe."),
                    HttpStatus.NOT_FOUND
            );
        }
        
        // Verificar si ya existe una categoría con el mismo nombre en el mismo proyecto
        Category existingCategory = categoryRepository.findByNameAndProject(dto.getName().trim(), project);
        if (!Objects.isNull(existingCategory)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "Ya existe una categoría con ese nombre en este proyecto."),
                    HttpStatus.BAD_REQUEST
            );
        }
        
        // Crear nueva categoría
        Category category = new Category();
        category.setName(dto.getName().trim());
        category.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : null);
        category.setStatus(dto.getStatus() != null ? dto.getStatus() : true);
        category.setProject(project);
        
        categoryRepository.save(category);
        
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Categoría creada correctamente."),
                HttpStatus.OK
        );
    }
    
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> changeCategoryStatus(ChangeStatusCategoryDto dto) {
        Category category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
        
        if (Objects.isNull(category)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No existe la categoría."), 
                    HttpStatus.NOT_FOUND
            );
        }
        
        // Si se está intentando deshabilitar la categoría, verificar que no tenga tareas activas
        if (category.getStatus()) { // Si actualmente está habilitada y se va a deshabilitar
            long activeTasks = taskRepository.countActiveByCategoryId(dto.getCategoryId());
            if (activeTasks > 0) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.WARNING, "No se puede deshabilitar una categoría que tiene tareas activas asignadas."), 
                        HttpStatus.BAD_REQUEST
                );
            }
        }
        
        category.setStatus(!category.getStatus());
        categoryRepository.save(category);
        
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Estado de la categoría actualizado correctamente"), 
                HttpStatus.OK
        );
    }
}
