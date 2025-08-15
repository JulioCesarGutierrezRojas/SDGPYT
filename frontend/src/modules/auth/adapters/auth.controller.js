import { handleRequest } from "../../../config/http-client.gateway.js";
import AxiosClient from "../../../config/axios.js";

/**
 * Servicio para manejar la autenticación de usuarios
 * Usa Axios directamente para evitar que el interceptor muestre alertas automáticas
 */
export const login = async (email, password) => {
    try {
        const response = await handleRequest('post', '/auth/login', { email, password })

        if (response.type !== 'SUCCESS' || response.status === 'ERROR')
            throw new Error(response.text)

        const { token, id, fullName, roles } = response.result;
        
        // Extract role strings from the backend format
        const roleStrings = roles.map(roleObj => roleObj.role);
        
        // Guardar información en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', fullName);
        localStorage.setItem('userId', id);
        localStorage.setItem('roles', JSON.stringify(roleStrings));

        return response;
    } catch (error) {
        throw new Error(error.message)
    }
};

/**
 * Registrar un nuevo usuario
 */
export const register = async (name, lastname, email, phoneNumber, password) => {
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
 * Enviar correo de recuperación de contraseña
 */
export const sendPasswordRecoveryEmail = async (email) => {
    try {
        const response = await handleRequest('post', '/auth/send-email', { email });

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Validar token de recuperación
 */
export const validateRecoveryToken = async (token) => {
    try {
        const response = await handleRequest('post', '/auth/validate-recovery-token', { token });

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Restablecer contraseña
 */
export const resetPassword = async (email, newPassword, confirmPassword) => {
    try {
        const response = await handleRequest('post', '/auth/reset-password', {
            email,
            newPassword,
            confirmPassword
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
 * Cerrar sesión
 */
export const logout = async () => {
    try {
        const response = await handleRequest('post', '/auth/logout', {})

        // Nota: No lanzamos error si falla el logout del servidor,
        // ya que siempre queremos limpiar el estado local
        if (response.type === 'SUCCESS') {
            console.log('✅ Token invalidado correctamente en el servidor');
        } else {
            console.warn('⚠️ No se pudo invalidar el token en el servidor, pero se procede con el logout local');
        }

        return response
    } catch (e) {
        console.warn('⚠️ Error al comunicarse con el servidor para logout:', e.message);
        // Retornamos un objeto válido para que continúe el logout local
        return { type: 'WARNING', text: 'Logout local realizado' };
    }
};
