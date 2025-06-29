package com.praga.backend.modules.users.controller;

import com.praga.backend.modules.users.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un usuario por ID", description = "Devuelve un usuario específico por su ID")
    public ResponseEntity<Object> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

}
