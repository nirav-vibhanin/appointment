import { apiService } from './api';
import {
  Appointment,
  AppointmentStatus,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  RescheduleAppointmentRequest,
  AppointmentFilters,
  AppointmentStats,
  AppointmentListResponse,
  AppointmentCalendarResponse,
  TimeSlot,
  TimeSlotStatus,
} from '../types/appointment';

export class AppointmentApiService {
  private readonly baseUrl = '/appointments';

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
    const res = await apiService.get<any>(`${this.baseUrl}?${params}`);
    if (Array.isArray(res)) {
      return {
        appointments: res as Appointment[],
        pagination: { page, limit, total: (res as Appointment[]).length, totalPages: 1 },
        stats: undefined as any,
      } as unknown as AppointmentListResponse;
    }
    if (res && Array.isArray(res.data)) {
      const list = res.data as Appointment[];
      return {
        appointments: list,
        pagination: { page, limit, total: list.length, totalPages: 1 },
        stats: res.stats ?? (undefined as any),
      } as unknown as AppointmentListResponse;
    }
    if (res && Array.isArray(res.appointments)) {
      return res as AppointmentListResponse;
    }
    return {
      appointments: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
      stats: undefined as any,
    } as unknown as AppointmentListResponse;
  }

  async getAppointment(id: string): Promise<Appointment> {
    return apiService.get<Appointment>(`${this.baseUrl}/${id}`);
  }

  async createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
    const appointment = await apiService.post<Appointment>(this.baseUrl, data);
    
    apiService.invalidateCache('appointments');
    apiService.invalidateCache('doctors');
    apiService.invalidateCache('patients');
    apiService.invalidateCache('appointments/slots');
    
    return appointment;
  }

  async updateAppointment(id: string, data: UpdateAppointmentRequest): Promise<Appointment> {
    const appointment = await apiService.put<Appointment>(`${this.baseUrl}/${id}`, data);
    
    apiService.invalidateCache('appointments');
    apiService.invalidateCache(`appointments/${id}`);
    
    return appointment;
  }

  async deleteAppointment(id: string): Promise<void> {
    await apiService.delete<void>(`${this.baseUrl}/${id}`);
    
    apiService.invalidateCache('appointments');
    apiService.invalidateCache(`appointments/${id}`);
  }

  async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    const appointment = await apiService.patch<Appointment>(`${this.baseUrl}/${id}/cancel`, {
      reason,
    });
    apiService.invalidateCache('appointments');
    apiService.invalidateCache(`appointments/${id}`);
    apiService.invalidateCache('appointments/slots');
    return appointment;
  }

  async rescheduleAppointment(id: string, data: RescheduleAppointmentRequest): Promise<Appointment> {
    const appointment = await apiService.post<Appointment>(`${this.baseUrl}/${id}/reschedule`, data);
    
    apiService.invalidateCache('appointments');
    apiService.invalidateCache(`appointments/${id}`);
    apiService.invalidateCache('doctors');
    
    return appointment;
  }

  async confirmAppointment(id: string): Promise<Appointment> {
    return this.updateAppointment(id, { status: AppointmentStatus.CONFIRMED });
  }

  async completeAppointment(id: string, diagnosis?: string, prescription?: string): Promise<Appointment> {
    const data: UpdateAppointmentRequest = {
      status: AppointmentStatus.COMPLETED,
      diagnosis,
      prescription,
    };
    
    return this.updateAppointment(id, data);
  }

  async getAppointmentStats(filters?: AppointmentFilters): Promise<AppointmentStats> {
    const params = filters ? this.buildFilterParams(filters) : {};
    const queryString = new URLSearchParams(params).toString();
    
    return apiService.get<AppointmentStats>(`${this.baseUrl}/stats${queryString ? `?${queryString}` : ''}`);
  }

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

  async getAvailableTimeSlots(doctorId: string, date: string, includeBooked: boolean = false): Promise<TimeSlot[]> {
    const params = new URLSearchParams({ doctorId, date, ...(includeBooked ? { includeBooked: 'true' } : {}) });
    return apiService.get<TimeSlot[]>(`${this.baseUrl}/slots/available?${params}`);
  }

  async getAvailableSlots(doctorId: string, date: string, includeBooked: boolean = false): Promise<TimeSlot[]> {
    return this.getAvailableTimeSlots(doctorId, date, includeBooked);
  }

  async getTimeSlot(id: string): Promise<TimeSlot> {
    return apiService.get<TimeSlot>(`${this.baseUrl}/time-slots/${id}`);
  }

  async createTimeSlot(data: Partial<TimeSlot>): Promise<TimeSlot> {
    return apiService.post<TimeSlot>(`${this.baseUrl}/time-slots`, data);
  }

  async updateTimeSlot(id: string, data: Partial<TimeSlot>): Promise<TimeSlot> {
    return apiService.put<TimeSlot>(`${this.baseUrl}/time-slots/${id}`, data);
  }

  async deleteTimeSlot(id: string): Promise<void> {
    await apiService.delete<void>(`${this.baseUrl}/time-slots/${id}`);
  }

  async blockTimeSlot(id: string, _reason?: string): Promise<TimeSlot> {
    return this.updateTimeSlot(id, {
      status: TimeSlotStatus.BLOCKED,
    });
  }

  async getPatientAppointments(
    patientId: string,
    status?: AppointmentStatus[],
    page: number = 1,
    limit: number = 10
  ): Promise<AppointmentListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status: status.join(',') }),
    });

    const res = await apiService.get<any>(`${this.baseUrl}/patient/${patientId}?${params}`);
    if (Array.isArray(res)) {
      return {
        appointments: res as Appointment[],
        pagination: { page, limit, total: (res as Appointment[]).length, totalPages: 1 },
        stats: undefined as any,
      } as unknown as AppointmentListResponse;
    }
    if (res && Array.isArray(res.data)) {
      const list = res.data as Appointment[];
      return {
        appointments: list,
        pagination: { page, limit, total: list.length, totalPages: 1 },
        stats: res.stats ?? (undefined as any),
      } as unknown as AppointmentListResponse;
    }
    if (res && Array.isArray(res.appointments)) {
      return res as AppointmentListResponse;
    }
    return {
      appointments: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
      stats: undefined as any,
    } as unknown as AppointmentListResponse;
  }

  async getDoctorAppointments(
    doctorId: string,
    status?: AppointmentStatus[],
    date?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<AppointmentListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status: status.join(',') }),
      ...(date && { date }),
    });

    const res = await apiService.get<any>(`${this.baseUrl}/doctor/${doctorId}?${params}`);
    if (Array.isArray(res)) {
      return {
        appointments: res as Appointment[],
        pagination: { page, limit, total: (res as Appointment[]).length, totalPages: 1 },
        stats: undefined as any,
      } as unknown as AppointmentListResponse;
    }
    if (res && Array.isArray(res.data)) {
      const list = res.data as Appointment[];
      return {
        appointments: list,
        pagination: { page, limit, total: list.length, totalPages: 1 },
        stats: res.stats ?? (undefined as any),
      } as unknown as AppointmentListResponse;
    }
    if (res && Array.isArray(res.appointments)) {
      return res as AppointmentListResponse;
    }
    return {
      appointments: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
      stats: undefined as any,
    } as unknown as AppointmentListResponse;
  }

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
      ...this.buildFilterParams(filters ?? {}),
    });

    return apiService.get<AppointmentListResponse>(`${this.baseUrl}/search?${params}`);
  }

  async exportAppointments(
    format: 'csv' | 'pdf' | 'excel',
    filters?: AppointmentFilters
  ): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      ...this.buildFilterParams(filters ?? {}),
    });

    const response = await apiService.get<Blob>(`${this.baseUrl}/export?${params}`, {
      responseType: 'blob',
    });

    return response;
  }

  async bulkUpdateAppointments(
    appointmentIds: string[],
    updates: Partial<UpdateAppointmentRequest>
  ): Promise<Appointment[]> {
    const appointments = await apiService.post<Appointment[]>(`${this.baseUrl}/bulk-update`, {
      appointmentIds,
      updates,
    });
    
    apiService.invalidateCache('appointments');
    
    return appointments;
  }

  async bulkCancelAppointments(appointmentIds: string[], reason?: string): Promise<Appointment[]> {
    return this.bulkUpdateAppointments(appointmentIds, {
      status: AppointmentStatus.CANCELLED,
      notes: reason ? `Bulk cancelled: ${reason}` : 'Bulk cancelled',
    });
  }

  async sendAppointmentReminder(appointmentId: string, type: 'email' | 'sms'): Promise<void> {
    await apiService.post<void>(`${this.baseUrl}/${appointmentId}/remind`, { type });
  }

  async addAppointmentNote(appointmentId: string, note: string): Promise<Appointment> {
    return apiService.post<Appointment>(`${this.baseUrl}/${appointmentId}/notes`, { note });
  }

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

export const appointmentApi = new AppointmentApiService();
