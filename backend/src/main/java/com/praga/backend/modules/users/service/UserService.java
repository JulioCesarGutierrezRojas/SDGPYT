package com.praga.backend.modules.users.service;

import com.praga.backend.kernel.ApiResponse;
import com.praga.backend.kernel.TypesResponse;
import com.praga.backend.modules.users.controller.dto.SaveUserDto;
import com.praga.backend.modules.users.controller.dto.UpdateUserDto;
import com.praga.backend.modules.users.controller.dto.UpdatePersonalProfileDto;
import com.praga.backend.modules.users.controller.dto.ChangeStatusUserDto;
import com.praga.backend.modules.users.controller.dto.GetUserDto;
import com.praga.backend.modules.users.controller.dto.GetUsersDto;
import com.praga.backend.modules.users.controller.dto.GetUsersByProjectDto;
import com.praga.backend.modules.users.controller.dto.UserListResponseDto;
import com.praga.backend.modules.users.model.IUserRepository;
import com.praga.backend.modules.users.model.User;
import com.praga.backend.modules.projects.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.Objects;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProjectService projectService;

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getAllUsers() {
        List<GetUsersDto> users = userRepository.findAll()
                .stream()
                .map(user -> new GetUsersDto(
                        user.getUserId(),
                        user.getName(),
                        user.getLastname(),
                        user.getEmail(),
                        user.getPhoneNumber(),
                        user.getStatus()
                ))
                .collect(Collectors.toList());
        return new ResponseEntity<>(
                new ApiResponse<>(users, TypesResponse.SUCCESS, "Lista de usuarios obtenida correctamente"), HttpStatus.OK
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getUserById(GetUserDto dto) {
        Optional<User> optionalUser = userRepository.findById(dto.getId());

        if (optionalUser.isPresent()) {
            GetUsersDto user = new GetUsersDto(
                    optionalUser.get().getUserId(),
                    optionalUser.get().getName(),
                    optionalUser.get().getLastname(),
                    optionalUser.get().getEmail(),
                    optionalUser.get().getPhoneNumber(),
                    optionalUser.get().getStatus()
            );
            return new ResponseEntity<>(
                    new ApiResponse<>(user, TypesResponse.SUCCESS, "Usuario encontrado correctamente"), HttpStatus.OK
            );
        } else {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.ERROR, "Usuario no encontrado"), HttpStatus.NOT_FOUND
            );
        }
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> changeUserStatus(ChangeStatusUserDto dto) {
        User user = userRepository.findById(dto.getId()).orElse(null);
        if (Objects.isNull(user)) {
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "No existe el usuario."), HttpStatus.NOT_FOUND);
        }
        user.setStatus(!user.getStatus());
        userRepository.save(user);
        GetUsersDto userDto = new GetUsersDto(
                user.getUserId(),
                user.getName(),
                user.getLastname(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getStatus()
        );
        return new ResponseEntity<>(new ApiResponse<>(userDto, TypesResponse.SUCCESS, "Estado del usuario actualizado correctamente"), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> saveUser(SaveUserDto dto) {
        User foundUser = userRepository.findByEmail(dto.getEmail()).orElse(null);

        if (!Objects.isNull(foundUser))
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "Ese correo ya esta en uso."), HttpStatus.BAD_REQUEST);

        User foundUserByPhone = userRepository.findByPhoneNumber(dto.getPhoneNumber()).orElse(null);

        if (!Objects.isNull(foundUserByPhone))
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "Ese número de teléfono ya esta en uso."), HttpStatus.BAD_REQUEST);

        User user = new User(dto.getName(), dto.getLastname(), dto.getEmail(), dto.getPhoneNumber(), passwordEncoder.encode(dto.getPassword()));
        user.setStatus(true);
        user.setAttempts(0);
        userRepository.save(user);

        // Procesar invitaciones pendientes después del registro
        try {
            projectService.processPendingInvitations(dto.getEmail());
        } catch (Exception e) {
            // Log error but don't fail the registration
            e.printStackTrace();
        }

        return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.SUCCESS, "Usuario registrado correctamente"), HttpStatus.OK);
    }

    public ResponseEntity<Object> updateUser(UpdateUserDto dto){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(authentication.getName()).orElse(null);
        
        User foundUser = userRepository.findById(dto.getId()).orElse(null);

        if (Objects.isNull(foundUser))
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "No existe el usuario."), HttpStatus.NOT_FOUND);

        // Validar permisos: solo puede editar su propio perfil o ser ROOT/PROJECT_ADMIN para editar a otros
        boolean isOwnProfile = currentUser != null && currentUser.getUserId().equals(dto.getId());
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROOT") || auth.getAuthority().equals("PROJECT_ADMIN"));
        
        if (!isOwnProfile && !isAdmin) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No tienes permisos para editar este usuario."), 
                    HttpStatus.FORBIDDEN
            );
        }

        // Validar email duplicado (excluir el mismo usuario)
        User existingUserByEmail = userRepository.findByEmail(dto.getEmail()).orElse(null);
        if (!Objects.isNull(existingUserByEmail) && !existingUserByEmail.getUserId().equals(dto.getId()))
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "Ese correo ya esta en uso."), HttpStatus.BAD_REQUEST);

        // Validar teléfono duplicado (excluir el mismo usuario)
        User existingUserByPhone = userRepository.findByPhoneNumber(dto.getPhoneNumber()).orElse(null);
        if (!Objects.isNull(existingUserByPhone) && !existingUserByPhone.getUserId().equals(dto.getId()))
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "Ese número de teléfono ya esta en uso."), HttpStatus.BAD_REQUEST);

        foundUser.setName(dto.getName());
        foundUser.setLastname(dto.getLastname());
        foundUser.setEmail(dto.getEmail());
        foundUser.setPhoneNumber(dto.getPhoneNumber());
        
        // Solo actualizar contraseña si realmente cambió
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            // Verificar si la nueva contraseña es diferente a la actual
            if (!passwordEncoder.matches(dto.getPassword(), foundUser.getPassword())) {
                foundUser.setPassword(passwordEncoder.encode(dto.getPassword()));
            }
            // Si la contraseña coincide con la actual, no hacer nada
        }

        userRepository.save(foundUser);

        GetUsersDto userDto = new GetUsersDto(
                foundUser.getUserId(),
                foundUser.getName(),
                foundUser.getLastname(),
                foundUser.getEmail(),
                foundUser.getPhoneNumber(),
                foundUser.getStatus()
        );
        return new ResponseEntity<>(new ApiResponse<>(userDto, TypesResponse.SUCCESS, "Usuario actualizado correctamente"), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getUsersByProject(GetUsersByProjectDto dto) {
        List<User> usersInProject = userRepository.findUsersByProjectId(dto.getProjectId());
        
        List<GetUsersDto> users = usersInProject.stream()
                .map(user -> new GetUsersDto(
                        user.getUserId(),
                        user.getName(),
                        user.getLastname(),
                        user.getEmail(),
                        user.getPhoneNumber(),
                        user.getStatus()
                ))
                .collect(Collectors.toList());
        
        if (users.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(users, TypesResponse.WARNING, "No hay usuarios asignados a este proyecto"), 
                    HttpStatus.OK
            );
        }
        
        return new ResponseEntity<>(
                new ApiResponse<>(users, TypesResponse.SUCCESS, "Usuarios del proyecto obtenidos correctamente"), 
                HttpStatus.OK
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getPersonalProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.ERROR, "Usuario no autenticado"),
                    HttpStatus.UNAUTHORIZED
            );
        }

        String userEmail = authentication.getName();
        Optional<User> optionalUser = userRepository.findByEmail(userEmail);

        if (optionalUser.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.ERROR, "Usuario no encontrado"),
                    HttpStatus.NOT_FOUND
            );
        }

        User user = optionalUser.get();
        GetUsersDto userDto = new GetUsersDto(
                user.getUserId(),
                user.getName(),
                user.getLastname(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getStatus()
        );

        return new ResponseEntity<>(
                new ApiResponse<>(userDto, TypesResponse.SUCCESS, "Perfil obtenido correctamente"),
                HttpStatus.OK
        );
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> updatePersonalProfile(UpdatePersonalProfileDto dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.ERROR, "Usuario no autenticado"),
                    HttpStatus.UNAUTHORIZED
            );
        }

        String userEmail = authentication.getName();
        Optional<User> optionalUser = userRepository.findByEmail(userEmail);

        if (optionalUser.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.ERROR, "Usuario no encontrado"),
                    HttpStatus.NOT_FOUND
            );
        }

        User user = optionalUser.get();

        // Validar email duplicado (excluir el mismo usuario)
        if (!user.getEmail().equals(dto.getEmail())) {
            Optional<User> existingUserByEmail = userRepository.findByEmail(dto.getEmail());
            if (existingUserByEmail.isPresent()) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.WARNING, "Ese correo ya está en uso"),
                        HttpStatus.BAD_REQUEST
                );
            }
        }

        // Validar teléfono duplicado (excluir el mismo usuario)
        if (!user.getPhoneNumber().equals(dto.getPhoneNumber())) {
            Optional<User> existingUserByPhone = userRepository.findByPhoneNumber(dto.getPhoneNumber());
            if (existingUserByPhone.isPresent()) {
                return new ResponseEntity<>(
                        new ApiResponse<>(null, TypesResponse.WARNING, "Ese número de teléfono ya está en uso"),
                        HttpStatus.BAD_REQUEST
                );
            }
        }

        // Actualizar datos
        user.setName(dto.getName());
        user.setLastname(dto.getLastname());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());

        // Solo actualizar contraseña si se proporciona y es diferente
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
                user.setPassword(passwordEncoder.encode(dto.getPassword()));
            }
        }

        userRepository.save(user);

        GetUsersDto userDto = new GetUsersDto(
                user.getUserId(),
                user.getName(),
                user.getLastname(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getStatus()
        );

        return new ResponseEntity<>(
                new ApiResponse<>(userDto, TypesResponse.SUCCESS, "Perfil actualizado correctamente"),
                HttpStatus.OK
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getUsersList(int page, int size, String search) {
        List<User> allUsers = userRepository.findAll();
        List<GetUsersDto> filteredUsers = allUsers
                .stream()
                .filter(user -> {
                    if (search == null || search.trim().isEmpty()) {
                        return true;
                    }
                    String searchLower = search.toLowerCase();
                    return user.getName().toLowerCase().contains(searchLower) ||
                           user.getLastname().toLowerCase().contains(searchLower) ||
                           user.getEmail().toLowerCase().contains(searchLower);
                })
                .map(user -> new GetUsersDto(
                        user.getUserId(),
                        user.getName(),
                        user.getLastname(),
                        user.getEmail(),
                        user.getPhoneNumber(),
                        user.getStatus()
                ))
                .collect(Collectors.toList());

        int totalElements = filteredUsers.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, totalElements);

        List<GetUsersDto> pageContent = filteredUsers.subList(
                Math.min(startIndex, totalElements),
                endIndex
        );

        UserListResponseDto response = new UserListResponseDto(
                pageContent,
                page,
                size,
                totalElements,
                totalPages,
                endIndex >= totalElements,  
                page == 0  
        );

        return new ResponseEntity<>(
                new ApiResponse<>(response, TypesResponse.SUCCESS, "Usuarios obtenidos correctamente"),
                HttpStatus.OK
        );
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> updateFcmToken(String fcmToken) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.ERROR, "Usuario no autenticado"),
                    HttpStatus.UNAUTHORIZED
            );
        }

        String userEmail = authentication.getName();
        Optional<User> optionalUser = userRepository.findByEmail(userEmail);

        if (optionalUser.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.ERROR, "Usuario no encontrado"),
                    HttpStatus.NOT_FOUND
            );
        }

        User user = optionalUser.get();
        user.setFcmToken(fcmToken);
        userRepository.save(user);

        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Token FCM actualizado correctamente"),
                HttpStatus.OK
        );
    }
}
