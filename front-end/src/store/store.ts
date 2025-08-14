import { configureStore } from '@reduxjs/toolkit';
import appointmentReducer from './slices/appointmentSlice';
import patientReducer from './slices/patientSlice';
import doctorReducer from './slices/doctorSlice';

// Root state type
export interface RootState {
  appointments: ReturnType<typeof appointmentReducer>;
  patients: ReturnType<typeof patientReducer>;
  doctors: ReturnType<typeof doctorReducer>;
}

// Store configuration
export const store = configureStore({
  reducer: {
    appointments: appointmentReducer,
    patients: patientReducer,
    doctors: doctorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'persist/FLUSH',
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['persist'],
      },
      immutableCheck: {
        // Ignore these paths in the state
        ignoredPaths: ['persist'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types
export type AppDispatch = typeof store.dispatch;
export type AppState = RootState;
