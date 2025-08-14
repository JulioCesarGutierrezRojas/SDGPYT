package com.praga.backend.modules.tasks.controller;

import com.praga.backend.modules.tasks.controller.dto.*;
import com.praga.backend.modules.tasks.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
@Tag(name = "tasks", description = "Endpoints para gestión de tareas")
public class TaskController {
    
    private final TaskService taskService;
    
    @PostMapping("/")
    @Operation(summary = "Crear tarea", description = "Crea una nueva tarea en el sistema")
    public ResponseEntity<Object> saveTask(@Validated @RequestBody SaveTaskDto dto) {
        return taskService.saveTask(dto);
    }
    
    @PostMapping("/by-project")
    @Operation(summary = "Obtener tareas por proyecto", description = "Lista todas las tareas de un proyecto específico")
    public ResponseEntity<Object> getTasksByProject(@Validated @RequestBody GetTasksByProjectDto dto) {
        return taskService.getTasksByProject(dto);
    }
    
    @PostMapping("/by-category")
    @Operation(summary = "Obtener tareas por categoría", description = "Lista todas las tareas de una categoría específica")
    public ResponseEntity<Object> getTasksByCategory(@Validated @RequestBody GetTasksByCategoryDto dto) {
        return taskService.getTasksByCategory(dto);
    }
    
    @PostMapping("/by-user")
    @Operation(summary = "Obtener tareas asignadas a un usuario", description = "Lista todas las tareas asignadas a un usuario específico")
    public ResponseEntity<Object> getTasksByUser(@Validated @RequestBody GetTasksByUserDto dto) {
        return taskService.getTasksByUser(dto);
    }
    
    @GetMapping("/{taskId}")
    @Operation(summary = "Obtener tarea por ID", description = "Obtiene una tarea específica por su ID")
    public ResponseEntity<Object> getTaskById(@PathVariable Long taskId) {
        return taskService.getTaskById(taskId);
    }
    
    @PutMapping("/")
    @Operation(summary = "Actualizar tarea", description = "Actualiza la información de una tarea existente")
    public ResponseEntity<Object> updateTask(@Validated @RequestBody UpdateTaskDto dto) {
        return taskService.updateTask(dto);
    }
    
    @PatchMapping("/")
    @Operation(summary = "Cambiar status de tarea", description = "Cambia el status de una tarea (activa/inactiva)")
    public ResponseEntity<Object> changeTaskStatus(@Validated @RequestBody ChangeStatusTaskDto dto) {
        return taskService.changeTaskStatus(dto);
    }
    
    @PatchMapping("/category")
    @Operation(summary = "Actualizar categoría de tarea", description = "Actualiza únicamente la categoría de una tarea existente")
    public ResponseEntity<Object> updateTaskCategory(@Validated @RequestBody UpdateTaskCategoryDto dto) {
        return taskService.updateTaskCategory(dto);
    }
    
    @DeleteMapping("/{taskId}")
    @Operation(summary = "Eliminar tarea", description = "Elimina una tarea del sistema")
    public ResponseEntity<Object> deleteTask(@PathVariable Long taskId) {
        return taskService.deleteTask(taskId);
    }
}
