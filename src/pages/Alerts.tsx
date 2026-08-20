import React, { useState } from 'react';
import {
  Radio,
  Clock,
  MapPin,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CreateAlertModal } from '../components/alerts/CreateAlertModal';
import { AlertItem } from '../types';

export const Alerts: React.FC = () => {
  const { alerts, addNotification } = useApp();

  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const activeAlerts = alerts.filter(a => a.status === 'Active');
  const criticalAlerts = alerts.filter(a => a.severity === 'Critical');

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    return true;
  });

  const handleRetract = (alertId: string) => {
    addNotification('Alert Retracted', `Broadcast ${alertId} has been deactivated across all public channels.`, 'info');
  };

  const handleRetransmit = (alert: AlertItem) => {
    addNotification('Emergency Re-broadcast', `Re-transmitted "${alert.title}" to public mobile networks.`, 'warning');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Emergency Alerts & Warning Broadcasts
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Transmit mass public advisories, siren activations, SMS broadcasts, and evacuation orders
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreatingAlert(true)}
          className="px-3.5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Radio className="w-4 h-4" /> Broadcast New Warning
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Active Broadcasts</span>
          <div className="text-2xl font-extrabold font-mono text-slate-800">{activeAlerts.length} Active</div>
          <span className="text-[10px] text-slate-500">Live on public channels</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-red-200 bg-red-50/20 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-red-600 uppercase">Critical Sirens</span>
          <div className="text-2xl font-extrabold font-mono text-red-600">{criticalAlerts.length} Red Alerts</div>
          <span className="text-[10px] text-red-600 font-medium">Immediate evacuation active</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Channels Integrated</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-600">5 Protocols</div>
          <span className="text-[10px] text-emerald-700 font-medium">SMS, Siren, TV, WhatsApp, App</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Estimated Reach</span>
          <div className="text-2xl font-extrabold font-mono text-blue-600">4.2M Citizens</div>
          <span className="text-[10px] text-blue-600 font-medium">Cellular cell broadcast</span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm items-center flex-wrap">
        <span className="text-xs font-bold text-slate-600 uppercase">Filter Alerts:</span>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-md px-3.5 py-2 focus:outline-hidden"
        >
          <option value="all">All Severities</option>
          <option value="Critical">Critical (Red Alert)</option>
          <option value="High">High (Orange Alert)</option>
          <option value="Medium">Medium (Yellow Alert)</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-md px-3.5 py-2 focus:outline-hidden"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active Warnings</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isCrit = alert.severity === 'Critical';

          return (
            <div
              key={alert.id}
              className={`p-5 rounded-xl border shadow-sm transition-all space-y-3 ${
                isCrit
                  ? 'border-red-200 bg-red-50/30'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {/* Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {alert.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                      isCrit
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {alert.severity} Alert
                    </span>
                    <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded uppercase">
                      {alert.disasterType}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Target: <strong className="text-slate-700">{alert.targetAudience}</strong>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 tracking-tight pt-1">
                    {alert.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Active
                  </span>
                </div>
              </div>

              {/* Message body */}
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed">
                {alert.message}
              </div>

              {/* Spatial, Timing & Channels */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>{alert.location}, {alert.district}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Issued: {new Date(alert.issuedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Dissemination channels */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Channels:</span>
                  {alert.broadcastChannels.map((ch, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleRetransmit(alert)}
                  className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-transmit Broadcast
                </button>
                <button
                  type="button"
                  onClick={() => handleRetract(alert.id)}
                  className="px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" /> Retract Warning
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Alert Modal */}
      <CreateAlertModal
        isOpen={isCreatingAlert}
        onClose={() => setIsCreatingAlert(false)}
      />
    </div>
  );
};
