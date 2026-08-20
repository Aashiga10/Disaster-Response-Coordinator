import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Send,
  CheckCircle2,
  Zap,
  ArrowRight,
  Bot
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIResponsePanel: React.FC = () => {
  const { incidents, assignTeamToIncident, flagDuplicateIncident, addNotification } = useApp();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);
  const [actionApplied, setActionApplied] = useState(false);

  const currentIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  const isCritical = currentIncident?.severity === 'Critical';
  const duplicateCandidate = incidents.find(
    i => i.id !== currentIncident?.id &&
    i.district === currentIncident?.district &&
    i.disasterType === currentIncident?.disasterType &&
    i.verificationStatus !== 'Duplicate'
  );

  const handleRunAI = () => {
    setIsAnalyzing(true);
    setActionApplied(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      addNotification('AI Incident Triage Updated', `Re-evaluated risk assessment for ${currentIncident?.id}`, 'info');
    }, 600);
  };

  const handleExecuteAIAction = () => {
    if (!currentIncident) return;
    if (!currentIncident.assignedTeam) {
      assignTeamToIncident(currentIncident.id, 'NDRF Rapid Air & Water Squad');
    }
    setActionApplied(true);
    addNotification('AI Recommendation Executed', `Dispatched recommended rescue protocols for ${currentIncident.id}.`, 'success', '/rescue');
  };

  const handleFlagDuplicate = () => {
    if (duplicateCandidate && currentIncident) {
      flagDuplicateIncident(duplicateCandidate.id, currentIncident.id);
      addNotification('Duplicate Linked by AI', `${duplicateCandidate.id} linked to primary incident ${currentIncident.id}.`, 'warning', '/incidents');
    }
  };

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const q = aiQuestion.toLowerCase();
      let response = '';
      if (q.includes('boat') || q.includes('water')) {
        response = `For ${currentIncident?.location || 'Adyar basin'}, 6 motorized inflatable Gemini boats are recommended with 2 inflatable rafts for medical casualties. Currently 8 boats available in Koyambedu depot.`;
      } else if (q.includes('sitrep') || q.includes('summary')) {
        response = `SITUATION REPORT: Active disaster incidents logged across 6 districts. Main hotspots: Kotturpuram & Cuddalore GH. Total estimated affected population: 3,400. 8 rescue teams actively deployed.`;
      } else if (q.includes('hospital') || q.includes('cuddalore')) {
        response = `Cuddalore GH requires 4 standby ALS ambulances and 2 heavy backup diesel generator rafts. Oxygen pipeline integrity is at 88%. Recommend secondary airlift standby.`;
      } else {
        response = `Incident ${currentIncident?.id} exhibits elevated cascading risk. Recommended immediate deployment: 1 SDRF field company, 200 ready-to-eat ration packs, and mobile drone surveillance.`;
      }
      setCustomAnswer(response);
      setAiQuestion('');
    }, 700);
  };

  return (
    <aside className="bg-[#eef2ff] rounded-xl border border-blue-200 flex flex-col p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1 rounded-md flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-blue-900 text-base">AI Response Assistant</h3>
        </div>

        {/* Incident Select & Refresh */}
        <div className="flex items-center gap-1.5">
          <select
            value={selectedIncidentId}
            onChange={(e) => {
              setSelectedIncidentId(e.target.value);
              setActionApplied(false);
              setCustomAnswer(null);
            }}
            className="bg-white text-[11px] font-medium text-slate-700 border border-blue-200 rounded-lg px-2 py-1 focus:outline-hidden focus:ring-1 focus:ring-blue-500 shadow-2xs"
          >
            {incidents.slice(0, 6).map((inc) => (
              <option key={inc.id} value={inc.id}>
                {inc.id} ({inc.severity})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleRunAI}
            disabled={isAnalyzing}
            className="p-1 rounded-lg bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 transition-colors shadow-2xs"
            title="Re-run AI synthesis"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {/* Card 1: Priority Recommendation */}
        <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wider">
              Priority Recommendation
            </p>
            <span className="text-[10px] font-bold text-slate-400">
              Threat: {isCritical ? '9.4/10' : '7.1/10'}
            </span>
          </div>
          
          <p className="text-sm text-slate-700 leading-snug">
            Analyze <strong>{currentIncident?.id}</strong>: High cluster of citizen reports in {currentIncident?.location}. Rapid water influx indicates elevated risk to ~{currentIncident?.affectedPeople || 350} residents.
          </p>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleExecuteAIAction}
              disabled={actionApplied}
              className={`text-[11px] px-3 py-1.5 rounded-md font-bold transition-all shadow-2xs ${
                actionApplied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {actionApplied ? '✓ NDRF Deployed' : 'Deploy NDRF Team'}
            </button>
            <button
              type="button"
              onClick={() => addNotification('Alert Snoozed', 'Incident monitoring interval set to 15m', 'info')}
              className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold px-3 py-1.5 rounded-md border border-slate-200 transition-colors"
            >
              Snooze Cluster
            </button>
          </div>
        </div>

        {/* Card 2: Duplicate Report Detection */}
        <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
          <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wider mb-2">
            Duplicate Report Detection
          </p>
          
          {currentIncident?.isDuplicate ? (
            <p className="text-sm text-slate-700">
              Incident {currentIncident.id} is merged with primary record <span className="font-mono font-bold text-blue-600">{currentIncident.duplicateOf}</span>.
            </p>
          ) : duplicateCandidate ? (
            <div>
              <p className="text-sm text-slate-700">
                Reports <strong>{currentIncident?.id}</strong> and <strong>{duplicateCandidate.id}</strong> appear to describe the same emergency in {duplicateCandidate.location}.
              </p>
              <button
                type="button"
                onClick={handleFlagDuplicate}
                className="mt-2 text-blue-600 hover:text-blue-700 text-[11px] font-bold inline-flex items-center gap-1"
              >
                Merge Reports →
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              No duplicate reports detected in this sector.
            </p>
          )}
        </div>

        {/* Card 3: Interactive Ask AI form */}
        <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
          <form onSubmit={handleAskAI} className="flex gap-1.5">
            <input
              type="text"
              placeholder="Ask AI: e.g. 'Resource needs for Cuddalore'..."
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isAnalyzing || !aiQuestion.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-md text-xs font-bold transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {customAnswer && (
            <div className="mt-2.5 p-2 bg-blue-50/70 border border-blue-100 rounded text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-blue-800 block mb-0.5">AI Triage Note:</span>
              {customAnswer}
            </div>
          )}
        </div>

        {/* Resource Confidence Bar */}
        <div className="pt-1">
          <div className="p-3 bg-blue-100/50 rounded-lg">
            <div className="flex justify-between text-[10px] font-bold text-blue-800 mb-1">
              <span>Resource Confidence</span>
              <span>94%</span>
            </div>
            <div className="h-1.5 w-full bg-blue-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 w-[94%] transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
