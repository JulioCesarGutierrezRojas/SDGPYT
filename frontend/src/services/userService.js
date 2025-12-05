import { handleRequest } from '../config/http-client.gateway';

export const userService = {
  async getUsersByProject(projectId) {
    return await handleRequest('post', '/users/byProject', { projectId });
  },

  async getAllUsers() {
    return await handleRequest('get', '/users/allUsers');
  },

  async getPersonalProfile() {
    return await handleRequest('get', '/users/me');
  },

  async updatePersonalProfile(updateData) {
    return await handleRequest('put', '/users/me', updateData);
  },

  async getUsersList(page = 0, size = 10, search = '') {
    let endpoint = `/users/list?page=${page}&size=${size}`;
    if (search && search.trim() !== '') {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }
    return await handleRequest('get', endpoint);
  },

  async changeUserStatus(userId) {
    return await handleRequest('patch', '/users/', { id: userId });
  }
};
