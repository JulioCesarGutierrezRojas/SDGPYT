package com.praga.backend.modules.projects.model;

import com.praga.backend.modules.users.model.Role;
import com.praga.backend.modules.users.model.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "project_users")
@Data
@NoArgsConstructor
public class ProjectUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectUserId;

    @ManyToOne
    private Project projectId;

    @ManyToOne
    private User userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;
}
