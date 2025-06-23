# HRMS API Endpoints Documentation

## Base URL
```
https://api.hrms.com/v1
```

## Authentication
All endpoints require Bearer token authentication except where noted:
```
Authorization: Bearer {token}
```

---

## Authentication Endpoints

### POST /auth/login
**Description:** Authenticate user and get access token
**Request Body:**
```json
{
  "email": "user@company.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "user@company.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "HR_MANAGER"
    }
  }
}
```

### POST /auth/logout
**Description:** Logout user and invalidate token
**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Company Endpoints

### GET /companies
**Description:** Get all companies
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "company-1",
      "name": "TechCorp Philippines",
      "description": "Leading technology company",
      "address": "BGC, Taguig City",
      "contactEmail": "info@techcorp.ph",
      "contactPhone": "+63 2 8123 4567",
      "createdAt": "2020-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /companies/{id}
**Description:** Get company by ID
**Response:** Same as above but single object

---

## Department Endpoints

### GET /departments
**Description:** Get all departments
**Query Parameters:**
- `companyId` (optional): Filter by company ID
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Engineering",
      "description": "Software development",
      "companyId": "company-1",
      "headId": "employee_id",
      "createdAt": "2020-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /departments/{id}
**Description:** Get department by ID

### POST /departments
**Description:** Create new department
**Request Body:**
```json
{
  "name": "New Department",
  "description": "Department description",
  "companyId": "company-1",
  "headId": "employee_id"
}
```

### PUT /departments/{id}
**Description:** Update department
**Request Body:** Same as POST

### DELETE /departments/{id}
**Description:** Delete department

---

## Job Title Endpoints

### GET /job-titles
**Description:** Get all job titles
**Query Parameters:**
- `departmentId` (optional): Filter by department ID
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Software Engineer",
      "description": "Develops software applications",
      "departmentId": "1",
      "createdAt": "2020-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /job-titles/{id}
**Description:** Get job title by ID

### POST /job-titles
**Description:** Create new job title
**Request Body:**
```json
{
  "title": "New Job Title",
  "description": "Job description",
  "departmentId": "1"
}
```

### PUT /job-titles/{id}
**Description:** Update job title

### DELETE /job-titles/{id}
**Description:** Delete job title

---

## Employee Endpoints

### GET /employees
**Description:** Get all employees with display data
**Query Parameters:**
- `departmentId` (optional): Filter by department
- `jobTitleId` (optional): Filter by job title
- `employmentStatus` (optional): Filter by employment status
- `searchTerm` (optional): Search in name, email, employee number
- `page` (optional): Page number for pagination
- `pageSize` (optional): Items per page
**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "1",
        "firstName": "Juan",
        "lastName": "Dela Cruz",
        "middleName": "Santos",
        "birthDate": "1990-05-15T00:00:00Z",
        "gender": "Male",
        "civilStatus": "Married",
        "email": "juan.delacruz@company.com",
        "phoneNumber": "+63 917 123 4567",
        "address": "123 Rizal Street, Makati",
        "sssNumber": "12-3456789-0",
        "philHealthNumber": "PH123456789",
        "pagIbigNumber": "PG123456789",
        "tin": "123-456-789-000",
        "employeeNumber": "EMP001",
        "dateHired": "2023-01-15T00:00:00Z",
        "companyId": "company-1",
        "departmentId": "1",
        "jobTitleId": "1",
        "employmentStatus": "Regular",
        "avatar": "avatar_url",
        "createdAt": "2023-01-15T08:00:00Z",
        "updatedAt": "2024-01-15T08:00:00Z",
        "department": "Engineering",
        "jobTitle": "Software Engineer",
        "company": "TechCorp Philippines"
      }
    ],
    "totalCount": 100,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### GET /employees/{id}
**Description:** Get employee by ID with display data

### POST /employees
**Description:** Create new employee
**Request Body:**
```json
{
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "middleName": "Santos",
  "birthDate": "1990-05-15T00:00:00Z",
  "gender": "Male",
  "civilStatus": "Married",
  "email": "juan.delacruz@company.com",
  "phoneNumber": "+63 917 123 4567",
  "address": "123 Rizal Street, Makati",
  "sssNumber": "12-3456789-0",
  "philHealthNumber": "PH123456789",
  "pagIbigNumber": "PG123456789",
  "tin": "123-456-789-000",
  "employeeNumber": "EMP001",
  "dateHired": "2023-01-15T00:00:00Z",
  "companyId": "company-1",
  "departmentId": "1",
  "jobTitleId": "1",
  "employmentStatus": "Regular",
  "avatar": "avatar_url"
}
```

### PUT /employees/{id}
**Description:** Update employee
**Request Body:** Same as POST (all fields optional)

### DELETE /employees/{id}
**Description:** Delete employee

---

## Leave Application Endpoints

### GET /leave-applications
**Description:** Get all leave applications with display data
**Query Parameters:**
- `employeeId` (optional): Filter by employee
- `departmentId` (optional): Filter by department
- `status` (optional): Filter by status
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date
- `page` (optional): Page number
- `pageSize` (optional): Items per page
**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "1",
        "employeeId": "1",
        "leaveType": "Vacation",
        "startDate": "2024-06-01T00:00:00Z",
        "endDate": "2024-06-05T00:00:00Z",
        "totalDays": 5,
        "paidDays": 5,
        "unpaidDays": 0,
        "leaveDays": [
          {
            "date": "2024-06-01T00:00:00Z",
            "isPaid": true
          }
        ],
        "reason": "Family vacation",
        "status": "Pending",
        "appliedDate": "2024-05-15T08:00:00Z",
        "departmentHeadApproval": null,
        "hrAcknowledgment": null,
        "createdAt": "2024-05-15T08:00:00Z",
        "updatedAt": "2024-05-15T08:00:00Z",
        "employee": {
          "id": "1",
          "firstName": "Juan",
          "lastName": "Dela Cruz",
          "department": "Engineering",
          "jobTitle": "Software Engineer",
          "company": "TechCorp Philippines"
        },
        "departmentHead": null,
        "hrPersonnel": null
      }
    ],
    "totalCount": 50,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### GET /leave-applications/{id}
**Description:** Get leave application by ID with display data

### POST /leave-applications
**Description:** Create new leave application
**Request Body:**
```json
{
  "employeeId": "1",
  "leaveType": "Vacation",
  "startDate": "2024-06-01T00:00:00Z",
  "endDate": "2024-06-05T00:00:00Z",
  "reason": "Family vacation",
  "leaveDays": [
    {
      "date": "2024-06-01T00:00:00Z",
      "isPaid": true
    }
  ]
}
```

### PUT /leave-applications/{id}
**Description:** Update leave application (only if status is Pending)

### DELETE /leave-applications/{id}
**Description:** Delete leave application (only if status is Pending)

### POST /leave-applications/{id}/approve
**Description:** Approve leave application by department head
**Request Body:**
```json
{
  "approvedBy": "department_head_id",
  "comments": "Approved for family vacation"
}
```

### POST /leave-applications/{id}/reject
**Description:** Reject leave application
**Request Body:**
```json
{
  "rejectedBy": "department_head_id",
  "comments": "Cannot approve due to workload"
}
```

### POST /leave-applications/{id}/acknowledge
**Description:** Acknowledge leave application by HR
**Request Body:**
```json
{
  "acknowledgedBy": "hr_personnel_id",
  "comments": "Leave application processed"
}
```

---

## Leave Balance Endpoints

### GET /leave-balances
**Description:** Get leave balances
**Query Parameters:**
- `employeeId` (optional): Filter by employee
- `year` (optional): Filter by year (default: current year)
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "employeeId": "1",
      "year": 2024,
      "totalPaidLeave": 15,
      "usedPaidLeave": 5,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-05-15T08:00:00Z"
    }
  ]
}
```

### GET /leave-balances/{employeeId}/{year}
**Description:** Get leave balance for specific employee and year

### PUT /leave-balances/{id}
**Description:** Update leave balance

---

## Attendance Endpoints

### GET /attendances
**Description:** Get attendance records
**Query Parameters:**
- `employeeId` (optional): Filter by employee
- `date` (optional): Filter by date
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "employeeId": "1",
      "date": "2024-05-15T00:00:00Z",
      "timeIn": "2024-05-15T08:00:00Z",
      "timeOut": "2024-05-15T17:00:00Z",
      "totalHours": 8.0,
      "createdAt": "2024-05-15T08:00:00Z",
      "updatedAt": "2024-05-15T17:00:00Z"
    }
  ]
}
```

### POST /attendances/clock-in
**Description:** Clock in for employee
**Request Body:**
```json
{
  "employeeId": "1"
}
```

### POST /attendances/clock-out
**Description:** Clock out for employee
**Request Body:**
```json
{
  "employeeId": "1"
}
```

---

## Payroll Endpoints

### GET /payrolls
**Description:** Get payroll records
**Query Parameters:**
- `employeeId` (optional): Filter by employee
- `periodStart` (optional): Filter by period start
- `periodEnd` (optional): Filter by period end
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "employeeId": "1",
      "periodStart": "2024-05-01T00:00:00Z",
      "periodEnd": "2024-05-31T00:00:00Z",
      "basicPay": 50000.00,
      "allowances": 5000.00,
      "deductions": 3000.00,
      "netPay": 52000.00,
      "createdAt": "2024-06-01T00:00:00Z",
      "updatedAt": "2024-06-01T00:00:00Z"
    }
  ]
}
```

### POST /payrolls
**Description:** Generate payroll for employee
**Request Body:**
```json
{
  "employeeId": "1",
  "periodStart": "2024-05-01T00:00:00Z",
  "periodEnd": "2024-05-31T00:00:00Z"
}
```

---

## Dashboard Endpoints

### GET /dashboard/stats
**Description:** Get dashboard statistics
**Response:**
```json
{
  "success": true,
  "data": {
    "totalEmployees": 150,
    "activeEmployees": 145,
    "pendingLeaves": 12,
    "approvedLeaves": 8,
    "rejectedLeaves": 2,
    "totalDepartments": 8,
    "totalJobTitles": 25
  }
}
```

### GET /dashboard/recent-activity
**Description:** Get recent activity
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "type": "LeaveApplication",
      "action": "Created",
      "description": "Juan Dela Cruz applied for vacation leave",
      "timestamp": "2024-05-15T08:00:00Z",
      "employeeId": "1"
    }
  ]
}
```

### GET /dashboard/upcoming-birthdays
**Description:** Get upcoming birthdays
**Query Parameters:**
- `days` (optional): Number of days to look ahead (default: 30)
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "firstName": "Juan",
      "lastName": "Dela Cruz",
      "birthDate": "1990-05-15T00:00:00Z",
      "daysUntilBirthday": 5
    }
  ]
}
```

---

## Error Responses

All endpoints return consistent error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Email is required",
    "Invalid email format"
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Pagination

For endpoints that support pagination, use these query parameters:
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 20, max: 100)

Response includes pagination metadata:
```json
{
  "items": [...],
  "totalCount": 100,
  "pageNumber": 1,
  "pageSize": 20,
  "totalPages": 5,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

---

## File Upload Endpoints

### POST /upload/avatar
**Description:** Upload employee avatar
**Content-Type:** multipart/form-data
**Request Body:**
- `file`: Image file (JPG, PNG, max 5MB)
- `employeeId`: Employee ID

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.hrms.com/avatars/employee_1.jpg",
    "filename": "employee_1.jpg"
  }
}
```

---

## Health Check

### GET /health
**Description:** Health check endpoint
**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-05-15T08:00:00Z",
    "version": "1.0.0"
  }
}
``` 