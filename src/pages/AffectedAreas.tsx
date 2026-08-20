import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Home,
  LifeBuoy,
  BellRing,
  Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AffectedArea } from '../types';

export const AffectedAreas: React.FC = () => {
  const navigate = useNavigate();
  const { affectedAreas, incidents, operations, addNotification } = useApp();

  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchDistrict, setSearchDistrict] = useState('');

  // Top summary metrics
  const totalAffected = affectedAreas.reduce((acc, a) => acc + a.affectedPopulation, 0);
  const totalEvacuated = affectedAreas.reduce((acc, a) => acc + a.evacuatedPopulation, 0);
  const criticalCount = affectedAreas.filter(a => a.severity === 'Critical').length;
  const totalShelters = affectedAreas.reduce((acc, a) => acc + a.sheltersActive, 0);

  const filteredAreas = affectedAreas.filter(a => {
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
    if (searchDistrict && !a.district.toLowerCase().includes(searchDistrict.toLowerCase())) return false;
    return true;
  });

  const handleIssueWarning = (area: AffectedArea) => {
    addNotification('Evacuation Alert Triggered', `Emergency sirens & SMS broadcast queued for ${area.district}.`, 'warning', '/alerts');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Affected Districts & Hazard Corridors
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time population displacement, shelter capacity tracking, and regional evacuation monitors
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/alerts')}
          className="px-3.5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <BellRing className="w-4 h-4" /> Broadcast Warning
        </button>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Total Affected Citizens</span>
          <div className="text-2xl font-extrabold font-mono text-slate-800">
            {totalAffected.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500">Across {affectedAreas.length} disaster districts</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Citizens Evacuated</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-600">
            {totalEvacuated.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-700 font-medium">
            {Math.round((totalEvacuated / totalAffected) * 100)}% evacuated to safety
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-red-200 bg-red-50/20 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-red-600 uppercase">Districts on Critical Alert</span>
          <div className="text-2xl font-extrabold font-mono text-red-600">
            {criticalCount} Red Zones
          </div>
          <span className="text-[10px] text-red-600 font-medium">Immediate evacuation active</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Active Relief Shelters</span>
          <div className="text-2xl font-extrabold font-mono text-blue-600">
            {totalShelters} Camps
          </div>
          <span className="text-[10px] text-blue-600 font-medium">Equipped with food & medical aid</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        <input
          type="text"
          placeholder="Search district name (e.g. Chennai, Nilgiris, Cuddalore)..."
          value={searchDistrict}
          onChange={(e) => setSearchDistrict(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-300"
        />

        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-md px-3.5 py-2 focus:outline-hidden"
        >
          <option value="all">All Severity Levels</option>
          <option value="Critical">Critical (Red Alert)</option>
          <option value="High">High (Orange Alert)</option>
          <option value="Medium">Medium (Yellow Alert)</option>
          <option value="Low">Low Risk</option>
        </select>
      </div>

      {/* District Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAreas.map((area) => {
          const isCrit = area.severity === 'Critical';
          const evacPercent = Math.round((area.evacuatedPopulation / area.affectedPopulation) * 100);
          const districtIncidents = incidents.filter(i => i.district === area.district);
          const districtTeams = operations.filter(o => o.district === area.district);

          return (
            <div
              key={area.id}
              className={`rounded-xl border p-5 bg-white shadow-sm transition-all flex flex-col justify-between space-y-4 ${
                isCrit
                  ? 'border-red-200 bg-red-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                      {area.primaryDisaster} Hazard Zone
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      {area.district}
                    </h3>
                  </div>

                  <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded uppercase ${
                    isCrit
                      ? 'bg-red-100 text-red-800'
                      : area.severity === 'High'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {area.severity}
                  </span>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 my-3">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Affected Pop</span>
                    <span className="text-base font-mono font-bold text-slate-900">
                      {area.affectedPopulation.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Evacuated</span>
                    <span className="text-base font-mono font-bold text-emerald-700">
                      {area.evacuatedPopulation.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Evacuation Progress */}
                <div className="space-y-1.5 my-3">
                  <div className="flex justify-between text-[11px] font-mono text-slate-500">
                    <span>Evacuation Progress</span>
                    <span className="font-bold text-slate-700">{evacPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        evacPercent > 70 ? 'bg-emerald-500' : evacPercent > 40 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${evacPercent}%` }}
                    />
                  </div>
                </div>

                {/* Logistics breakdown */}
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Home className="w-3.5 h-3.5 text-blue-600" /> Operational Shelters
                    </span>
                    <span className="font-mono font-bold text-slate-800">{area.sheltersActive} active camps</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <LifeBuoy className="w-3.5 h-3.5 text-amber-600" /> Rescue Teams on Ground
                    </span>
                    <span className="font-mono font-bold text-slate-800">{districtTeams.length} squads</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Radio className="w-3.5 h-3.5 text-red-500" /> Logged Incidents
                    </span>
                    <span className="font-mono font-bold text-slate-800">{districtIncidents.length} incidents</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/map')}
                  className="flex-1 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  View Hotspots
                </button>
                <button
                  type="button"
                  onClick={() => handleIssueWarning(area)}
                  className="py-1.5 px-3 rounded-md bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition-colors flex items-center gap-1"
                  title="Issue District Siren Alert"
                >
                  <BellRing className="w-3.5 h-3.5" /> Siren
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
