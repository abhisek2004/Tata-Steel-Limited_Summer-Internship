# JWT Authentication Guide

This document provides information on how to use JWT (JSON Web Token) authentication with the Tata Steel Learning Management System API.

## Overview

The system now supports two authentication methods:

1. **NextAuth.js** - Used for web application users
2. **JWT Token** - Used for API access

JWT authentication allows you to access API endpoints programmatically without using browser sessions.

## Getting a JWT Token

To obtain a JWT token, make a POST request to the login endpoint:

```
POST /api/auth/login
```

Request body:

```json
{
  "email": "your.email@example.com",
  "password": "your_password"
}
```

Response (success):

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f7e8a9b9e5e8a9b9e5e8a9",
    "name": "User Name",
    "email": "your.email@example.com",
    "role": "user"
  }
}
```

## Using the JWT Token

Once you have a token, include it in the `Authorization` header of your requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## API Endpoints

Here are some examples of API endpoints you can access with JWT authentication:

### Get Current User Profile

```
GET /api/auth/me
```

Response:

```json
{
  "id": "65f7e8a9b9e5e8a9b9e5e8a9",
  "name": "User Name",
  "email": "your.email@example.com",
  "role": "user",
  "department": "Engineering",
  "createdAt": "2023-03-17T12:34:56.789Z",
  "updatedAt": "2023-03-17T12:34:56.789Z"
}
```

### Get Analytics Data (Admin/Manager Only)

```
GET /api/reports?department=Engineering&period=month
```

Query parameters:
- `department` (optional): Filter by department
- `period` (optional): "week", "month", or "year"

Response (for admins/managers only):

```json
{
  "departmentStats": [...],
  "courseEngagementByCategory": [...],
  "timeSeriesData": [...]
}
```

## Token Expiration

JWT tokens expire after 24 hours. When a token expires, you'll need to request a new one by logging in again.

If you use an expired token, you'll receive a 401 Unauthorized response:

```json
{
  "error": "Invalid token"
}
```

## Role-Based Access Control

The API implements role-based access control:

- **Admin**: Full access to all endpoints
- **Manager**: Access to department-specific reports and user management
- **User**: Access to their own data and learning resources

Attempting to access endpoints without the required role will result in a 403 Forbidden response:

```json
{
  "error": "Admin access required"
}
```

## Security Best Practices

1. **Store tokens securely**: Never store tokens in localStorage or cookies without proper security measures
2. **Use HTTPS**: Always use HTTPS for API requests
3. **Validate tokens**: Always validate tokens on the server side
4. **Implement token refresh**: For long-running applications, implement token refresh mechanisms
5. **Revoke tokens**: Implement token revocation for logout or security breaches

## Example: API Request with JWT in JavaScript

```javascript
async function fetchUserProfile() {
  const token = localStorage.getItem('jwt_token'); // Get token from secure storage
  
  const response = await fetch('https://your-api.com/api/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (response.status === 401) {
    // Token expired or invalid, redirect to login
    window.location.href = '/login';
    return;
  }
  
  const data = await response.json();
  return data;
}
```

## Support

For any issues or questions about JWT authentication, please contact the development team.