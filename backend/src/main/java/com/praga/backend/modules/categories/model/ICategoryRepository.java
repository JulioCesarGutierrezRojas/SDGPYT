package com.praga.backend.modules.categories.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ICategoryRepository extends JpaRepository<Category, Long> {
    
    @Query("SELECT c FROM Category c WHERE c.status = true")
    List<Category> findActiveCategories();
    
    @Query("SELECT DISTINCT c FROM Category c INNER JOIN Task t ON t.category = c WHERE t.project.projectId = :projectId")
    List<Category> findCategoriesByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT c FROM Category c WHERE c.name = :name AND c.categoryId != :categoryId")
    Category findByNameAndCategoryIdNot(@Param("name") String name, @Param("categoryId") Long categoryId);
    
    Category findByName(String name);
}
