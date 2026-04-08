package com.praga.backend.modules.projects.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.praga.backend.kernel.Auditable;
import com.praga.backend.modules.tasks.model.Task;
import com.praga.backend.modules.categories.model.Category;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
public class Project extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId;

    @Column(name = "name", columnDefinition = "VARCHAR(100)", nullable = false)
    private String name;

    @Column(name = "abbreviation", columnDefinition = "VARCHAR(50)", nullable = false)
    private String abbreviation;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "status", columnDefinition = "BOOLEAN DEFAULT true", nullable = false)
    private Boolean status;

    @OneToMany(mappedBy = "project")
    @JsonIgnore
    private List<Task> tasks;

    @OneToMany(mappedBy = "project")
    @JsonIgnore
    private List<Category> categories;

    @OneToMany(mappedBy = "projectId")
    @JsonIgnore
    private List<ProjectUser> projectUsers;
}
