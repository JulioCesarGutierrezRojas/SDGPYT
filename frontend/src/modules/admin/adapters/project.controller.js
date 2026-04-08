import { handleRequest } from "../../../config/http-client.gateway.js";

/**
 * Obtener todos los proyectos
 */
export const getAllProjects = async () => {
    try {
        const response = await handleRequest('get', '/projects/');

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Crear un nuevo proyecto
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
 * Actualizar un proyecto
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
