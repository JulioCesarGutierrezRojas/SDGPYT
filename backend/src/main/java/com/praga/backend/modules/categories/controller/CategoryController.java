package com.praga.backend.modules.categories.controller;

import com.praga.backend.modules.categories.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
}
