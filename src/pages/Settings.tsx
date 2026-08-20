import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Sliders,
  RefreshCw,
  Zap,
  Save,
  Database,
  Download,
  Upload,
  CheckCircle2,
  Server,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { api, BackendHealthResponse } from '../services/api';

export const Settings: React.FC = () => {
  const {
    user,
    switchUserRole,
    resetToDefaults,
    triggerSurgeSimulation,
    addNotification,
    exportDataset,
    importDataset,
    refreshFromBackend,
    isBackendConnected
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userName, setUserName] = useState(user?.name || 'Dr. Anand Ramanathan');
  const [userEmail, setUserEmail] = useState(user?.email || 'coordinator@disaster-eoc.gov.in');
  const [userRole, setUserRole] = useState<UserRole>(user?.role || 'Chief Coordinator');
  const [eocDistrict, setEocDistrict] = useState('Chennai State Operations Room');
  
  // Health telemetry
  const [healthData, setHealthData] = useState<BackendHealthResponse | null>(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Preferences
  const [enableSound, setEnableSound] = useState(true);
  const [autoTriageAI, setAutoTriageAI] = useState(true);
  const [autoRefreshFeed, setAutoRefreshFeed] = useState(true);

  const fetchHealth = async () => {
    setIsLoadingHealth(true);
    try {
      const data = await api.getHealth();
      setHealthData(data);
    } catch (err) {
      console.warn('Backend health check error:', err);
    } finally {
      setIsLoadingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    switchUserRole(userRole);
    addNotification('Profile Saved', 'Emergency Coordinator profile settings updated.', 'success');
  };

  const handleSimulateSurge = async () => {
    await triggerSurgeSimulation();
    await fetchHealth();
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all incidents, rescue missions, and resource allocations to factory demo dataset?')) {
      await resetToDefaults();
      await fetchHealth();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const success = await importDataset(json);
        if (success) {
          await fetchHealth();
        } else {
          addNotification('Import Failed', 'Invalid disaster dataset schema format.', 'critical');
        }
      } catch (err) {
        addNotification('Import Failed', 'JSON parsing error. Check file structure.', 'critical');
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            System & Command Settings
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure backend APIs, coordinator credentials, dataset export/import, and demo simulations
          </p>
        </div>
      </div>

      {/* Backend API & Dataset Integration Section */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" /> Backend API & Live Dataset Connectivity
          </h3>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
              isBackendConnected || healthData?.status === 'operational'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {isBackendConnected || healthData?.status === 'operational' ? 'REST API Connected (Port 3000)' : 'Connecting API...'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The Express backend provides full REST endpoints (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">/api/incidents</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">/api/operations</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">/api/resources</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">/api/alerts</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">/api/ai/triage</code>) for seamless data synchronization and external GIS integration.
        </p>

        {/* Live Backend Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Active Incidents</span>
            <span className="text-base font-mono font-bold text-slate-900">
              {healthData?.counts?.incidents ?? '8'}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Critical Emergencies</span>
            <span className="text-base font-mono font-bold text-red-600">
              {healthData?.counts?.criticalIncidents ?? '3'}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Rescue Missions</span>
            <span className="text-base font-mono font-bold text-amber-700">
              {healthData?.counts?.operations ?? '5'}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">AI Triage Status</span>
            <span className="text-xs font-semibold text-blue-700 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Active (Gemini / Heuristic)
            </span>
          </div>
        </div>

        {/* Action Buttons for Dataset & API */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={exportDataset}
            className="px-3.5 py-2 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4 text-blue-600" /> Export Full Dataset (JSON)
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            type="button"
            disabled={isImporting}
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4 text-purple-600" />
            {isImporting ? 'Importing Dataset...' : 'Import Dataset (JSON)'}
          </button>

          <button
            type="button"
            onClick={async () => {
              await refreshFromBackend();
              await fetchHealth();
              addNotification('Data Refreshed', 'Synced latest state from backend API.', 'success');
            }}
            className="px-3.5 py-2 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${isLoadingHealth ? 'animate-spin' : ''}`} />
            Sync from Server
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <form onSubmit={handleSaveProfile} className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" /> Coordinator Profile & Active Role
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-300"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Official EOC Email</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Security Role</label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-800 font-mono font-medium focus:outline-hidden"
            >
              <option value="Chief Coordinator">Chief Coordinator (Full Command Access)</option>
              <option value="Field Commander">Field Commander (Tactical Rescue Lead)</option>
              <option value="Logistics Officer">Logistics Officer (Resources & Supplies)</option>
              <option value="Volunteer Coordinator">Volunteer Coordinator (Civic Corps)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">EOC Base Station</label>
            <input
              type="text"
              value={eocDistrict}
              onChange={(e) => setEocDistrict(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Save className="w-3.5 h-3.5" /> Save Profile Preferences
          </button>
        </div>
      </form>

      {/* Emergency Simulation Controls */}
      <div className="p-6 rounded-xl bg-white border border-amber-200 bg-amber-50/20 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" /> Disaster Surge Simulator & Testing
          </h3>
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-100 text-amber-800 rounded">
            DEMO TOOLKIT
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Inject live test incidents to verify automatic AI triage deduplication, telemetry dashboards, and multi-agency alert broadcasts.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handleSimulateSurge}
            className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Zap className="w-4 h-4" /> Inject New Emergency Surge Incident
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <RefreshCw className="w-4 h-4 text-red-600" /> Reset Database to Factory Mock
          </button>
        </div>
      </div>

      {/* System Preferences */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" /> Automation & Notification Preferences
        </h3>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">Audible Emergency Siren Beep</span>
              <span className="text-[11px] text-slate-500">Play chime when Critical P1 incidents are detected</span>
            </div>
            <input
              type="checkbox"
              checked={enableSound}
              onChange={(e) => setEnableSound(e.target.checked)}
              className="rounded bg-white border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">Autonomous AI Triage Engine</span>
              <span className="text-[11px] text-slate-500">Auto-calculate threat score and detect duplicate reports</span>
            </div>
            <input
              type="checkbox"
              checked={autoTriageAI}
              onChange={(e) => setAutoTriageAI(e.target.checked)}
              className="rounded bg-white border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">Real-time Stream Auto-Sync</span>
              <span className="text-[11px] text-slate-500">Poll background citizen reports every 10 seconds</span>
            </div>
            <input
              type="checkbox"
              checked={autoRefreshFeed}
              onChange={(e) => setAutoRefreshFeed(e.target.checked)}
              className="rounded bg-white border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
