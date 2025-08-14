import { handleRequest } from "../../../config/http-client.gateway.js";

/**
 * Obtener categorías activas
 */
export const getActiveCategories = async () => {
    try {
        const response = await handleRequest('get', '/categories/active');

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Obtener categorías por proyecto
 */
export const getCategoriesByProject = async (projectId) => {
    try {
        const response = await handleRequest('post', '/categories/by-project', {
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
 * Crear una nueva categoría
 */
export const createCategory = async (name, description, projectId) => {
    try {
        const response = await handleRequest('post', '/categories/', {
            name,
            description,
            projectId,
            status: true
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
 * Actualizar una categoría
 */
export const updateCategory = async (categoryId, name, description) => {
    try {
        const response = await handleRequest('put', '/categories/', {
            categoryId,
            name,
            description
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
 * Cambiar el estado de una categoría (habilitar/deshabilitar)
 */
export const changeCategoryStatus = async (categoryId) => {
    try {
        const response = await handleRequest('patch', '/categories/', { 
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
