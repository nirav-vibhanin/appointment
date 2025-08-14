# Appointment Booking System

A modern web application for booking, managing, and scheduling appointments with doctors. Built with React, TypeScript, Node.js, Express.js, and SQLite.

## Features

- **Appointment Booking**: Book appointments with available doctors
- **Appointment Management**: View, edit, and cancel appointments
- **Doctor Directory**: Browse available doctors and their specializations
- **Patient Registration**: Create patient accounts
- **Real-time Availability**: Check available appointment slots
- **Responsive Design**: Works on desktop and mobile devices
- **Form Validation**: Comprehensive form validation with Formik and Yup
- **State Management**: Redux Toolkit for efficient state management

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Formik & Yup** for form handling and validation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Lucide React** for icons
- **date-fns** for date manipulation

### Backend
- **Node.js** with Express.js
- **SQLite** for database
- **CORS** for cross-origin requests
- **Helmet** for security headers
- **Morgan** for logging
- **Express Rate Limit** for API protection
- **UUID** for unique identifiers

## Project Structure

```
appointment-booking/
├── front-end/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store and slices
│   │   ├── types/           # TypeScript type definitions
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # App entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── back-end/                 # Node.js backend application
│   ├── src/
│   │   ├── database/        # Database initialization
│   │   ├── routes/          # API routes
│   │   └── index.js         # Server entry point
│   ├── package.json
│   └── env.example
├── package.json              # Root package.json with workspaces
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd appointment-booking
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd front-end
   npm install
   
   # Install backend dependencies
   cd ../back-end
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cd back-end
   cp env.example .env
   ```

4. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start both the frontend (port 3000) and backend (port 5000) servers concurrently.

### Manual Start (Alternative)

If you prefer to start servers manually:

```bash
# Start backend server
cd back-end
npm run dev

# In a new terminal, start frontend server
cd front-end
npm run dev
```

## API Endpoints

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment
- `GET /api/appointments/slots/:doctorId` - Get available slots for a doctor
- `GET /api/appointments/patient/:patientId` - Get appointments by patient
- `GET /api/appointments/doctor/:doctorId` - Get appointments by doctor

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

## Database Schema

### Patients Table
- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT, NOT NULL)
- `email` (TEXT, UNIQUE, NOT NULL)
- `phone` (TEXT, NOT NULL)
- `dateOfBirth` (TEXT, NOT NULL)
- `createdAt` (TEXT, NOT NULL)
- `updatedAt` (TEXT, NOT NULL)

### Doctors Table
- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT, NOT NULL)
- `specialization` (TEXT, NOT NULL)
- `email` (TEXT, UNIQUE, NOT NULL)
- `phone` (TEXT, NOT NULL)
- `createdAt` (TEXT, NOT NULL)
- `updatedAt` (TEXT, NOT NULL)

### Appointments Table
- `id` (TEXT, PRIMARY KEY)
- `patientId` (TEXT, FOREIGN KEY)
- `doctorId` (TEXT, FOREIGN KEY)
- `date` (TEXT, NOT NULL)
- `time` (TEXT, NOT NULL)
- `status` (TEXT, NOT NULL) - 'available', 'booked', 'cancelled', 'completed'
- `notes` (TEXT)
- `createdAt` (TEXT, NOT NULL)
- `updatedAt` (TEXT, NOT NULL)

## Key Features Implementation

### Appointment Booking Flow
1. User selects a doctor from the directory
2. User chooses a date and time slot
3. System validates slot availability
4. Appointment is created and slot is marked as booked
5. User receives confirmation

### Form Validation
- **Patient Registration**: Name, email, phone, and date of birth validation
- **Appointment Booking**: Required fields and date/time validation
- **Real-time Validation**: Immediate feedback on form errors

### State Management
- **Redux Toolkit**: Centralized state management
- **Async Thunks**: Handle API calls and loading states
- **Optimistic Updates**: Immediate UI updates for better UX

### Security Features
- **CORS Protection**: Configured for frontend-backend communication
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries

## Development

### Available Scripts

**Root Directory:**
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build the frontend for production
- `npm run install:all` - Install dependencies for all workspaces

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Code Organization

The project follows a clean, modular architecture:

- **Components**: Reusable UI components with TypeScript interfaces
- **Pages**: Route-level components for different views
- **Services**: API communication layer
- **Store**: Redux state management with slices
- **Types**: TypeScript type definitions
- **Routes**: Express.js API endpoints
- **Database**: SQLite setup and initialization

## Deployment

### Frontend Deployment
The frontend can be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3
- GitHub Pages

### Backend Deployment
The backend can be deployed to:
- Heroku
- Railway
- DigitalOcean
- AWS EC2

### Environment Variables
Make sure to set the following environment variables in production:
- `PORT` - Server port
- `NODE_ENV` - Environment (production/development)
- `FRONTEND_URL` - Frontend URL for CORS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
