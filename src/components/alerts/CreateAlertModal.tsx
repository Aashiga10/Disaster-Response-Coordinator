import React, { useState } from 'react';
import {
  X,
  Radio,
  Siren
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DisasterType, Severity, AlertItem } from '../../types';

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAlertModal: React.FC<CreateAlertModalProps> = ({ isOpen, onClose }) => {
  const { createAlert, affectedAreas } = useApp();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [disasterType, setDisasterType] = useState<DisasterType>('flood');
  const [district, setDistrict] = useState(affectedAreas[0]?.district || 'Chennai');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<Severity>('Critical');
  const [targetAudience, setTargetAudience] = useState<AlertItem['targetAudience']>('All Citizens');
  const [broadcastChannels, setBroadcastChannels] = useState<AlertItem['broadcastChannels']>([
    'SMS',
    'Emergency Siren',
    'App Push'
  ]);

  if (!isOpen) return null;

  const toggleChannel = (channel: AlertItem['broadcastChannels'][number]) => {
    if (broadcastChannels.includes(channel)) {
      setBroadcastChannels(broadcastChannels.filter(c => c !== channel));
    } else {
      setBroadcastChannels([...broadcastChannels, channel]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    createAlert({
      title,
      message,
      disasterType,
      location: location || `${district} District Disaster Area`,
      district,
      severity,
      targetAudience,
      status: 'Active',
      broadcastChannels,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      issuer: 'State Emergency Operations Center (SEOC)'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <Siren className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Broadcast Emergency Public Warning</h3>
              <p className="text-xs text-slate-500">National Civil Protection Alert Dissemination</p>
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Alert Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Alert Headline / Title
            </label>
            <input
              type="text"
              placeholder="e.g. RED ALERT: Immediate Evacuation Ordered for Adyar Lowlands"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-300"
              required
            />
          </div>

          {/* Grid of Disaster, Severity, District */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Disaster</label>
              <select
                value={disasterType}
                onChange={(e) => setDisasterType(e.target.value as DisasterType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800"
              >
                <option value="flood">Flood</option>
                <option value="cyclone">Cyclone</option>
                <option value="landslide">Landslide</option>
                <option value="fire">Fire</option>
                <option value="building_collapse">Collapse</option>
                <option value="other">General Emergency</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-red-600 font-bold"
              >
                <option value="Critical">Critical (Red Alert)</option>
                <option value="High">High (Orange Alert)</option>
                <option value="Medium">Medium (Yellow Alert)</option>
                <option value="Low">Advisory</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Target District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800"
              >
                {affectedAreas.map((a) => (
                  <option key={a.id} value={a.district}>
                    {a.district}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Specific Location */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Specific Location / Perimeter
            </label>
            <input
              type="text"
              placeholder="e.g. Kotturpuram, Saidapet, & Jafferkhanpet 500m basin"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900"
            />
          </div>

          {/* Target Audience */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Target Audience
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as AlertItem['targetAudience'])}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-800"
            >
              <option value="All Citizens">All Citizens (Broad Public Warning)</option>
              <option value="River Basin Area">River Basin / Lowland Residents</option>
              <option value="Coastal Residents">Coastal Fishing Hamlets</option>
              <option value="First Responders">First Responders & Tactical Teams</option>
              <option value="Hospital Networks">Hospital & Emergency Trauma Networks</option>
            </select>
          </div>

          {/* Warning Message */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Emergency Broadcast Text
            </label>
            <textarea
              rows={4}
              placeholder="Write concise, actionable emergency instructions (e.g. seek higher ground, shelter locations, boiling water orders)..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-300 leading-relaxed"
              required
            />
          </div>

          {/* Multi-channel selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Select Dissemination Channels
            </label>
            <div className="flex flex-wrap gap-2">
              {(['SMS', 'Emergency Siren', 'App Push', 'Radio/TV', 'WhatsApp'] as AlertItem['broadcastChannels'][number][]).map((ch) => {
                const isSelected = broadcastChannels.includes(ch);
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => toggleChannel(ch)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-red-50 text-red-700 border-red-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 -mx-5 -mb-5 flex items-center justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Radio className="w-3.5 h-3.5" /> Transmit Emergency Broadcast
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
