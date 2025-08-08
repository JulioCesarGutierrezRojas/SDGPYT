package com.praga.backend.modules.categories.service;

import com.praga.backend.kernel.ApiResponse;
import com.praga.backend.kernel.TypesResponse;
import com.praga.backend.modules.categories.controller.dto.GetCategoriesDto;
import com.praga.backend.modules.categories.model.ICategoryRepository;
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
}
