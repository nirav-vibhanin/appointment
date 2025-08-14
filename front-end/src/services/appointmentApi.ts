import { apiService } from './api';
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  RescheduleAppointmentRequest,
  AppointmentFilters,
  AppointmentStats,
  AppointmentCalendar,
  AppointmentListResponse,
  AppointmentCalendarResponse,
  TimeSlot,
  TimeSlotStatus,
} from '../types/appointment';

export class AppointmentApiService {
  private readonly baseUrl = '/appointments';

  // Get all appointments with filtering and pagination
  async getAppointments(
    filters: AppointmentFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<AppointmentListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...this.buildFilterParams(filters),
    });

    return apiService.get<AppointmentListResponse>(`${this.baseUrl}?${params}`);
  }

  // Get appointment by ID
  async getAppointment(id: string): Promise<Appointment> {
    return apiService.get<Appointment>(`${this.baseUrl}/${id}`);
  }

  // Create new appointment
  async createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
    const appointment = await apiService.post<Appointment>(this.baseUrl, data);
    
    // Invalidate related caches
    apiService.invalidateCache('appointments');
    apiService.invalidateCache('doctors');
    apiService.invalidateCache('patients');
    
    return appointment;
  }

  // Update appointment
  async updateAppointment(id: string, data: UpdateAppointmentRequest): Promise<Appointment> {
    const appointment = await apiService.put<Appointment>(`${this.baseUrl}/${id}`, data);
    
    // Invalidate related caches
    apiService.invalidateCache('appointments');
    apiService.invalidateCache(`appointments/${id}`);
    
    return appointment;
  }

  // Delete appointment
  async deleteAppointment(id: string): Promise<void> {
    await apiService.delete<void>(`${this.baseUrl}/${id}`);
    
    // Invalidate related caches
    apiService.invalidateCache('appointments');
    apiService.invalidateCache(`appointments/${id}`);
  }

  // Cancel appointment
  async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    const data = {
      status: AppointmentStatus.CANCELLED,
      notes: reason ? `Cancelled: ${reason}` : 'Appointment cancelled',
    };
    
    return this.updateAppointment(id, data);
  }

  // Reschedule appointment
  async rescheduleAppointment(id: string, data: RescheduleAppointmentRequest): Promise<Appointment> {
    const appointment = await apiService.post<Appointment>(`${this.baseUrl}/${id}/reschedule`, data);
    
    // Invalidate related caches
    apiService.invalidateCache('appointments');
    apiService.invalidateCache(`appointments/${id}`);
    apiService.invalidateCache('doctors');
    
    return appointment;
  }

  // Confirm appointment
  async confirmAppointment(id: string): Promise<Appointment> {
    return this.updateAppointment(id, { status: AppointmentStatus.CONFIRMED });
  }

  // Mark appointment as completed
  async completeAppointment(id: string, diagnosis?: string, prescription?: string): Promise<Appointment> {
    const data: UpdateAppointmentRequest = {
      status: AppointmentStatus.COMPLETED,
      diagnosis,
      prescription,
    };
    
    return this.updateAppointment(id, data);
  }

  // Get appointment statistics
  async getAppointmentStats(filters?: AppointmentFilters): Promise<AppointmentStats> {
    const params = filters ? this.buildFilterParams(filters) : {};
    const queryString = new URLSearchParams(params).toString();
    
    return apiService.get<AppointmentStats>(`${this.baseUrl}/stats${queryString ? `?${queryString}` : ''}`);
  }

  // Get appointment calendar
  async getAppointmentCalendar(
    startDate: string,
    endDate: string,
    doctorId?: string
  ): Promise<AppointmentCalendarResponse> {
    const params = new URLSearchParams({
      startDate,
      endDate,
      ...(doctorId && { doctorId }),
    });

    return apiService.get<AppointmentCalendarResponse>(`${this.baseUrl}/calendar?${params}`);
  }

  // Get available time slots for a doctor on a specific date
  async getAvailableTimeSlots(doctorId: string, date: string): Promise<TimeSlot[]> {
    const params = new URLSearchParams({ doctorId, date });
    return apiService.get<TimeSlot[]>(`${this.baseUrl}/time-slots?${params}`);
  }

  // Alias for backward compatibility
  async getAvailableSlots(doctorId: string, date: string): Promise<TimeSlot[]> {
    return this.getAvailableTimeSlots(doctorId, date);
  }

  // Get time slots by ID
  async getTimeSlot(id: string): Promise<TimeSlot> {
    return apiService.get<TimeSlot>(`${this.baseUrl}/time-slots/${id}`);
  }

  // Create time slot
  async createTimeSlot(data: Partial<TimeSlot>): Promise<TimeSlot> {
    return apiService.post<TimeSlot>(`${this.baseUrl}/time-slots`, data);
  }

  // Update time slot
  async updateTimeSlot(id: string, data: Partial<TimeSlot>): Promise<TimeSlot> {
    return apiService.put<TimeSlot>(`${this.baseUrl}/time-slots/${id}`, data);
  }

  // Delete time slot
  async deleteTimeSlot(id: string): Promise<void> {
    await apiService.delete<void>(`${this.baseUrl}/time-slots/${id}`);
  }

  // Block time slot
  async blockTimeSlot(id: string, reason?: string): Promise<TimeSlot> {
    return this.updateTimeSlot(id, {
      status: TimeSlotStatus.BLOCKED,
      notes: reason,
    });
  }

  // Get appointments by patient
  async getPatientAppointments(
    patientId: string,
    status?: AppointmentStatus[],
    page: number = 1,
    limit: number = 10
  ): Promise<AppointmentListResponse> {
    const params = new URLSearchParams({
      patientId,
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status: status.join(',') }),
    });

    return apiService.get<AppointmentListResponse>(`${this.baseUrl}/patient/${patientId}?${params}`);
  }

  // Get appointments by doctor
  async getDoctorAppointments(
    doctorId: string,
    status?: AppointmentStatus[],
    date?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<AppointmentListResponse> {
    const params = new URLSearchParams({
      doctorId,
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status: status.join(',') }),
      ...(date && { date }),
    });

    return apiService.get<AppointmentListResponse>(`${this.baseUrl}/doctor/${doctorId}?${params}`);
  }

  // Get upcoming appointments
  async getUpcomingAppointments(
    patientId?: string,
    doctorId?: string,
    limit: number = 10
  ): Promise<Appointment[]> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      ...(patientId && { patientId }),
      ...(doctorId && { doctorId }),
    });

    return apiService.get<Appointment[]>(`${this.baseUrl}/upcoming?${params}`);
  }

  // Get past appointments
  async getPastAppointments(
    patientId?: string,
    doctorId?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<AppointmentListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(patientId && { patientId }),
      ...(doctorId && { doctorId }),
    });

    return apiService.get<AppointmentListResponse>(`${this.baseUrl}/past?${params}`);
  }

  // Search appointments
  async searchAppointments(
    query: string,
    filters?: AppointmentFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<AppointmentListResponse> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      ...this.buildFilterParams(filters),
    });

    return apiService.get<AppointmentListResponse>(`${this.baseUrl}/search?${params}`);
  }

  // Export appointments
  async exportAppointments(
    format: 'csv' | 'pdf' | 'excel',
    filters?: AppointmentFilters
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
  async bulkUpdateAppointments(
    appointmentIds: string[],
    updates: Partial<UpdateAppointmentRequest>
  ): Promise<Appointment[]> {
    const appointments = await apiService.post<Appointment[]>(`${this.baseUrl}/bulk-update`, {
      appointmentIds,
      updates,
    });
    
    // Invalidate related caches
    apiService.invalidateCache('appointments');
    
    return appointments;
  }

  async bulkCancelAppointments(appointmentIds: string[], reason?: string): Promise<Appointment[]> {
    return this.bulkUpdateAppointments(appointmentIds, {
      status: AppointmentStatus.CANCELLED,
      notes: reason ? `Bulk cancelled: ${reason}` : 'Bulk cancelled',
    });
  }

  // Appointment reminders
  async sendAppointmentReminder(appointmentId: string, type: 'email' | 'sms'): Promise<void> {
    await apiService.post<void>(`${this.baseUrl}/${appointmentId}/remind`, { type });
  }

  // Appointment notes
  async addAppointmentNote(appointmentId: string, note: string): Promise<Appointment> {
    return apiService.post<Appointment>(`${this.baseUrl}/${appointmentId}/notes`, { note });
  }

  // Appointment follow-up
  async scheduleFollowUp(
    appointmentId: string,
    followUpDate: string,
    reason?: string
  ): Promise<Appointment> {
    return apiService.post<Appointment>(`${this.baseUrl}/${appointmentId}/follow-up`, {
      followUpDate,
      reason,
    });
  }

  // Helper method to build filter parameters
  private buildFilterParams(filters: AppointmentFilters): Record<string, string> {
    const params: Record<string, string> = {};

    if (filters.status?.length) {
      params.status = filters.status.join(',');
    }

    if (filters.type?.length) {
      params.type = filters.type.join(',');
    }

    if (filters.dateFrom) {
      params.dateFrom = filters.dateFrom;
    }

    if (filters.dateTo) {
      params.dateTo = filters.dateTo;
    }

    if (filters.doctorId) {
      params.doctorId = filters.doctorId;
    }

    if (filters.patientId) {
      params.patientId = filters.patientId;
    }

    if (filters.search) {
      params.search = filters.search;
    }

    return params;
  }
}

// Export singleton instance
export const appointmentApi = new AppointmentApiService();
