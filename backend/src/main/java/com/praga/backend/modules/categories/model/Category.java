package com.praga.backend.modules.categories.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.praga.backend.kernel.Auditable;
import com.praga.backend.modules.tasks.model.Task;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
public class Category extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    @Column(name = "name", columnDefinition = "VARCHAR(100)", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "status", columnDefinition = "BOOLEAN DEFAULT true", nullable = false)
    private Boolean status;

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<Task> tasks;
}
