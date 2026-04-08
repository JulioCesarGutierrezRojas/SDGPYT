import { handleRequest } from "../../../config/http-client.gateway.js";

/**
 * Enviar invitaciones al proyecto por correo electrónico
 * @param {number} projectId - ID del proyecto
 * @param {string[]} emails - Array de correos electrónicos a invitar
 * @returns {Promise<Object>} Respuesta de la API
 */
export const sendProjectInvitations = async (projectId, emails) => {
    try {
        const response = await handleRequest('post', '/projects/send-invitations', {
            projectId,
            emails
        });

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};
