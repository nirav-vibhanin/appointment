import { apiService } from './api';
import {
  Patient,
  Gender,
  BloodType,
  MaritalStatus,
  InsuranceProvider,
  CreatePatientRequest,
  UpdatePatientRequest,
  PatientFilters,
  PatientStats,
  PatientSearchResult,
  PatientListResponse,
  PatientSearchResponse,
  PatientWithAppointments,
} from '../types/patient';

export class PatientApiService {
  private readonly baseUrl = '/patients';

  // Get all patients with filtering and pagination
  async getPatients(
    filters: PatientFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<PatientListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...this.buildFilterParams(filters),
    });

    return apiService.get<PatientListResponse>(`${this.baseUrl}?${params}`);
  }

  // Get patient by ID
  async getPatient(id: string): Promise<Patient> {
    return apiService.get<Patient>(`${this.baseUrl}/${id}`);
  }

  // Get patient with appointments
  async getPatientWithAppointments(id: string): Promise<PatientWithAppointments> {
    return apiService.get<PatientWithAppointments>(`${this.baseUrl}/${id}/with-appointments`);
  }

  // Create new patient
  async createPatient(data: CreatePatientRequest): Promise<Patient> {
    const patient = await apiService.post<Patient>(this.baseUrl, data);
    
    // Invalidate related caches
    apiService.invalidateCache('patients');
    
    return patient;
  }

  // Update patient
  async updatePatient(id: string, data: UpdatePatientRequest): Promise<Patient> {
    const patient = await apiService.put<Patient>(`${this.baseUrl}/${id}`, data);
    
    // Invalidate related caches
    apiService.invalidateCache('patients');
    apiService.invalidateCache(`patients/${id}`);
    
    return patient;
  }

  // Delete patient
  async deletePatient(id: string): Promise<void> {
    await apiService.delete<void>(`${this.baseUrl}/${id}`);
    
    // Invalidate related caches
    apiService.invalidateCache('patients');
    apiService.invalidateCache(`patients/${id}`);
  }

  // Deactivate patient
  async deactivatePatient(id: string, reason?: string): Promise<Patient> {
    return this.updatePatient(id, {
      isActive: false,
      notes: reason ? `Deactivated: ${reason}` : 'Patient deactivated',
    });
  }

  // Reactivate patient
  async reactivatePatient(id: string): Promise<Patient> {
    return this.updatePatient(id, { isActive: true });
  }

  // Get patient statistics
  async getPatientStats(filters?: PatientFilters): Promise<PatientStats> {
    const params = filters ? this.buildFilterParams(filters) : {};
    const queryString = new URLSearchParams(params).toString();
    
    return apiService.get<PatientStats>(`${this.baseUrl}/stats${queryString ? `?${queryString}` : ''}`);
  }

  // Search patients
  async searchPatients(
    query: string,
    filters?: PatientFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<PatientSearchResponse> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      ...this.buildFilterParams(filters),
    });

    return apiService.get<PatientSearchResponse>(`${this.baseUrl}/search?${params}`);
  }

  // Get patients by doctor
  async getPatientsByDoctor(
    doctorId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PatientListResponse> {
    const params = new URLSearchParams({
      doctorId,
      page: page.toString(),
      limit: limit.toString(),
    });

    return apiService.get<PatientListResponse>(`${this.baseUrl}/by-doctor/${doctorId}?${params}`);
  }

  // Get patients by insurance provider
  async getPatientsByInsurance(
    provider: InsuranceProvider,
    page: number = 1,
    limit: number = 10
  ): Promise<PatientListResponse> {
    const params = new URLSearchParams({
      provider,
      page: page.toString(),
      limit: limit.toString(),
    });

    return apiService.get<PatientListResponse>(`${this.baseUrl}/by-insurance?${params}`);
  }

  // Get patients by age group
  async getPatientsByAgeGroup(
    ageGroup: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PatientListResponse> {
    const params = new URLSearchParams({
      ageGroup,
      page: page.toString(),
      limit: limit.toString(),
    });

    return apiService.get<PatientListResponse>(`${this.baseUrl}/by-age-group?${params}`);
  }

  // Get patients by location
  async getPatientsByLocation(
    city?: string,
    state?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PatientListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(city && { city }),
      ...(state && { state }),
    });

    return apiService.get<PatientListResponse>(`${this.baseUrl}/by-location?${params}`);
  }

  // Get new patients
  async getNewPatients(
    days: number = 30,
    page: number = 1,
    limit: number = 10
  ): Promise<PatientListResponse> {
    const params = new URLSearchParams({
      days: days.toString(),
      page: page.toString(),
      limit: limit.toString(),
    });

    return apiService.get<PatientListResponse>(`${this.baseUrl}/new?${params}`);
  }

  // Get inactive patients
  async getInactivePatients(
    page: number = 1,
    limit: number = 10
  ): Promise<PatientListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return apiService.get<PatientListResponse>(`${this.baseUrl}/inactive?${params}`);
  }

  // Export patients
  async exportPatients(
    format: 'csv' | 'pdf' | 'excel',
    filters?: PatientFilters
  ): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      ...this.buildFilterParams(filters),
    });

    const response = await apiService.get<Blob>(`${this.baseUrl}/export?${params}`, {
      responseType: 'blob',
    });

    return response;
  }

  // Bulk operations
  async bulkUpdatePatients(
    patientIds: string[],
    updates: Partial<UpdatePatientRequest>
  ): Promise<Patient[]> {
    const patients = await apiService.post<Patient[]>(`${this.baseUrl}/bulk-update`, {
      patientIds,
      updates,
    });
    
    // Invalidate related caches
    apiService.invalidateCache('patients');
    
    return patients;
  }

  async bulkDeactivatePatients(patientIds: string[], reason?: string): Promise<Patient[]> {
    return this.bulkUpdatePatients(patientIds, {
      isActive: false,
      notes: reason ? `Bulk deactivated: ${reason}` : 'Bulk deactivated',
    });
  }

  async bulkReactivatePatients(patientIds: string[]): Promise<Patient[]> {
    return this.bulkUpdatePatients(patientIds, { isActive: true });
  }

  // Patient medical history
  async updateMedicalHistory(
    patientId: string,
    medicalHistory: any
  ): Promise<Patient> {
    return apiService.put<Patient>(`${this.baseUrl}/${patientId}/medical-history`, medicalHistory);
  }

  // Patient insurance
  async updateInsurance(
    patientId: string,
    insurance: any
  ): Promise<Patient> {
    return apiService.put<Patient>(`${this.baseUrl}/${patientId}/insurance`, insurance);
  }

  // Patient emergency contact
  async updateEmergencyContact(
    patientId: string,
    emergencyContact: any
  ): Promise<Patient> {
    return apiService.put<Patient>(`${this.baseUrl}/${patientId}/emergency-contact`, emergencyContact);
  }

  // Patient allergies
  async updateAllergies(
    patientId: string,
    allergies: string[]
  ): Promise<Patient> {
    return apiService.put<Patient>(`${this.baseUrl}/${patientId}/allergies`, { allergies });
  }

  // Patient medications
  async updateMedications(
    patientId: string,
    medications: string[]
  ): Promise<Patient> {
    return apiService.put<Patient>(`${this.baseUrl}/${patientId}/medications`, { medications });
  }

  // Patient notes
  async addPatientNote(
    patientId: string,
    note: string
  ): Promise<Patient> {
    return apiService.post<Patient>(`${this.baseUrl}/${patientId}/notes`, { note });
  }

  // Patient documents
  async uploadPatientDocument(
    patientId: string,
    file: File,
    documentType: string,
    onProgress?: (progress: number) => void
  ): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    return apiService.uploadFile<any>(`${this.baseUrl}/${patientId}/documents`, file, onProgress);
  }

  async getPatientDocuments(patientId: string): Promise<any[]> {
    return apiService.get<any[]>(`${this.baseUrl}/${patientId}/documents`);
  }

  async deletePatientDocument(patientId: string, documentId: string): Promise<void> {
    await apiService.delete<void>(`${this.baseUrl}/${patientId}/documents/${documentId}`);
  }

  // Patient verification
  async verifyPatient(patientId: string): Promise<Patient> {
    return apiService.post<Patient>(`${this.baseUrl}/${patientId}/verify`);
  }

  // Patient duplicate check
  async checkDuplicatePatient(data: Partial<CreatePatientRequest>): Promise<{
    isDuplicate: boolean;
    potentialMatches: Patient[];
  }> {
    return apiService.post<{
      isDuplicate: boolean;
      potentialMatches: Patient[];
    }>(`${this.baseUrl}/check-duplicate`, data);
  }

  // Patient merge
  async mergePatients(
    primaryPatientId: string,
    secondaryPatientId: string
  ): Promise<Patient> {
    return apiService.post<Patient>(`${this.baseUrl}/merge`, {
      primaryPatientId,
      secondaryPatientId,
    });
  }

  // Helper method to build filter parameters
  private buildFilterParams(filters: PatientFilters): Record<string, string> {
    const params: Record<string, string> = {};

    if (filters.search) {
      params.search = filters.search;
    }

    if (filters.gender) {
      params.gender = filters.gender;
    }

    if (filters.bloodType) {
      params.bloodType = filters.bloodType;
    }

    if (filters.insuranceProvider) {
      params.insuranceProvider = filters.insuranceProvider;
    }

    if (filters.dateOfBirthFrom) {
      params.dateOfBirthFrom = filters.dateOfBirthFrom;
    }

    if (filters.dateOfBirthTo) {
      params.dateOfBirthTo = filters.dateOfBirthTo;
    }

    if (filters.isActive !== undefined) {
      params.isActive = filters.isActive.toString();
    }

    if (filters.city) {
      params.city = filters.city;
    }

    if (filters.state) {
      params.state = filters.state;
    }

    return params;
  }
}

// Export singleton instance
export const patientApi = new PatientApiService();
