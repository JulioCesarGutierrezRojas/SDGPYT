package com.praga.backend.modules.categories.controller;

import com.praga.backend.modules.categories.controller.dto.GetCategoriesByProjectDto;
import com.praga.backend.modules.categories.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
@Tag(name = "categories", description = "Endpoints para gestión de categorías")
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @GetMapping("/active")
    @Operation(summary = "Obtener categorías activas", description = "Lista todas las categorías con status activo (true)")
    public ResponseEntity<Object> getActiveCategories() {
        return categoryService.getActiveCategories();
    }
    
    @PostMapping("/by-project")
    @Operation(summary = "Obtener categorías por proyecto", description = "Lista todas las categorías utilizadas en las tareas de un proyecto específico")
    public ResponseEntity<Object> getCategoriesByProject(@Validated @RequestBody GetCategoriesByProjectDto dto) {
        return categoryService.getCategoriesByProject(dto);
    }
}
