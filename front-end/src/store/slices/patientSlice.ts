import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { patientApi } from '../../services/patientApi';
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
} from '../../types/patient';

// Async thunks
export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async ({ filters, page, limit }: { filters?: PatientFilters; page?: number; limit?: number }) => {
    const response = await patientApi.getPatients(filters, page, limit);
    return response;
  }
);

export const fetchPatient = createAsyncThunk(
  'patients/fetchPatient',
  async (id: string) => {
    const patient = await patientApi.getPatient(id);
    return patient;
  }
);

export const fetchPatientWithAppointments = createAsyncThunk(
  'patients/fetchPatientWithAppointments',
  async (id: string) => {
    const patient = await patientApi.getPatientWithAppointments(id);
    return patient;
  }
);

export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (data: CreatePatientRequest) => {
    const patient = await patientApi.createPatient(data);
    return patient;
  }
);

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, data }: { id: string; data: UpdatePatientRequest }) => {
    const patient = await patientApi.updatePatient(id, data);
    return patient;
  }
);

export const deletePatient = createAsyncThunk(
  'patients/deletePatient',
  async (id: string) => {
    await patientApi.deletePatient(id);
    return id;
  }
);

export const deactivatePatient = createAsyncThunk(
  'patients/deactivatePatient',
  async ({ id, reason }: { id: string; reason?: string }) => {
    const patient = await patientApi.deactivatePatient(id, reason);
    return patient;
  }
);

export const reactivatePatient = createAsyncThunk(
  'patients/reactivatePatient',
  async (id: string) => {
    const patient = await patientApi.reactivatePatient(id);
    return patient;
  }
);

export const fetchPatientStats = createAsyncThunk(
  'patients/fetchPatientStats',
  async (filters?: PatientFilters) => {
    const stats = await patientApi.getPatientStats(filters);
    return stats;
  }
);

export const searchPatients = createAsyncThunk(
  'patients/searchPatients',
  async ({ query, filters, page, limit }: { query: string; filters?: PatientFilters; page?: number; limit?: number }) => {
    const response = await patientApi.searchPatients(query, filters, page, limit);
    return response;
  }
);

export const fetchPatientsByDoctor = createAsyncThunk(
  'patients/fetchPatientsByDoctor',
  async ({ doctorId, page, limit }: { doctorId: string; page?: number; limit?: number }) => {
    const response = await patientApi.getPatientsByDoctor(doctorId, page, limit);
    return response;
  }
);

export const fetchPatientsByInsurance = createAsyncThunk(
  'patients/fetchPatientsByInsurance',
  async ({ provider, page, limit }: { provider: InsuranceProvider; page?: number; limit?: number }) => {
    const response = await patientApi.getPatientsByInsurance(provider, page, limit);
    return response;
  }
);

export const fetchPatientsByAgeGroup = createAsyncThunk(
  'patients/fetchPatientsByAgeGroup',
  async ({ ageGroup, page, limit }: { ageGroup: string; page?: number; limit?: number }) => {
    const response = await patientApi.getPatientsByAgeGroup(ageGroup, page, limit);
    return response;
  }
);

export const fetchPatientsByLocation = createAsyncThunk(
  'patients/fetchPatientsByLocation',
  async ({ city, state, page, limit }: { city?: string; state?: string; page?: number; limit?: number }) => {
    const response = await patientApi.getPatientsByLocation(city, state, page, limit);
    return response;
  }
);

export const fetchNewPatients = createAsyncThunk(
  'patients/fetchNewPatients',
  async ({ days, page, limit }: { days?: number; page?: number; limit?: number }) => {
    const response = await patientApi.getNewPatients(days, page, limit);
    return response;
  }
);

export const fetchInactivePatients = createAsyncThunk(
  'patients/fetchInactivePatients',
  async ({ page, limit }: { page?: number; limit?: number }) => {
    const response = await patientApi.getInactivePatients(page, limit);
    return response;
  }
);

export const bulkUpdatePatients = createAsyncThunk(
  'patients/bulkUpdatePatients',
  async ({ patientIds, updates }: { patientIds: string[]; updates: Partial<UpdatePatientRequest> }) => {
    const patients = await patientApi.bulkUpdatePatients(patientIds, updates);
    return patients;
  }
);

export const bulkDeactivatePatients = createAsyncThunk(
  'patients/bulkDeactivatePatients',
  async ({ patientIds, reason }: { patientIds: string[]; reason?: string }) => {
    const patients = await patientApi.bulkDeactivatePatients(patientIds, reason);
    return patients;
  }
);

export const bulkReactivatePatients = createAsyncThunk(
  'patients/bulkReactivatePatients',
  async (patientIds: string[]) => {
    const patients = await patientApi.bulkReactivatePatients(patientIds);
    return patients;
  }
);

export const checkDuplicatePatient = createAsyncThunk(
  'patients/checkDuplicatePatient',
  async (data: Partial<CreatePatientRequest>) => {
    const result = await patientApi.checkDuplicatePatient(data);
    return result;
  }
);

export const mergePatients = createAsyncThunk(
  'patients/mergePatients',
  async ({ primaryPatientId, secondaryPatientId }: { primaryPatientId: string; secondaryPatientId: string }) => {
    const patient = await patientApi.mergePatients(primaryPatientId, secondaryPatientId);
    return patient;
  }
);

// State interface
interface PatientState {
  // Patients list
  patients: Patient[];
  selectedPatient: Patient | null;
  selectedPatientWithAppointments: PatientWithAppointments | null;
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Filters
  filters: PatientFilters;
  
  // Statistics
  stats: PatientStats | null;
  
  // Search results
  searchResults: PatientSearchResult[];
  searchPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Filtered results
  patientsByDoctor: Patient[];
  patientsByDoctorPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  patientsByInsurance: Patient[];
  patientsByInsurancePagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  patientsByAgeGroup: Patient[];
  patientsByAgeGroupPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  patientsByLocation: Patient[];
  patientsByLocationPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  newPatients: Patient[];
  newPatientsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  inactivePatients: Patient[];
  inactivePatientsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Duplicate check
  duplicateCheck: {
    isDuplicate: boolean;
    potentialMatches: Patient[];
  } | null;
  
  // Loading states
  loading: {
    patients: boolean;
    patient: boolean;
    patientWithAppointments: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    deactivating: boolean;
    reactivating: boolean;
    stats: boolean;
    searching: boolean;
    patientsByDoctor: boolean;
    patientsByInsurance: boolean;
    patientsByAgeGroup: boolean;
    patientsByLocation: boolean;
    newPatients: boolean;
    inactivePatients: boolean;
    bulkUpdating: boolean;
    bulkDeactivating: boolean;
    bulkReactivating: boolean;
    duplicateChecking: boolean;
    merging: boolean;
  };
  
  // Error states
  error: {
    patients: string | null;
    patient: string | null;
    patientWithAppointments: string | null;
    creating: string | null;
    updating: string | null;
    deleting: string | null;
    deactivating: string | null;
    reactivating: string | null;
    stats: string | null;
    searching: string | null;
    patientsByDoctor: string | null;
    patientsByInsurance: string | null;
    patientsByAgeGroup: string | null;
    patientsByLocation: string | null;
    newPatients: string | null;
    inactivePatients: string | null;
    bulkUpdating: string | null;
    bulkDeactivating: string | null;
    bulkReactivating: string | null;
    duplicateChecking: string | null;
    merging: string | null;
  };
}

// Initial state
const initialState: PatientState = {
  patients: [],
  selectedPatient: null,
  selectedPatientWithAppointments: null,
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
  patientsByDoctor: [],
  patientsByDoctorPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  patientsByInsurance: [],
  patientsByInsurancePagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  patientsByAgeGroup: [],
  patientsByAgeGroupPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  patientsByLocation: [],
  patientsByLocationPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  newPatients: [],
  newPatientsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  inactivePatients: [],
  inactivePatientsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  duplicateCheck: null,
  loading: {
    patients: false,
    patient: false,
    patientWithAppointments: false,
    creating: false,
    updating: false,
    deleting: false,
    deactivating: false,
    reactivating: false,
    stats: false,
    searching: false,
    patientsByDoctor: false,
    patientsByInsurance: false,
    patientsByAgeGroup: false,
    patientsByLocation: false,
    newPatients: false,
    inactivePatients: false,
    bulkUpdating: false,
    bulkDeactivating: false,
    bulkReactivating: false,
    duplicateChecking: false,
    merging: false,
  },
  error: {
    patients: null,
    patient: null,
    patientWithAppointments: null,
    creating: null,
    updating: null,
    deleting: null,
    deactivating: null,
    reactivating: null,
    stats: null,
    searching: null,
    patientsByDoctor: null,
    patientsByInsurance: null,
    patientsByAgeGroup: null,
    patientsByLocation: null,
    newPatients: null,
    inactivePatients: null,
    bulkUpdating: null,
    bulkDeactivating: null,
    bulkReactivating: null,
    duplicateChecking: null,
    merging: null,
  },
};

// Slice
const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    // Clear selected patient
    clearSelectedPatient: (state) => {
      state.selectedPatient = null;
      state.selectedPatientWithAppointments = null;
    },
    
    // Set filters
    setFilters: (state, action: PayloadAction<PatientFilters>) => {
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
    
    // Clear duplicate check
    clearDuplicateCheck: (state) => {
      state.duplicateCheck = null;
    },
    
    // Clear errors
    clearError: (state, action: PayloadAction<keyof PatientState['error']>) => {
      state.error[action.payload] = null;
    },
    
    // Clear all errors
    clearAllErrors: (state) => {
      Object.keys(state.error).forEach((key) => {
        state.error[key as keyof PatientState['error']] = null;
      });
    },
    
    // Reset state
    resetPatientState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch patients
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading.patients = true;
        state.error.patients = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading.patients = false;
        state.patients = action.payload.patients;
        state.pagination = action.payload.pagination;
        state.stats = action.payload.stats;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading.patients = false;
        state.error.patients = action.error.message || 'Failed to fetch patients';
      });

    // Fetch single patient
    builder
      .addCase(fetchPatient.pending, (state) => {
        state.loading.patient = true;
        state.error.patient = null;
      })
      .addCase(fetchPatient.fulfilled, (state, action) => {
        state.loading.patient = false;
        state.selectedPatient = action.payload;
      })
      .addCase(fetchPatient.rejected, (state, action) => {
        state.loading.patient = false;
        state.error.patient = action.error.message || 'Failed to fetch patient';
      });

    // Fetch patient with appointments
    builder
      .addCase(fetchPatientWithAppointments.pending, (state) => {
        state.loading.patientWithAppointments = true;
        state.error.patientWithAppointments = null;
      })
      .addCase(fetchPatientWithAppointments.fulfilled, (state, action) => {
        state.loading.patientWithAppointments = false;
        state.selectedPatientWithAppointments = action.payload;
      })
      .addCase(fetchPatientWithAppointments.rejected, (state, action) => {
        state.loading.patientWithAppointments = false;
        state.error.patientWithAppointments = action.error.message || 'Failed to fetch patient with appointments';
      });

    // Create patient
    builder
      .addCase(createPatient.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.patients.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.error.message || 'Failed to create patient';
      });

    // Update patient
    builder
      .addCase(updatePatient.pending, (state) => {
        state.loading.updating = true;
        state.error.updating = null;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.loading.updating = false;
        const index = state.patients.findIndex(patient => patient.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
        if (state.selectedPatient?.id === action.payload.id) {
          state.selectedPatient = action.payload;
        }
        if (state.selectedPatientWithAppointments?.id === action.payload.id) {
          state.selectedPatientWithAppointments = { ...state.selectedPatientWithAppointments, ...action.payload };
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.loading.updating = false;
        state.error.updating = action.error.message || 'Failed to update patient';
      });

    // Delete patient
    builder
      .addCase(deletePatient.pending, (state) => {
        state.loading.deleting = true;
        state.error.deleting = null;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.loading.deleting = false;
        state.patients = state.patients.filter(patient => patient.id !== action.payload);
        state.pagination.total -= 1;
        if (state.selectedPatient?.id === action.payload) {
          state.selectedPatient = null;
        }
        if (state.selectedPatientWithAppointments?.id === action.payload) {
          state.selectedPatientWithAppointments = null;
        }
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.loading.deleting = false;
        state.error.deleting = action.error.message || 'Failed to delete patient';
      });

    // Deactivate patient
    builder
      .addCase(deactivatePatient.pending, (state) => {
        state.loading.deactivating = true;
        state.error.deactivating = null;
      })
      .addCase(deactivatePatient.fulfilled, (state, action) => {
        state.loading.deactivating = false;
        const index = state.patients.findIndex(patient => patient.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
        if (state.selectedPatient?.id === action.payload.id) {
          state.selectedPatient = action.payload;
        }
        if (state.selectedPatientWithAppointments?.id === action.payload.id) {
          state.selectedPatientWithAppointments = { ...state.selectedPatientWithAppointments, ...action.payload };
        }
      })
      .addCase(deactivatePatient.rejected, (state, action) => {
        state.loading.deactivating = false;
        state.error.deactivating = action.error.message || 'Failed to deactivate patient';
      });

    // Reactivate patient
    builder
      .addCase(reactivatePatient.pending, (state) => {
        state.loading.reactivating = true;
        state.error.reactivating = null;
      })
      .addCase(reactivatePatient.fulfilled, (state, action) => {
        state.loading.reactivating = false;
        const index = state.patients.findIndex(patient => patient.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
        if (state.selectedPatient?.id === action.payload.id) {
          state.selectedPatient = action.payload;
        }
        if (state.selectedPatientWithAppointments?.id === action.payload.id) {
          state.selectedPatientWithAppointments = { ...state.selectedPatientWithAppointments, ...action.payload };
        }
      })
      .addCase(reactivatePatient.rejected, (state, action) => {
        state.loading.reactivating = false;
        state.error.reactivating = action.error.message || 'Failed to reactivate patient';
      });

    // Fetch patient stats
    builder
      .addCase(fetchPatientStats.pending, (state) => {
        state.loading.stats = true;
        state.error.stats = null;
      })
      .addCase(fetchPatientStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchPatientStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error.stats = action.error.message || 'Failed to fetch patient stats';
      });

    // Search patients
    builder
      .addCase(searchPatients.pending, (state) => {
        state.loading.searching = true;
        state.error.searching = null;
      })
      .addCase(searchPatients.fulfilled, (state, action) => {
        state.loading.searching = false;
        state.searchResults = action.payload.patients;
        state.searchPagination = action.payload.pagination;
      })
      .addCase(searchPatients.rejected, (state, action) => {
        state.loading.searching = false;
        state.error.searching = action.error.message || 'Failed to search patients';
      });

    // Fetch patients by doctor
    builder
      .addCase(fetchPatientsByDoctor.pending, (state) => {
        state.loading.patientsByDoctor = true;
        state.error.patientsByDoctor = null;
      })
      .addCase(fetchPatientsByDoctor.fulfilled, (state, action) => {
        state.loading.patientsByDoctor = false;
        state.patientsByDoctor = action.payload.patients;
        state.patientsByDoctorPagination = action.payload.pagination;
      })
      .addCase(fetchPatientsByDoctor.rejected, (state, action) => {
        state.loading.patientsByDoctor = false;
        state.error.patientsByDoctor = action.error.message || 'Failed to fetch patients by doctor';
      });

    // Fetch patients by insurance
    builder
      .addCase(fetchPatientsByInsurance.pending, (state) => {
        state.loading.patientsByInsurance = true;
        state.error.patientsByInsurance = null;
      })
      .addCase(fetchPatientsByInsurance.fulfilled, (state, action) => {
        state.loading.patientsByInsurance = false;
        state.patientsByInsurance = action.payload.patients;
        state.patientsByInsurancePagination = action.payload.pagination;
      })
      .addCase(fetchPatientsByInsurance.rejected, (state, action) => {
        state.loading.patientsByInsurance = false;
        state.error.patientsByInsurance = action.error.message || 'Failed to fetch patients by insurance';
      });

    // Fetch patients by age group
    builder
      .addCase(fetchPatientsByAgeGroup.pending, (state) => {
        state.loading.patientsByAgeGroup = true;
        state.error.patientsByAgeGroup = null;
      })
      .addCase(fetchPatientsByAgeGroup.fulfilled, (state, action) => {
        state.loading.patientsByAgeGroup = false;
        state.patientsByAgeGroup = action.payload.patients;
        state.patientsByAgeGroupPagination = action.payload.pagination;
      })
      .addCase(fetchPatientsByAgeGroup.rejected, (state, action) => {
        state.loading.patientsByAgeGroup = false;
        state.error.patientsByAgeGroup = action.error.message || 'Failed to fetch patients by age group';
      });

    // Fetch patients by location
    builder
      .addCase(fetchPatientsByLocation.pending, (state) => {
        state.loading.patientsByLocation = true;
        state.error.patientsByLocation = null;
      })
      .addCase(fetchPatientsByLocation.fulfilled, (state, action) => {
        state.loading.patientsByLocation = false;
        state.patientsByLocation = action.payload.patients;
        state.patientsByLocationPagination = action.payload.pagination;
      })
      .addCase(fetchPatientsByLocation.rejected, (state, action) => {
        state.loading.patientsByLocation = false;
        state.error.patientsByLocation = action.error.message || 'Failed to fetch patients by location';
      });

    // Fetch new patients
    builder
      .addCase(fetchNewPatients.pending, (state) => {
        state.loading.newPatients = true;
        state.error.newPatients = null;
      })
      .addCase(fetchNewPatients.fulfilled, (state, action) => {
        state.loading.newPatients = false;
        state.newPatients = action.payload.patients;
        state.newPatientsPagination = action.payload.pagination;
      })
      .addCase(fetchNewPatients.rejected, (state, action) => {
        state.loading.newPatients = false;
        state.error.newPatients = action.error.message || 'Failed to fetch new patients';
      });

    // Fetch inactive patients
    builder
      .addCase(fetchInactivePatients.pending, (state) => {
        state.loading.inactivePatients = true;
        state.error.inactivePatients = null;
      })
      .addCase(fetchInactivePatients.fulfilled, (state, action) => {
        state.loading.inactivePatients = false;
        state.inactivePatients = action.payload.patients;
        state.inactivePatientsPagination = action.payload.pagination;
      })
      .addCase(fetchInactivePatients.rejected, (state, action) => {
        state.loading.inactivePatients = false;
        state.error.inactivePatients = action.error.message || 'Failed to fetch inactive patients';
      });

    // Bulk update patients
    builder
      .addCase(bulkUpdatePatients.pending, (state) => {
        state.loading.bulkUpdating = true;
        state.error.bulkUpdating = null;
      })
      .addCase(bulkUpdatePatients.fulfilled, (state, action) => {
        state.loading.bulkUpdating = false;
        // Update patients in the list
        action.payload.forEach(updatedPatient => {
          const index = state.patients.findIndex(patient => patient.id === updatedPatient.id);
          if (index !== -1) {
            state.patients[index] = updatedPatient;
          }
        });
      })
      .addCase(bulkUpdatePatients.rejected, (state, action) => {
        state.loading.bulkUpdating = false;
        state.error.bulkUpdating = action.error.message || 'Failed to bulk update patients';
      });

    // Bulk deactivate patients
    builder
      .addCase(bulkDeactivatePatients.pending, (state) => {
        state.loading.bulkDeactivating = true;
        state.error.bulkDeactivating = null;
      })
      .addCase(bulkDeactivatePatients.fulfilled, (state, action) => {
        state.loading.bulkDeactivating = false;
        // Update patients in the list
        action.payload.forEach(updatedPatient => {
          const index = state.patients.findIndex(patient => patient.id === updatedPatient.id);
          if (index !== -1) {
            state.patients[index] = updatedPatient;
          }
        });
      })
      .addCase(bulkDeactivatePatients.rejected, (state, action) => {
        state.loading.bulkDeactivating = false;
        state.error.bulkDeactivating = action.error.message || 'Failed to bulk deactivate patients';
      });

    // Bulk reactivate patients
    builder
      .addCase(bulkReactivatePatients.pending, (state) => {
        state.loading.bulkReactivating = true;
        state.error.bulkReactivating = null;
      })
      .addCase(bulkReactivatePatients.fulfilled, (state, action) => {
        state.loading.bulkReactivating = false;
        // Update patients in the list
        action.payload.forEach(updatedPatient => {
          const index = state.patients.findIndex(patient => patient.id === updatedPatient.id);
          if (index !== -1) {
            state.patients[index] = updatedPatient;
          }
        });
      })
      .addCase(bulkReactivatePatients.rejected, (state, action) => {
        state.loading.bulkReactivating = false;
        state.error.bulkReactivating = action.error.message || 'Failed to bulk reactivate patients';
      });

    // Check duplicate patient
    builder
      .addCase(checkDuplicatePatient.pending, (state) => {
        state.loading.duplicateChecking = true;
        state.error.duplicateChecking = null;
      })
      .addCase(checkDuplicatePatient.fulfilled, (state, action) => {
        state.loading.duplicateChecking = false;
        state.duplicateCheck = action.payload;
      })
      .addCase(checkDuplicatePatient.rejected, (state, action) => {
        state.loading.duplicateChecking = false;
        state.error.duplicateChecking = action.error.message || 'Failed to check for duplicate patient';
      });

    // Merge patients
    builder
      .addCase(mergePatients.pending, (state) => {
        state.loading.merging = true;
        state.error.merging = null;
      })
      .addCase(mergePatients.fulfilled, (state, action) => {
        state.loading.merging = false;
        // Update the merged patient in the list
        const index = state.patients.findIndex(patient => patient.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
        if (state.selectedPatient?.id === action.payload.id) {
          state.selectedPatient = action.payload;
        }
        if (state.selectedPatientWithAppointments?.id === action.payload.id) {
          state.selectedPatientWithAppointments = { ...state.selectedPatientWithAppointments, ...action.payload };
        }
      })
      .addCase(mergePatients.rejected, (state, action) => {
        state.loading.merging = false;
        state.error.merging = action.error.message || 'Failed to merge patients';
      });
  },
});

// Export actions
export const {
  clearSelectedPatient,
  setFilters,
  clearFilters,
  setPagination,
  clearDuplicateCheck,
  clearError,
  clearAllErrors,
  resetPatientState,
} = patientSlice.actions;

// Export selectors
export const selectPatients = (state: { patients: PatientState }) => state.patients.patients;
export const selectSelectedPatient = (state: { patients: PatientState }) => state.patients.selectedPatient;
export const selectSelectedPatientWithAppointments = (state: { patients: PatientState }) => state.patients.selectedPatientWithAppointments;
export const selectPagination = (state: { patients: PatientState }) => state.patients.pagination;
export const selectFilters = (state: { patients: PatientState }) => state.patients.filters;
export const selectStats = (state: { patients: PatientState }) => state.patients.stats;
export const selectSearchResults = (state: { patients: PatientState }) => state.patients.searchResults;
export const selectSearchPagination = (state: { patients: PatientState }) => state.patients.searchPagination;
export const selectPatientsByDoctor = (state: { patients: PatientState }) => state.patients.patientsByDoctor;
export const selectPatientsByDoctorPagination = (state: { patients: PatientState }) => state.patients.patientsByDoctorPagination;
export const selectPatientsByInsurance = (state: { patients: PatientState }) => state.patients.patientsByInsurance;
export const selectPatientsByInsurancePagination = (state: { patients: PatientState }) => state.patients.patientsByInsurancePagination;
export const selectPatientsByAgeGroup = (state: { patients: PatientState }) => state.patients.patientsByAgeGroup;
export const selectPatientsByAgeGroupPagination = (state: { patients: PatientState }) => state.patients.patientsByAgeGroupPagination;
export const selectPatientsByLocation = (state: { patients: PatientState }) => state.patients.patientsByLocation;
export const selectPatientsByLocationPagination = (state: { patients: PatientState }) => state.patients.patientsByLocationPagination;
export const selectNewPatients = (state: { patients: PatientState }) => state.patients.newPatients;
export const selectNewPatientsPagination = (state: { patients: PatientState }) => state.patients.newPatientsPagination;
export const selectInactivePatients = (state: { patients: PatientState }) => state.patients.inactivePatients;
export const selectInactivePatientsPagination = (state: { patients: PatientState }) => state.patients.inactivePatientsPagination;
export const selectDuplicateCheck = (state: { patients: PatientState }) => state.patients.duplicateCheck;
export const selectLoading = (state: { patients: PatientState }) => state.patients.loading;
export const selectError = (state: { patients: PatientState }) => state.patients.error;

// Export reducer
export default patientSlice.reducer;
