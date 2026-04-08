package com.praga.backend.modules.categories.model;

import com.praga.backend.modules.projects.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ICategoryRepository extends JpaRepository<Category, Long> {
    
    @Query("SELECT c FROM Category c WHERE c.status = true")
    List<Category> findActiveCategories();
    
    @Query("SELECT c FROM Category c WHERE c.project.projectId = :projectId")
    List<Category> findCategoriesByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT c FROM Category c WHERE c.name = :name AND c.categoryId != :categoryId AND c.project = :project")
    Category findByNameAndCategoryIdNotAndProject(@Param("name") String name, @Param("categoryId") Long categoryId, @Param("project") Project project);
    
    @Query("SELECT c FROM Category c WHERE c.name = :name AND c.project = :project")
    Category findByNameAndProject(@Param("name") String name, @Param("project") Project project);
}
