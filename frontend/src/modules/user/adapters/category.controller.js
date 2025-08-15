import { handleRequest } from "../../../config/http-client.gateway.js";

/**
 * Obtener categorías por proyecto (solo lectura para usuarios normales)
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
 * Crear una nueva categoría (solo para administradores de proyecto)
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
 * Actualizar una categoría (solo para administradores de proyecto)
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
 * Cambiar el estado de una categoría (solo para administradores de proyecto)
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
