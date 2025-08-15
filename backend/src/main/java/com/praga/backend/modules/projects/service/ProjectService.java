package com.praga.backend.modules.projects.service;

import com.praga.backend.kernel.ApiResponse;
import com.praga.backend.kernel.TypesResponse;
import com.praga.backend.modules.projects.controller.dto.GetAssignedProjectsDto;
import com.praga.backend.modules.projects.controller.dto.GetProjectsDto;
import com.praga.backend.modules.projects.controller.dto.SaveProjectDto;
import com.praga.backend.modules.projects.controller.dto.UpdateProjectDto;
import com.praga.backend.modules.projects.controller.dto.ChangeStatusProjectDto;
import com.praga.backend.modules.projects.controller.dto.GetProjectByIdDto;
import com.praga.backend.modules.projects.controller.dto.AssignProjectAdminDto;
import com.praga.backend.modules.projects.controller.dto.SendInvitationsDto;
import com.praga.backend.modules.projects.controller.dto.AcceptInvitationDto;
import com.praga.backend.modules.projects.controller.dto.AcceptInvitationGuestDto;
import com.praga.backend.modules.projects.model.IProjectRepository;
import com.praga.backend.modules.projects.model.IProjectUserRepository;
import com.praga.backend.modules.projects.model.IPendingInvitationRepository;
import com.praga.backend.modules.projects.model.Project;
import com.praga.backend.modules.projects.model.ProjectUser;
import com.praga.backend.modules.projects.model.PendingInvitation;
import com.praga.backend.modules.users.model.IUserRepository;
import com.praga.backend.modules.users.model.User;
import com.praga.backend.modules.users.model.Role;
import com.praga.backend.kernel.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.sql.Types;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ProjectService {
    private final IProjectRepository projectRepository;
    private final IUserRepository userRepository;
    private final IProjectUserRepository iProjectUserRepository;
    private final IPendingInvitationRepository pendingInvitationRepository;
    private final EmailService emailService;
    
    /**
     * Método helper para verificar si el usuario actual tiene rol ROOT
     */
    private boolean currentUserIsRoot() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getAuthorities() != null) {
                return authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .anyMatch(authority -> "ROOT".equals(authority));
            }
        } catch (Exception e) {
            // En caso de error, asumir que no es ROOT
            return false;
        }
        return false;
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getAllProjects() {
        List<GetProjectsDto> projects = projectRepository.findAll()
                .stream()
                .map(project -> {
                    // Buscar el administrador del proyecto
                    ProjectUser adminProjectUser = iProjectUserRepository
                            .findByProjectIdAndRole(project, Role.PROJECT_ADMIN)
                            .stream()
                            .findFirst()
                            .orElse(null);
                    
                    String adminName = null;
                    String adminEmail = null;
                    
                    if (adminProjectUser != null && adminProjectUser.getUserId() != null) {
                        User admin = adminProjectUser.getUserId();
                        adminName = admin.getName() + " " + admin.getLastname();
                        adminEmail = admin.getEmail();
                    }
                    
                    return new GetProjectsDto(
                            project.getProjectId(),
                            project.getName(),
                            project.getAbbreviation(),
                            project.getDescription(),
                            project.getStatus(),
                            adminName,
                            adminEmail
                    );
                })
                .collect(Collectors.toList());
        return new ResponseEntity<>(
                new ApiResponse<>(projects, TypesResponse.SUCCESS, "Lista de proyectos obtenida correctamente"), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> saveProject(SaveProjectDto dto) {
        if (Objects.isNull(dto.getName()) || dto.getName().trim().isEmpty()) {
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "El nombre del proyecto es obligatorio."), HttpStatus.BAD_REQUEST);
        }

        if (Objects.isNull(dto.getAbbreviation()) || dto.getAbbreviation().trim().isEmpty()) {
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "La abreviación del proyecto es obligatoria."), HttpStatus.BAD_REQUEST);
        }

        Project project = new Project();
        project.setName(dto.getName());
        project.setAbbreviation(dto.getAbbreviation());
        project.setDescription(dto.getDescription());
        project.setStatus(dto.getStatus() != null ? dto.getStatus() : true);

        projectRepository.save(project);

        // Obtener información del usuario actual
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication != null ? authentication.getName() : null;
        
        // Si se especificó un administrador, asignarlo al proyecto
        if (dto.getAdminUserId() != null) {
            User adminUser = userRepository.findById(dto.getAdminUserId()).orElse(null);
            if (adminUser != null) {
                // Verificar si ya existe una relación ProjectUser para este usuario y proyecto
                ProjectUser existingProjectUser = iProjectUserRepository
                    .findByProjectIdAndUserId(project, adminUser)
                    .orElse(null);
                
                if (existingProjectUser == null) {
                    ProjectUser projectUser = new ProjectUser();
                    projectUser.setProjectId(project);
                    projectUser.setUserId(adminUser);
                    projectUser.setRole(Role.PROJECT_ADMIN); // Asignar rol de administrador
                    iProjectUserRepository.save(projectUser);
                }
            }
        } else {
            // Si no se especificó administrador y el usuario actual no es ROOT,
            // asignar al usuario actual como PROJECT_ADMIN
            if (!currentUserIsRoot() && currentUsername != null) {
                User currentUser = userRepository.findByEmail(currentUsername).orElse(null);
                if (currentUser != null) {
                    // Verificar si ya existe una relación ProjectUser para este usuario y proyecto
                    ProjectUser existingProjectUser = iProjectUserRepository
                        .findByProjectIdAndUserId(project, currentUser)
                        .orElse(null);
                    
                    if (existingProjectUser == null) {
                        ProjectUser projectUser = new ProjectUser();
                        projectUser.setProjectId(project);
                        projectUser.setUserId(currentUser);
                        projectUser.setRole(Role.PROJECT_ADMIN); // Asignar como administrador del proyecto
                        iProjectUserRepository.save(projectUser);
                    }
                }
            }
        }

        return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.SUCCESS, "Proyecto creado correctamente."), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> updateProject(UpdateProjectDto dto) {
        Project project = projectRepository.findById(dto.getId()).orElse(null);

        if (Objects.isNull(project)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No se encontró el proyecto con ID: " + dto.getId()),
                    HttpStatus.NOT_FOUND
            );
        }

        if (Objects.isNull(dto.getName()) || dto.getName().trim().isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El nombre del proyecto es obligatorio."),
                    HttpStatus.BAD_REQUEST
            );
        }

        if (Objects.isNull(dto.getAbbreviation()) || dto.getAbbreviation().trim().isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "La abreviación del proyecto es obligatoria."),
                    HttpStatus.BAD_REQUEST
            );
        }

        project.setName(dto.getName());
        project.setAbbreviation(dto.getAbbreviation());
        project.setDescription(dto.getDescription());
        //project.setStatus(dto.getStatus() != null ? dto.getStatus() : project.getStatus());

        projectRepository.save(project);

        // Gestionar la asignación del administrador
        if (dto.getAdminUserId() != null) {
            User adminUser = userRepository.findById(dto.getAdminUserId()).orElse(null);
            if (adminUser != null) {
                // Buscar si ya existe un administrador para este proyecto
                ProjectUser currentAdmin = iProjectUserRepository
                    .findByProjectIdAndRole(project, Role.PROJECT_ADMIN)
                    .stream()
                    .findFirst()
                    .orElse(null);
                
                // Si ya existe un administrador diferente, actualizar la relación
                if (currentAdmin != null) {
                    if (!currentAdmin.getUserId().getUserId().equals(dto.getAdminUserId())) {
                        // Cambiar el usuario administrador
                        currentAdmin.setUserId(adminUser);
                        iProjectUserRepository.save(currentAdmin);
                    }
                } else {
                    // No existe administrador, crear nueva relación
                    ProjectUser newAdminRelation = new ProjectUser();
                    newAdminRelation.setProjectId(project);
                    newAdminRelation.setUserId(adminUser);
                    newAdminRelation.setRole(Role.PROJECT_ADMIN);
                    iProjectUserRepository.save(newAdminRelation);
                }
            }
        } else {
            // Si adminUserId es null, eliminar el administrador actual
            ProjectUser currentAdmin = iProjectUserRepository
                .findByProjectIdAndRole(project, Role.PROJECT_ADMIN)
                .stream()
                .findFirst()
                .orElse(null);
            
            if (currentAdmin != null) {
                iProjectUserRepository.delete(currentAdmin);
            }
        }

        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Proyecto actualizado correctamente."),
                HttpStatus.OK
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getUserProjects() {
        try {
            // Obtener el usuario actual del contexto de seguridad
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.ERROR, "Usuario no autenticado"),
                        HttpStatus.UNAUTHORIZED
                );
            }

            String username = authentication.getName();
            if (username == null || username.equals("anonymousUser")) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.ERROR, "Usuario no autenticado"),
                        HttpStatus.UNAUTHORIZED
                );
            }

            User currentUser = userRepository.findByEmail(username).orElse(null);

            if (Objects.isNull(currentUser)) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.WARNING, "Usuario no encontrado: " + username),
                        HttpStatus.NOT_FOUND
                );
            }

            // Obtener todos los proyectos del usuario con sus roles
            List<ProjectUser> projectUsers = iProjectUserRepository.findProjectUsersByUser(currentUser);
            
            List<GetAssignedProjectsDto> userProjects = projectUsers.stream()
                    .filter(pu -> pu.getProjectId() != null) // Filtrar proyectos nulos
                    .map(pu -> new GetAssignedProjectsDto(
                            pu.getProjectId().getProjectId(),
                            pu.getProjectId().getName(),
                            pu.getProjectId().getAbbreviation(),
                            pu.getProjectId().getDescription(),
                            pu.getProjectId().getStatus(),
                            pu.getRole()
                    ))
                    .collect(Collectors.toList());
            
            return new ResponseEntity<>(
                    new ApiResponse<>(userProjects, TypesResponse.SUCCESS, "Proyectos del usuario obtenidos correctamente"),
                    HttpStatus.OK
            );
            
        } catch (Exception e) {
            e.printStackTrace(); // Para debug
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.ERROR, "Error al obtener proyectos del usuario: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getProjectById(GetProjectByIdDto dto) {
        Project project = projectRepository.findById(dto.getProjectId()).orElse(null);
        
        if (Objects.isNull(project)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No se encontró el proyecto con ID: " + dto.getProjectId()),
                    HttpStatus.NOT_FOUND
            );
        }
        
        // Buscar el administrador del proyecto
        ProjectUser adminProjectUser = iProjectUserRepository
                .findByProjectIdAndRole(project, Role.PROJECT_ADMIN)
                .stream()
                .findFirst()
                .orElse(null);
        
        String adminName = null;
        String adminEmail = null;
        
        if (adminProjectUser != null && adminProjectUser.getUserId() != null) {
            User admin = adminProjectUser.getUserId();
            adminName = admin.getName() + " " + admin.getLastname();
            adminEmail = admin.getEmail();
        }
        
        GetProjectsDto projectDto = new GetProjectsDto(
                project.getProjectId(),
                project.getName(),
                project.getAbbreviation(),
                project.getDescription(),
                project.getStatus(),
                adminName,
                adminEmail
        );
        
        return new ResponseEntity<>(
                new ApiResponse<>(projectDto, TypesResponse.SUCCESS, "Proyecto obtenido correctamente"),
                HttpStatus.OK
        );
    }
                               
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> changeProjectStatus(ChangeStatusProjectDto dto) {
        Project project = projectRepository.findById(dto.getId()).orElse(null);
        if (Objects.isNull(project)) {
            return new ResponseEntity<>(
            new ApiResponse<>(null, TypesResponse.WARNING, "No se encontró el proyecto con ID: " + dto.getId()), HttpStatus.NOT_FOUND);
        }
        project.setStatus(!project.getStatus());
        projectRepository.save(project);
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Estado del proyecto actualizado correctamente"), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> assignProjectAdmin(AssignProjectAdminDto dto) {
        // Verificar que el proyecto existe
        Project project = projectRepository.findById(dto.getProjectId()).orElse(null);
        if (Objects.isNull(project)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No se encontró el proyecto con ID: " + dto.getProjectId()),
                    HttpStatus.NOT_FOUND
            );
        }

        // Verificar que el usuario existe
        User adminUser = userRepository.findById(dto.getUserId()).orElse(null);
        if (Objects.isNull(adminUser)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No se encontró el usuario con ID: " + dto.getUserId()),
                    HttpStatus.NOT_FOUND
            );
        }

        // Verificar si ya existe una relación ProjectUser para este usuario y proyecto
        ProjectUser existingProjectUser = iProjectUserRepository
                .findByProjectIdAndUserId(project, adminUser)
                .orElse(null);

        if (existingProjectUser != null) {
            // Si ya existe, actualizar el rol a PROJECT_ADMIN
            existingProjectUser.setRole(Role.PROJECT_ADMIN);
            iProjectUserRepository.save(existingProjectUser);
        } else {
            // Si no existe, crear nueva relación
            ProjectUser projectUser = new ProjectUser();
            projectUser.setProjectId(project);
            projectUser.setUserId(adminUser);
            projectUser.setRole(Role.PROJECT_ADMIN);
            iProjectUserRepository.save(projectUser);
        }

        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Administrador asignado al proyecto correctamente"),
                HttpStatus.OK
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> sendProjectInvitations(SendInvitationsDto dto) {
        try {
            // Obtener el usuario actual del contexto de seguridad
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.ERROR, "Usuario no autenticado"),
                        HttpStatus.UNAUTHORIZED
                );
            }

            String username = authentication.getName();
            User currentUser = userRepository.findByEmail(username).orElse(null);

            if (Objects.isNull(currentUser)) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.WARNING, "Usuario no encontrado"),
                        HttpStatus.NOT_FOUND
                );
            }

            // Verificar que el proyecto existe
            Project project = projectRepository.findById(dto.getProjectId()).orElse(null);
            if (Objects.isNull(project)) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.WARNING, "No se encontró el proyecto con ID: " + dto.getProjectId()),
                        HttpStatus.NOT_FOUND
                );
            }

            // Verificar que el usuario actual es administrador del proyecto
            ProjectUser adminProjectUser = iProjectUserRepository
                    .findByProjectIdAndUserId(project, currentUser)
                    .orElse(null);

            if (adminProjectUser == null || !adminProjectUser.getRole().equals(Role.PROJECT_ADMIN)) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.WARNING, "No tienes permisos para enviar invitaciones a este proyecto"),
                        HttpStatus.FORBIDDEN
                );
            }

            // Preparar los datos para el envío de correos
            String inviterName = currentUser.getName() + " " + currentUser.getLastname();
            String inviterEmail = currentUser.getEmail();
            
            // Enviar las invitaciones por correo
            boolean emailsSent = emailService.sendProjectInvitations(
                    dto.getEmails(),
                    project.getName(),
                    project.getDescription(),
                    inviterName,
                    inviterEmail,
                    project.getProjectId()
            );

            if (emailsSent) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.SUCCESS, "Invitaciones enviadas correctamente a " + dto.getEmails().size() + " destinatarios"),
                        HttpStatus.OK
                );
            } else {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.ERROR, "Error al enviar las invitaciones por correo"),
                        HttpStatus.INTERNAL_SERVER_ERROR
                );
            }

        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.ERROR, "Error inesperado al enviar invitaciones: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> acceptProjectInvitation(AcceptInvitationDto dto) {
        try {
            // Obtener el usuario actual del contexto de seguridad
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.ERROR, "Debes iniciar sesión para aceptar la invitación"),
                        HttpStatus.UNAUTHORIZED
                );
            }

            String username = authentication.getName();
            if (username == null || username.equals("anonymousUser")) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.ERROR, "Debes iniciar sesión para aceptar la invitación"),
                        HttpStatus.UNAUTHORIZED
                );
            }

            User currentUser = userRepository.findByEmail(username).orElse(null);

            if (Objects.isNull(currentUser)) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.WARNING, "No se encontró tu cuenta de usuario. Regístrate primero."),
                        HttpStatus.NOT_FOUND
                );
            }

            // Verificar que el proyecto existe
            Project project = projectRepository.findById(dto.getProjectId()).orElse(null);
            if (Objects.isNull(project)) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.WARNING, "El proyecto no existe o ha sido eliminado"),
                        HttpStatus.NOT_FOUND
                );
            }

            // Verificar que el proyecto esté activo
            if (!project.getStatus()) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.WARNING, "Este proyecto no está disponible actualmente"),
                        HttpStatus.BAD_REQUEST
                );
            }

            // Verificar si el usuario ya está en el proyecto
            ProjectUser existingProjectUser = iProjectUserRepository
                    .findByProjectIdAndUserId(project, currentUser)
                    .orElse(null);

            if (existingProjectUser != null) {
                String roleName = existingProjectUser.getRole() == Role.PROJECT_ADMIN ? "administrador" : "colaborador";
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.WARNING, "Ya eres " + roleName + " de este proyecto"),
                        HttpStatus.CONFLICT
                );
            }

            // Crear nueva relación usuario-proyecto con rol USER
            ProjectUser newProjectUser = new ProjectUser();
            newProjectUser.setProjectId(project);
            newProjectUser.setUserId(currentUser);
            newProjectUser.setRole(Role.USER); // Rol de colaborador normal
            iProjectUserRepository.save(newProjectUser);

            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.SUCCESS, "¡Te has unido exitosamente al proyecto \"" + project.getName() + "\"!"),
                    HttpStatus.OK
            );

        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.ERROR, "Error inesperado al aceptar la invitación: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Aceptar invitación como usuario no registrado
     * Crea una invitación pendiente que se procesará cuando el usuario se registre
     */
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> acceptProjectInvitationAsGuest(AcceptInvitationGuestDto dto) {
        try {
            // Verificar que el proyecto existe
            Project project = projectRepository.findById(dto.getProjectId()).orElse(null);
            if (Objects.isNull(project)) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.WARNING, "El proyecto no existe o ha sido eliminado"),
                        HttpStatus.NOT_FOUND
                );
            }

            // Verificar que el proyecto esté activo
            if (!project.getStatus()) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.WARNING, "Este proyecto no está disponible actualmente"),
                        HttpStatus.BAD_REQUEST
                );
            }

            // Verificar si el usuario ya está registrado
            User existingUser = userRepository.findByEmail(dto.getEmail()).orElse(null);
            if (existingUser != null) {
                // Si ya está registrado, verificar si ya está en el proyecto
                ProjectUser existingProjectUser = iProjectUserRepository
                        .findByProjectIdAndUserId(project, existingUser)
                        .orElse(null);

                if (existingProjectUser != null) {
                    String roleName = existingProjectUser.getRole() == Role.PROJECT_ADMIN ? "administrador" : "colaborador";
                    return new ResponseEntity<>(
                            new ApiResponse<>(null, TypesResponse.WARNING, "Ya eres " + roleName + " de este proyecto"),
                            HttpStatus.CONFLICT
                    );
                }

                // Si está registrado pero no en el proyecto, agregarlo directamente
                ProjectUser newProjectUser = new ProjectUser();
                newProjectUser.setProjectId(project);
                newProjectUser.setUserId(existingUser);
                newProjectUser.setRole(Role.USER);
                iProjectUserRepository.save(newProjectUser);

                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.SUCCESS, "Te has unido exitosamente al proyecto \"" + project.getName() + "\"! Inicia sesión para continuar."),
                        HttpStatus.OK
                );
            }

            // Verificar si ya existe una invitación pendiente
            PendingInvitation existingInvitation = pendingInvitationRepository
                    .findByEmailAndProjectIdAndUsedFalseAndExpiresAtAfter(dto.getEmail(), project, LocalDateTime.now())
                    .orElse(null);

            if (existingInvitation != null) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.WARNING, "Ya tienes una invitación pendiente para este proyecto. Regístrate para unirte."),
                        HttpStatus.CONFLICT
                );
            }

            // Crear nueva invitación pendiente
            PendingInvitation pendingInvitation = new PendingInvitation();
            pendingInvitation.setProjectId(project);
            pendingInvitation.setEmail(dto.getEmail());
            pendingInvitationRepository.save(pendingInvitation);

            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.SUCCESS, "Invitación aceptada. Regístrate para unirte al proyecto \"" + project.getName() + "\"."),
                    HttpStatus.OK
            );

        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.ERROR, "Error inesperado al procesar la invitación: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Procesar invitaciones pendientes después del registro de usuario
     */
    @Transactional(rollbackFor = {SQLException.class})
    public void processPendingInvitations(String email) {
        try {
            List<PendingInvitation> pendingInvitations = pendingInvitationRepository
                    .findPendingInvitationsByEmail(email, LocalDateTime.now());

            if (!pendingInvitations.isEmpty()) {
                User newUser = userRepository.findByEmail(email).orElse(null);
                if (newUser != null) {
                    for (PendingInvitation invitation : pendingInvitations) {
                        // Verificar si el proyecto aún existe y está activo
                        if (invitation.getProjectId() != null && invitation.getProjectId().getStatus()) {
                            // Verificar si ya existe relación usuario-proyecto
                            ProjectUser existingProjectUser = iProjectUserRepository
                                    .findByProjectIdAndUserId(invitation.getProjectId(), newUser)
                                    .orElse(null);

                            if (existingProjectUser == null) {
                                // Crear nueva relación usuario-proyecto
                                ProjectUser newProjectUser = new ProjectUser();
                                newProjectUser.setProjectId(invitation.getProjectId());
                                newProjectUser.setUserId(newUser);
                                newProjectUser.setRole(Role.USER);
                                iProjectUserRepository.save(newProjectUser);
                            }
                        }

                        // Marcar invitación como usada
                        invitation.setUsed(true);
                        pendingInvitationRepository.save(invitation);
                    }
                }
            }
        } catch (Exception e) {
            // Log error but don't fail the registration process
            e.printStackTrace();
        }
    }

    /**
     * Limpiar invitaciones expiradas (método utilitario)
     */
    @Transactional(rollbackFor = {SQLException.class})
    public void cleanExpiredInvitations() {
        try {
            pendingInvitationRepository.deleteExpiredInvitations(LocalDateTime.now());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
