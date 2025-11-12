import { handleRequest } from '../config/http-client.gateway';

export const userService = {
  // Obtener usuarios por proyecto
  async getUsersByProject(projectId) {
    return await handleRequest('post', '/users/byProject', { projectId });
  },

  // Obtener todos los usuarios
  async getAllUsers() {
    return await handleRequest('get', '/users/allUsers');
  },

  // Obtener perfil personal del usuario autenticado
  async getPersonalProfile() {
    return await handleRequest('get', '/users/me');
  }
};
