import { handleRequest } from "../../../config/http-client.gateway.js";

/**
 * Aceptar invitación como usuario no registrado (sin autenticación)
 * @param {number} projectId - ID del proyecto
 * @param {string} email - Correo electrónico del usuario
 * @returns {Promise<Object>} Respuesta de la API
 */
export const acceptProjectInvitationAsGuest = async (projectId, email) => {
    try {
        const response = await handleRequest('post', '/projects/accept-invitation-guest', {
            projectId,
            email
        });

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};
