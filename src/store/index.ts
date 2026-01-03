import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import claimsReducer from './claimsSlice';
import customersReducer from './customersSlice';
import dashboardReducer from './dashboardSlice';
import policiesReducer from './policiesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    policies: policiesReducer,
    claims: claimsReducer,
    customers: customersReducer,
    dashboard: dashboardReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
