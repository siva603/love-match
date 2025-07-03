import { mockAuthService } from './mockAuth';

// User interface removed - using plain JavaScript objects

export const userService = {

  // Authentication (using mock service for demo)
  async login(email, password) {
    return await mockAuthService.login(email, password);
  },

  async register(userData) {
    return await mockAuthService.register(userData);
  },

  // User management (using mock service for demo)
  async getAllUsers() {
    return await mockAuthService.getAllUsers();
  },

  async getUserById(id) {
    return await mockAuthService.getUserById(id);
  },

  async getMaleUsers() {
    return await mockAuthService.getUsersByGender('male');
  },

  async getFemaleUsers() {
    return await mockAuthService.getUsersByGender('female');
  },

  async getBestMatches(userId, limit = 10) {
    return await mockAuthService.getBestMatches(userId, limit);
  },

  async deleteUser(userId) {
    await mockAuthService.deleteUser(userId);
  },

  // Utility function to get profile picture based on gender
  
}