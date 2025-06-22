package com.praga.backend.modules.tasks.model;

import com.praga.backend.kernel.Auditable;
import com.praga.backend.modules.categories.model.Category;
import com.praga.backend.modules.projects.model.Project;
import com.praga.backend.modules.users.model.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
public class Task extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;

    @Column(name = "name", columnDefinition = "VARCHAR(100)", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "status", columnDefinition = "BOOLEAN DEFAULT true", nullable = false)
    private Boolean status;

    @ManyToOne
    private Category category;

    @ManyToOne
    private Project project;

    @ManyToOne
    private User user;
}
