import { handleRequest } from "../../../config/http-client.gateway.js";

/**
 * Obtener tareas asignadas al usuario actual
 */
export const getTasksByUser = async (userId) => {
    try {
        const response = await handleRequest('post', '/tasks/by-user', {
            userId: userId
        });

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Obtener tareas asignadas al usuario actual por proyecto
 * Filtra las tareas del usuario para mostrar solo las del proyecto especificado
 */
export const getTasksByUserAndProject = async (userId, projectId) => {
    try {
        const response = await getTasksByUser(userId);
        
        if (response.result && Array.isArray(response.result)) {
            // Filtrar las tareas por el proyecto especificado
            const filteredTasks = response.result.filter(task => 
                task.projectId === parseInt(projectId)
            );
            
            return {
                ...response,
                result: filteredTasks
            };
        }
        
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Actualizar solo la categoría de una tarea (para usuarios que pueden mover tareas)
 */
export const updateTaskCategory = async (taskId, categoryId) => {
    try {
        const response = await handleRequest('patch', '/tasks/category', {
            taskId,
            categoryId
        });

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};
