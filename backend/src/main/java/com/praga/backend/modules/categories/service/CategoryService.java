package com.praga.backend.modules.categories.service;

import com.praga.backend.kernel.ApiResponse;
import com.praga.backend.kernel.TypesResponse;
import com.praga.backend.modules.categories.controller.dto.GetCategoriesDto;
import com.praga.backend.modules.categories.controller.dto.GetCategoriesByProjectDto;
import com.praga.backend.modules.categories.model.ICategoryRepository;
import com.praga.backend.modules.projects.model.IProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoryService {
    
    private final ICategoryRepository categoryRepository;
    private final IProjectRepository projectRepository;
    
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
}
