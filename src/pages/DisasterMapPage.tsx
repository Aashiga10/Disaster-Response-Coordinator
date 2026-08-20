import React, { useState } from 'react';
import { DisasterMap } from '../components/map/DisasterMap';
import { IncidentModal } from '../components/incidents/IncidentModal';
import { AssignTeamModal } from '../components/rescue/AssignTeamModal';
import { useApp } from '../context/AppContext';
import { Incident } from '../types';

export const DisasterMapPage: React.FC = () => {
  const {
    verifyIncident,
    markIncidentCritical,
    resolveIncident
  } = useApp();

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [teamModalIncident, setTeamModalIncident] = useState<Incident | null>(null);

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Live Disaster GIS Spatial Map
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Geographic visualization of critical emergencies, field rescue battalions, shelters, and hospital trauma beds
          </p>
        </div>
      </div>

      {/* Map Component */}
      <DisasterMap
        fullHeight={true}
        onSelectIncident={(inc) => setSelectedIncident(inc)}
      />

      {/* Modals */}
      {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onVerify={(id) => verifyIncident(id)}
          onAssignTeam={(inc) => {
            setSelectedIncident(null);
            setTeamModalIncident(inc);
          }}
          onMarkCritical={(id) => markIncidentCritical(id)}
          onResolve={(id) => resolveIncident(id)}
        />
      )}

      {teamModalIncident && (
        <AssignTeamModal
          incident={teamModalIncident}
          isOpen={!!teamModalIncident}
          onClose={() => setTeamModalIncident(null)}
        />
      )}
    </div>
  );
};
