import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ChevronRight, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AlertBanner: React.FC = () => {
  const navigate = useNavigate();
  const { alerts } = useApp();
  const [dismissed, setDismissed] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Active Critical Alerts
  const criticalAlerts = alerts.filter(a => a.severity === 'Critical' && a.status === 'Active');

  if (dismissed || criticalAlerts.length === 0) {
    return null;
  }

  const activeAlert = criticalAlerts[currentIdx % criticalAlerts.length];

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-600 px-4 sm:px-6 py-3 text-white shadow-md z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="bg-white/20 p-1.5 rounded-md flex-shrink-0 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>

          <div className="flex items-baseline gap-2 flex-wrap min-w-0">
            <span className="font-bold uppercase tracking-wide text-xs bg-black/20 px-2 py-0.5 rounded">
              Critical Alert:
            </span>
            <span className="font-semibold text-white truncate max-w-xl">
              {activeAlert.title}
            </span>
            <span className="hidden md:inline text-white/90 text-xs truncate max-w-md">
              — {activeAlert.message}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {criticalAlerts.length > 1 && (
            <button
              type="button"
              onClick={() => setCurrentIdx((prev) => (prev + 1) % criticalAlerts.length)}
              className="px-2 py-1 text-xs bg-white/20 hover:bg-white/30 text-white rounded transition-colors font-medium"
            >
              Next Alert ({currentIdx + 1}/{criticalAlerts.length})
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate('/rescue')}
            className="bg-white text-red-600 px-4 py-1.5 rounded-md text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap"
          >
            Deploy SDRF Team
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 text-white/80 hover:text-white rounded-md hover:bg-white/20 transition-colors"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
