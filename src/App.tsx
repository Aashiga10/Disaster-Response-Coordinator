import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Incidents } from './pages/Incidents';
import { ReportIncident } from './pages/ReportIncident';
import { DisasterMapPage } from './pages/DisasterMapPage';
import { AffectedAreas } from './pages/AffectedAreas';
import { RescueOperations } from './pages/RescueOperations';
import { Resources } from './pages/Resources';
import { Volunteers } from './pages/Volunteers';
import { Alerts } from './pages/Alerts';
import { Analytics } from './pages/Analytics';
import { EmergencyContacts } from './pages/EmergencyContacts';
import { Settings } from './pages/Settings';
import { AIVerificationPage } from './pages/AIVerificationPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Unauthenticated / Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Authenticated Dashboard Framework */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="incidents" element={<Incidents />} />
            <Route path="report" element={<ReportIncident />} />
            <Route path="verification" element={<AIVerificationPage />} />
            <Route path="map" element={<DisasterMapPage />} />
            <Route path="affected-areas" element={<AffectedAreas />} />
            <Route path="rescue" element={<RescueOperations />} />
            <Route path="resources" element={<Resources />} />
            <Route path="volunteers" element={<Volunteers />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="contacts" element={<EmergencyContacts />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
