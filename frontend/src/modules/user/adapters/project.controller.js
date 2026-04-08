import { handleRequest } from "../../../config/http-client.gateway.js";

/**
 * Obtener proyectos asignados al usuario actual
 */
export const getUserProjects = async () => {
    try {
        const response = await handleRequest('get', '/projects/user-projects');

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Crear un nuevo proyecto (solo para usuarios con rol de administrador de proyecto)
 */
export const createProject = async (name, abbreviation, description, adminUserId = null) => {
    try {
        const requestBody = {
            name,
            abbreviation,
            description,
            status: true
        };
        
        // Solo agregar adminUserId si se proporciona
        if (adminUserId) {
            requestBody.adminUserId = adminUserId;
        }
        
        const response = await handleRequest('post', '/projects/create', requestBody);

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Actualizar un proyecto (solo para administradores del proyecto)
 */
export const updateProject = async (id, name, abbreviation, description, adminUserId = null) => {
    try {
        const requestBody = {
            id,
            name,
            abbreviation,
            description
        };
        
        // Solo agregar adminUserId si se proporciona
        if (adminUserId !== null) {
            requestBody.adminUserId = adminUserId;
        }
        
        const response = await handleRequest('put', '/projects/update', requestBody);

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Obtener proyecto por ID
 */
export const getProjectById = async (projectId) => {
    try {
        const response = await handleRequest('post', '/projects/by-id', { projectId });

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Cambiar el estado de un proyecto (habilitar/deshabilitar)
 * Solo para administradores del proyecto
 */
export const changeProjectStatus = async (id) => {
    try {
        const response = await handleRequest('patch', '/projects/changestatus', { id });

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};
