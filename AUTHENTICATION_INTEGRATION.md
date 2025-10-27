# Authentication Integration Documentation

## Overview

This document describes the professional authentication integration between the Vault Admin frontend and the backend API. The integration provides secure, role-based authentication with proper error handling and user experience.

## Architecture

### Components

1. **API Service Layer** (`src/services/api.js`)
   - Centralized API communication
   - Token management
   - Error handling
   - Request/response transformation

2. **Authentication Context** (`src/contexts/AuthContext.jsx`)
   - State management for authentication
   - User session handling
   - Permission management
   - Real-time authentication status

3. **Authentication Components**
   - `LoginPage.jsx` - User login interface
   - `RegistrationPage.jsx` - User registration interface
   - `ForgotPasswordPage.jsx` - Password reset interface
   - `AuthGuard.jsx` - Route protection wrapper

4. **Configuration** (`src/config/api.js`)
   - API endpoint configuration
   - Environment variable management
   - Request timeout settings

## Features

### Authentication Flow

1. **Login Process**
   - Email/password validation
   - Backend authentication
   - JWT token storage
   - Automatic session restoration

2. **Registration Process**
   - Admin user creation
   - Email validation
   - Password strength requirements
   - Auto-login for admin users

3. **Password Reset**
   - Email-based reset flow
   - Secure token generation
   - User-friendly interface

4. **Session Management**
   - Automatic token refresh
   - Secure logout
   - Session persistence

### Security Features

- **JWT Token Authentication**
  - Secure token storage
  - Automatic token inclusion in requests
  - Token expiration handling

- **Role-Based Access Control**
  - Admin/super_admin roles
  - Permission-based UI rendering
  - Secure route protection

- **Input Validation**
  - Client-side validation
  - Server-side validation
  - XSS protection

- **Error Handling**
  - User-friendly error messages
  - Secure error logging
  - Graceful failure handling

## API Endpoints

### Authentication Endpoints

| Endpoint | Method | Description | Access |
|----------|--------|-------------|---------|
| `/api/auth/login` | POST | User login | Public |
| `/api/auth/register` | POST | User registration | Public/Private* |
| `/api/auth/logout` | POST | User logout | Private |
| `/api/auth/me` | GET | Get current user | Private |
| `/api/auth/forgot-password` | POST | Send reset email | Public |
| `/api/auth/reset-password` | POST | Reset password | Public |
| `/api/auth/verify-email` | POST | Verify email | Public |

*Registration for admin users requires existing admin authentication

### User Management Endpoints

| Endpoint | Method | Description | Access |
|----------|--------|-------------|---------|
| `/api/users` | GET | List users | Private |
| `/api/users/:id` | GET | Get user details | Private |
| `/api/users/:id` | PUT | Update user | Private |
| `/api/users/:id` | DELETE | Delete user | Private |

## Configuration

### Environment Variables

Create a `.env.local` file in the admin panel root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Application Configuration
VITE_APP_NAME=Vault Admin
VITE_APP_VERSION=1.0.0

# Development Configuration
VITE_DEBUG=true
VITE_LOG_LEVEL=info
```

### API Configuration

The API service is configured in `src/config/api.js`:

```javascript
const config = {
  API_BASE_URL: 'http://localhost:5000/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      // ... other endpoints
    }
  },
  TIMEOUTS: {
    DEFAULT: 10000,
    UPLOAD: 30000,
    DOWNLOAD: 60000
  }
}
```

## Usage

### Authentication Context

```javascript
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    hasPermission 
  } = useAuth()

  // Use authentication state
  if (isAuthenticated) {
    return <Dashboard user={user} />
  }
  
  return <LoginForm onLogin={login} />
}
```

### API Service Usage

```javascript
import apiService from '../services/api'

// Login user
const response = await apiService.login(email, password)

// Get current user
const user = await apiService.getMe()

// Update user profile
const updatedUser = await apiService.updateUser(userId, userData)
```

### Route Protection

```javascript
import AuthGuard from './components/AuthGuard'

function App() {
  return (
    <AuthProvider>
      <AuthGuard>
        <Dashboard />
      </AuthGuard>
    </AuthProvider>
  )
}
```

## Error Handling

### Client-Side Error Handling

```javascript
try {
  await login(email, password)
} catch (error) {
  // Handle authentication errors
  setError(error.message)
}
```

### API Error Responses

The API service automatically handles:
- Network errors
- HTTP status codes
- Authentication failures
- Validation errors

## Security Considerations

1. **Token Storage**
   - JWT tokens stored in localStorage
   - Automatic token cleanup on logout
   - Secure token transmission

2. **Input Sanitization**
   - All user inputs are validated
   - XSS protection implemented
   - SQL injection prevention

3. **Role-Based Access**
   - Admin-only features protected
   - Permission-based UI rendering
   - Secure route protection

## Testing

### Manual Testing Checklist

- [ ] User can register as admin
- [ ] User can login with valid credentials
- [ ] User cannot login with invalid credentials
- [ ] Session persists across browser refresh
- [ ] User can logout successfully
- [ ] Password reset flow works
- [ ] Role-based permissions work
- [ ] Error messages are user-friendly

### API Testing

Use the provided Postman collection to test API endpoints:

1. Import `Volt_API_Collection.postman_collection.json`
2. Set up environment variables
3. Test authentication flow
4. Verify user management endpoints

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured
   - Check API base URL configuration

2. **Authentication Failures**
   - Verify JWT secret configuration
   - Check token expiration
   - Validate user credentials

3. **Session Issues**
   - Clear localStorage
   - Check token validity
   - Verify API connectivity

### Debug Mode

Enable debug mode by setting `VITE_DEBUG=true` in environment variables. This will:
- Log API requests/responses
- Show detailed error messages
- Enable development tools

## Deployment

### Production Configuration

1. Update API base URL to production endpoint
2. Configure secure token storage
3. Enable HTTPS for all communications
4. Set up proper error monitoring

### Environment Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## Support

For issues or questions regarding the authentication integration:

1. Check this documentation
2. Review error logs
3. Test API endpoints directly
4. Contact development team

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Maintainer:** Vault Development Team
