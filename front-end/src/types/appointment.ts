export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
  NO_SHOW = 'no_show',
}

export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency',
  ROUTINE_CHECKUP = 'routine_checkup',
  SPECIALIST_VISIT = 'specialist_visit',
  LAB_TEST = 'lab_test',
  PROCEDURE = 'procedure',
}

export enum TimeSlotStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  BLOCKED = 'blocked',
  MAINTENANCE = 'maintenance',
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  status: TimeSlotStatus;
  doctorId: string;
  date: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

// Alias for backward compatibility
export type AppointmentSlot = TimeSlot;

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  timeSlotId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  type: AppointmentType;
  reason: string;
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  patient?: Patient;
  doctor?: Doctor;
  timeSlot?: TimeSlot;
}

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: AppointmentType;
  reason: string;
  notes?: string;
  symptoms?: string;
}

export interface UpdateAppointmentRequest {
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: AppointmentStatus;
  type?: AppointmentType;
  reason?: string;
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  followUpDate?: string;
}

export interface RescheduleAppointmentRequest {
  newDate: string;
  newStartTime: string;
  newEndTime: string;
  reason?: string;
}

export interface AppointmentFilters {
  status?: AppointmentStatus[];
  type?: AppointmentType[];
  dateFrom?: string;
  dateTo?: string;
  doctorId?: string;
  patientId?: string;
  search?: string;
}

export interface AppointmentStats {
  total: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  rescheduled: number;
  noShow: number;
}

export interface AppointmentCalendar {
  date: string;
  appointments: Appointment[];
  availableSlots: TimeSlot[];
  totalSlots: number;
  bookedSlots: number;
}

export interface AppointmentReminder {
  id: string;
  appointmentId: string;
  reminderTime: string;
  type: 'email' | 'sms' | 'push';
  sent: boolean;
  createdAt: string;
}

// Utility types
export type AppointmentWithRelations = Appointment & {
  patient: Patient;
  doctor: Doctor;
  timeSlot: TimeSlot;
};

export type AppointmentListResponse = {
  appointments: AppointmentWithRelations[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: AppointmentStats;
};

export type AppointmentCalendarResponse = {
  calendar: AppointmentCalendar[];
  stats: AppointmentStats;
};

// Import related types
import { Patient } from './patient';
import { Doctor } from './doctor';
