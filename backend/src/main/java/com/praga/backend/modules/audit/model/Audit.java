package com.praga.backend.modules.audit.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log", schema = "audit")
@Data
@NoArgsConstructor
public class Audit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_time", nullable = false)
    private LocalDateTime eventTime;

    @Column(nullable = false)
    private String username;

    @Column(name = "table_name", nullable = false)
    private String tableName;

    @Column(nullable = false)
    private String move;

    @Column(name = "data_before", columnDefinition = "jsonb")
    private String dataBefore;

    @Column(name = "data_after", columnDefinition = "jsonb")
    private String dataAfter;
}

