import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio,
  Search,
  Filter,
  FilePlus2,
  Table,
  LayoutGrid,
  AlertOctagon,
  AlertTriangle,
  UserCheck,
  Clock,
  CheckCircle2,
  X,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IncidentTable } from '../components/incidents/IncidentTable';
import { IncidentModal } from '../components/incidents/IncidentModal';
import { AssignTeamModal } from '../components/rescue/AssignTeamModal';
import { Incident } from '../types';

export const Incidents: React.FC = () => {
  const navigate = useNavigate();
  const {
    incidents,
    verifyIncident,
    markIncidentCritical,
    resolveIncident,
    affectedAreas,
    syncLiveFeeds
  } = useApp();

  const [isSyncingFeeds, setIsSyncingFeeds] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedVerification, setSelectedVerification] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [feedFilter, setFeedFilter] = useState<'all' | 'live' | 'flagged'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const handleSyncLiveFeeds = async () => {
    setIsSyncingFeeds(true);
    await syncLiveFeeds();
    setIsSyncingFeeds(false);
  };

  // Modals
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [teamModalIncident, setTeamModalIncident] = useState<Incident | null>(null);

  // Filter logic
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          inc.id.toLowerCase().includes(q) ||
          inc.title.toLowerCase().includes(q) ||
          inc.location.toLowerCase().includes(q) ||
          inc.district.toLowerCase().includes(q) ||
          inc.description.toLowerCase().includes(q) ||
          inc.reporterName.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Live Feed / Flagged Filter
      if (feedFilter === 'live' && !inc.isLiveFeed && inc.source !== 'Live News / GDACS') return false;
      if (feedFilter === 'flagged' && !inc.isLikelyFake && (inc.credibilityScore === undefined || inc.credibilityScore >= 50)) return false;

      // Disaster Type
      if (selectedType !== 'all' && inc.disasterType !== selectedType) return false;

      // Severity
      if (selectedSeverity !== 'all' && inc.severity !== selectedSeverity) return false;

      // Status
      if (selectedStatus !== 'all' && inc.status !== selectedStatus) return false;

      // Verification
      if (selectedVerification !== 'all' && inc.verificationStatus !== selectedVerification) return false;

      // District
      if (selectedDistrict !== 'all' && inc.district !== selectedDistrict) return false;

      return true;
    });
  }, [
    incidents,
    searchQuery,
    selectedType,
    selectedSeverity,
    selectedStatus,
    selectedVerification,
    selectedDistrict
  ]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedSeverity('all');
    setSelectedStatus('all');
    setSelectedVerification('all');
    setSelectedDistrict('all');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedType !== 'all' ||
    selectedSeverity !== 'all' ||
    selectedStatus !== 'all' ||
    selectedVerification !== 'all' ||
    selectedDistrict !== 'all';

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Live Incidents Directory
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor, verify, dispatch, and triage incoming emergency incident logs
          </p>
        </div>

        {/* CTA & View switcher */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            disabled={isSyncingFeeds}
            onClick={handleSyncLiveFeeds}
            className="px-3.5 py-2 rounded-md bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5 disabled:opacity-60"
            title="Fetch real-time data from USGS & GDACS feeds"
          >
            <Radio className={`w-3.5 h-3.5 text-cyan-600 ${isSyncingFeeds ? 'animate-spin' : 'animate-pulse'}`} />
            {isSyncingFeeds ? 'Syncing Global Feeds...' : 'Sync Live Feeds (USGS/GDACS)'}
          </button>

          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'cards' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('/report')}
            className="px-3.5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <FilePlus2 className="w-4 h-4" /> Log Incident (Voice / Text)
          </button>
        </div>
      </div>

      {/* Filter Bar & Metric Badges */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3.5 shadow-sm">
        {/* Search input + direct filters */}
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, title, location, reporter or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-300"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Disaster Type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-md px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-slate-300 font-medium"
            >
              <option value="all">All Disasters</option>
              <option value="flood">Flood</option>
              <option value="cyclone">Cyclone</option>
              <option value="landslide">Landslide</option>
              <option value="fire">Fire</option>
              <option value="building_collapse">Collapse</option>
              <option value="other">Other</option>
            </select>

            {/* Severity */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-md px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-slate-300 font-medium"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-md px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-slate-300 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Verified">Verified</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            {/* District */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-md px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-slate-300 font-medium"
            >
              <option value="all">All Districts</option>
              {affectedAreas.map((a) => (
                <option key={a.id} value={a.district}>
                  {a.district}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Counter Summary Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs flex-wrap font-mono">
          <span className="text-slate-500 font-sans">Showing {filteredIncidents.length} of {incidents.length} incidents:</span>
          <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold font-mono">
            {incidents.filter(i => i.severity === 'Critical').length} Critical
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold font-mono">
            {incidents.filter(i => i.status === 'New').length} New Unverified
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold font-mono">
            {incidents.filter(i => i.status === 'In Progress').length} Active Response
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold font-mono">
            {incidents.filter(i => i.status === 'Resolved').length} Resolved
          </span>
        </div>
      </div>

      {/* View Output */}
      {viewMode === 'table' ? (
        <IncidentTable
          incidents={filteredIncidents}
          onSelectIncident={(inc) => setSelectedIncident(inc)}
          onVerify={(id) => verifyIncident(id)}
          onAssignTeam={(inc) => setTeamModalIncident(inc)}
          onMarkCritical={(id) => markIncidentCritical(id)}
          onResolve={(id) => resolveIncident(id)}
        />
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIncidents.map((inc) => (
            <div
              key={inc.id}
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-600">{inc.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    inc.severity === 'Critical'
                      ? 'bg-red-100 text-red-700'
                      : inc.severity === 'High'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {inc.severity}
                  </span>
                </div>

                <h3
                  onClick={() => setSelectedIncident(inc)}
                  className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer transition-colors line-clamp-1"
                >
                  {inc.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {inc.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="truncate">{inc.location}, {inc.district}</span>
                  <span className="font-mono font-bold text-slate-800 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> {inc.affectedPeople}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Status: <strong className="text-slate-700 font-semibold">{inc.status}</strong></span>
                  <span className="font-mono">{new Date(inc.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {/* Quick actions on card */}
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedIncident(inc)}
                    className="flex-1 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    View
                  </button>
                  {inc.status !== 'Resolved' && (
                    <button
                      type="button"
                      onClick={() => setTeamModalIncident(inc)}
                      className="flex-1 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                    >
                      Assign Team
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Incident Modal */}
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

      {/* Assign Team Modal */}
      <AssignTeamModal
        incident={teamModalIncident}
        isOpen={!!teamModalIncident}
        onClose={() => setTeamModalIncident(null)}
      />
    </div>
  );
};
