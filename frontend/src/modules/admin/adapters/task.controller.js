import { handleRequest } from "../../../config/http-client.gateway.js";

/**
 * Obtener tareas por proyecto
 */
export const getTasksByProject = async (projectId) => {
    try {
        const response = await handleRequest('post', '/tasks/by-project', {
            projectId: projectId
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
 * Obtener tareas por categoría
 */
export const getTasksByCategory = async (categoryId) => {
    try {
        const response = await handleRequest('post', '/tasks/by-category', {
            categoryId: categoryId
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
 * Obtener tarea por ID
 */
export const getTaskById = async (taskId) => {
    try {
        const response = await handleRequest('get', `/tasks/${taskId}`);

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Crear una nueva tarea
 */
export const createTask = async (name, description, categoryId, projectId, userId) => {
    try {
        const response = await handleRequest('post', '/tasks/', {
            name,
            description,
            status: true,
            categoryId,
            projectId,
            userId
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
 * Actualizar una tarea
 */
export const updateTask = async (taskId, name, description, categoryId, userId) => {
    try {
        const response = await handleRequest('put', '/tasks/', {
            taskId,
            name,
            description,
            categoryId,
            userId
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
 * Cambiar el estado de una tarea (habilitar/deshabilitar)
 */
export const changeTaskStatus = async (taskId) => {
    try {
        const response = await handleRequest('patch', '/tasks/', { 
            taskId 
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
 * Actualizar solo la categoría de una tarea
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

/**
 * Eliminar una tarea
 */
export const deleteTask = async (taskId) => {
    try {
        const response = await handleRequest('delete', `/tasks/${taskId}`);

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};
