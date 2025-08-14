import { apiService } from './api';
import {
  Doctor,
  Specialization,
  DoctorStatus,
  AvailabilityType,
  CreateDoctorRequest,
  UpdateDoctorRequest,
  DoctorFilters,
  DoctorStats,
  DoctorSearchResult,
  DoctorListResponse,
  DoctorSearchResponse,
  DoctorWithSchedule,
  DoctorDetailResponse,
  DoctorReview,
  CreateReviewRequest,
  DoctorSchedule,
} from '../types/doctor';

export class DoctorApiService {
  private readonly baseUrl = '/doctors';

  // Get all doctors with filtering and pagination
  async getDoctors(
    filters: DoctorFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<DoctorListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...this.buildFilterParams(filters),
    });

    return apiService.get<DoctorListResponse>(`${this.baseUrl}?${params}`);
  }

  // Get doctor by ID
  async getDoctor(id: string): Promise<Doctor> {
    return apiService.get<Doctor>(`${this.baseUrl}/${id}`);
  }

  // Get doctor with schedule and details
  async getDoctorWithSchedule(id: string): Promise<DoctorWithSchedule> {
    return apiService.get<DoctorWithSchedule>(`${this.baseUrl}/${id}/with-schedule`);
  }

  // Get doctor detail with stats
  async getDoctorDetail(id: string): Promise<DoctorDetailResponse> {
    return apiService.get<DoctorDetailResponse>(`${this.baseUrl}/${id}/detail`);
  }

  // Create new doctor
  async createDoctor(data: CreateDoctorRequest): Promise<Doctor> {
    const doctor = await apiService.post<Doctor>(this.baseUrl, data);
    
    // Invalidate related caches
    apiService.invalidateCache('doctors');
    
    return doctor;
  }

  // Update doctor
  async updateDoctor(id: string, data: UpdateDoctorRequest): Promise<Doctor> {
    const doctor = await apiService.put<Doctor>(`${this.baseUrl}/${id}`, data);
    
    // Invalidate related caches
    apiService.invalidateCache('doctors');
    apiService.invalidateCache(`doctors/${id}`);
    
    return doctor;
  }

  // Delete doctor
  async deleteDoctor(id: string): Promise<void> {
    await apiService.delete<void>(`${this.baseUrl}/${id}`);
    
    // Invalidate related caches
    apiService.invalidateCache('doctors');
    apiService.invalidateCache(`doctors/${id}`);
  }

  // Deactivate doctor
  async deactivateDoctor(id: string, reason?: string): Promise<Doctor> {
    return this.updateDoctor(id, {
      status: DoctorStatus.INACTIVE,
      notes: reason ? `Deactivated: ${reason}` : 'Doctor deactivated',
    });
  }

  // Reactivate doctor
  async reactivateDoctor(id: string): Promise<Doctor> {
    return this.updateDoctor(id, { status: DoctorStatus.ACTIVE });
  }

  // Get doctor statistics
  async getDoctorStats(filters?: DoctorFilters): Promise<DoctorStats> {
    const params = filters ? this.buildFilterParams(filters) : {};
    const queryString = new URLSearchParams(params).toString();
    
    return apiService.get<DoctorStats>(`${this.baseUrl}/stats${queryString ? `?${queryString}` : ''}`);
  }

  // Search doctors
  async searchDoctors(
    query: string,
    filters?: DoctorFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<DoctorSearchResponse> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      ...this.buildFilterParams(filters),
    });

    return apiService.get<DoctorSearchResponse>(`${this.baseUrl}/search?${params}`);
  }

  // Get doctors by specialization
  async getDoctorsBySpecialization(
    specialization: Specialization,
    page: number = 1,
    limit: number = 10
  ): Promise<DoctorListResponse> {
    const params = new URLSearchParams({
      specialization,
      page: page.toString(),
      limit: limit.toString(),
    });

    return apiService.get<DoctorListResponse>(`${this.baseUrl}/by-specialization?${params}`);
  }

  // Get doctors by availability type
  async getDoctorsByAvailability(
    availabilityType: AvailabilityType,
    page: number = 1,
    limit: number = 10
  ): Promise<DoctorListResponse> {
    const params = new URLSearchParams({
      availabilityType,
      page: page.toString(),
      limit: limit.toString(),
    });

    return apiService.get<DoctorListResponse>(`${this.baseUrl}/by-availability?${params}`);
  }

  // Get available doctors for a specific date and time
  async getAvailableDoctors(
    date: string,
    time?: string,
    specialization?: Specialization,
    page: number = 1,
    limit: number = 10
  ): Promise<DoctorListResponse> {
    const params = new URLSearchParams({
      date,
      page: page.toString(),
      limit: limit.toString(),
      ...(time && { time }),
      ...(specialization && { specialization }),
    });

    return apiService.get<DoctorListResponse>(`${this.baseUrl}/available?${params}`);
  }

  // Get verified doctors
  async getVerifiedDoctors(
    page: number = 1,
    limit: number = 10
  ): Promise<DoctorListResponse> {
    const params = new URLSearchParams({
      isVerified: 'true',
      page: page.toString(),
      limit: limit.toString(),
    });

    return apiService.get<DoctorListResponse>(`${this.baseUrl}?${params}`);
  }

  // Get top rated doctors
  async getTopRatedDoctors(
    limit: number = 10,
    specialization?: Specialization
  ): Promise<Doctor[]> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      sortBy: 'rating',
      sortOrder: 'desc',
      ...(specialization && { specialization }),
    });

    return apiService.get<Doctor[]>(`${this.baseUrl}/top-rated?${params}`);
  }

  // Get new doctors
  async getNewDoctors(
    days: number = 30,
    page: number = 1,
    limit: number = 10
  ): Promise<DoctorListResponse> {
    const params = new URLSearchParams({
      days: days.toString(),
      page: page.toString(),
      limit: limit.toString(),
    });

    return apiService.get<DoctorListResponse>(`${this.baseUrl}/new?${params}`);
  }

  // Export doctors
  async exportDoctors(
    format: 'csv' | 'pdf' | 'excel',
    filters?: DoctorFilters
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
  async bulkUpdateDoctors(
    doctorIds: string[],
    updates: Partial<UpdateDoctorRequest>
  ): Promise<Doctor[]> {
    const doctors = await apiService.post<Doctor[]>(`${this.baseUrl}/bulk-update`, {
      doctorIds,
      updates,
    });
    
    // Invalidate related caches
    apiService.invalidateCache('doctors');
    
    return doctors;
  }

  async bulkDeactivateDoctors(doctorIds: string[], reason?: string): Promise<Doctor[]> {
    return this.bulkUpdateDoctors(doctorIds, {
      status: DoctorStatus.INACTIVE,
      notes: reason ? `Bulk deactivated: ${reason}` : 'Bulk deactivated',
    });
  }

  async bulkReactivateDoctors(doctorIds: string[]): Promise<Doctor[]> {
    return this.bulkUpdateDoctors(doctorIds, { status: DoctorStatus.ACTIVE });
  }

  // Doctor schedule management
  async getDoctorSchedule(
    doctorId: string,
    startDate: string,
    endDate: string
  ): Promise<DoctorSchedule[]> {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });

    return apiService.get<DoctorSchedule[]>(`${this.baseUrl}/${doctorId}/schedule?${params}`);
  }

  async updateDoctorSchedule(
    doctorId: string,
    schedule: Partial<DoctorSchedule>
  ): Promise<DoctorSchedule> {
    return apiService.put<DoctorSchedule>(`${this.baseUrl}/${doctorId}/schedule`, schedule);
  }

  async blockDoctorSchedule(
    doctorId: string,
    date: string,
    reason?: string
  ): Promise<DoctorSchedule> {
    return apiService.post<DoctorSchedule>(`${this.baseUrl}/${doctorId}/schedule/block`, {
      date,
      reason,
    });
  }

  // Doctor availability management
  async updateDoctorAvailability(
    doctorId: string,
    availability: any
  ): Promise<Doctor> {
    return apiService.put<Doctor>(`${this.baseUrl}/${doctorId}/availability`, availability);
  }

  // Doctor reviews
  async getDoctorReviews(
    doctorId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    reviews: DoctorReview[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return apiService.get<{
      reviews: DoctorReview[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`${this.baseUrl}/${doctorId}/reviews?${params}`);
  }

  async createDoctorReview(data: CreateReviewRequest): Promise<DoctorReview> {
    const review = await apiService.post<DoctorReview>(`${this.baseUrl}/${data.doctorId}/reviews`, data);
    
    // Invalidate related caches
    apiService.invalidateCache(`doctors/${data.doctorId}`);
    
    return review;
  }

  async updateDoctorReview(
    doctorId: string,
    reviewId: string,
    data: Partial<CreateReviewRequest>
  ): Promise<DoctorReview> {
    const review = await apiService.put<DoctorReview>(`${this.baseUrl}/${doctorId}/reviews/${reviewId}`, data);
    
    // Invalidate related caches
    apiService.invalidateCache(`doctors/${doctorId}`);
    
    return review;
  }

  async deleteDoctorReview(doctorId: string, reviewId: string): Promise<void> {
    await apiService.delete<void>(`${this.baseUrl}/${doctorId}/reviews/${reviewId}`);
    
    // Invalidate related caches
    apiService.invalidateCache(`doctors/${doctorId}`);
  }

  // Doctor verification
  async verifyDoctor(doctorId: string): Promise<Doctor> {
    return apiService.post<Doctor>(`${this.baseUrl}/${doctorId}/verify`);
  }

  // Doctor documents
  async uploadDoctorDocument(
    doctorId: string,
    file: File,
    documentType: string,
    onProgress?: (progress: number) => void
  ): Promise<any> {
    return apiService.uploadFile<any>(`${this.baseUrl}/${doctorId}/documents`, file, onProgress);
  }

  async getDoctorDocuments(doctorId: string): Promise<any[]> {
    return apiService.get<any[]>(`${this.baseUrl}/${doctorId}/documents`);
  }

  async deleteDoctorDocument(doctorId: string, documentId: string): Promise<void> {
    await apiService.delete<void>(`${this.baseUrl}/${doctorId}/documents/${documentId}`);
  }

  // Doctor notes
  async addDoctorNote(
    doctorId: string,
    note: string
  ): Promise<Doctor> {
    return apiService.post<Doctor>(`${this.baseUrl}/${doctorId}/notes`, { note });
  }

  // Doctor performance metrics
  async getDoctorPerformance(
    doctorId: string,
    startDate: string,
    endDate: string
  ): Promise<{
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    averageRating: number;
    totalPatients: number;
    averageConsultationTime: number;
    completionRate: number;
  }> {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });

    return apiService.get<{
      totalAppointments: number;
      completedAppointments: number;
      cancelledAppointments: number;
      averageRating: number;
      totalPatients: number;
      averageConsultationTime: number;
      completionRate: number;
    }>(`${this.baseUrl}/${doctorId}/performance?${params}`);
  }

  // Helper method to build filter parameters
  private buildFilterParams(filters: DoctorFilters): Record<string, string> {
    const params: Record<string, string> = {};

    if (filters.search) {
      params.search = filters.search;
    }

    if (filters.specialization?.length) {
      params.specialization = filters.specialization.join(',');
    }

    if (filters.status?.length) {
      params.status = filters.status.join(',');
    }

    if (filters.availabilityType?.length) {
      params.availabilityType = filters.availabilityType.join(',');
    }

    if (filters.experienceMin !== undefined) {
      params.experienceMin = filters.experienceMin.toString();
    }

    if (filters.experienceMax !== undefined) {
      params.experienceMax = filters.experienceMax.toString();
    }

    if (filters.ratingMin !== undefined) {
      params.ratingMin = filters.ratingMin.toString();
    }

    if (filters.feeMin !== undefined) {
      params.feeMin = filters.feeMin.toString();
    }

    if (filters.feeMax !== undefined) {
      params.feeMax = filters.feeMax.toString();
    }

    if (filters.languages?.length) {
      params.languages = filters.languages.join(',');
    }

    if (filters.isVerified !== undefined) {
      params.isVerified = filters.isVerified.toString();
    }

    return params;
  }
}

// Export singleton instance
export const doctorApi = new DoctorApiService();
