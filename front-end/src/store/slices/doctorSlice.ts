import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { doctorApi } from '../../services/doctorApi';
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
} from '../../types/doctor';

// Async thunks
export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async ({ filters, page, limit }: { filters?: DoctorFilters; page?: number; limit?: number }) => {
    const response = await doctorApi.getDoctors(filters, page, limit);
    return response;
  }
);

export const fetchDoctor = createAsyncThunk(
  'doctors/fetchDoctor',
  async (id: string) => {
    const doctor = await doctorApi.getDoctor(id);
    return doctor;
  }
);

export const fetchDoctorById = createAsyncThunk(
  'doctors/fetchDoctorById',
  async (id: string) => {
    const doctor = await doctorApi.getDoctor(id);
    return doctor;
  }
);

export const fetchDoctorWithSchedule = createAsyncThunk(
  'doctors/fetchDoctorWithSchedule',
  async (id: string) => {
    const doctor = await doctorApi.getDoctorWithSchedule(id);
    return doctor;
  }
);

export const fetchDoctorDetail = createAsyncThunk(
  'doctors/fetchDoctorDetail',
  async (id: string) => {
    const doctor = await doctorApi.getDoctorDetail(id);
    return doctor;
  }
);

export const createDoctor = createAsyncThunk(
  'doctors/createDoctor',
  async (data: CreateDoctorRequest) => {
    const doctor = await doctorApi.createDoctor(data);
    return doctor;
  }
);

export const updateDoctor = createAsyncThunk(
  'doctors/updateDoctor',
  async ({ id, data }: { id: string; data: UpdateDoctorRequest }) => {
    const doctor = await doctorApi.updateDoctor(id, data);
    return doctor;
  }
);

export const deleteDoctor = createAsyncThunk(
  'doctors/deleteDoctor',
  async (id: string) => {
    await doctorApi.deleteDoctor(id);
    return id;
  }
);

export const deactivateDoctor = createAsyncThunk(
  'doctors/deactivateDoctor',
  async ({ id, reason }: { id: string; reason?: string }) => {
    const doctor = await doctorApi.deactivateDoctor(id, reason);
    return doctor;
  }
);

export const reactivateDoctor = createAsyncThunk(
  'doctors/reactivateDoctor',
  async (id: string) => {
    const doctor = await doctorApi.reactivateDoctor(id);
    return doctor;
  }
);

export const fetchDoctorStats = createAsyncThunk(
  'doctors/fetchDoctorStats',
  async (filters?: DoctorFilters) => {
    const stats = await doctorApi.getDoctorStats(filters);
    return stats;
  }
);

export const searchDoctors = createAsyncThunk(
  'doctors/searchDoctors',
  async ({ query, filters, page, limit }: { query: string; filters?: DoctorFilters; page?: number; limit?: number }) => {
    const response = await doctorApi.searchDoctors(query, filters, page, limit);
    return response;
  }
);

export const fetchDoctorsBySpecialization = createAsyncThunk(
  'doctors/fetchDoctorsBySpecialization',
  async ({ specialization, page, limit }: { specialization: Specialization; page?: number; limit?: number }) => {
    const response = await doctorApi.getDoctorsBySpecialization(specialization, page, limit);
    return response;
  }
);

export const fetchAvailableDoctors = createAsyncThunk(
  'doctors/fetchAvailableDoctors',
  async ({ date, time, specialization, page, limit }: { date: string; time?: string; specialization?: Specialization; page?: number; limit?: number }) => {
    const response = await doctorApi.getAvailableDoctors(date, time, specialization, page, limit);
    return response;
  }
);

export const fetchTopRatedDoctors = createAsyncThunk(
  'doctors/fetchTopRatedDoctors',
  async ({ limit, specialization }: { limit?: number; specialization?: Specialization }) => {
    const doctors = await doctorApi.getTopRatedDoctors(limit, specialization);
    return doctors;
  }
);

export const fetchVerifiedDoctors = createAsyncThunk(
  'doctors/fetchVerifiedDoctors',
  async ({ page, limit }: { page?: number; limit?: number }) => {
    const response = await doctorApi.getVerifiedDoctors(page, limit);
    return response;
  }
);

export const fetchNewDoctors = createAsyncThunk(
  'doctors/fetchNewDoctors',
  async ({ days, page, limit }: { days?: number; page?: number; limit?: number }) => {
    const response = await doctorApi.getNewDoctors(days, page, limit);
    return response;
  }
);

export const bulkUpdateDoctors = createAsyncThunk(
  'doctors/bulkUpdateDoctors',
  async ({ doctorIds, updates }: { doctorIds: string[]; updates: Partial<UpdateDoctorRequest> }) => {
    const doctors = await doctorApi.bulkUpdateDoctors(doctorIds, updates);
    return doctors;
  }
);

export const bulkDeactivateDoctors = createAsyncThunk(
  'doctors/bulkDeactivateDoctors',
  async ({ doctorIds, reason }: { doctorIds: string[]; reason?: string }) => {
    const doctors = await doctorApi.bulkDeactivateDoctors(doctorIds, reason);
    return doctors;
  }
);

export const bulkReactivateDoctors = createAsyncThunk(
  'doctors/bulkReactivateDoctors',
  async (doctorIds: string[]) => {
    const doctors = await doctorApi.bulkReactivateDoctors(doctorIds);
    return doctors;
  }
);

export const verifyDoctor = createAsyncThunk(
  'doctors/verifyDoctor',
  async (doctorId: string) => {
    const doctor = await doctorApi.verifyDoctor(doctorId);
    return doctor;
  }
);

export const fetchDoctorReviews = createAsyncThunk(
  'doctors/fetchDoctorReviews',
  async ({ doctorId, page, limit }: { doctorId: string; page?: number; limit?: number }) => {
    const response = await doctorApi.getDoctorReviews(doctorId, page, limit);
    return response;
  }
);

export const createDoctorReview = createAsyncThunk(
  'doctors/createDoctorReview',
  async (data: CreateReviewRequest) => {
    const review = await doctorApi.createDoctorReview(data);
    return review;
  }
);

export const fetchDoctorPerformance = createAsyncThunk(
  'doctors/fetchDoctorPerformance',
  async ({ doctorId, startDate, endDate }: { doctorId: string; startDate: string; endDate: string }) => {
    const performance = await doctorApi.getDoctorPerformance(doctorId, startDate, endDate);
    return performance;
  }
);

// State interface
interface DoctorState {
  // Doctors list
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  selectedDoctorWithSchedule: DoctorWithSchedule | null;
  selectedDoctorDetail: DoctorDetailResponse | null;
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Filters
  filters: DoctorFilters;
  
  // Statistics
  stats: DoctorStats | null;
  
  // Search results
  searchResults: DoctorSearchResult[];
  searchPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Filtered results
  doctorsBySpecialization: Doctor[];
  doctorsBySpecializationPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  availableDoctors: Doctor[];
  availableDoctorsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  topRatedDoctors: Doctor[];
  verifiedDoctors: Doctor[];
  verifiedDoctorsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  newDoctors: Doctor[];
  newDoctorsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Reviews
  doctorReviews: DoctorReview[];
  doctorReviewsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Performance
  doctorPerformance: {
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    averageRating: number;
    totalPatients: number;
    averageConsultationTime: number;
    completionRate: number;
  } | null;
  
  // Loading states
  loading: {
    doctors: boolean;
    doctor: boolean;
    doctorWithSchedule: boolean;
    doctorDetail: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    deactivating: boolean;
    reactivating: boolean;
    stats: boolean;
    searching: boolean;
    doctorsBySpecialization: boolean;
    availableDoctors: boolean;
    topRatedDoctors: boolean;
    verifiedDoctors: boolean;
    newDoctors: boolean;
    bulkUpdating: boolean;
    bulkDeactivating: boolean;
    bulkReactivating: boolean;
    verifying: boolean;
    reviews: boolean;
    creatingReview: boolean;
    performance: boolean;
  };
  
  // Error states
  error: {
    doctors: string | null;
    doctor: string | null;
    doctorWithSchedule: string | null;
    doctorDetail: string | null;
    creating: string | null;
    updating: string | null;
    deleting: string | null;
    deactivating: string | null;
    reactivating: string | null;
    stats: string | null;
    searching: string | null;
    doctorsBySpecialization: string | null;
    availableDoctors: string | null;
    topRatedDoctors: string | null;
    verifiedDoctors: string | null;
    newDoctors: string | null;
    bulkUpdating: string | null;
    bulkDeactivating: string | null;
    bulkReactivating: string | null;
    verifying: string | null;
    reviews: string | null;
    creatingReview: string | null;
    performance: string | null;
  };
}

// Initial state
const initialState: DoctorState = {
  doctors: [],
  selectedDoctor: null,
  selectedDoctorWithSchedule: null,
  selectedDoctorDetail: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {},
  stats: null,
  searchResults: [],
  searchPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  doctorsBySpecialization: [],
  doctorsBySpecializationPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  availableDoctors: [],
  availableDoctorsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  topRatedDoctors: [],
  verifiedDoctors: [],
  verifiedDoctorsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  newDoctors: [],
  newDoctorsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  doctorReviews: [],
  doctorReviewsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  doctorPerformance: null,
  loading: {
    doctors: false,
    doctor: false,
    doctorWithSchedule: false,
    doctorDetail: false,
    creating: false,
    updating: false,
    deleting: false,
    deactivating: false,
    reactivating: false,
    stats: false,
    searching: false,
    doctorsBySpecialization: false,
    availableDoctors: false,
    topRatedDoctors: false,
    verifiedDoctors: false,
    newDoctors: false,
    bulkUpdating: false,
    bulkDeactivating: false,
    bulkReactivating: false,
    verifying: false,
    reviews: false,
    creatingReview: false,
    performance: false,
  },
  error: {
    doctors: null,
    doctor: null,
    doctorWithSchedule: null,
    doctorDetail: null,
    creating: null,
    updating: null,
    deleting: null,
    deactivating: null,
    reactivating: null,
    stats: null,
    searching: null,
    doctorsBySpecialization: null,
    availableDoctors: null,
    topRatedDoctors: null,
    verifiedDoctors: null,
    newDoctors: null,
    bulkUpdating: null,
    bulkDeactivating: null,
    bulkReactivating: null,
    verifying: null,
    reviews: null,
    creatingReview: null,
    performance: null,
  },
};

// Slice
const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    // Clear selected doctor
    clearSelectedDoctor: (state) => {
      state.selectedDoctor = null;
      state.selectedDoctorWithSchedule = null;
      state.selectedDoctorDetail = null;
    },
    
    // Set filters
    setFilters: (state, action: PayloadAction<DoctorFilters>) => {
      state.filters = action.payload;
    },
    
    // Clear filters
    clearFilters: (state) => {
      state.filters = {};
    },
    
    // Set pagination
    setPagination: (state, action: PayloadAction<{ page: number; limit: number }>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    // Clear errors
    clearError: (state, action: PayloadAction<keyof DoctorState['error']>) => {
      state.error[action.payload] = null;
    },
    
    // Clear all errors
    clearAllErrors: (state) => {
      Object.keys(state.error).forEach((key) => {
        state.error[key as keyof DoctorState['error']] = null;
      });
    },
    
    // Reset state
    resetDoctorState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch doctors
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading.doctors = true;
        state.error.doctors = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading.doctors = false;
        state.doctors = action.payload.doctors;
        state.pagination = action.payload.pagination;
        state.stats = action.payload.stats;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading.doctors = false;
        state.error.doctors = action.error.message || 'Failed to fetch doctors';
      });

    // Fetch single doctor
    builder
      .addCase(fetchDoctor.pending, (state) => {
        state.loading.doctor = true;
        state.error.doctor = null;
      })
      .addCase(fetchDoctor.fulfilled, (state, action) => {
        state.loading.doctor = false;
        state.selectedDoctor = action.payload;
      })
      .addCase(fetchDoctor.rejected, (state, action) => {
        state.loading.doctor = false;
        state.error.doctor = action.error.message || 'Failed to fetch doctor';
      });

    // Fetch doctor with schedule
    builder
      .addCase(fetchDoctorWithSchedule.pending, (state) => {
        state.loading.doctorWithSchedule = true;
        state.error.doctorWithSchedule = null;
      })
      .addCase(fetchDoctorWithSchedule.fulfilled, (state, action) => {
        state.loading.doctorWithSchedule = false;
        state.selectedDoctorWithSchedule = action.payload;
      })
      .addCase(fetchDoctorWithSchedule.rejected, (state, action) => {
        state.loading.doctorWithSchedule = false;
        state.error.doctorWithSchedule = action.error.message || 'Failed to fetch doctor with schedule';
      });

    // Fetch doctor detail
    builder
      .addCase(fetchDoctorDetail.pending, (state) => {
        state.loading.doctorDetail = true;
        state.error.doctorDetail = null;
      })
      .addCase(fetchDoctorDetail.fulfilled, (state, action) => {
        state.loading.doctorDetail = false;
        state.selectedDoctorDetail = action.payload;
      })
      .addCase(fetchDoctorDetail.rejected, (state, action) => {
        state.loading.doctorDetail = false;
        state.error.doctorDetail = action.error.message || 'Failed to fetch doctor detail';
      });

    // Create doctor
    builder
      .addCase(createDoctor.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
      })
      .addCase(createDoctor.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.doctors.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createDoctor.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.error.message || 'Failed to create doctor';
      });

    // Update doctor
    builder
      .addCase(updateDoctor.pending, (state) => {
        state.loading.updating = true;
        state.error.updating = null;
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        state.loading.updating = false;
        const index = state.doctors.findIndex(doctor => doctor.id === action.payload.id);
        if (index !== -1) {
          state.doctors[index] = action.payload;
        }
        if (state.selectedDoctor?.id === action.payload.id) {
          state.selectedDoctor = action.payload;
        }
        if (state.selectedDoctorWithSchedule?.id === action.payload.id) {
          state.selectedDoctorWithSchedule = { ...state.selectedDoctorWithSchedule, ...action.payload };
        }
        if (state.selectedDoctorDetail?.id === action.payload.id) {
          state.selectedDoctorDetail = { ...state.selectedDoctorDetail, ...action.payload };
        }
      })
      .addCase(updateDoctor.rejected, (state, action) => {
        state.loading.updating = false;
        state.error.updating = action.error.message || 'Failed to update doctor';
      });

    // Delete doctor
    builder
      .addCase(deleteDoctor.pending, (state) => {
        state.loading.deleting = true;
        state.error.deleting = null;
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.loading.deleting = false;
        state.doctors = state.doctors.filter(doctor => doctor.id !== action.payload);
        state.pagination.total -= 1;
        if (state.selectedDoctor?.id === action.payload) {
          state.selectedDoctor = null;
        }
        if (state.selectedDoctorWithSchedule?.id === action.payload) {
          state.selectedDoctorWithSchedule = null;
        }
        if (state.selectedDoctorDetail?.id === action.payload) {
          state.selectedDoctorDetail = null;
        }
      })
      .addCase(deleteDoctor.rejected, (state, action) => {
        state.loading.deleting = false;
        state.error.deleting = action.error.message || 'Failed to delete doctor';
      });

    // Deactivate doctor
    builder
      .addCase(deactivateDoctor.pending, (state) => {
        state.loading.deactivating = true;
        state.error.deactivating = null;
      })
      .addCase(deactivateDoctor.fulfilled, (state, action) => {
        state.loading.deactivating = false;
        const index = state.doctors.findIndex(doctor => doctor.id === action.payload.id);
        if (index !== -1) {
          state.doctors[index] = action.payload;
        }
        if (state.selectedDoctor?.id === action.payload.id) {
          state.selectedDoctor = action.payload;
        }
        if (state.selectedDoctorWithSchedule?.id === action.payload.id) {
          state.selectedDoctorWithSchedule = { ...state.selectedDoctorWithSchedule, ...action.payload };
        }
        if (state.selectedDoctorDetail?.id === action.payload.id) {
          state.selectedDoctorDetail = { ...state.selectedDoctorDetail, ...action.payload };
        }
      })
      .addCase(deactivateDoctor.rejected, (state, action) => {
        state.loading.deactivating = false;
        state.error.deactivating = action.error.message || 'Failed to deactivate doctor';
      });

    // Reactivate doctor
    builder
      .addCase(reactivateDoctor.pending, (state) => {
        state.loading.reactivating = true;
        state.error.reactivating = null;
      })
      .addCase(reactivateDoctor.fulfilled, (state, action) => {
        state.loading.reactivating = false;
        const index = state.doctors.findIndex(doctor => doctor.id === action.payload.id);
        if (index !== -1) {
          state.doctors[index] = action.payload;
        }
        if (state.selectedDoctor?.id === action.payload.id) {
          state.selectedDoctor = action.payload;
        }
        if (state.selectedDoctorWithSchedule?.id === action.payload.id) {
          state.selectedDoctorWithSchedule = { ...state.selectedDoctorWithSchedule, ...action.payload };
        }
        if (state.selectedDoctorDetail?.id === action.payload.id) {
          state.selectedDoctorDetail = { ...state.selectedDoctorDetail, ...action.payload };
        }
      })
      .addCase(reactivateDoctor.rejected, (state, action) => {
        state.loading.reactivating = false;
        state.error.reactivating = action.error.message || 'Failed to reactivate doctor';
      });

    // Fetch doctor stats
    builder
      .addCase(fetchDoctorStats.pending, (state) => {
        state.loading.stats = true;
        state.error.stats = null;
      })
      .addCase(fetchDoctorStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchDoctorStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error.stats = action.error.message || 'Failed to fetch doctor stats';
      });

    // Search doctors
    builder
      .addCase(searchDoctors.pending, (state) => {
        state.loading.searching = true;
        state.error.searching = null;
      })
      .addCase(searchDoctors.fulfilled, (state, action) => {
        state.loading.searching = false;
        state.searchResults = action.payload.doctors;
        state.searchPagination = {
          page: 1,
          limit: 10,
          total: action.payload.total,
          totalPages: Math.ceil(action.payload.total / 10),
        };
      })
      .addCase(searchDoctors.rejected, (state, action) => {
        state.loading.searching = false;
        state.error.searching = action.error.message || 'Failed to search doctors';
      });

    // Fetch doctors by specialization
    builder
      .addCase(fetchDoctorsBySpecialization.pending, (state) => {
        state.loading.doctorsBySpecialization = true;
        state.error.doctorsBySpecialization = null;
      })
      .addCase(fetchDoctorsBySpecialization.fulfilled, (state, action) => {
        state.loading.doctorsBySpecialization = false;
        state.doctorsBySpecialization = action.payload.doctors;
        state.doctorsBySpecializationPagination = action.payload.pagination;
      })
      .addCase(fetchDoctorsBySpecialization.rejected, (state, action) => {
        state.loading.doctorsBySpecialization = false;
        state.error.doctorsBySpecialization = action.error.message || 'Failed to fetch doctors by specialization';
      });

    // Fetch available doctors
    builder
      .addCase(fetchAvailableDoctors.pending, (state) => {
        state.loading.availableDoctors = true;
        state.error.availableDoctors = null;
      })
      .addCase(fetchAvailableDoctors.fulfilled, (state, action) => {
        state.loading.availableDoctors = false;
        state.availableDoctors = action.payload.doctors;
        state.availableDoctorsPagination = action.payload.pagination;
      })
      .addCase(fetchAvailableDoctors.rejected, (state, action) => {
        state.loading.availableDoctors = false;
        state.error.availableDoctors = action.error.message || 'Failed to fetch available doctors';
      });

    // Fetch top rated doctors
    builder
      .addCase(fetchTopRatedDoctors.pending, (state) => {
        state.loading.topRatedDoctors = true;
        state.error.topRatedDoctors = null;
      })
      .addCase(fetchTopRatedDoctors.fulfilled, (state, action) => {
        state.loading.topRatedDoctors = false;
        state.topRatedDoctors = action.payload;
      })
      .addCase(fetchTopRatedDoctors.rejected, (state, action) => {
        state.loading.topRatedDoctors = false;
        state.error.topRatedDoctors = action.error.message || 'Failed to fetch top rated doctors';
      });

    // Fetch verified doctors
    builder
      .addCase(fetchVerifiedDoctors.pending, (state) => {
        state.loading.verifiedDoctors = true;
        state.error.verifiedDoctors = null;
      })
      .addCase(fetchVerifiedDoctors.fulfilled, (state, action) => {
        state.loading.verifiedDoctors = false;
        state.verifiedDoctors = action.payload.doctors;
        state.verifiedDoctorsPagination = action.payload.pagination;
      })
      .addCase(fetchVerifiedDoctors.rejected, (state, action) => {
        state.loading.verifiedDoctors = false;
        state.error.verifiedDoctors = action.error.message || 'Failed to fetch verified doctors';
      });

    // Fetch new doctors
    builder
      .addCase(fetchNewDoctors.pending, (state) => {
        state.loading.newDoctors = true;
        state.error.newDoctors = null;
      })
      .addCase(fetchNewDoctors.fulfilled, (state, action) => {
        state.loading.newDoctors = false;
        state.newDoctors = action.payload.doctors;
        state.newDoctorsPagination = action.payload.pagination;
      })
      .addCase(fetchNewDoctors.rejected, (state, action) => {
        state.loading.newDoctors = false;
        state.error.newDoctors = action.error.message || 'Failed to fetch new doctors';
      });

    // Bulk update doctors
    builder
      .addCase(bulkUpdateDoctors.pending, (state) => {
        state.loading.bulkUpdating = true;
        state.error.bulkUpdating = null;
      })
      .addCase(bulkUpdateDoctors.fulfilled, (state, action) => {
        state.loading.bulkUpdating = false;
        // Update doctors in the list
        action.payload.forEach(updatedDoctor => {
          const index = state.doctors.findIndex(doctor => doctor.id === updatedDoctor.id);
          if (index !== -1) {
            state.doctors[index] = updatedDoctor;
          }
        });
      })
      .addCase(bulkUpdateDoctors.rejected, (state, action) => {
        state.loading.bulkUpdating = false;
        state.error.bulkUpdating = action.error.message || 'Failed to bulk update doctors';
      });

    // Bulk deactivate doctors
    builder
      .addCase(bulkDeactivateDoctors.pending, (state) => {
        state.loading.bulkDeactivating = true;
        state.error.bulkDeactivating = null;
      })
      .addCase(bulkDeactivateDoctors.fulfilled, (state, action) => {
        state.loading.bulkDeactivating = false;
        // Update doctors in the list
        action.payload.forEach(updatedDoctor => {
          const index = state.doctors.findIndex(doctor => doctor.id === updatedDoctor.id);
          if (index !== -1) {
            state.doctors[index] = updatedDoctor;
          }
        });
      })
      .addCase(bulkDeactivateDoctors.rejected, (state, action) => {
        state.loading.bulkDeactivating = false;
        state.error.bulkDeactivating = action.error.message || 'Failed to bulk deactivate doctors';
      });

    // Bulk reactivate doctors
    builder
      .addCase(bulkReactivateDoctors.pending, (state) => {
        state.loading.bulkReactivating = true;
        state.error.bulkReactivating = null;
      })
      .addCase(bulkReactivateDoctors.fulfilled, (state, action) => {
        state.loading.bulkReactivating = false;
        // Update doctors in the list
        action.payload.forEach(updatedDoctor => {
          const index = state.doctors.findIndex(doctor => doctor.id === updatedDoctor.id);
          if (index !== -1) {
            state.doctors[index] = updatedDoctor;
          }
        });
      })
      .addCase(bulkReactivateDoctors.rejected, (state, action) => {
        state.loading.bulkReactivating = false;
        state.error.bulkReactivating = action.error.message || 'Failed to bulk reactivate doctors';
      });

    // Verify doctor
    builder
      .addCase(verifyDoctor.pending, (state) => {
        state.loading.verifying = true;
        state.error.verifying = null;
      })
      .addCase(verifyDoctor.fulfilled, (state, action) => {
        state.loading.verifying = false;
        const index = state.doctors.findIndex(doctor => doctor.id === action.payload.id);
        if (index !== -1) {
          state.doctors[index] = action.payload;
        }
        if (state.selectedDoctor?.id === action.payload.id) {
          state.selectedDoctor = action.payload;
        }
        if (state.selectedDoctorWithSchedule?.id === action.payload.id) {
          state.selectedDoctorWithSchedule = { ...state.selectedDoctorWithSchedule, ...action.payload };
        }
        if (state.selectedDoctorDetail?.id === action.payload.id) {
          state.selectedDoctorDetail = { ...state.selectedDoctorDetail, ...action.payload };
        }
      })
      .addCase(verifyDoctor.rejected, (state, action) => {
        state.loading.verifying = false;
        state.error.verifying = action.error.message || 'Failed to verify doctor';
      });

    // Fetch doctor reviews
    builder
      .addCase(fetchDoctorReviews.pending, (state) => {
        state.loading.reviews = true;
        state.error.reviews = null;
      })
      .addCase(fetchDoctorReviews.fulfilled, (state, action) => {
        state.loading.reviews = false;
        state.doctorReviews = action.payload.reviews;
        state.doctorReviewsPagination = action.payload.pagination;
      })
      .addCase(fetchDoctorReviews.rejected, (state, action) => {
        state.loading.reviews = false;
        state.error.reviews = action.error.message || 'Failed to fetch doctor reviews';
      });

    // Create doctor review
    builder
      .addCase(createDoctorReview.pending, (state) => {
        state.loading.creatingReview = true;
        state.error.creatingReview = null;
      })
      .addCase(createDoctorReview.fulfilled, (state, action) => {
        state.loading.creatingReview = false;
        state.doctorReviews.unshift(action.payload);
        state.doctorReviewsPagination.total += 1;
      })
      .addCase(createDoctorReview.rejected, (state, action) => {
        state.loading.creatingReview = false;
        state.error.creatingReview = action.error.message || 'Failed to create doctor review';
      });

    // Fetch doctor performance
    builder
      .addCase(fetchDoctorPerformance.pending, (state) => {
        state.loading.performance = true;
        state.error.performance = null;
      })
      .addCase(fetchDoctorPerformance.fulfilled, (state, action) => {
        state.loading.performance = false;
        state.doctorPerformance = action.payload;
      })
      .addCase(fetchDoctorPerformance.rejected, (state, action) => {
        state.loading.performance = false;
        state.error.performance = action.error.message || 'Failed to fetch doctor performance';
      });
  },
});

// Export actions
export const {
  clearSelectedDoctor,
  setFilters,
  clearFilters,
  setPagination,
  clearError,
  clearAllErrors,
  resetDoctorState,
} = doctorSlice.actions;

// Export selectors
export const selectDoctors = (state: { doctors: DoctorState }) => state.doctors.doctors;
export const selectSelectedDoctor = (state: { doctors: DoctorState }) => state.doctors.selectedDoctor;
export const selectSelectedDoctorWithSchedule = (state: { doctors: DoctorState }) => state.doctors.selectedDoctorWithSchedule;
export const selectSelectedDoctorDetail = (state: { doctors: DoctorState }) => state.doctors.selectedDoctorDetail;
export const selectPagination = (state: { doctors: DoctorState }) => state.doctors.pagination;
export const selectFilters = (state: { doctors: DoctorState }) => state.doctors.filters;
export const selectStats = (state: { doctors: DoctorState }) => state.doctors.stats;
export const selectSearchResults = (state: { doctors: DoctorState }) => state.doctors.searchResults;
export const selectSearchPagination = (state: { doctors: DoctorState }) => state.doctors.searchPagination;
export const selectDoctorsBySpecialization = (state: { doctors: DoctorState }) => state.doctors.doctorsBySpecialization;
export const selectDoctorsBySpecializationPagination = (state: { doctors: DoctorState }) => state.doctors.doctorsBySpecializationPagination;
export const selectAvailableDoctors = (state: { doctors: DoctorState }) => state.doctors.availableDoctors;
export const selectAvailableDoctorsPagination = (state: { doctors: DoctorState }) => state.doctors.availableDoctorsPagination;
export const selectTopRatedDoctors = (state: { doctors: DoctorState }) => state.doctors.topRatedDoctors;
export const selectVerifiedDoctors = (state: { doctors: DoctorState }) => state.doctors.verifiedDoctors;
export const selectVerifiedDoctorsPagination = (state: { doctors: DoctorState }) => state.doctors.verifiedDoctorsPagination;
export const selectNewDoctors = (state: { doctors: DoctorState }) => state.doctors.newDoctors;
export const selectNewDoctorsPagination = (state: { doctors: DoctorState }) => state.doctors.newDoctorsPagination;
export const selectDoctorReviews = (state: { doctors: DoctorState }) => state.doctors.doctorReviews;
export const selectDoctorReviewsPagination = (state: { doctors: DoctorState }) => state.doctors.doctorReviewsPagination;
export const selectDoctorPerformance = (state: { doctors: DoctorState }) => state.doctors.doctorPerformance;
export const selectLoading = (state: { doctors: DoctorState }) => state.doctors.loading;
export const selectError = (state: { doctors: DoctorState }) => state.doctors.error;

// Export reducer
export default doctorSlice.reducer;
