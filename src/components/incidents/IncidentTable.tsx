import React from 'react';
import {
  Waves,
  Wind,
  Mountain,
  Flame,
  Building,
  AlertTriangle,
  Eye,
  Check,
  Zap,
  Users
} from 'lucide-react';
import { Incident, DisasterType, Severity, IncidentStatus } from '../../types';

interface IncidentTableProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onVerify?: (id: string) => void;
  onAssignTeam?: (incident: Incident) => void;
  onMarkCritical?: (id: string) => void;
  onResolve?: (id: string) => void;
}

export const IncidentTable: React.FC<IncidentTableProps> = ({
  incidents,
  onSelectIncident,
  onVerify,
  onAssignTeam,
  onMarkCritical,
  onResolve
}) => {
  const getDisasterIcon = (type: DisasterType) => {
    switch (type) {
      case 'flood':
        return <Waves className="w-4 h-4 text-blue-500" />;
      case 'cyclone':
        return <Wind className="w-4 h-4 text-teal-500" />;
      case 'landslide':
        return <Mountain className="w-4 h-4 text-amber-600" />;
      case 'fire':
        return <Flame className="w-4 h-4 text-red-500" />;
      case 'building_collapse':
        return <Building className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    }
  };

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase tracking-wide">
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded uppercase tracking-wide">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded uppercase tracking-wide">
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-medium rounded uppercase tracking-wide">
            Low
          </span>
        );
    }
  };

  const getStatusBadge = (status: IncidentStatus, isDuplicate?: boolean) => {
    if (isDuplicate) {
      return (
        <span className="text-purple-600 font-semibold text-xs flex items-center gap-1">
          ● Duplicate
        </span>
      );
    }
    switch (status) {
      case 'New':
        return (
          <span className="text-slate-500 font-semibold text-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
            ● New
          </span>
        );
      case 'Verified':
        return (
          <span className="text-blue-600 font-semibold text-xs flex items-center gap-1">
            ● Verified
          </span>
        );
      case 'In Progress':
        return (
          <span className="text-amber-600 font-semibold text-xs flex items-center gap-1">
            ● In Progress
          </span>
        );
      case 'Resolved':
        return (
          <span className="text-green-600 font-semibold text-xs flex items-center gap-1">
            ● Resolved
          </span>
        );
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST';
    } catch {
      return 'Recent';
    }
  };

  if (incidents.length === 0) {
    return (
      <div className="p-10 text-center rounded-xl bg-white border border-slate-200 text-slate-500 shadow-sm">
        <p className="text-sm font-semibold text-slate-700">No Incidents Found</p>
        <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
            <tr>
              <th className="px-6 py-3 font-mono">Incident ID</th>
              <th className="px-6 py-3">Type & Title</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Severity</th>
              <th className="px-6 py-3">Affected</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 font-mono">Time</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {incidents.map((inc) => (
              <tr
                key={inc.id}
                className="hover:bg-slate-50 transition-colors"
              >
                {/* ID */}
                <td className="px-6 py-4 font-mono font-bold text-slate-500 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onSelectIncident(inc)}
                    className="hover:text-blue-600 transition-colors font-mono"
                  >
                    {inc.id}
                  </button>
                </td>

                {/* Type & Title */}
                <td className="px-6 py-4 max-w-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1 rounded bg-slate-100 text-slate-600 flex-shrink-0">
                      {getDisasterIcon(inc.disasterType)}
                    </div>
                    <div className="min-w-0">
                      <p
                        onClick={() => onSelectIncident(inc)}
                        className="font-semibold text-slate-800 hover:text-blue-600 truncate cursor-pointer transition-colors text-xs sm:text-sm"
                      >
                        {inc.title}
                      </p>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {inc.disasterType} • {inc.source}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Location */}
                <td className="px-6 py-4 text-slate-600 whitespace-nowrap text-xs">
                  <div className="font-medium text-slate-800">{inc.location}</div>
                  <div className="text-[10px] text-slate-400">{inc.district}</div>
                </td>

                {/* Severity */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {getSeverityBadge(inc.severity)}
                </td>

                {/* People Affected */}
                <td className="px-6 py-4 whitespace-nowrap text-xs">
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {inc.affectedPeople.toLocaleString()}
                  </div>
                  {inc.injuredCount > 0 && (
                    <div className="text-[10px] text-red-600 font-medium">
                      {inc.injuredCount} injured {inc.missingCount > 0 ? `• ${inc.missingCount} missing` : ''}
                    </div>
                  )}
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(inc.status, inc.isDuplicate)}
                  {inc.assignedTeam && (
                    <div className="text-[10px] text-slate-400 truncate max-w-[120px] mt-0.5">
                      {inc.assignedTeam}
                    </div>
                  )}
                </td>

                {/* Reported Time */}
                <td className="px-6 py-4 font-mono text-slate-400 whitespace-nowrap text-xs">
                  {formatRelativeTime(inc.reportedAt)}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5 justify-end">
                    <button
                      type="button"
                      onClick={() => onSelectIncident(inc)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded text-xs font-semibold transition-colors"
                      title="View full details"
                    >
                      View
                    </button>

                    {inc.verificationStatus !== 'Verified' && onVerify && (
                      <button
                        type="button"
                        onClick={() => onVerify(inc.id)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded text-xs font-semibold border border-blue-200 transition-colors"
                        title="Verify Incident"
                      >
                        Verify
                      </button>
                    )}

                    {inc.status !== 'Resolved' && onAssignTeam && (
                      <button
                        type="button"
                        onClick={() => onAssignTeam(inc)}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-800 px-2.5 py-1 rounded text-xs font-semibold border border-amber-200 transition-colors"
                        title="Assign Team"
                      >
                        {inc.assignedTeam ? 'Reassign' : 'Assign'}
                      </button>
                    )}

                    {inc.status !== 'Resolved' && onResolve && (
                      <button
                        type="button"
                        onClick={() => onResolve(inc.id)}
                        className="p-1 rounded bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 transition-colors"
                        title="Resolve Incident"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
