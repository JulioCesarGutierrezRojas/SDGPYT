package com.praga.backend.modules.audit.controller;

import com.praga.backend.modules.audit.service.AuditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
@Tag(name = "audit", description = "Endpoints para gestión de auditoría")
public class AuditController {
    
    private final AuditService auditService;
    
    @GetMapping("/logs")
    @Operation(summary = "Obtener todos los registros de auditoría", description = "Lista todos los registros de la tabla audit_log")
    public ResponseEntity<Object> getAllAuditLogs() {
        return auditService.getAllAuditLogs();
    }
}
