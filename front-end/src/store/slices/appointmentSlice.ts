import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { appointmentApi } from '../../services/appointmentApi';
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
} from '../../types/appointment';

// Async thunks
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (
    params: { filters?: AppointmentFilters; page?: number; limit?: number } | undefined = {}
  ) => {
    const { filters, page, limit } = params;
    const response = await appointmentApi.getAppointments(filters, page, limit);
    return response;
  }
);

export const fetchAppointment = createAsyncThunk(
  'appointments/fetchAppointment',
  async (id: string) => {
    const appointment = await appointmentApi.getAppointment(id);
    return appointment;
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (data: CreateAppointmentRequest) => {
    const appointment = await appointmentApi.createAppointment(data);
    return appointment;
  }
);

export const updateAppointment = createAsyncThunk(
  'appointments/updateAppointment',
  async ({ id, data }: { id: string; data: UpdateAppointmentRequest }) => {
    const appointment = await appointmentApi.updateAppointment(id, data);
    return appointment;
  }
);

export const deleteAppointment = createAsyncThunk(
  'appointments/deleteAppointment',
  async (id: string) => {
    await appointmentApi.deleteAppointment(id);
    return id;
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancelAppointment',
  async ({ id, reason }: { id: string; reason?: string }) => {
    const appointment = await appointmentApi.cancelAppointment(id, reason);
    return appointment;
  }
);

export const rescheduleAppointment = createAsyncThunk(
  'appointments/rescheduleAppointment',
  async ({ id, data }: { id: string; data: RescheduleAppointmentRequest }) => {
    const appointment = await appointmentApi.rescheduleAppointment(id, data);
    return appointment;
  }
);

export const confirmAppointment = createAsyncThunk(
  'appointments/confirmAppointment',
  async (id: string) => {
    const appointment = await appointmentApi.confirmAppointment(id);
    return appointment;
  }
);

export const completeAppointment = createAsyncThunk(
  'appointments/completeAppointment',
  async ({ id, diagnosis, prescription }: { id: string; diagnosis?: string; prescription?: string }) => {
    const appointment = await appointmentApi.completeAppointment(id, diagnosis, prescription);
    return appointment;
  }
);

export const fetchAppointmentStats = createAsyncThunk(
  'appointments/fetchAppointmentStats',
  async (filters?: AppointmentFilters) => {
    const stats = await appointmentApi.getAppointmentStats(filters);
    return stats;
  }
);

export const fetchAppointmentCalendar = createAsyncThunk(
  'appointments/fetchAppointmentCalendar',
  async ({ startDate, endDate, doctorId }: { startDate: string; endDate: string; doctorId?: string }) => {
    const calendar = await appointmentApi.getAppointmentCalendar(startDate, endDate, doctorId);
    return calendar;
  }
);

export const fetchAvailableTimeSlots = createAsyncThunk(
  'appointments/fetchAvailableTimeSlots',
  async ({ doctorId, date }: { doctorId: string; date: string }) => {
    const timeSlots = await appointmentApi.getAvailableTimeSlots(doctorId, date);
    return timeSlots;
  }
);

export const fetchPatientAppointments = createAsyncThunk(
  'appointments/fetchPatientAppointments',
  async ({ patientId, status, page, limit }: { patientId: string; status?: AppointmentStatus[]; page?: number; limit?: number }) => {
    const response = await appointmentApi.getPatientAppointments(patientId, status, page, limit);
    return response;
  }
);

export const fetchDoctorAppointments = createAsyncThunk(
  'appointments/fetchDoctorAppointments',
  async ({ doctorId, status, date, page, limit }: { doctorId: string; status?: AppointmentStatus[]; date?: string; page?: number; limit?: number }) => {
    const response = await appointmentApi.getDoctorAppointments(doctorId, status, date, page, limit);
    return response;
  }
);

export const fetchUpcomingAppointments = createAsyncThunk(
  'appointments/fetchUpcomingAppointments',
  async ({ patientId, doctorId, limit }: { patientId?: string; doctorId?: string; limit?: number }) => {
    const appointments = await appointmentApi.getUpcomingAppointments(patientId, doctorId, limit);
    return appointments;
  }
);

export const fetchPastAppointments = createAsyncThunk(
  'appointments/fetchPastAppointments',
  async ({ patientId, doctorId, page, limit }: { patientId?: string; doctorId?: string; page?: number; limit?: number }) => {
    const response = await appointmentApi.getPastAppointments(patientId, doctorId, page, limit);
    return response;
  }
);

export const searchAppointments = createAsyncThunk(
  'appointments/searchAppointments',
  async ({ query, filters, page, limit }: { query: string; filters?: AppointmentFilters; page?: number; limit?: number }) => {
    const response = await appointmentApi.searchAppointments(query, filters, page, limit);
    return response;
  }
);

interface AppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  filters: AppointmentFilters;
  
  stats: AppointmentStats | null;
  
  calendar: AppointmentCalendar[];
  
  availableTimeSlots: TimeSlot[];
  
  patientAppointments: Appointment[];
  patientAppointmentsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  doctorAppointments: Appointment[];
  doctorAppointmentsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  upcomingAppointments: Appointment[];
  
  pastAppointments: Appointment[];
  pastAppointmentsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  searchResults: Appointment[];
  searchPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  loading: {
    appointments: boolean;
    appointment: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    cancelling: boolean;
    rescheduling: boolean;
    confirming: boolean;
    completing: boolean;
    stats: boolean;
    calendar: boolean;
    timeSlots: boolean;
    patientAppointments: boolean;
    doctorAppointments: boolean;
    upcomingAppointments: boolean;
    pastAppointments: boolean;
    searching: boolean;
  };
  
  error: {
    appointments: string | null;
    appointment: string | null;
    creating: string | null;
    updating: string | null;
    deleting: string | null;
    cancelling: string | null;
    rescheduling: string | null;
    confirming: string | null;
    completing: string | null;
    stats: string | null;
    calendar: string | null;
    timeSlots: string | null;
    patientAppointments: string | null;
    doctorAppointments: string | null;
    upcomingAppointments: string | null;
    pastAppointments: string | null;
    searching: string | null;
  };
}

const initialState: AppointmentState = {
  appointments: [],
  selectedAppointment: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {},
  stats: null,
  calendar: [],
  availableTimeSlots: [],
  patientAppointments: [],
  patientAppointmentsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  doctorAppointments: [],
  doctorAppointmentsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  upcomingAppointments: [],
  pastAppointments: [],
  pastAppointmentsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  searchResults: [],
  searchPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  loading: {
    appointments: false,
    appointment: false,
    creating: false,
    updating: false,
    deleting: false,
    cancelling: false,
    rescheduling: false,
    confirming: false,
    completing: false,
    stats: false,
    calendar: false,
    timeSlots: false,
    patientAppointments: false,
    doctorAppointments: false,
    upcomingAppointments: false,
    pastAppointments: false,
    searching: false,
  },
  error: {
    appointments: null,
    appointment: null,
    creating: null,
    updating: null,
    deleting: null,
    cancelling: null,
    rescheduling: null,
    confirming: null,
    completing: null,
    stats: null,
    calendar: null,
    timeSlots: null,
    patientAppointments: null,
    doctorAppointments: null,
    upcomingAppointments: null,
    pastAppointments: null,
    searching: null,
  },
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearSelectedAppointment: (state) => {
      state.selectedAppointment = null;
    },
    
    setFilters: (state, action: PayloadAction<AppointmentFilters>) => {
      state.filters = action.payload;
    },
    
    clearFilters: (state) => {
      state.filters = {};
    },
    
    setPagination: (state, action: PayloadAction<{ page: number; limit: number }>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    clearError: (state, action: PayloadAction<keyof AppointmentState['error']>) => {
      state.error[action.payload] = null;
    },
    
    clearAllErrors: (state) => {
      Object.keys(state.error).forEach((key) => {
        state.error[key as keyof AppointmentState['error']] = null;
      });
    },
    
    resetAppointmentState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading.appointments = true;
        state.error.appointments = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading.appointments = false;
        state.appointments = action.payload.appointments;
        state.pagination = action.payload.pagination;
        state.stats = action.payload.stats;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading.appointments = false;
        state.error.appointments = action.error.message || 'Failed to fetch appointments';
      });

    builder
      .addCase(fetchAppointment.pending, (state) => {
        state.loading.appointment = true;
        state.error.appointment = null;
      })
      .addCase(fetchAppointment.fulfilled, (state, action) => {
        state.loading.appointment = false;
        state.selectedAppointment = action.payload;
      })
      .addCase(fetchAppointment.rejected, (state, action) => {
        state.loading.appointment = false;
        state.error.appointment = action.error.message || 'Failed to fetch appointment';
      });

    builder
      .addCase(createAppointment.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.appointments.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.error.message || 'Failed to create appointment';
      });

    builder
      .addCase(updateAppointment.pending, (state) => {
        state.loading.updating = true;
        state.error.updating = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading.updating = false;
        const index = state.appointments.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        if (state.selectedAppointment?.id === action.payload.id) {
          state.selectedAppointment = action.payload;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading.updating = false;
        state.error.updating = action.error.message || 'Failed to update appointment';
      });

    builder
      .addCase(deleteAppointment.pending, (state) => {
        state.loading.deleting = true;
        state.error.deleting = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading.deleting = false;
        state.appointments = state.appointments.filter(app => app.id !== action.payload);
        state.pagination.total -= 1;
        if (state.selectedAppointment?.id === action.payload) {
          state.selectedAppointment = null;
        }
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading.deleting = false;
        state.error.deleting = action.error.message || 'Failed to delete appointment';
      });

    builder
      .addCase(cancelAppointment.pending, (state) => {
        state.loading.cancelling = true;
        state.error.cancelling = null;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.loading.cancelling = false;
        const index = state.appointments.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        if (state.selectedAppointment?.id === action.payload.id) {
          state.selectedAppointment = action.payload;
        }
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading.cancelling = false;
        state.error.cancelling = action.error.message || 'Failed to cancel appointment';
      });

    builder
      .addCase(rescheduleAppointment.pending, (state) => {
        state.loading.rescheduling = true;
        state.error.rescheduling = null;
      })
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        state.loading.rescheduling = false;
        const index = state.appointments.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        if (state.selectedAppointment?.id === action.payload.id) {
          state.selectedAppointment = action.payload;
        }
      })
      .addCase(rescheduleAppointment.rejected, (state, action) => {
        state.loading.rescheduling = false;
        state.error.rescheduling = action.error.message || 'Failed to reschedule appointment';
      });

    builder
      .addCase(confirmAppointment.pending, (state) => {
        state.loading.confirming = true;
        state.error.confirming = null;
      })
      .addCase(confirmAppointment.fulfilled, (state, action) => {
        state.loading.confirming = false;
        const index = state.appointments.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        if (state.selectedAppointment?.id === action.payload.id) {
          state.selectedAppointment = action.payload;
        }
      })
      .addCase(confirmAppointment.rejected, (state, action) => {
        state.loading.confirming = false;
        state.error.confirming = action.error.message || 'Failed to confirm appointment';
      });

    builder
      .addCase(completeAppointment.pending, (state) => {
        state.loading.completing = true;
        state.error.completing = null;
      })
      .addCase(completeAppointment.fulfilled, (state, action) => {
        state.loading.completing = false;
        const index = state.appointments.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        if (state.selectedAppointment?.id === action.payload.id) {
          state.selectedAppointment = action.payload;
        }
      })
      .addCase(completeAppointment.rejected, (state, action) => {
        state.loading.completing = false;
        state.error.completing = action.error.message || 'Failed to complete appointment';
      });

    builder
      .addCase(fetchAppointmentStats.pending, (state) => {
        state.loading.stats = true;
        state.error.stats = null;
      })
      .addCase(fetchAppointmentStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchAppointmentStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error.stats = action.error.message || 'Failed to fetch appointment stats';
      });

    builder
      .addCase(fetchAppointmentCalendar.pending, (state) => {
        state.loading.calendar = true;
        state.error.calendar = null;
      })
      .addCase(fetchAppointmentCalendar.fulfilled, (state, action) => {
        state.loading.calendar = false;
        state.calendar = action.payload.calendar;
        state.stats = action.payload.stats;
      })
      .addCase(fetchAppointmentCalendar.rejected, (state, action) => {
        state.loading.calendar = false;
        state.error.calendar = action.error.message || 'Failed to fetch appointment calendar';
      });

    builder
      .addCase(fetchAvailableTimeSlots.pending, (state) => {
        state.loading.timeSlots = true;
        state.error.timeSlots = null;
      })
      .addCase(fetchAvailableTimeSlots.fulfilled, (state, action) => {
        state.loading.timeSlots = false;
        state.availableTimeSlots = action.payload;
      })
      .addCase(fetchAvailableTimeSlots.rejected, (state, action) => {
        state.loading.timeSlots = false;
        state.error.timeSlots = action.error.message || 'Failed to fetch available time slots';
      });

    builder
      .addCase(fetchPatientAppointments.pending, (state) => {
        state.loading.patientAppointments = true;
        state.error.patientAppointments = null;
      })
      .addCase(fetchPatientAppointments.fulfilled, (state, action) => {
        state.loading.patientAppointments = false;
        state.patientAppointments = action.payload.appointments;
        state.patientAppointmentsPagination = action.payload.pagination;
      })
      .addCase(fetchPatientAppointments.rejected, (state, action) => {
        state.loading.patientAppointments = false;
        state.error.patientAppointments = action.error.message || 'Failed to fetch patient appointments';
      });

    builder
      .addCase(fetchDoctorAppointments.pending, (state) => {
        state.loading.doctorAppointments = true;
        state.error.doctorAppointments = null;
      })
      .addCase(fetchDoctorAppointments.fulfilled, (state, action) => {
        state.loading.doctorAppointments = false;
        state.doctorAppointments = action.payload.appointments;
        state.doctorAppointmentsPagination = action.payload.pagination;
      })
      .addCase(fetchDoctorAppointments.rejected, (state, action) => {
        state.loading.doctorAppointments = false;
        state.error.doctorAppointments = action.error.message || 'Failed to fetch doctor appointments';
      });

    builder
      .addCase(fetchUpcomingAppointments.pending, (state) => {
        state.loading.upcomingAppointments = true;
        state.error.upcomingAppointments = null;
      })
      .addCase(fetchUpcomingAppointments.fulfilled, (state, action) => {
        state.loading.upcomingAppointments = false;
        state.upcomingAppointments = action.payload;
      })
      .addCase(fetchUpcomingAppointments.rejected, (state, action) => {
        state.loading.upcomingAppointments = false;
        state.error.upcomingAppointments = action.error.message || 'Failed to fetch upcoming appointments';
      });

    builder
      .addCase(fetchPastAppointments.pending, (state) => {
        state.loading.pastAppointments = true;
        state.error.pastAppointments = null;
      })
      .addCase(fetchPastAppointments.fulfilled, (state, action) => {
        state.loading.pastAppointments = false;
        state.pastAppointments = action.payload.appointments;
        state.pastAppointmentsPagination = action.payload.pagination;
      })
      .addCase(fetchPastAppointments.rejected, (state, action) => {
        state.loading.pastAppointments = false;
        state.error.pastAppointments = action.error.message || 'Failed to fetch past appointments';
      });

    builder
      .addCase(searchAppointments.pending, (state) => {
        state.loading.searching = true;
        state.error.searching = null;
      })
      .addCase(searchAppointments.fulfilled, (state, action) => {
        state.loading.searching = false;
        state.searchResults = action.payload.appointments;
        state.searchPagination = action.payload.pagination;
      })
      .addCase(searchAppointments.rejected, (state, action) => {
        state.loading.searching = false;
        state.error.searching = action.error.message || 'Failed to search appointments';
      });
  },
});

export const {
  clearSelectedAppointment,
  setFilters,
  clearFilters,
  setPagination,
  clearError,
  clearAllErrors,
  resetAppointmentState,
} = appointmentSlice.actions;

export const selectAppointments = (state: { appointments: AppointmentState }) => state.appointments.appointments;
export const selectSelectedAppointment = (state: { appointments: AppointmentState }) => state.appointments.selectedAppointment;
export const selectPagination = (state: { appointments: AppointmentState }) => state.appointments.pagination;
export const selectFilters = (state: { appointments: AppointmentState }) => state.appointments.filters;
export const selectStats = (state: { appointments: AppointmentState }) => state.appointments.stats;
export const selectCalendar = (state: { appointments: AppointmentState }) => state.appointments.calendar;
export const selectAvailableTimeSlots = (state: { appointments: AppointmentState }) => state.appointments.availableTimeSlots;
export const selectPatientAppointments = (state: { appointments: AppointmentState }) => state.appointments.patientAppointments;
export const selectDoctorAppointments = (state: { appointments: AppointmentState }) => state.appointments.doctorAppointments;
export const selectUpcomingAppointments = (state: { appointments: AppointmentState }) => state.appointments.upcomingAppointments;
export const selectPastAppointments = (state: { appointments: AppointmentState }) => state.appointments.pastAppointments;
export const selectSearchResults = (state: { appointments: AppointmentState }) => state.appointments.searchResults;
export const selectLoading = (state: { appointments: AppointmentState }) => state.appointments.loading;
export const selectError = (state: { appointments: AppointmentState }) => state.appointments.error;

export default appointmentSlice.reducer;
