import { userService } from '../../../../services/userService';

export const profileController = {
  // Obtener perfil personal del usuario autenticado
  async getPersonalProfile() {
    try {
      const response = await userService.getPersonalProfile();
      return response;
    } catch (error) {
      console.error('Error al obtener perfil personal:', error);
      throw error;
    }
  }
};
