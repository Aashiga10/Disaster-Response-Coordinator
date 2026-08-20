import React from 'react';
import {
  X,
  MapPin,
  LifeBuoy,
  Phone,
  User,
  ShieldCheck,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Sparkles,
  Radio,
  Copy,
  AlertTriangle
} from 'lucide-react';
import { Incident } from '../../types';

interface IncidentModalProps {
  incident: Incident | null;
  onClose: () => void;
  onVerify: (id: string) => void;
  onAssignTeam: (incident: Incident) => void;
  onMarkCritical: (id: string) => void;
  onResolve: (id: string) => void;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({
  incident,
  onClose,
  onVerify,
  onAssignTeam,
  onMarkCritical,
  onResolve
}) => {
  if (!incident) return null;

  const isFakeOrHoax = incident.isLikelyFake || (incident.credibilityScore !== undefined && incident.credibilityScore < 40);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-slate-700 px-2 py-0.5 bg-slate-200 rounded">
                {incident.id}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono uppercase ${
                incident.severity === 'Critical'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {incident.severity} SEVERITY
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 uppercase">
                {incident.disasterType}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                Priority: {incident.priority}
              </span>
              {incident.isLiveFeed && (
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-100 text-cyan-900 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-cyan-600 animate-pulse" /> Live External Feed
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {incident.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Hero image if present */}
          {incident.imageUrl && (
            <div className="relative h-48 sm:h-56 rounded-lg overflow-hidden border border-slate-200">
              <img
                src={incident.imageUrl}
                alt={incident.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 text-xs font-mono text-white bg-slate-900/80 px-2 py-0.5 rounded">
                Incident Ground Media • Recon Feed
              </div>
            </div>
          )}

          {/* Credibility & Fake Report Detection Card */}
          <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
            isFakeOrHoax
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {isFakeOrHoax ? (
                  <ShieldAlert className="w-5 h-5 text-amber-600" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider">
                  AI Source Credibility & Fact Verification
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600">Trust Score:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-bold ${
                  (incident.credibilityScore ?? 90) >= 75
                    ? 'bg-emerald-200 text-emerald-900'
                    : (incident.credibilityScore ?? 90) >= 45
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-red-200 text-red-900 animate-pulse'
                }`}>
                  {incident.credibilityScore ?? 92}% {isFakeOrHoax ? '• Suspected Fake/Hoax' : '• Genuine Verified'}
                </span>
              </div>
            </div>

            {incident.credibilityReasoning && (
              <p className="text-xs leading-relaxed text-slate-700 bg-white/80 p-2.5 rounded-lg border border-slate-200/80">
                <strong className="text-slate-900">Verification Reasoning: </strong>
                {incident.credibilityReasoning}
              </p>
            )}

            {incident.misinformationRisk && (
              <div className="flex items-center gap-2 text-[11px] text-slate-600 font-mono">
                <span>Misinformation Risk: <strong>{incident.misinformationRisk}</strong></span>
                {incident.isDuplicate && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-sans font-semibold">
                    Duplicate Cluster Detected
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">People Affected</span>
              <span className="text-lg font-mono font-bold text-slate-900">
                {incident.affectedPeople.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Injured Casualties</span>
              <span className="text-lg font-mono font-bold text-red-600">
                {incident.injuredCount}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Missing Persons</span>
              <span className="text-lg font-mono font-bold text-amber-600">
                {incident.missingCount}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Status</span>
              <span className="text-xs font-bold text-emerald-700 block mt-1">
                {incident.status} ({incident.verificationStatus})
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Detailed Incident Description
            </h4>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              {incident.description}
            </div>
          </div>

          {/* Spatial & Logistics Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location & Reporter */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">{incident.location}</div>
                  <div className="text-xs text-slate-500">
                    District: <strong className="text-slate-800">{incident.district}</strong>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Lat: {incident.lat.toFixed(4)}, Lng: {incident.lng.toFixed(4)}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-start gap-2.5">
                <User className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    Reporter: {incident.reporterName}
                  </div>
                  <div className="text-xs font-mono text-slate-600 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    {incident.reporterContact}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Source: {incident.source} • Logged: {new Date(incident.reportedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Team & Resources */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Assigned Emergency Response Team
                </span>
                {incident.assignedTeam ? (
                  <div className="flex items-center gap-2 p-2 rounded-md bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                    <LifeBuoy className="w-4 h-4 text-amber-600" />
                    {incident.assignedTeam}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">
                    No team assigned yet. Click "Assign Team" below to dispatch.
                  </div>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Required Emergency Resources
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {incident.requiredResources.map((res, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-xs font-mono bg-white text-slate-700 border border-slate-200"
                    >
                      {res}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendation Summary */}
          <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-blue-900 block mb-0.5">
                AI Coordinator Tactical Guidance
              </span>
              <p className="text-blue-800">
                Recommended priority level is <strong>{incident.priority}</strong>. Deploy rapid responder unit to coordinate immediate safety perimeter.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
          >
            Close Window
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            {incident.verificationStatus !== 'Verified' && (
              <button
                type="button"
                onClick={() => {
                  onVerify(incident.id);
                  onClose();
                }}
                className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Verify Incident
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onAssignTeam(incident);
                onClose();
              }}
              className="px-3 py-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <LifeBuoy className="w-3.5 h-3.5" /> {incident.assignedTeam ? 'Reassign Team' : 'Assign Team'}
            </button>

            {incident.severity !== 'Critical' && (
              <button
                type="button"
                onClick={() => {
                  onMarkCritical(incident.id);
                  onClose();
                }}
                className="px-3 py-2 rounded-md bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" /> Mark Critical
              </button>
            )}

            {incident.status !== 'Resolved' && (
              <button
                type="button"
                onClick={() => {
                  onResolve(incident.id);
                  onClose();
                }}
                className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
