package com.praga.backend.modules.users.controller;

import com.praga.backend.modules.users.controller.dto.SaveUserDto;
import com.praga.backend.modules.users.controller.dto.UpdateUserDto;
import com.praga.backend.modules.users.controller.dto.ChangeStatusUserDto;
import com.praga.backend.modules.users.controller.dto.GetUserDto;
import com.praga.backend.modules.users.controller.dto.GetUsersByProjectDto;
import com.praga.backend.modules.users.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
@Tag(name = "users", description = "Endpoints para gestión de usuarios")

public class UserController {
    private final UserService userService;
    @GetMapping("/allUsers")
    @Operation(summary = "Obtener todos los usuarios", description = "Lista todos los usuarios del sistema")
    public ResponseEntity<Object> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/byId")
    @Operation(summary = "Obtener un usuario por ID", description = "Devuelve un usuario específico por su ID")
    public ResponseEntity<Object> getUserById(@Validated @RequestBody GetUserDto dto) {
        return userService.getUserById(dto);
    }

    @PatchMapping("/")
    @Operation(summary = "status del usuario", description = "Actualiza el status")
    public ResponseEntity<Object> changeUserStatus(@Validated @RequestBody ChangeStatusUserDto dto) {
        return userService.changeUserStatus(dto);
    }
  
    @PostMapping("/")
    @Operation(summary = "Crear un nuevo usuario", description = "Crea un nuevo usuario en el sistema")
    public ResponseEntity<Object> saveUser(@Validated @RequestBody SaveUserDto saveUserDto) {
        return userService.saveUser(saveUserDto);
    }

    @PutMapping("/")
    @Operation(summary = "Actualizar usuario", description = "Actualiza la información de un usuario existente")
    public ResponseEntity<Object> updateUser(@Validated @RequestBody UpdateUserDto userDto) {
        return userService.updateUser(userDto);
    }

    @PostMapping("/byProject")
    @Operation(summary = "Obtener usuarios por proyecto", description = "Devuelve todos los usuarios asignados a un proyecto específico")
    public ResponseEntity<Object> getUsersByProject(@Validated @RequestBody GetUsersByProjectDto dto) {
        return userService.getUsersByProject(dto);
    }

    @GetMapping("/me")
    @Operation(summary = "Obtener perfil personal", description = "Retorna el perfil del usuario autenticado")
    public ResponseEntity<Object> getPersonalProfile() {
        return userService.getPersonalProfile();
    }
}
