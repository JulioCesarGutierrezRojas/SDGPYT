package com.praga.backend.modules.audit.service;

import com.praga.backend.kernel.ApiResponse;
import com.praga.backend.kernel.TypesResponse;
import com.praga.backend.modules.audit.controller.dto.GetAuditDto;
import com.praga.backend.modules.audit.model.Audit;
import com.praga.backend.modules.audit.model.IAuditRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AuditService {
    
    private final IAuditRepository auditRepository;
    
    @Transactional(readOnly = true)
    public ResponseEntity<Object> getAllAuditLogs() {
        try {
            List<GetAuditDto> auditLogs = auditRepository.findAll()
                    .stream()
                    .map(audit -> new GetAuditDto(
                            audit.getId(),
                            audit.getEventTime(),
                            audit.getUsername(),
                            audit.getTableName(),
                            audit.getMove(),
                            audit.getDataBefore(),
                            audit.getDataAfter()
                    ))
                    .collect(Collectors.toList());
            
            return new ResponseEntity<>(
                    new ApiResponse<>(auditLogs, TypesResponse.SUCCESS, "Lista de registros de auditoría obtenida correctamente"), 
                    HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.ERROR, "Error al obtener los registros de auditoría: " + e.getMessage()), 
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
