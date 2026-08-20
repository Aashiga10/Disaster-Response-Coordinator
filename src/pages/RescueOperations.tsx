import React, { useState } from 'react';
import {
  LifeBuoy,
  Plus,
  Truck,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  Shield,
  Search,
  Filter,
  UserCheck,
  Zap,
  ArrowRight,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RescueOperation } from '../types';

export const RescueOperations: React.FC = () => {
  const {
    operations,
    addRescueOperation,
    updateRescueOperation,
    affectedAreas,
    addNotification
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);

  // New Operation form state
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDistrict, setNewDistrict] = useState(affectedAreas[0]?.district || 'Chennai');
  const [newTeamName, setNewTeamName] = useState('NDRF Urban Search & Rescue Unit');
  const [newLeader, setNewLeader] = useState('Deputy Commandant V. Sundaram');
  const [newSize, setNewSize] = useState(16);
  const [newTarget, setNewTarget] = useState(120);
  const [newEta, setNewEta] = useState('15 mins');

  // Summary counts
  const totalRescued = operations.reduce((acc, o) => acc + o.rescuedCount, 0);
  const totalTarget = operations.reduce((acc, o) => acc + o.targetCount, 0);
  const activeOps = operations.filter(o => o.status !== 'Completed').length;
  const completedOps = operations.filter(o => o.status === 'Completed').length;

  const filteredOps = operations.filter(op => {
    if (filterStatus !== 'all' && op.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        op.id.toLowerCase().includes(q) ||
        op.title.toLowerCase().includes(q) ||
        op.teamName.toLowerCase().includes(q) ||
        op.location.toLowerCase().includes(q) ||
        op.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLocation) return;

    addRescueOperation({
      title: newTitle,
      location: newLocation,
      district: newDistrict,
      teamName: newTeamName,
      disasterType: 'flood',
      priority: 'P1 - Immediate',
      status: 'Deployed',
      eta: newEta,
      teamLeader: newLeader,
      teamSize: newSize,
      assignedVehicles: ['2 Inflatable Gemini Boats', '1 4x4 Rescue Truck', '1 Trauma Ambulance'],
      rescuedCount: 0,
      targetCount: newTarget,
      notes: 'Initial tactical team deployed with live satellite comms.',
      lat: 13.0827,
      lng: 80.2707
    });

    setIsCreating(false);
    setNewTitle('');
    setNewLocation('');
  };

  const handleUpdateRescueCount = (opId: string, countToAdd: number) => {
    const target = operations.find(o => o.id === opId);
    if (target) {
      const newCount = target.rescuedCount + countToAdd;
      const isComplete = newCount >= target.targetCount;
      updateRescueOperation(opId, {
        rescuedCount: newCount,
        status: isComplete ? 'Completed' : target.status
      });
      addNotification(
        'Rescue Progress Logged',
        `+${countToAdd} evacuated in ${target.title}. (Total: ${newCount})`,
        'success'
      );
    }
  };

  const handleStatusChange = (opId: string, newStatus: RescueOperation['status']) => {
    updateRescueOperation(opId, { status: newStatus });
    addNotification('Mission Status Updated', `Mission ${opId} updated to ${newStatus}.`, 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Rescue Operations & Tactical Squads
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time deployment tracking for NDRF, SDRF, Marine Units, and Fire & Rescue Battalions
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Launch New Mission
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Active Deployments</span>
          <div className="text-2xl font-extrabold font-mono text-blue-600">{activeOps} Teams</div>
          <span className="text-[10px] text-slate-500">NDRF, SDRF & Marine units</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Total Citizens Rescued</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-600">{totalRescued.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-700 font-medium">
            {Math.round((totalRescued / (totalTarget || 1)) * 100)}% of target evacuated
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Target Extraction Pool</span>
          <div className="text-2xl font-extrabold font-mono text-slate-800">{totalTarget.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">Stranded individuals</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Completed Missions</span>
          <div className="text-2xl font-extrabold font-mono text-slate-700">{completedOps} Missions</div>
          <span className="text-[10px] text-slate-500">Successfully de-escalated</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search rescue operations by mission, team, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-md px-3.5 py-2 focus:outline-hidden"
        >
          <option value="all">All Mission Statuses</option>
          <option value="Deployed">Deployed</option>
          <option value="En Route">En Route</option>
          <option value="On Scene">On Scene</option>
          <option value="Evacuating">Evacuating</option>
          <option value="Standby">Standby</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Operations List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredOps.map((op) => {
          const progress = Math.min(100, Math.round((op.rescuedCount / (op.targetCount || 1)) * 100));

          return (
            <div
              key={op.id}
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{op.id}</span>
                      <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                        {op.disasterType}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">{op.title}</h3>
                  </div>

                  <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded ${
                    op.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : op.status === 'Evacuating'
                      ? 'bg-red-100 text-red-700 animate-pulse'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {op.status.toUpperCase()}
                  </span>
                </div>

                {/* Team Details */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-800">
                    <span className="font-bold text-blue-700">{op.teamName}</span>
                    <span className="font-mono text-slate-500 font-semibold">ETA: {op.eta}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Commander: <strong className="text-slate-700">{op.teamLeader}</strong></span>
                    <span>Personnel: <strong className="text-slate-700">{op.teamSize} responders</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{op.location}, {op.district}</span>
                  </div>
                </div>

                {/* Rescue Progress Bar */}
                <div className="space-y-1.5 my-3.5">
                  <div className="flex justify-between text-[11px] font-mono text-slate-500">
                    <span>Extraction Progress</span>
                    <span className="font-bold text-slate-800">
                      {op.rescuedCount} / {op.targetCount} citizens ({progress}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        progress >= 100 ? 'bg-emerald-500' : progress > 50 ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Assigned Equipment */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Assigned Fleet</span>
                  <div className="flex flex-wrap gap-1.5">
                    {op.assignedVehicles.map((v, i) => (
                      <span key={i} className="px-2 py-0.5 text-[11px] rounded bg-slate-100 text-slate-700 font-medium">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                {/* Add rescued increment buttons */}
                {op.status !== 'Completed' && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleUpdateRescueCount(op.id, 5)}
                      className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold hover:bg-emerald-100 transition-colors"
                      title="Log 5 citizens rescued"
                    >
                      +5 Saved
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateRescueCount(op.id, 20)}
                      className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold hover:bg-emerald-100 transition-colors"
                      title="Log 20 citizens rescued"
                    >
                      +20 Saved
                    </button>
                  </div>
                )}

                {/* Status Switcher */}
                <div className="flex items-center gap-1.5">
                  <select
                    value={op.status}
                    onChange={(e) => handleStatusChange(op.id, e.target.value as RescueOperation['status'])}
                    className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-700 font-medium"
                  >
                    <option value="Deployed">Deployed</option>
                    <option value="En Route">En Route</option>
                    <option value="On Scene">On Scene</option>
                    <option value="Evacuating">Evacuating</option>
                    <option value="Standby">Standby</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Operation Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Launch Tactical Rescue Mission</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Mission Code Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Operation Adyar Evacuation Squad"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">District</label>
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-800"
                  >
                    {affectedAreas.map((a) => (
                      <option key={a.id} value={a.district}>
                        {a.district}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Location / Landmark</label>
                  <input
                    type="text"
                    placeholder="e.g. Kotturpuram Bridge"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Battalion Unit</label>
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Commander Name</label>
                  <input
                    type="text"
                    value={newLeader}
                    onChange={(e) => setNewLeader(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Responders</label>
                  <input
                    type="number"
                    value={newSize}
                    onChange={(e) => setNewSize(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Target Evacuees</label>
                  <input
                    type="number"
                    value={newTarget}
                    onChange={(e) => setNewTarget(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">ETA</label>
                  <input
                    type="text"
                    value={newEta}
                    onChange={(e) => setNewEta(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3.5 py-2 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
                >
                  Deploy Mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
