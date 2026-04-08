import { handleRequest } from "../../../config/http-client.gateway.js";

/**
 * Obtener todos los registros de auditoría
 */
export const getAllAuditLogs = async () => {
    try {
        const response = await handleRequest('get', '/audit/logs');

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text);
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};
