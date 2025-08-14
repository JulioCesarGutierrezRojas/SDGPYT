import { handleRequest } from "../../../config/http-client.gateway.js";

/**
 * Obtener todos los usuarios
 */
export const getAllUsers = async () => {
    try {
        const response = await handleRequest('get', '/users/allUsers');

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Obtener un usuario por ID
 */
export const getUserById = async (id) => {
    try {
        const response = await handleRequest('get', '/users/', { id });

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Crear un nuevo usuario
 */
export const createUser = async (name, lastname, email, phoneNumber, password) => {
    try {
        const response = await handleRequest('post', '/users/', {
            name,
            lastname,
            email,
            phoneNumber,
            password
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
 * Actualizar un usuario
 */
export const updateUser = async (id, name, lastname, email, phoneNumber, password) => {
    try {
        const response = await handleRequest('put', '/users/', {
            id,
            name,
            lastname,
            email,
            phoneNumber,
            password
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
 * Cambiar el estado de un usuario (habilitar/deshabilitar)
 */
export const changeUserStatus = async (id) => {
    try {
        const response = await handleRequest('patch', '/users/', { id });

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};
