// =============================================================================
// API SERVICE LAYER
// =============================================================================
// This module handles all API communication with the backend
// Provides a centralized way to manage API calls, authentication, and error handling

import config from '../config/api'

class ApiService {
  constructor() {
    this.baseURL = config.API_BASE_URL
    this.token = localStorage.getItem('vault_token')
  }

  // Set authentication token
  setToken(token) {
    this.token = token
    if (token) {
      localStorage.setItem('vault_token', token)
    } else {
      localStorage.removeItem('vault_token')
    }
  }

  // Get authentication token
  getToken() {
    return this.token || localStorage.getItem('vault_token')
  }

  // Make HTTP request with error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getToken()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Authentication endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData) {
    console.log('API Service: Register called with userData:', userData)
    
    const requestData = {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      password: userData.password,
      role: 'admin' // Admin panel users are always admin role
    }
    
    console.log('API Service: Sending request data:', requestData)
    console.log('API Service: API Base URL:', this.baseURL)
    
    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(requestData),
      })
      console.log('API Service: Registration response:', response)
      return response
    } catch (error) {
      console.error('API Service: Registration request failed:', error)
      throw error
    }
  }

  async getMe() {
    return this.request('/auth/me', {
      method: 'GET',
    })
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    })
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(token, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    })
  }

  async verifyEmail(token) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
  }

  // User management endpoints
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/admin/users${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    })
  }

  async createAdminUser(userData) {
    return this.request('/admin/users/create-admin', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getUserById(userId) {
    return this.request(`/users/${userId}`, {
      method: 'GET',
    })
  }

  async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(userId) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    })
  }

  // File management endpoints
  async getFiles(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/files${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    })
  }

  async getFolders(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/files/folders${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    })
  }

  // Admin-wide lists
  async getAdminFolders(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/admin/folders${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    })
  }

  async getAdminFiles(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/admin/files${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    })
  }

  async getFileById(fileId) {
    return this.request(`/files/${fileId}`, {
      method: 'GET',
    })
  }

  async deleteFile(fileId) {
    return this.request(`/files/${fileId}`, {
      method: 'DELETE',
    })
  }

  // Analytics endpoints
  async getDashboardStats() {
    return this.request('/admin/dashboard', {
      method: 'GET',
    })
  }

  async getAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/admin/analytics${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    })
  }

  // Recipients endpoints (Admin)
  async getRecipients(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/admin/recipients${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    })
  }

  async getRecipientById(recipientId) {
    return this.request(`/admin/recipients/${recipientId}`, {
      method: 'GET',
    })
  }

  async createRecipient(recipientData) {
    return this.request('/admin/recipients', {
      method: 'POST',
      body: JSON.stringify(recipientData),
    })
  }

  async updateRecipient(recipientId, recipientData) {
    return this.request(`/admin/recipients/${recipientId}`, {
      method: 'PUT',
      body: JSON.stringify(recipientData),
    })
  }

  async deleteRecipient(recipientId) {
    return this.request(`/admin/recipients/${recipientId}`, {
      method: 'DELETE',
    })
  }
}

// Create and export a singleton instance
const apiService = new ApiService()
export default apiService
