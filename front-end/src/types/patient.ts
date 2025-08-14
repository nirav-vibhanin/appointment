export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  SEPARATED = 'separated',
}

export enum InsuranceProvider {
  BLUE_CROSS = 'blue_cross',
  AETNA = 'aetna',
  CIGNA = 'cigna',
  UNITED_HEALTH = 'united_health',
  HUMANA = 'humana',
  KAISER = 'kaiser',
  OTHER = 'other',
  NONE = 'none',
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  bloodType?: BloodType;
  maritalStatus?: MaritalStatus;
  address: Address;
  emergencyContact: EmergencyContact;
  insurance?: Insurance;
  medicalHistory?: MedicalHistory;
  allergies?: string[];
  medications?: string[];
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: Address;
}

export interface Insurance {
  provider: InsuranceProvider;
  policyNumber: string;
  groupNumber?: string;
  effectiveDate: string;
  expiryDate?: string;
  copay?: number;
  deductible?: number;
}

export interface MedicalHistory {
  conditions: MedicalCondition[];
  surgeries: Surgery[];
  familyHistory: FamilyHistory[];
  lifestyle: Lifestyle;
}

export interface MedicalCondition {
  condition: string;
  diagnosedDate: string;
  status: 'active' | 'resolved' | 'chronic';
  notes?: string;
}

export interface Surgery {
  procedure: string;
  date: string;
  hospital: string;
  surgeon: string;
  notes?: string;
}

export interface FamilyHistory {
  condition: string;
  relationship: string;
  ageAtDiagnosis?: number;
}

export interface Lifestyle {
  smoking: 'never' | 'former' | 'current';
  alcohol: 'never' | 'occasional' | 'moderate' | 'heavy';
  exercise: 'none' | 'light' | 'moderate' | 'heavy';
  diet: 'standard' | 'vegetarian' | 'vegan' | 'keto' | 'other';
  occupation?: string;
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  bloodType?: BloodType;
  maritalStatus?: MaritalStatus;
  address: Address;
  emergencyContact: EmergencyContact;
  insurance?: Insurance;
  allergies?: string[];
  medications?: string[];
  notes?: string;
}

export interface UpdatePatientRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  bloodType?: BloodType;
  maritalStatus?: MaritalStatus;
  address?: Address;
  emergencyContact?: EmergencyContact;
  insurance?: Insurance;
  allergies?: string[];
  medications?: string[];
  notes?: string;
  isActive?: boolean;
}

export interface PatientFilters {
  search?: string;
  gender?: Gender;
  bloodType?: BloodType;
  insuranceProvider?: InsuranceProvider;
  dateOfBirthFrom?: string;
  dateOfBirthTo?: string;
  isActive?: boolean;
  city?: string;
  state?: string;
}

export interface PatientStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  newThisYear: number;
  byGender: Record<Gender, number>;
  byAgeGroup: Record<string, number>;
  byInsurance: Record<InsuranceProvider, number>;
}

export interface PatientSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  city: string;
  state: string;
  lastAppointment?: string;
  upcomingAppointments: number;
}

// Utility types
export type PatientWithAppointments = Patient & {
  appointments: Appointment[];
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
};

export type PatientListResponse = {
  patients: Patient[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: PatientStats;
};

export type PatientSearchResponse = {
  patients: PatientSearchResult[];
  total: number;
};

// Form validation schemas
export interface PatientFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
    email?: string;
  };
}

// Import related types
import { Appointment } from './appointment';
