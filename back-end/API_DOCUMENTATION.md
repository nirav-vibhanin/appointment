# Appointment Booking API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, the API doesn't require authentication. In production, implement JWT or session-based authentication.

## Response Format
All responses are in JSON format with the following structure:

**Success Response:**
```json
{
  "message": "Success message",
  "data": {...} // or array of data
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "message": "Additional details (in development)"
}
```

---

## Health Check

### GET /health
Check if the server is running.

**Response:**
```json
{
  "status": "OK",
  "message": "Appointment Booking API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Appointments

### GET /appointments
Get all appointments with patient and doctor details.

**Query Parameters:**
- `status` (optional): Filter by status (`available`, `booked`, `cancelled`, `completed`)
- `date` (optional): Filter by specific date (YYYY-MM-DD)

**Response:**
```json
[
  {
    "id": "apt-001",
    "patientId": "pat-001",
    "doctorId": "doc-001",
    "date": "2024-01-20",
    "time": "09:00",
    "status": "booked",
    "notes": "Regular checkup",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "patientName": "John Smith",
    "patientEmail": "john@email.com",
    "patientPhone": "+1-555-0201",
    "doctorName": "Dr. Sarah Johnson",
    "doctorSpecialization": "Cardiology",
    "doctorEmail": "sarah@hospital.com",
    "doctorPhone": "+1-555-0101"
  }
]
```

### GET /appointments/:id
Get a specific appointment by ID.

**Response:**
```json
{
  "id": "apt-001",
  "patientId": "pat-001",
  "doctorId": "doc-001",
  "date": "2024-01-20",
  "time": "09:00",
  "status": "booked",
  "notes": "Regular checkup",
  "patientName": "John Smith",
  "doctorName": "Dr. Sarah Johnson"
}
```

### POST /appointments
Book an appointment (create new appointment).

**Request Body:**
```json
{
  "patientId": "pat-001",
  "doctorId": "doc-001",
  "date": "2024-01-20",
  "time": "09:00",
  "notes": "Regular checkup"
}
```

**Response:**
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "id": "apt-001",
    "patientId": "pat-001",
    "doctorId": "doc-001",
    "date": "2024-01-20",
    "time": "09:00",
    "status": "booked",
    "notes": "Regular checkup"
  }
}
```

### PUT /appointments/:id
Reschedule an appointment.

**Request Body:**
```json
{
  "doctorId": "doc-002",
  "date": "2024-01-21",
  "time": "10:00",
  "notes": "Rescheduled appointment"
}
```

**Response:**
```json
{
  "message": "Appointment rescheduled successfully",
  "appointmentId": "apt-002"
}
```

### PATCH /appointments/:id/cancel
Cancel an appointment.

**Response:**
```json
{
  "message": "Appointment cancelled successfully"
}
```

### PATCH /appointments/:id/complete
Mark an appointment as completed.

**Response:**
```json
{
  "message": "Appointment marked as completed"
}
```

### GET /appointments/slots/available
Get available appointment slots for a doctor on a specific date.

**Query Parameters:**
- `doctorId` (required): Doctor ID
- `date` (required): Date in YYYY-MM-DD format

**Response:**
```json
[
  {
    "id": "apt-001",
    "doctorId": "doc-001",
    "date": "2024-01-20",
    "time": "09:00",
    "status": "available"
  },
  {
    "id": "apt-002",
    "doctorId": "doc-001",
    "date": "2024-01-20",
    "time": "10:00",
    "status": "available"
  }
]
```

### GET /appointments/patient/:patientId
Get all appointments for a specific patient.

**Query Parameters:**
- `status` (optional): Filter by status
- `past` (optional): `true` for past appointments, `false` for future appointments

**Response:**
```json
[
  {
    "id": "apt-001",
    "patientId": "pat-001",
    "doctorId": "doc-001",
    "date": "2024-01-20",
    "time": "09:00",
    "status": "booked",
    "doctorName": "Dr. Sarah Johnson",
    "doctorSpecialization": "Cardiology"
  }
]
```

### GET /appointments/doctor/:doctorId
Get all appointments for a specific doctor.

**Query Parameters:**
- `status` (optional): Filter by status
- `date` (optional): Filter by specific date

**Response:**
```json
[
  {
    "id": "apt-001",
    "patientId": "pat-001",
    "doctorId": "doc-001",
    "date": "2024-01-20",
    "time": "09:00",
    "status": "booked",
    "patientName": "John Smith",
    "patientEmail": "john@email.com"
  }
]
```

### GET /appointments/past/all
Get past appointments (completed or cancelled).

**Query Parameters:**
- `patientId` (optional): Filter by patient
- `doctorId` (optional): Filter by doctor
- `limit` (optional): Number of results (default: 50)

**Response:**
```json
[
  {
    "id": "apt-001",
    "patientId": "pat-001",
    "doctorId": "doc-001",
    "date": "2024-01-10",
    "time": "09:00",
    "status": "completed",
    "patientName": "John Smith",
    "doctorName": "Dr. Sarah Johnson"
  }
]
```

### GET /appointments/upcoming
Get upcoming appointments (next 7 days).

**Query Parameters:**
- `patientId` (optional): Filter by patient
- `doctorId` (optional): Filter by doctor
- `limit` (optional): Number of results (default: 10)

**Response:**
```json
[
  {
    "id": "apt-001",
    "patientId": "pat-001",
    "doctorId": "doc-001",
    "date": "2024-01-20",
    "time": "09:00",
    "status": "booked",
    "patientName": "John Smith",
    "doctorName": "Dr. Sarah Johnson"
  }
]
```

### GET /appointments/stats/overview
Get appointment statistics.

**Query Parameters:**
- `patientId` (optional): Filter by patient
- `doctorId` (optional): Filter by doctor
- `dateRange` (optional): `today`, `week`, or `month`

**Response:**
```json
{
  "total": 100,
  "booked": 25,
  "completed": 60,
  "cancelled": 10,
  "available": 5
}
```

### POST /appointments/slots/generate
Generate available appointment slots for a doctor (admin function).

**Request Body:**
```json
{
  "doctorId": "doc-001",
  "startDate": "2024-01-20",
  "endDate": "2024-01-25",
  "timeSlots": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
}
```

**Response:**
```json
{
  "message": "Successfully created 30 new appointment slots",
  "created": 30,
  "total": 30
}
```

---

## Doctors

### GET /doctors
Get all doctors.

**Response:**
```json
[
  {
    "id": "doc-001",
    "name": "Dr. Sarah Johnson",
    "email": "sarah@hospital.com",
    "phone": "+1-555-0101",
    "specialization": "Cardiology",
    "experience": 15,
    "availability": "Mon-Fri 9AM-5PM",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### GET /doctors/:id
Get a specific doctor by ID.

**Response:**
```json
{
  "id": "doc-001",
  "name": "Dr. Sarah Johnson",
  "email": "sarah@hospital.com",
  "phone": "+1-555-0101",
  "specialization": "Cardiology",
  "experience": 15,
  "availability": "Mon-Fri 9AM-5PM"
}
```

### POST /doctors
Create a new doctor.

**Request Body:**
```json
{
  "name": "Dr. Michael Chen",
  "email": "michael@hospital.com",
  "phone": "+1-555-0102",
  "specialization": "Neurology",
  "experience": 12,
  "availability": "Mon-Fri 10AM-6PM"
}
```

**Response:**
```json
{
  "message": "Doctor created successfully",
  "doctor": {
    "id": "doc-002",
    "name": "Dr. Michael Chen",
    "email": "michael@hospital.com",
    "specialization": "Neurology"
  }
}
```

### PUT /doctors/:id
Update a doctor's information.

**Request Body:**
```json
{
  "name": "Dr. Michael Chen",
  "phone": "+1-555-0103",
  "experience": 13
}
```

**Response:**
```json
{
  "message": "Doctor updated successfully"
}
```

### DELETE /doctors/:id
Delete a doctor (only if no appointments exist).

**Response:**
```json
{
  "message": "Doctor deleted successfully"
}
```

### GET /doctors/:id/appointments
Get all appointments for a specific doctor.

**Response:**
```json
[
  {
    "id": "apt-001",
    "patientId": "pat-001",
    "doctorId": "doc-001",
    "date": "2024-01-20",
    "time": "09:00",
    "status": "booked",
    "patientName": "John Smith",
    "patientEmail": "john@email.com"
  }
]
```

### GET /doctors/specialization/:specialization
Get doctors by specialization.

**Response:**
```json
[
  {
    "id": "doc-001",
    "name": "Dr. Sarah Johnson",
    "specialization": "Cardiology",
    "experience": 15
  }
]
```

---

## Patients

### GET /patients
Get all patients.

**Response:**
```json
[
  {
    "id": "pat-001",
    "name": "John Smith",
    "email": "john@email.com",
    "phone": "+1-555-0201",
    "dateOfBirth": "1985-03-15",
    "address": "123 Main St, City, State",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### GET /patients/:id
Get a specific patient by ID.

**Response:**
```json
{
  "id": "pat-001",
  "name": "John Smith",
  "email": "john@email.com",
  "phone": "+1-555-0201",
  "dateOfBirth": "1985-03-15",
  "address": "123 Main St, City, State"
}
```

### POST /patients
Create a new patient.

**Request Body:**
```json
{
  "name": "Maria Garcia",
  "email": "maria@email.com",
  "phone": "+1-555-0202",
  "dateOfBirth": "1990-07-22",
  "address": "456 Oak Ave, City, State"
}
```

**Response:**
```json
{
  "message": "Patient created successfully",
  "patient": {
    "id": "pat-002",
    "name": "Maria Garcia",
    "email": "maria@email.com"
  }
}
```

### PUT /patients/:id
Update a patient's information.

**Request Body:**
```json
{
  "name": "Maria Garcia",
  "phone": "+1-555-0203",
  "address": "789 Pine St, City, State"
}
```

**Response:**
```json
{
  "message": "Patient updated successfully"
}
```

### DELETE /patients/:id
Delete a patient (only if no appointments exist).

**Response:**
```json
{
  "message": "Patient deleted successfully"
}
```

### GET /patients/:id/appointments
Get all appointments for a specific patient.

**Response:**
```json
[
  {
    "id": "apt-001",
    "patientId": "pat-001",
    "doctorId": "doc-001",
    "date": "2024-01-20",
    "time": "09:00",
    "status": "booked",
    "doctorName": "Dr. Sarah Johnson",
    "doctorSpecialization": "Cardiology"
  }
]
```

### GET /patients/search/:query
Search patients by name or email.

**Response:**
```json
[
  {
    "id": "pat-001",
    "name": "John Smith",
    "email": "john@email.com",
    "phone": "+1-555-0201"
  }
]
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input data |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

## Common Error Messages

- `Missing required fields` - Required fields are missing from request
- `Email already exists` - Email is already registered
- `Selected time slot is not available` - Appointment slot is already booked
- `Cannot book appointments in the past` - Attempting to book for past date
- `Patient already has an appointment at this time` - Patient has conflicting appointment
- `Only booked appointments can be cancelled` - Cannot cancel non-booked appointments
- `Cannot delete doctor/patient with existing appointments` - Cannot delete due to data integrity

## Rate Limiting

The API implements rate limiting:
- 100 requests per 15 minutes per IP address
- Exceeds limit returns 429 status code

## CORS

The API supports CORS for frontend integration:
- Allowed origin: `http://localhost:3000` (configurable)
- Credentials: true
- Methods: GET, POST, PUT, PATCH, DELETE
