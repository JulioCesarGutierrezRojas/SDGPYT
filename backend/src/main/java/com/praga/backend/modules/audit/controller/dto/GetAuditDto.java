package com.praga.backend.modules.audit.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAuditDto {
    private Long id;
    private LocalDateTime eventTime;
    private String username;
    private String tableName;
    private String move;
    private String dataBefore;
    private String dataAfter;
}
