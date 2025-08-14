package com.praga.backend.modules.tasks.service;

import com.praga.backend.kernel.ApiResponse;
import com.praga.backend.kernel.TypesResponse;
import com.praga.backend.modules.tasks.controller.dto.SaveTaskDto;
import com.praga.backend.modules.tasks.controller.dto.GetTasksByProjectDto;
import com.praga.backend.modules.tasks.controller.dto.GetTasksByCategoryDto;
import com.praga.backend.modules.tasks.controller.dto.GetTasksByUserDto;
import com.praga.backend.modules.tasks.controller.dto.GetTasksDto;
import com.praga.backend.modules.tasks.controller.dto.UpdateTaskDto;
import com.praga.backend.modules.tasks.controller.dto.UpdateTaskCategoryDto;
import com.praga.backend.modules.tasks.controller.dto.ChangeStatusTaskDto;
import com.praga.backend.modules.tasks.model.ITaskRepository;
import com.praga.backend.modules.tasks.model.Task;
import com.praga.backend.modules.categories.model.ICategoryRepository;
import com.praga.backend.modules.categories.model.Category;
import com.praga.backend.modules.projects.model.IProjectRepository;
import com.praga.backend.modules.projects.model.Project;
import com.praga.backend.modules.users.model.IUserRepository;
import com.praga.backend.modules.users.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TaskService {
    
    private final ITaskRepository taskRepository;
    private final ICategoryRepository categoryRepository;
    private final IProjectRepository projectRepository;
    private final IUserRepository userRepository;
    
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> saveTask(SaveTaskDto dto) {
        // Validaciones de entrada
        if (Objects.isNull(dto.getName()) || dto.getName().trim().isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El nombre de la tarea es obligatorio."),
                    HttpStatus.BAD_REQUEST
            );
        }
        
        // Validar que el proyecto existe y está activo
        Project project = projectRepository.findById(dto.getProjectId()).orElse(null);
        if (Objects.isNull(project)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El proyecto especificado no existe."),
                    HttpStatus.NOT_FOUND
            );
        }
        
        if (!project.getStatus()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No se pueden crear tareas en un proyecto inactivo."),
                    HttpStatus.BAD_REQUEST
            );
        }
        
        // Verificar si ya existe una tarea con el mismo nombre en este proyecto
        Task existingTask = taskRepository.findByNameAndProject(dto.getName().trim(), dto.getProjectId());
        if (!Objects.isNull(existingTask)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "Ya existe una tarea con ese nombre en este proyecto."),
                    HttpStatus.BAD_REQUEST
            );
        }
        
        // Validar que la categoría existe y está activa
        Category category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
        if (Objects.isNull(category)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "La categoría especificada no existe."),
                    HttpStatus.NOT_FOUND
            );
        }
        
        if (!category.getStatus()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No se pueden crear tareas con una categoría inactiva."),
                    HttpStatus.BAD_REQUEST
            );
        }
        
        // Validar que el usuario asignado existe y está activo (obligatorio)
        User user = userRepository.findById(dto.getUserId()).orElse(null);
        if (Objects.isNull(user)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El usuario asignado especificado no existe."),
                    HttpStatus.NOT_FOUND
            );
        }
        
        if (!user.getStatus()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No se pueden asignar tareas a un usuario inactivo."),
                    HttpStatus.BAD_REQUEST
            );
        }
        
        // Crear nueva tarea
        Task task = new Task();
        task.setName(dto.getName().trim());
        task.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : null);
        task.setStatus(dto.getStatus() != null ? dto.getStatus() : true);
        task.setCategory(category);
        task.setProject(project);
        task.setUser(user);
        
        taskRepository.save(task);
        
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Tarea creada correctamente en el proyecto '" + project.getName() + "'."),
                HttpStatus.OK
        );
    }
    
    @Transactional(readOnly = true)
    public ResponseEntity<Object> getTasksByProject(GetTasksByProjectDto dto) {
        // Validar que el proyecto existe
        if (!projectRepository.existsById(dto.getProjectId())) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El proyecto no existe"),
                    HttpStatus.NOT_FOUND
            );
        }
        
        List<GetTasksDto> tasksInProject = taskRepository.findTasksByProject(dto.getProjectId())
                .stream()
                .map(this::convertToGetTasksDto)
                .collect(Collectors.toList());
        
        return new ResponseEntity<>(
                new ApiResponse<>(tasksInProject, TypesResponse.SUCCESS, "Tareas del proyecto obtenidas correctamente"),
                HttpStatus.OK
        );
    }
    
    @Transactional(readOnly = true)
    public ResponseEntity<Object> getTasksByCategory(GetTasksByCategoryDto dto) {
        // Validar que la categoría existe
        if (!categoryRepository.existsById(dto.getCategoryId())) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "La categoría no existe"),
                    HttpStatus.NOT_FOUND
            );
        }
        
        List<GetTasksDto> tasksByCategory = taskRepository.findTasksByCategory(dto.getCategoryId())
                .stream()
                .map(this::convertToGetTasksDto)
                .collect(Collectors.toList());
        
        return new ResponseEntity<>(
                new ApiResponse<>(tasksByCategory, TypesResponse.SUCCESS, "Tareas de la categoría obtenidas correctamente"),
                HttpStatus.OK
        );
    }
    
    @Transactional(readOnly = true)
    public ResponseEntity<Object> getTasksByUser(GetTasksByUserDto dto) {
        // Validar que el usuario existe
        if (!userRepository.existsById(dto.getUserId())) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El usuario no existe"),
                    HttpStatus.NOT_FOUND
            );
        }
        
        List<GetTasksDto> tasksByUser = taskRepository.findTasksByUser(dto.getUserId())
                .stream()
                .map(this::convertToGetTasksDto)
                .collect(Collectors.toList());
        
        return new ResponseEntity<>(
                new ApiResponse<>(tasksByUser, TypesResponse.SUCCESS, "Tareas asignadas al usuario obtenidas correctamente"),
                HttpStatus.OK
        );
    }
    
    @Transactional(readOnly = true)
    public ResponseEntity<Object> getTaskById(Long taskId) {
        Task task = taskRepository.findById(taskId).orElse(null);
        
        if (Objects.isNull(task)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No se encontró la tarea con ID: " + taskId),
                    HttpStatus.NOT_FOUND
            );
        }
        
        GetTasksDto taskDto = convertToGetTasksDto(task);
        
        return new ResponseEntity<>(
                new ApiResponse<>(taskDto, TypesResponse.SUCCESS, "Tarea obtenida correctamente"),
                HttpStatus.OK
        );
    }
    
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> updateTask(UpdateTaskDto dto) {
        // Buscar la tarea por ID
        Task task = taskRepository.findById(dto.getTaskId()).orElse(null);
        
        if (Objects.isNull(task)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No se encontró la tarea con ID: " + dto.getTaskId()),
                    HttpStatus.NOT_FOUND
            );
        }
        
        // Validaciones adicionales
        if (Objects.isNull(dto.getName()) || dto.getName().trim().isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El nombre de la tarea es obligatorio."),
                    HttpStatus.BAD_REQUEST
            );
        }
        
        // Verificar si ya existe otra tarea con el mismo nombre en el mismo proyecto (excluyendo la actual)
        Task existingTask = taskRepository.findByNameAndProjectAndTaskIdNot(dto.getName(), task.getProject().getProjectId(), dto.getTaskId());
        if (!Objects.isNull(existingTask)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "Ya existe una tarea con ese nombre en este proyecto."),
                    HttpStatus.BAD_REQUEST
            );
        }
        
        // Validar que la categoría existe
        Category category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
        if (Objects.isNull(category)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "La categoría especificada no existe."),
                    HttpStatus.NOT_FOUND
            );
        }
        
        // Validar que el usuario asignado existe y está activo (obligatorio)
        User user = userRepository.findById(dto.getUserId()).orElse(null);
        if (Objects.isNull(user)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El usuario asignado especificado no existe."),
                    HttpStatus.NOT_FOUND
            );
        }
        
        if (!user.getStatus()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No se pueden asignar tareas a un usuario inactivo."),
                    HttpStatus.BAD_REQUEST
            );
        }
        
        // Actualizar los campos
        task.setName(dto.getName().trim());
        task.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : null);
        task.setCategory(category);
        task.setUser(user);
        
        taskRepository.save(task);
        
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Tarea actualizada correctamente."),
                HttpStatus.OK
        );
    }
    
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> changeTaskStatus(ChangeStatusTaskDto dto) {
        Task task = taskRepository.findById(dto.getTaskId()).orElse(null);
        
        if (Objects.isNull(task)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No existe la tarea."),
                    HttpStatus.NOT_FOUND
            );
        }
        
        task.setStatus(!task.getStatus());
        taskRepository.save(task);
        
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Estado de la tarea actualizado correctamente"),
                HttpStatus.OK
        );
    }
    
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> deleteTask(Long taskId) {
        Task task = taskRepository.findById(taskId).orElse(null);
        
        if (Objects.isNull(task)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No existe la tarea."),
                    HttpStatus.NOT_FOUND
            );
        }
        
        taskRepository.delete(task);
        
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Tarea eliminada correctamente"),
                HttpStatus.OK
        );
    }
    
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> updateTaskCategory(UpdateTaskCategoryDto dto) {
        // Buscar la tarea por ID
        Task task = taskRepository.findById(dto.getTaskId()).orElse(null);
        
        if (Objects.isNull(task)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No se encontró la tarea con ID: " + dto.getTaskId()),
                    HttpStatus.NOT_FOUND
            );
        }
        
        // Buscar la categoría por ID
        Category category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
        
        if (Objects.isNull(category)) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "No se encontró la categoría con ID: " + dto.getCategoryId()),
                    HttpStatus.NOT_FOUND
            );
        }
        
        // Actualizar solo la categoría
        task.setCategory(category);
        taskRepository.save(task);
        
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Categoría de la tarea actualizada correctamente."),
                HttpStatus.OK
        );
    }
    
    private GetTasksDto convertToGetTasksDto(Task task) {
        return new GetTasksDto(
                task.getTaskId(),
                task.getName(),
                task.getDescription(),
                task.getStatus(),
                task.getCategory() != null ? task.getCategory().getName() : null,
                task.getCategory() != null ? task.getCategory().getCategoryId() : null,
                task.getProject() != null ? task.getProject().getName() : null,
                task.getProject() != null ? task.getProject().getProjectId() : null,
                task.getUser() != null ? task.getUser().getName() : null,
                task.getUser() != null ? task.getUser().getUserId() : null
        );
    }
}
