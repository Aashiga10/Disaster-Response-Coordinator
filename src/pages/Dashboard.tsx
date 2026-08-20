import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio,
  AlertOctagon,
  Users,
  LifeBuoy,
  Boxes,
  Clock,
  ArrowRight,
  FilePlus2,
  MapPin,
  ShieldAlert,
  Waves,
  Building,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/dashboard/StatCard';
import { AIResponsePanel } from '../components/dashboard/AIResponsePanel';
import { IncidentTable } from '../components/incidents/IncidentTable';
import { IncidentModal } from '../components/incidents/IncidentModal';
import { AssignTeamModal } from '../components/rescue/AssignTeamModal';
import { Incident } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    incidents,
    operations,
    resources,
    alerts,
    verifyIncident,
    markIncidentCritical,
    resolveIncident
  } = useApp();

  // System Time State
  const [timeString, setTimeString] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Modals
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [teamModalIncident, setTeamModalIncident] = useState<Incident | null>(null);

  // Computed metrics
  const totalActiveIncidents = incidents.filter(i => i.status !== 'Resolved').length;
  const criticalIncidents = incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length;
  const totalAffectedPeople = incidents.reduce((acc, curr) => acc + (curr.affectedPeople || 0), 0);
  const deployedTeamsCount = operations.filter(o => o.status !== 'Completed').length;
  const totalResourcesAvailable = resources.reduce((acc, curr) => acc + curr.available, 0);
  const totalVolunteersStandby = 312;

  // Recent 5 Incidents for table
  const recentIncidents = incidents.slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Disaster Response Overview
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Real-time tracking of active emergencies in Tamil Nadu Sector.
          </p>
        </div>

        <div className="flex items-center gap-6 self-start sm:self-auto">
          <div className="text-left sm:text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              System Time
            </div>
            <div className="text-lg font-mono font-bold text-slate-700">
              {timeString || '14:32:05 UTC'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/report')}
              className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <FilePlus2 className="w-3.5 h-3.5" /> Report Incident
            </button>
            <button
              type="button"
              onClick={() => navigate('/map')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-200 shadow-2xs"
            >
              <MapPin className="w-3.5 h-3.5 text-red-600" /> Disaster Map
            </button>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Active Incidents"
          value={totalActiveIncidents}
          description="Ongoing situations"
          icon={Radio}
          variant="default"
          trend={{ value: '12% vs last 6h', direction: 'up', label: '' }}
          onClick={() => navigate('/incidents')}
        />
        <StatCard
          title="Critical"
          value={criticalIncidents < 10 ? `0${criticalIncidents}` : criticalIncidents}
          description="Urgent Action"
          icon={AlertOctagon}
          variant="danger"
          trend={{ value: 'Urgent Action', direction: 'neutral', label: '' }}
          onClick={() => navigate('/incidents')}
        />
        <StatCard
          title="Affected People"
          value={`${(totalAffectedPeople / 1000).toFixed(1)}k`}
          description="Estimated Reach"
          icon={Users}
          variant="default"
          trend={{ value: 'Estimated Reach', direction: 'neutral', label: '' }}
          onClick={() => navigate('/affected-areas')}
        />
        <StatCard
          title="Rescue Teams"
          value={deployedTeamsCount + 6}
          description="18 Deployed"
          icon={LifeBuoy}
          variant="default"
          trend={{ value: '18 Deployed', direction: 'neutral', label: '' }}
          onClick={() => navigate('/rescue')}
        />
        <StatCard
          title="Resources"
          value="86%"
          description="Optimum Level"
          icon={Boxes}
          variant="default"
          trend={{ value: 'Optimum Level', direction: 'down', label: '' }}
          onClick={() => navigate('/resources')}
        />
        <StatCard
          title="Volunteers"
          value={totalVolunteersStandby}
          description="On Standby"
          icon={Users}
          variant="default"
          trend={{ value: 'On Standby', direction: 'neutral', label: '' }}
          onClick={() => navigate('/volunteers')}
        />
      </div>

      {/* Main 2-Col + 1-Col Layout (Incidents Table & AI Assistant) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Incidents */}
        <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Recent Live Incidents</h3>
              <p className="text-xs text-slate-400 mt-0.5">Priority feed from field coordinators & citizens</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/incidents')}
              className="text-blue-600 hover:text-blue-700 text-xs font-bold inline-flex items-center gap-1"
            >
              View All Incidents →
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <IncidentTable
              incidents={recentIncidents}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
              onVerify={verifyIncident}
              onAssignTeam={(inc) => setTeamModalIncident(inc)}
              onMarkCritical={markIncidentCritical}
              onResolve={resolveIncident}
            />
          </div>
        </section>

        {/* Right 1 Col: AI Response Assistant */}
        <div className="lg:col-span-1">
          <AIResponsePanel />
        </div>
      </div>

      {/* Modals */}
      {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onVerify={verifyIncident}
          onAssignTeam={(inc) => setTeamModalIncident(inc)}
          onMarkCritical={markIncidentCritical}
          onResolve={resolveIncident}
        />
      )}

      {teamModalIncident && (
        <AssignTeamModal
          incident={teamModalIncident}
          onClose={() => setTeamModalIncident(null)}
        />
      )}
    </div>
  );
};
