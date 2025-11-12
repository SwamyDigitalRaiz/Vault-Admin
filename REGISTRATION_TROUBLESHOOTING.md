# Registration Page Troubleshooting Guide

## 🚨 **Issue: Page Refreshes Instead of Proceeding**

When clicking "Create Account" button, the page refreshes instead of proceeding to the next screen.

## 🔍 **Debugging Steps**

### 1. **Check Browser Console**
Open browser developer tools (F12) and look for:
- Console errors
- Network request failures
- JavaScript errors

### 2. **Check Network Tab**
Look for:
- Failed API requests to `/auth/register`
- CORS errors
- 404/500 errors

### 3. **Verify Backend is Running**
Make sure the backend server is running:
```bash
cd backend
npm start
```

### 4. **Check API Configuration**
Verify the API base URL in `src/config/api.js`:
```javascript
API_BASE_URL: 'http://localhost:5000/api'
```

## 🛠️ **Common Issues & Solutions**

### **Issue 1: Backend Not Running**
**Symptoms:** Network error, connection refused
**Solution:** Start the backend server
```bash
cd backend
npm start
```

### **Issue 2: CORS Error**
**Symptoms:** CORS policy error in console
**Solution:** Check backend CORS configuration in `backend/server.js`

### **Issue 3: API Endpoint Not Found**
**Symptoms:** 404 error for `/auth/register`
**Solution:** Verify backend routes are properly configured

### **Issue 4: Form Validation Failing**
**Symptoms:** Form submits but validation fails
**Solution:** Check form validation logic in `RegistrationPage.jsx`

### **Issue 5: Authentication State Not Updating**
**Symptoms:** Registration succeeds but user not logged in
**Solution:** Check `AuthContext.jsx` register function

## 🔧 **Debug Tools Added**

### **Console Logging**
Added comprehensive logging to:
- `RegistrationPage.jsx` - Form submission
- `AuthContext.jsx` - Registration logic
- `api.js` - API calls

### **Debug Utilities**
Created `src/utils/debugRegistration.js` with:
- API connectivity tests
- Form submission tests
- Console error detection

## 📋 **Testing Checklist**

### **Before Testing:**
- [ ] Backend server is running
- [ ] API base URL is correct
- [ ] No console errors
- [ ] Browser console is open

### **During Testing:**
- [ ] Fill out registration form
- [ ] Click "Create Account" button
- [ ] Check console for logs
- [ ] Check network tab for API calls
- [ ] Verify success/error states

### **Expected Console Output:**
```
Form submitted with data: {firstName: "...", lastName: "...", email: "...", password: "..."}
Calling register function...
AuthContext: Starting registration with data: {...}
API Service: Register called with userData: {...}
API Service: Sending request data: {...}
API Service: Registration response: {...}
AuthContext: Registration successful, user: {...}
```

## 🚀 **Quick Fixes**

### **Fix 1: Restart Development Server**
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### **Fix 2: Clear Browser Cache**
- Hard refresh (Ctrl+Shift+R)
- Clear localStorage
- Check browser console

### **Fix 3: Check Backend Logs**
Look at backend console for:
- Registration attempts
- Validation errors
- Database errors

## 🔍 **Advanced Debugging**

### **Enable Debug Mode**
Set environment variable:
```env
VITE_DEBUG=true
```

### **Test API Directly**
Use browser console to test API:
```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPassword123',
    role: 'admin'
  })
})
.then(response => response.json())
.then(data => console.log(data))
```

### **Check Authentication State**
```javascript
// In browser console
console.log('User:', localStorage.getItem('vault_user'))
console.log('Token:', localStorage.getItem('vault_token'))
```

## 📞 **Support**

If the issue persists:
1. Check browser console for specific errors
2. Verify backend is running and accessible
3. Test API endpoints directly
4. Check network connectivity
5. Review this troubleshooting guide

## 🎯 **Expected Behavior**

**Successful Registration Flow:**
1. User fills form
2. Clicks "Create Account"
3. Form validation passes
4. API call to backend
5. Backend processes registration
6. Success response received
7. User logged in automatically (admin)
8. Redirected to dashboard

**Error Handling:**
1. Form validation errors → Show error message
2. API errors → Show error message
3. Network errors → Show error message
4. Success → Show success message

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Maintainer:** Vault Development Team
