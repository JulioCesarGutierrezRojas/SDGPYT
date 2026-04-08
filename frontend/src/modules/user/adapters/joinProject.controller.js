import { handleRequest } from "../../../config/http-client.gateway.js";

/**
 * Aceptar invitación al proyecto
 * @param {number} projectId - ID del proyecto a unirse
 * @returns {Promise<Object>} Respuesta de la API
 */
export const acceptProjectInvitation = async (projectId) => {
    try {
        const response = await handleRequest('post', '/projects/accept-invitation', {
            projectId
        });

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};
