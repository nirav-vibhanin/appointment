import { apiService, type ApiResponse } from './api';
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

    const resp = await apiService.get<any>(`${this.baseUrl}?${params}`);
    const data = (resp && typeof resp === 'object' && 'data' in resp) ? (resp as any).data : resp;

    if (Array.isArray(data)) {
      const normalizedPatients = data.map((p: any) => {
        const fullName: string = p.name || '';
        const parts = fullName.trim().split(/\s+/);
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ');
        return {
          id: String(p.id),
          firstName,
          lastName,
          email: p.email || '',
          phone: p.phone || '',
          dateOfBirth: p.dateOfBirth || '',
          gender: 'other',
          address: p.address || { street: '', city: '', state: '', zipCode: '', country: '' },
          emergencyContact: { name: '', relationship: '', phone: '' },
          isActive: true,
          createdAt: p.createdAt || '',
          updatedAt: p.updatedAt || '',
          name: p.name,
        } as any; 
      });

      const total = normalizedPatients.length;
      return {
        patients: normalizedPatients as any,
        pagination: {
          page: 1,
          limit: total,
          total,
          totalPages: 1,
        },
        stats: {
          total,
          active: total,
          inactive: 0,
          newThisMonth: 0,
          newThisYear: 0,
          byGender: { male: 0, female: 0, other: total, prefer_not_to_say: 0 } as any,
          byAgeGroup: {},
          byInsurance: {} as any,
        },
      } as PatientListResponse;
    }

    return data as PatientListResponse;
  }

  async getPatient(id: string): Promise<Patient> {
    return apiService.get<Patient>(`${this.baseUrl}/${id}`);
  }

  async getPatientWithAppointments(id: string): Promise<PatientWithAppointments> {
    return apiService.get<PatientWithAppointments>(`${this.baseUrl}/${id}/with-appointments`);
  }

  async createPatient(data: CreatePatientRequest): Promise<Patient> {
    const patient = await apiService.post<Patient>(this.baseUrl, data);
    
    apiService.invalidateCache('patients');
    
    return patient;
  }

  async updatePatient(id: string, data: UpdatePatientRequest): Promise<Patient> {
    const patient = await apiService.put<Patient>(`${this.baseUrl}/${id}`, data);
    
    apiService.invalidateCache('patients');
    apiService.invalidateCache(`patients/${id}`);
    
    return patient;
  }

  async deletePatient(id: string): Promise<void> {
    await apiService.delete<void>(`${this.baseUrl}/${id}`);
    
    apiService.invalidateCache('patients');
    apiService.invalidateCache(`patients/${id}`);
  }

  async deactivatePatient(id: string, reason?: string): Promise<Patient> {
    return this.updatePatient(id, {
      isActive: false,
      notes: reason ? `Deactivated: ${reason}` : 'Patient deactivated',
    });
  }

  async reactivatePatient(id: string): Promise<Patient> {
    return this.updatePatient(id, { isActive: true });
  }

  async getPatientStats(filters?: PatientFilters): Promise<PatientStats> {
    const params = filters ? this.buildFilterParams(filters || ({} as PatientFilters)) : {};
    const queryString = new URLSearchParams(params).toString();
    
    return apiService.get<PatientStats>(`${this.baseUrl}/stats${queryString ? `?${queryString}` : ''}`);
  }

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

  async exportPatients(
    format: 'csv' | 'pdf' | 'excel',
    filters?: PatientFilters
  ): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      ...this.buildFilterParams((filters || ({} as PatientFilters))),
    });

    const response = await apiService.get<Blob>(`${this.baseUrl}/export?${params}`, {
      responseType: 'blob',
    });

    return response;
  }

  async bulkUpdatePatients(
    patientIds: string[],
    updates: Partial<UpdatePatientRequest>
  ): Promise<Patient[]> {
    const patients = await apiService.post<Patient[]>(`${this.baseUrl}/bulk-update`, {
      patientIds,
      updates,
    });
    
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

  async updateMedicalHistory(
    patientId: string,
    medicalHistory: any
  ): Promise<Patient> {
    return apiService.put<Patient>(`${this.baseUrl}/${patientId}/medical-history`, medicalHistory);
  }

  async updateInsurance(
    patientId: string,
    insurance: any
  ): Promise<Patient> {
    return apiService.put<Patient>(`${this.baseUrl}/${patientId}/insurance`, insurance);
  }

  async updateEmergencyContact(
    patientId: string,
    emergencyContact: any
  ): Promise<Patient> {
    return apiService.put<Patient>(`${this.baseUrl}/${patientId}/emergency-contact`, emergencyContact);
  }

  async updateAllergies(
    patientId: string,
    allergies: string[]
  ): Promise<Patient> {
    return apiService.put<Patient>(`${this.baseUrl}/${patientId}/allergies`, { allergies });
  }

  async updateMedications(
    patientId: string,
    medications: string[]
  ): Promise<Patient> {
    return apiService.put<Patient>(`${this.baseUrl}/${patientId}/medications`, { medications });
  }

  async addPatientNote(
    patientId: string,
    note: string
  ): Promise<Patient> {
    return apiService.post<Patient>(`${this.baseUrl}/${patientId}/notes`, { note });
  }

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

  async verifyPatient(patientId: string): Promise<Patient> {
    return apiService.post<Patient>(`${this.baseUrl}/${patientId}/verify`);
  }

  async checkDuplicatePatient(data: Partial<CreatePatientRequest>): Promise<{
    isDuplicate: boolean;
    potentialMatches: Patient[];
  }> {
    return apiService.post<{
      isDuplicate: boolean;
      potentialMatches: Patient[];
    }>(`${this.baseUrl}/check-duplicate`, data);
  }

  async mergePatients(
    primaryPatientId: string,
    secondaryPatientId: string
  ): Promise<Patient> {
    return apiService.post<Patient>(`${this.baseUrl}/merge`, {
      primaryPatientId,
      secondaryPatientId,
    });
  }

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

export const patientApi = new PatientApiService();
