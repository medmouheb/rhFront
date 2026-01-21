# HR Management System - Backend API Documentation

**Base URL:** `http://localhost:5000/api` (or your deployed backend URL)

**Version:** 1.0.0

**Authentication:** JWT tokens sent via HTTP-only cookies

---

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Candidates](#candidates)
4. [Hiring Requests](#hiring-requests)
5. [Interviews](#interviews)
6. [Notifications](#notifications)
7. [Vacant Positions](#vacant-positions)
8. [Common Response Formats](#common-response-formats)
9. [Error Handling](#error-handling)

---

## Authentication

### POST `/api/auth/login`

**Description:** Login user and receive authentication cookie

**Authentication Required:** No

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "role": "RH" | "Manager" | "CO" | "Directeur"
  },
  "message": "Login successful"
}
```

---

### POST `/api/auth/logout`

**Description:** Logout current user and clear authentication cookie

**Authentication Required:** No (but clears existing session)

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### GET `/api/auth/me`

**Description:** Get current authenticated user's information

**Authentication Required:** Yes

**Response (200 OK):**
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "role": "RH" | "Manager" | "CO" | "Directeur"
  }
}
```

---

## Users

**All user routes require authentication and RH role**

### POST `/api/users`

**Description:** Create a new user

**Role Required:** RH

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "role": "RH" | "Manager" | "CO" | "Directeur"
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "username": "string",
  "role": "string",
  "createdAt": "ISO 8601 date string"
}
```

---

### GET `/api/users`

**Description:** Get all users

**Role Required:** RH

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role

**Response (200 OK):**
```json
{
  "users": [
    {
      "id": "string",
      "username": "string",
      "role": "string",
      "createdAt": "ISO 8601 date string"
    }
  ],
  "total": "number",
  "page": "number",
  "totalPages": "number"
}
```

---

### GET `/api/users/:id`

**Description:** Get user by ID

**Role Required:** RH

**Response (200 OK):**
```json
{
  "id": "string",
  "username": "string",
  "role": "string",
  "createdAt": "ISO 8601 date string",
  "updatedAt": "ISO 8601 date string"
}
```

---

### PUT `/api/users/:id`

**Description:** Update user

**Role Required:** RH

**Request Body:**
```json
{
  "username": "string (optional)",
  "password": "string (optional)",
  "role": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "username": "string",
  "role": "string",
  "updatedAt": "ISO 8601 date string"
}
```

---

### DELETE `/api/users/:id`

**Description:** Delete user

**Role Required:** RH

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

---

## Candidates

**All candidate routes require authentication**

### POST `/api/candidates`

**Description:** Create a new candidate

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "position": "string",
  "status": "Applied" | "Screening" | "Interview" | "Offered" | "Hired" | "Rejected",
  "source": "string (optional)",
  "notes": "string (optional)"
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "position": "string",
  "status": "string",
  "source": "string",
  "notes": "string",
  "createdAt": "ISO 8601 date string"
}
```

---

### GET `/api/candidates`

**Description:** Get all candidates

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status
- `position` (optional): Filter by position
- `search` (optional): Search by name or email

**Response (200 OK):**
```json
{
  "candidates": [...],
  "total": "number",
  "page": "number",
  "totalPages": "number"
}
```

---

### GET `/api/candidates/:id`

**Description:** Get candidate by ID

**Response (200 OK):**
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "position": "string",
  "status": "string",
  "source": "string",
  "notes": "string",
  "cvUrl": "string (optional)",
  "documentsUrl": "string (optional)",
  "createdAt": "ISO 8601 date string",
  "updatedAt": "ISO 8601 date string"
}
```

---

### PUT `/api/candidates/:id`

**Description:** Update candidate

**Request Body:** (all fields optional)
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "position": "string",
  "status": "string",
  "source": "string",
  "notes": "string"
}
```

**Response (200 OK):** Updated candidate object

---

### DELETE `/api/candidates/:id`

**Description:** Delete candidate

**Response (200 OK):**
```json
{
  "message": "Candidate deleted successfully"
}
```

---

### GET `/api/candidates/:id/status-history`

**Description:** Get candidate's status change history

**Response (200 OK):**
```json
{
  "history": [
    {
      "status": "string",
      "changedAt": "ISO 8601 date string",
      "changedBy": "string (user ID)",
      "notes": "string (optional)"
    }
  ]
}
```

---

### POST `/api/candidates/:id/upload`

**Description:** Upload candidate documents (CV and/or additional documents)

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `cv`: File (optional, max 1 file)
- `documents`: File (optional, max 1 file)

**Response (200 OK):**
```json
{
  "cvUrl": "string (optional)",
  "documentsUrl": "string (optional)",
  "message": "Files uploaded successfully"
}
```

---

## Hiring Requests

**All hiring request routes require authentication**

### POST `/api/hiring-requests`

**Description:** Create a new hiring request

**Roles Allowed:** RH, Manager, Directeur

**Request Body:**
```json
{
  "position": "string",
  "department": "string",
  "numberOfPositions": "number",
  "description": "string",
  "requirements": "string",
  "priority": "Low" | "Medium" | "High" | "Urgent",
  "deadline": "ISO 8601 date string",
  "budget": "number (optional)",
  "status": "Draft" | "Pending" | "Approved" | "Rejected" | "Fulfilled"
}
```

**Response (201 Created):** Hiring request object

---

### GET `/api/hiring-requests`

**Description:** Get all hiring requests

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter by status
- `department`: Filter by department
- `priority`: Filter by priority

**Response (200 OK):**
```json
{
  "requests": [...],
  "total": "number",
  "page": "number",
  "totalPages": "number"
}
```

---

### GET `/api/hiring-requests/:id`

**Description:** Get hiring request by ID

**Response (200 OK):** Hiring request object

---

### PUT `/api/hiring-requests/:id`

**Description:** Update hiring request

**Roles Allowed:** RH, Manager, Directeur

**Request Body:** (fields to update)

**Response (200 OK):** Updated hiring request object

---

### DELETE `/api/hiring-requests/:id`

**Description:** Delete hiring request

**Roles Allowed:** RH, Manager, Directeur

**Response (200 OK):**
```json
{
  "message": "Hiring request deleted successfully"
}
```

---

## Interviews

**All interview routes require authentication**

### POST `/api/interviews`

**Description:** Schedule an interview

**Request Body:**
```json
{
  "candidateId": "string",
  "position": "string",
  "scheduledDate": "ISO 8601 date string",
  "interviewers": ["string (user IDs)"],
  "type": "Phone" | "Video" | "In-Person" | "Technical" | "HR",
  "location": "string (optional)",
  "notes": "string (optional)",
  "status": "Scheduled" | "Completed" | "Cancelled" | "Rescheduled"
}
```

**Response (201 Created):** Interview object

---

### GET `/api/interviews`

**Description:** Get all interviews

**Query Parameters:**
- `candidateId`: Filter by candidate
- `status`: Filter by status
- `date`: Filter by date
- `page`, `limit`: Pagination

**Response (200 OK):**
```json
{
  "interviews": [...],
  "total": "number",
  "page": "number",
  "totalPages": "number"
}
```

---

### GET `/api/interviews/:id`

**Description:** Get interview by ID

**Response (200 OK):** Interview object

---

### PUT `/api/interviews/:id`

**Description:** Update interview

**Request Body:** (fields to update)

**Response (200 OK):** Updated interview object

---

### DELETE `/api/interviews/:id`

**Description:** Delete interview

**Response (200 OK):**
```json
{
  "message": "Interview deleted successfully"
}
```

---

## Notifications

**All notification routes require authentication**

### POST `/api/notifications`

**Description:** Create a notification

**Request Body:**
```json
{
  "userId": "string",
  "title": "string",
  "message": "string",
  "type": "Info" | "Success" | "Warning" | "Error",
  "link": "string (optional)"
}
```

**Response (201 Created):** Notification object

---

### GET `/api/notifications/me`

**Description:** Get current user's notifications

**Query Parameters:**
- `unreadOnly`: boolean (optional)
- `page`, `limit`: Pagination

**Response (200 OK):**
```json
{
  "notifications": [
    {
      "id": "string",
      "title": "string",
      "message": "string",
      "type": "string",
      "isRead": "boolean",
      "link": "string (optional)",
      "createdAt": "ISO 8601 date string"
    }
  ],
  "total": "number",
  "unreadCount": "number"
}
```

---

### PUT `/api/notifications/:id/read`

**Description:** Mark notification as read

**Response (200 OK):**
```json
{
  "message": "Notification marked as read"
}
```

---

### PUT `/api/notifications/read-all`

**Description:** Mark all notifications as read

**Response (200 OK):**
```json
{
  "message": "All notifications marked as read"
}
```

---

### DELETE `/api/notifications/:id`

**Description:** Delete notification

**Response (200 OK):**
```json
{
  "message": "Notification deleted successfully"
}
```

---

## Vacant Positions

### GET `/api/vacant-positions`

**Description:** Get all vacant positions

**Authentication Required:** No (public endpoint)

**Query Parameters:**
- `department`: Filter by department
- `type`: Filter by position type
- `page`, `limit`: Pagination

**Response (200 OK):**
```json
{
  "positions": [
    {
      "id": "string",
      "title": "string",
      "department": "string",
      "description": "string",
      "requirements": "string",
      "location": "string",
      "type": "Full-Time" | "Part-Time" | "Contract" | "Internship",
      "salaryRange": "string (optional)",
      "postedDate": "ISO 8601 date string",
      "deadline": "ISO 8601 date string",
      "isActive": "boolean"
    }
  ],
  "total": "number"
}
```

---

## Common Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "string (optional)"
}
```

### Pagination Metadata

```json
{
  "data": [...],
  "total": "number",
  "page": "number",
  "limit": "number",
  "totalPages": "number"
}
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "message": "string",
    "code": "string (optional)",
    "details": { ... } (optional)
  }
}
```

### Common HTTP Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Authentication required or invalid credentials
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **422 Unprocessable Entity** - Validation failed
- **500 Internal Server Error** - Server error

### Authentication Errors

**401 Unauthorized:**
```json
{
  "error": "Unauthorized - No token provided"
}
```

**403 Forbidden:**
```json
{
  "error": "Access denied - Insufficient permissions"
}
```

---

## Authentication Flow

1. **Login:** POST to `/api/auth/login` with credentials
2. **Session:** JWT token is stored in HTTP-only cookie (handled automatically)
3. **Authenticated Requests:** Cookie is sent automatically with each request
4. **Logout:** POST to `/api/auth/logout` to clear session

---

## Role-Based Access Control (RBAC)

### Roles

- **RH (Human Resources):** Full access to user management, candidates, hiring requests
- **Manager:** Can create/manage hiring requests, view candidates
- **CO (Chief Officer):** Limited access, primarily viewing
- **Directeur:** Senior management access

### Permission Matrix

| Resource | RH | Manager | CO | Directeur |
|----------|----|---------|----|-----------|
| Users | Full | - | - | - |
| Candidates | Full | View/Create | View | View |
| Hiring Requests | Full | Full | View | Full |
| Interviews | Full | Full | View | View |
| Notifications | Own | Own | Own | Own |

---

## Notes for Frontend Integration

1. **Cookies:** The API uses HTTP-only cookies for authentication. No need to manually manage tokens in frontend.

2. **CORS:** Ensure your frontend origin is whitelisted in the backend CORS configuration.

3. **Base URL:** Configure the base URL based on environment (development vs production).

4. **File Uploads:** Use `FormData` for file upload endpoints with `multipart/form-data` content type.

5. **Error Handling:** Always check for error responses and handle them appropriately in your UI.

6. **Pagination:** Most list endpoints support pagination via `page` and `limit` query parameters.

---

**Last Updated:** 2026-01-21

**Contact:** For questions or issues, contact the backend team.
