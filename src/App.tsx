/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { UserRole } from './types';

// Pages
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import CredentialsPage from './pages/Credentials';
import AdminPanelPage from './pages/AdminPanel';
import ProfilePage from './pages/Profile';
import NotificationsPage from './pages/Notifications';
import SharedCredentialAcceptPage from './pages/SharedCredentialAccept';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/credentials" element={
              <ProtectedRoute>
                <MainLayout>
                  <CredentialsPage />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/notifications" element={
              <ProtectedRoute>
                <MainLayout>
                  <NotificationsPage />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/invitation/:id/:notificationId" element={
              <ProtectedRoute>
                <MainLayout>
                  <SharedCredentialAcceptPage />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <MainLayout>
                  <AdminPanelPage />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" expand={true} richColors />
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
