package com.praga.backend.modules.users.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.praga.backend.kernel.Auditable;
import com.praga.backend.modules.projects.model.ProjectUser;
import com.praga.backend.modules.tasks.model.Task;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(name = "name", columnDefinition = "VARCHAR(100)", nullable = false)
    private String name;

    @Column(name = "lastname", columnDefinition = "VARCHAR(100)", nullable = false)
    private String lastname;

    @Column(name = "email", columnDefinition = "VARCHAR(255)", nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number", columnDefinition = "VARCHAR(15)", nullable = false, unique = true)
    private String phoneNumber;

    @Column(name = "password", columnDefinition = "VARCHAR(255)", nullable = false)
    private String password;

    @Column(name = "token", columnDefinition = "VARCHAR(20)")
    private String token;

    @Column(name = "date_expiration", columnDefinition = "TIMESTAMP")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateExpiration;

    @Column(name = "time_blocked", columnDefinition = "TIMESTAMP")
    @Temporal(TemporalType.TIMESTAMP)
    private Date timeBlocked;

    @Column(name = "attempts", columnDefinition = "INT DEFAULT 0")
    private Integer attempts;

    @Column(name = "status", columnDefinition = "BOOLEAN DEFAULT true", nullable = false)
    private Boolean status;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Task> tasks;

    @OneToMany(mappedBy = "userId")
    @JsonIgnore
    private List<ProjectUser> projectUsers;
}
