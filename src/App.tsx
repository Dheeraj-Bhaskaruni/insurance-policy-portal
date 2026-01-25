import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from './store';
import { useAppDispatch } from './store/hooks';
import { restoreSession, logoutUser } from './store/authSlice';
import { setUnauthorizedHandler } from './services/api';
import AppLayout from './components/layout/AppLayout';
import ErrorBoundary from './components/feedback/ErrorBoundary';
import LoadingSpinner from './components/feedback/LoadingSpinner';
import { ToastProvider } from './hooks/useToastContext';
import ProtectedRoute from './features/auth/ProtectedRoute';
import LoginPage from './features/auth/LoginPage';
import { ROUTES } from './utils/constants';

import './assets/styles/global.css';

// Code splitting with lazy loading
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const PoliciesPage = lazy(() => import('./features/policies/PoliciesPage'));
const PolicyDetailPage = lazy(() => import('./features/policies/PolicyDetailPage'));
const CreatePolicyPage = lazy(() => import('./features/policies/CreatePolicyPage'));
const ClaimsPage = lazy(() => import('./features/claims/ClaimsPage'));
const ClaimDetailPage = lazy(() => import('./features/claims/ClaimDetailPage'));
const CreateClaimPage = lazy(() => import('./features/claims/CreateClaimPage'));
const CustomersPage = lazy(() => import('./features/customers/CustomersPage'));
const CustomerDetailPage = lazy(() => import('./features/customers/CustomerDetailPage'));
const ReportsPage = lazy(() => import('./features/reports/ReportsPage'));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage'));

const PageLoader = () => <LoadingSpinner size="lg" message="Loading page..." />;

const AppRoutes: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
    setUnauthorizedHandler(() => {
      dispatch(logoutUser());
    });
  }, [dispatch]);

  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.POLICIES}
          element={
            <Suspense fallback={<PageLoader />}>
              <PoliciesPage />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.POLICY_CREATE}
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute allowedRoles={['admin', 'agent']}>
                <CreatePolicyPage />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path={ROUTES.POLICY_DETAIL}
          element={
            <Suspense fallback={<PageLoader />}>
              <PolicyDetailPage />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.CLAIMS}
          element={
            <Suspense fallback={<PageLoader />}>
              <ClaimsPage />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.CLAIM_CREATE}
          element={
            <Suspense fallback={<PageLoader />}>
              <CreateClaimPage />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.CLAIM_DETAIL}
          element={
            <Suspense fallback={<PageLoader />}>
              <ClaimDetailPage />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.CUSTOMERS}
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute allowedRoles={['admin', 'agent']}>
                <CustomersPage />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path={ROUTES.CUSTOMER_DETAIL}
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute allowedRoles={['admin', 'agent']}>
                <CustomerDetailPage />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path={ROUTES.REPORTS}
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute allowedRoles={['admin', 'agent']}>
                <ReportsPage />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path={ROUTES.SETTINGS}
          element={
            <Suspense fallback={<PageLoader />}>
              <SettingsPage />
            </Suspense>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
