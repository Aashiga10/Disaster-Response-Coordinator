import React, { useState } from 'react';
import { X, LifeBuoy } from 'lucide-react';
import { Incident } from '../../types';
import { useApp } from '../../context/AppContext';

interface AssignTeamModalProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AssignTeamModal: React.FC<AssignTeamModalProps> = ({ incident, isOpen, onClose }) => {
  const { operations, assignTeamToIncident, addRescueOperation, addNotification } = useApp();
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [customTeamLeader, setCustomTeamLeader] = useState('');
  const [customTeamSize, setCustomTeamSize] = useState(12);

  if (!isOpen || !incident) return null;

  const activeTeams = [
    'NDRF Alpha Team 04',
    'SDRF Coastal Unit 02',
    'Nilgiris Mountain Rescue & Fire Unit',
    'Greater Chennai Corp Disaster Unit 07',
    'Madurai City Fire & Rescue Unit 1',
    'Coast Guard & Marine Police Unit',
    'NDRF Urban Search & Rescue Unit',
    'State Highways Disaster Quick Response',
    'Custom Rapid Response Squad'
  ];

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    const teamToAssign = selectedTeam || 'NDRF Alpha Team 04';
    
    // Assign to incident
    assignTeamToIncident(incident.id, teamToAssign);

    // If no existing rescue operation matches, create a linked one
    const existingOp = operations.find(o => o.teamName === teamToAssign);
    if (!existingOp) {
      addRescueOperation({
        title: `Operation Relief - ${incident.title.slice(0, 30)}`,
        location: incident.location,
        district: incident.district,
        teamName: teamToAssign,
        disasterType: incident.disasterType,
        priority: incident.priority,
        status: 'Deployed',
        eta: '20 mins',
        teamLeader: customTeamLeader || 'Commander S. Raghavan',
        teamSize: customTeamSize,
        assignedVehicles: ['2 High Axle Trucks', '1 Ambulance', '2 Dinghies'],
        rescuedCount: 0,
        targetCount: incident.affectedPeople,
        notes: `Dispatched to incident ${incident.id}: ${incident.description}`,
        lat: incident.lat,
        lng: incident.lng
      });
    }

    addNotification('Team Dispatched', `${teamToAssign} assigned to ${incident.id}`, 'success', '/rescue');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Dispatch Rescue Team</h3>
              <p className="text-xs text-slate-500 font-mono">Incident: {incident.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleAssign} className="p-5 space-y-4">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-400 block mb-0.5 font-medium">Target Location & Urgency:</span>
            <strong className="text-slate-900 font-bold">{incident.location}, {incident.district}</strong>
            <div className="text-red-600 font-bold mt-1">
              Severity: {incident.severity} • Affected: {incident.affectedPeople} citizens
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Select Response Unit / Battalion
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-300 font-medium"
              required
            >
              <option value="">-- Choose available tactical team --</option>
              {activeTeams.map((team, idx) => (
                <option key={idx} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Designated Team Leader
              </label>
              <input
                type="text"
                placeholder="e.g. Inspector R. Manikandan"
                value={customTeamLeader}
                onChange={(e) => setCustomTeamLeader(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-300"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Personnel Size
              </label>
              <input
                type="number"
                min="2"
                max="50"
                value={customTeamSize}
                onChange={(e) => setCustomTeamSize(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 -mx-5 -mb-5 flex items-center justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <LifeBuoy className="w-3.5 h-3.5" /> Dispatch Team Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
