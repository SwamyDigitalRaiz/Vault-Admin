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

    console.log('🌐 [API Service] Making request:', {
      method: options.method || 'GET',
      url,
      hasToken: !!token,
      endpoint
    })

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
      
      console.log('🌐 [API Service] Response status:', response.status, response.statusText)
      
      // Check if response has content before trying to parse JSON
      const contentType = response.headers.get('content-type')
      let data
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        // If not JSON, read as text
        const text = await response.text()
        console.error('🌐 [API Service] Non-JSON response:', text)
        throw new Error(`Expected JSON but got: ${contentType || 'unknown type'}. Response: ${text.substring(0, 200)}`)
      }

      console.log('🌐 [API Service] Response data:', data)

      if (!response.ok) {
        const errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`
        console.error('🌐 [API Service] Request failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          data
        })
        throw new Error(errorMessage)
      }

      return data
    } catch (error) {
      console.error('🌐 [API Service] Request error:', {
        url,
        endpoint,
        method: options.method || 'GET',
        error: error.message,
        stack: error.stack
      })
      throw error
    }
  }

  // Authentication endpoints
  // Admin login - uses separate admin endpoint
  async login(email, password) {
    return this.request('/admin/login', {
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

  // System Settings APIs
  async getSystemSettings() {
    return this.request('/admin/settings', {
      method: 'GET',
    })
  }

  async updateSystemSettings(settingsData) {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    })
  }

  async getUserById(userId) {
    return this.request(`/admin/users/${userId}`, {
      method: 'GET',
    })
  }

  async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async updateUserStorageLimit(userId, storageLimit) {
    return this.request(`/admin/users/${userId}/storage-limit`, {
      method: 'PUT',
      body: JSON.stringify({ storageLimit }),
    })
  }

  async deleteUser(userId) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    })
  }

  // Staff management endpoints (separate from users)
  async getStaff(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/admin/staff${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    })
  }

  async getStaffById(staffId) {
    return this.request(`/admin/staff/${staffId}`, {
      method: 'GET',
    })
  }

  async createStaff(staffData) {
    return this.request('/admin/staff', {
      method: 'POST',
      body: JSON.stringify(staffData),
    })
  }

  async updateStaff(staffId, staffData) {
    return this.request(`/admin/staff/${staffId}`, {
      method: 'PUT',
      body: JSON.stringify(staffData),
    })
  }

  async deleteStaff(staffId) {
    return this.request(`/admin/staff/${staffId}`, {
      method: 'DELETE',
    })
  }

  async toggleStaffStatus(staffId) {
    return this.request(`/admin/staff/${staffId}/toggle-status`, {
      method: 'PATCH',
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

  // Schedule endpoints (Admin)
  async getSchedules(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/admin/schedules${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    })
  }

  async getScheduleByUserId(userId) {
    return this.request(`/admin/schedules/user/${userId}`, {
      method: 'GET',
    })
  }

  // Schedule endpoints (User - can be used by admin to manage user schedules)
  async getUserSchedule(userId) {
    // Note: This would require admin to impersonate user or use different endpoint
    // For now, we'll use the admin endpoint
    return this.getScheduleByUserId(userId)
  }

  async updateScheduleConfig(scheduleData) {
    return this.request('/schedules', {
      method: 'PUT',
      body: JSON.stringify(scheduleData),
    })
  }

  async addScheduleItem(itemData) {
    return this.request('/schedules/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    })
  }

  async updateScheduleItem(itemId, itemData) {
    return this.request(`/schedules/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    })
  }

  async removeScheduleItem(itemId) {
    return this.request(`/schedules/items/${itemId}`, {
      method: 'DELETE',
    })
  }

  async executeSchedule() {
    return this.request('/schedules/execute', {
      method: 'POST',
    })
  }

  // Package management endpoints (Admin)
  async getPackages(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/admin/packages${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    })
  }

  async getPackageById(packageId) {
    return this.request(`/admin/packages/${packageId}`, {
      method: 'GET',
    })
  }

  async getPackageStats() {
    return this.request('/admin/packages/stats', {
      method: 'GET',
    })
  }

  async createPackage(packageData) {
    return this.request('/admin/packages', {
      method: 'POST',
      body: JSON.stringify(packageData),
    })
  }

  async updatePackage(packageId, packageData) {
    return this.request(`/admin/packages/${packageId}`, {
      method: 'PUT',
      body: JSON.stringify(packageData),
    })
  }

  async deletePackage(packageId) {
    return this.request(`/admin/packages/${packageId}`, {
      method: 'DELETE',
    })
  }

  // Subscription management endpoints (Admin)
  async getSubscriptions(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/admin/subscriptions${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    })
  }

  async getSubscriptionById(subscriptionId) {
    return this.request(`/admin/subscriptions/${subscriptionId}`, {
      method: 'GET',
    })
  }

  async getSubscriptionStats() {
    return this.request('/admin/subscriptions/stats', {
      method: 'GET',
    })
  }

  // Referral management endpoints (Admin)
  async getReferrals(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/admin/referrals${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    })
  }

  async getReferralById(userId) {
    return this.request(`/admin/referrals/${userId}`, {
      method: 'GET',
    })
  }

  async getReferralStats() {
    return this.request('/admin/referrals/stats', {
      method: 'GET',
    })
  }

  // Referral settings endpoints (Admin)
  async getReferralSettings() {
    return this.request('/admin/referrals/settings', {
      method: 'GET',
    })
  }

  async updateReferralSettings(settings) {
    return this.request('/admin/referrals/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
  }

  async createSubscription(subscriptionData) {
    return this.request('/admin/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    })
  }

  async updateSubscription(subscriptionId, subscriptionData) {
    return this.request(`/admin/subscriptions/${subscriptionId}`, {
      method: 'PUT',
      body: JSON.stringify(subscriptionData),
    })
  }

  async deleteSubscription(subscriptionId) {
    return this.request(`/admin/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
    })
  }

  // Role management endpoints (Admin)
  async getRoles() {
    return this.request('/admin/roles', {
      method: 'GET',
    })
  }

  async getRoleById(roleId) {
    return this.request(`/admin/roles/${roleId}`, {
      method: 'GET',
    })
  }

  async createRole(roleData) {
    return this.request('/admin/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    })
  }

  async updateRole(roleId, roleData) {
    return this.request(`/admin/roles/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    })
  }

  async deleteRole(roleId) {
    try {
      return await this.request(`/admin/roles/${roleId}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('[API Service] Delete role error:', error)
      throw error
    }
  }

  // Support ticket management endpoints (Admin)
  async getSupportTickets(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/admin/support/tickets${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    })
  }

  async getSupportTicketById(ticketId) {
    return this.request(`/admin/support/tickets/${ticketId}`, {
      method: 'GET',
    })
  }

  async updateSupportTicket(ticketId, ticketData) {
    return this.request(`/admin/support/tickets/${ticketId}`, {
      method: 'PUT',
      body: JSON.stringify(ticketData),
    })
  }

  async addSupportTicketMessage(ticketId, messageData) {
    return this.request(`/admin/support/tickets/${ticketId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    })
  }

  async getSupportStats() {
    return this.request('/admin/support/stats', {
      method: 'GET',
    })
  }
}

// Create and export a singleton instance
const apiService = new ApiService()
export default apiService
