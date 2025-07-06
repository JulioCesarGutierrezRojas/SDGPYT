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
    @JoinColumn(name = "project_id_project_id")
    private Project projectId;

    @ManyToOne
    @JoinColumn(name = "user_id_user_id")
    private User userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;
}
