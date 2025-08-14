import { configureStore } from '@reduxjs/toolkit';
import appointmentReducer from './slices/appointmentSlice';
import patientReducer from './slices/patientSlice';
import doctorReducer from './slices/doctorSlice';

export interface RootState {
  appointments: ReturnType<typeof appointmentReducer>;
  patients: ReturnType<typeof patientReducer>;
  doctors: ReturnType<typeof doctorReducer>;
}

export const store = configureStore({
  reducer: {
    appointments: appointmentReducer,
    patients: patientReducer,
    doctors: doctorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'persist/FLUSH',
        ],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['persist'],
      },
      immutableCheck: {
        ignoredPaths: ['persist'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type AppState = RootState;
