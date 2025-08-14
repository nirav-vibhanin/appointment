# Appointment Booking Backend

A Node.js/Express.js backend API for the appointment booking system with SQLite database.

## Features

- **RESTful API** for managing appointments, doctors, and patients
- **SQLite Database** with automatic initialization and sample data
- **Security Middleware** including CORS, Helmet, and rate limiting
- **Comprehensive Error Handling** with proper HTTP status codes
- **Input Validation** and data integrity checks

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Database
- **UUID** - Unique ID generation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logging
- **Express Rate Limit** - API rate limiting
- **Dotenv** - Environment variables

## Project Structure

```
back-end/
├── src/
│   ├── index.js              # Main server file
│   ├── database/
│   │   └── init.js           # Database initialization
│   └── routes/
│       ├── appointments.js    # Appointment routes
│       ├── doctors.js         # Doctor routes
│       └── patients.js        # Patient routes
├── database/                  # SQLite database files (auto-created)
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Book an appointment
- `PUT /api/appointments/:id` - Update/reschedule appointment
- `PATCH /api/appointments/:id/cancel` - Cancel appointment
- `GET /api/appointments/slots/available` - Get available slots
- `GET /api/appointments/patient/:patientId` - Get patient's appointments
- `GET /api/appointments/doctor/:doctorId` - Get doctor's appointments

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor
- `GET /api/doctors/:id/appointments` - Get doctor's appointments
- `GET /api/doctors/specialization/:specialization` - Get doctors by specialization

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/:id/appointments` - Get patient's appointments
- `GET /api/patients/search/:query` - Search patients

## Database Schema

### Patients Table
```sql
CREATE TABLE patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  dateOfBirth TEXT,
  address TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Doctors Table
```sql
CREATE TABLE doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  specialization TEXT,
  experience INTEGER,
  availability TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
  id TEXT PRIMARY KEY,
  patientId TEXT NOT NULL,
  doctorId TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'booked', 'cancelled', 'completed')),
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patientId) REFERENCES patients (id) ON DELETE CASCADE,
  FOREIGN KEY (doctorId) REFERENCES doctors (id) ON DELETE CASCADE
);
```

## Sample Data

The database automatically initializes with sample data including:
- 3 sample doctors (Cardiology, Neurology, Pediatrics)
- 2 sample patients
- Available appointment slots for the next day

## Error Handling

All endpoints return consistent error responses:
```json
{
  "error": "Error message",
  "message": "Additional details (in development)"
}
```

## Security Features

- **CORS** - Configured for frontend communication
- **Helmet** - Security headers
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **Input Validation** - Required field validation
- **SQL Injection Prevention** - Parameterized queries
- **Data Integrity** - Foreign key constraints

## Development

### Logging
- HTTP requests are logged using Morgan
- Database errors are logged to console
- Development mode includes detailed error messages

### Database
- SQLite database file is created automatically
- Tables are created with proper indexes
- Sample data is inserted on first run

### Scripts
- `npm run dev` - Start with nodemon for development
- `npm start` - Start production server
- `npm test` - Run tests (placeholder)

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure proper CORS origins
3. Set up proper logging
4. Use PM2 or similar process manager
5. Set up reverse proxy (nginx)
6. Configure SSL/TLS certificates

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include input validation
4. Test all endpoints
5. Update documentation

## Support

For issues and questions, please refer to the main project documentation.
