package com.praga.backend.modules.categories.controller;

import com.praga.backend.modules.categories.controller.dto.GetCategoriesByProjectDto;
import com.praga.backend.modules.categories.controller.dto.UpdateCategoryDto;
import com.praga.backend.modules.categories.controller.dto.SaveCategoryDto;
import com.praga.backend.modules.categories.controller.dto.ChangeStatusCategoryDto;
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
    
    @PostMapping("/")
    @Operation(summary = "Crear categoría", description = "Crea una nueva categoría en el sistema")
    public ResponseEntity<Object> saveCategory(@Validated @RequestBody SaveCategoryDto dto) {
        return categoryService.saveCategory(dto);
    }
    
    @PutMapping("/")
    @Operation(summary = "Actualizar categoría", description = "Actualiza la información de una categoría existente")
    public ResponseEntity<Object> updateCategory(@Validated @RequestBody UpdateCategoryDto dto) {
        return categoryService.updateCategory(dto);
    }
    
    @PatchMapping("/")
    @Operation(summary = "Cambiar status de categoría", description = "Cambia el status de una categoría (activa/inactiva)")
    public ResponseEntity<Object> changeCategoryStatus(@Validated @RequestBody ChangeStatusCategoryDto dto) {
        return categoryService.changeCategoryStatus(dto);
    }
}
