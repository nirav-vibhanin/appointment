export enum Specialization {
  CARDIOLOGY = 'cardiology',
  DERMATOLOGY = 'dermatology',
  ENDOCRINOLOGY = 'endocrinology',
  GASTROENTEROLOGY = 'gastroenterology',
  GENERAL_MEDICINE = 'general_medicine',
  GYNECOLOGY = 'gynecology',
  HEMATOLOGY = 'hematology',
  INFECTIOUS_DISEASE = 'infectious_disease',
  INTERNAL_MEDICINE = 'internal_medicine',
  NEUROLOGY = 'neurology',
  ONCOLOGY = 'oncology',
  OPHTHALMOLOGY = 'ophthalmology',
  ORTHOPEDICS = 'orthopedics',
  PEDIATRICS = 'pediatrics',
  PSYCHIATRY = 'psychiatry',
  PULMONOLOGY = 'pulmonology',
  RADIOLOGY = 'radiology',
  RHEUMATOLOGY = 'rheumatology',
  SURGERY = 'surgery',
  UROLOGY = 'urology',
  EMERGENCY_MEDICINE = 'emergency_medicine',
  FAMILY_MEDICINE = 'family_medicine',
  GERIATRICS = 'geriatrics',
  SPORTS_MEDICINE = 'sports_medicine',
  PREVENTIVE_MEDICINE = 'preventive_medicine',
}

export enum DoctorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  RETIRED = 'retired',
  SUSPENDED = 'suspended',
}

export enum AvailabilityType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONSULTANT = 'consultant',
  EMERGENCY_ONLY = 'emergency_only',
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: Specialization;
  licenseNumber: string;
  experience: number;
  education: Education[];
  certifications: Certification[];
  availability: Availability;
  consultationFee: number;
  rating: number;
  totalReviews: number;
  bio: string;
  avatar?: string;
  status: DoctorStatus;
  isVerified: boolean;
  languages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
  country: string;
}

export interface Certification {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface Availability {
  type: AvailabilityType;
  workingDays: WorkingDay[];
  holidays: string[];
  emergencyAvailable: boolean;
  maxPatientsPerDay: number;
  consultationDuration: number; // in minutes
}

export interface WorkingDay {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  breakStartTime?: string;
  breakEndTime?: string;
}

export interface DoctorSchedule {
  id: string;
  doctorId: string;
  date: string;
  timeSlots: TimeSlot[];
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
}

export interface CreateDoctorRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: Specialization;
  licenseNumber: string;
  experience: number;
  education: Education[];
  certifications: Certification[];
  availability: Availability;
  consultationFee: number;
  bio: string;
  languages: string[];
}

export interface UpdateDoctorRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  specialization?: Specialization;
  licenseNumber?: string;
  experience?: number;
  education?: Education[];
  certifications?: Certification[];
  availability?: Availability;
  consultationFee?: number;
  bio?: string;
  avatar?: string;
  status?: DoctorStatus;
  languages?: string[];
}

export interface DoctorFilters {
  search?: string;
  specialization?: Specialization[];
  status?: DoctorStatus[];
  availabilityType?: AvailabilityType[];
  experienceMin?: number;
  experienceMax?: number;
  ratingMin?: number;
  feeMin?: number;
  feeMax?: number;
  languages?: string[];
  isVerified?: boolean;
}

export interface DoctorStats {
  total: number;
  active: number;
  inactive: number;
  onLeave: number;
  bySpecialization: Record<Specialization, number>;
  byExperience: Record<string, number>;
  byRating: Record<string, number>;
  averageRating: number;
  totalAppointments: number;
  totalPatients: number;
}

export interface DoctorSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  specialization: Specialization;
  experience: number;
  rating: number;
  totalReviews: number;
  consultationFee: number;
  avatar?: string;
  isVerified: boolean;
  nextAvailableSlot?: string;
  totalAppointments: number;
}

export interface DoctorReview {
  id: string;
  doctorId: string;
  patientId: string;
  appointmentId: string;
  rating: number;
  comment: string;
  createdAt: string;
  patient?: Patient;
}

export interface CreateReviewRequest {
  doctorId: string;
  appointmentId: string;
  rating: number;
  comment: string;
}

// Utility types
export type DoctorWithSchedule = Doctor & {
  schedule: DoctorSchedule[];
  reviews: DoctorReview[];
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
};

export type DoctorListResponse = {
  doctors: Doctor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: DoctorStats;
};

export type DoctorSearchResponse = {
  doctors: DoctorSearchResult[];
  total: number;
};

export type DoctorDetailResponse = DoctorWithSchedule & {
  stats: {
    totalAppointments: number;
    totalPatients: number;
    averageRating: number;
    completionRate: number;
    averageConsultationTime: number;
  };
};

// Form validation schemas
export interface DoctorFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  licenseNumber?: string;
  experience?: string;
  consultationFee?: string;
  bio?: string;
  education?: {
    degree?: string;
    institution?: string;
    year?: string;
  }[];
  availability?: {
    workingDays?: string;
    consultationDuration?: string;
  };
}

// Import related types
import { Patient } from './patient';
import { Appointment, TimeSlot } from './appointment';
