import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Radio,
  FilePlus2,
  ListFilter,
  History,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { AIVerificationDetector, VerificationResult } from '../components/common/AIVerificationDetector';
import { useApp } from '../context/AppContext';

export const AIVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { addIncident, addNotification } = useApp();
  const [lastResult, setLastResult] = useState<{ result: VerificationResult; text: string } | null>(null);

  const handleVerificationComplete = (result: VerificationResult, text: string) => {
    setLastResult({ result, text });
  };

  const handlePushToIncidentQueue = async () => {
    if (!lastResult) return;
    const { result, text } = lastResult;

    try {
      const newId = await addIncident({
        title: text.slice(0, 70) || 'Verified Emergency Report',
        description: text,
        disasterType: 'flood',
        location: 'Corroborated Distress Zone',
        district: 'Chennai',
        lat: 13.0827,
        lng: 80.2707,
        severity: result.credibilityScore > 70 ? 'High' : 'Medium',
        priority: result.credibilityScore > 70 ? 'P2 - High' : 'P3 - Moderate',
        status: 'New',
        affectedPeople: 15,
        injuredCount: 0,
        missingCount: 0,
        source: 'Citizen',
        verificationStatus: result.isLikelyFake ? 'Flagged' : 'Verified',
        reporterName: 'AI Verified Ingestion',
        reporterContact: '+91 94440 00000',
        requiredResources: ['Emergency Shelters', 'Inflatable Boats'],
        credibilityScore: result.credibilityScore,
        isLikelyFake: result.isLikelyFake,
        credibilityReasoning: result.recommendedAction,
        misinformationRisk: result.misinformationRisk
      });

      addNotification(
        'Incident Logged from Detector',
        `Incident ${newId} logged with Trust Score ${result.credibilityScore}%.`,
        result.isLikelyFake ? 'warning' : 'success',
        '/incidents'
      );
      navigate('/incidents');
    } catch (e) {
      addNotification('Error Saving Incident', 'Failed to push incident to command queue.', 'critical');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-orange-100 text-orange-800 border border-orange-200">
              AI Trust & Safety Hub
            </span>
            <span className="text-xs text-slate-500 font-mono">Real-time Multimodal Ingestion</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            AI Incident Verification Detector
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Cross-examine social media distress claims, citizen uploads, and voice reports before committing field rescue squads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/incidents')}
            className="px-3 py-2 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5 text-slate-500" /> View Live Incidents
          </button>
          <button
            type="button"
            onClick={() => navigate('/report')}
            className="px-3.5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <FilePlus2 className="w-3.5 h-3.5" /> Full Intake Form
          </button>
        </div>
      </div>

      {/* Main Component Panel */}
      <AIVerificationDetector onVerificationComplete={handleVerificationComplete} />

      {/* Quick Action when verified */}
      {lastResult && (
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl animate-in fade-in">
          <div className="flex items-center gap-3">
            {lastResult.result.isLikelyFake ? (
              <ShieldAlert className="w-6 h-6 text-orange-500 flex-shrink-0" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            )}
            <div>
              <p className="text-sm font-bold font-mono">
                Verification Complete — {lastResult.result.credibilityScore}% Trust ({lastResult.result.misinformationRisk} Risk)
              </p>
              <p className="text-xs text-neutral-400">
                Ready to commit to state emergency incident registry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePushToIncidentQueue}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-neutral-950 font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              Push to Incident Queue & Map
            </button>
          </div>
        </div>
      )}

      {/* Trust & Safety Best Practices Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Multi-Source Fusion
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Cross-references natural language distress signals with USGS seismic telemetry and GDACS weather advisories.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
            <ShieldAlert className="w-4 h-4 text-orange-600" /> Hoax & Panic Prevention
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Flags hyperbolic phrasing, uncorroborated casualty counts, and digital artifacts to prevent emergency queue poisoning.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
            <Radio className="w-4 h-4 text-blue-600" /> Triage Routing
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Automatically suggests priority brackets (P1 to P4) and pre-stages emergency rescue packages based on verified water levels.
          </p>
        </div>
      </div>
    </div>
  );
};
