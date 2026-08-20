import React, { useState } from 'react';
import {
  Boxes,
  Truck,
  AlertTriangle,
  Send,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  Minus
} from 'lucide-react';
import { EmergencyResource } from '../../types';
import { useApp } from '../../context/AppContext';

interface ResourceCardProps {
  resource: EmergencyResource;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const { allocateResource, replenishResource, affectedAreas } = useApp();
  const [isAllocating, setIsAllocating] = useState(false);
  const [allocQty, setAllocQty] = useState(Math.min(5, resource.available));
  const [selectedDestination, setSelectedDestination] = useState(affectedAreas[0]?.district || 'Chennai');
  const [isReplenishing, setIsReplenishing] = useState(false);
  const [replenishQty, setReplenishQty] = useState(10);

  const percentAvailable = Math.round((resource.available / resource.total) * 100);

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (allocQty > 0) {
      allocateResource(resource.id, allocQty, selectedDestination);
      setIsAllocating(false);
    }
  };

  const handleReplenish = (e: React.FormEvent) => {
    e.preventDefault();
    if (replenishQty > 0) {
      replenishResource(resource.id, replenishQty);
      setIsReplenishing(false);
    }
  };

  return (
    <div className={`rounded-xl border p-5 bg-white shadow-sm transition-all flex flex-col justify-between ${
      resource.criticalShortage
        ? 'border-red-300 bg-red-50/30'
        : 'border-slate-200 hover:border-slate-300'
    }`}>
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
              {resource.category}
            </span>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">
              {resource.name}
            </h4>
          </div>

          {resource.criticalShortage ? (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-red-100 text-red-700 rounded flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Shortage
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Available
            </span>
          )}
        </div>

        {/* Numerical Stats */}
        <div className="grid grid-cols-3 gap-2 my-3 text-center">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Total</span>
            <span className="text-sm font-mono font-bold text-slate-800">
              {resource.total.toLocaleString()}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Available</span>
            <span className={`text-sm font-mono font-bold ${
              resource.criticalShortage ? 'text-red-600' : 'text-emerald-700'
            }`}>
              {resource.available.toLocaleString()}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Deployed</span>
            <span className="text-sm font-mono font-bold text-amber-700">
              {resource.deployed.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 my-3">
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>Readiness / In-Stock</span>
            <span className="font-bold text-slate-700">{percentAvailable}% Available</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                percentAvailable < 20
                  ? 'bg-red-500'
                  : percentAvailable < 50
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${percentAvailable}%` }}
            />
          </div>
        </div>

        {/* Depot Location & Condition */}
        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{resource.depotLocation}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Unit: {resource.unit}</span>
            <span>Updated: {resource.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Allocation Drawer / Buttons */}
      {!isAllocating && !isReplenishing && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsAllocating(true)}
            disabled={resource.available === 0}
            className="flex-1 py-1.5 px-3 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" /> Dispatch
          </button>
          <button
            type="button"
            onClick={() => setIsReplenishing(true)}
            className="py-1.5 px-3 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            title="Add stock / replenish"
          >
            <Plus className="w-3.5 h-3.5" /> Stock
          </button>
        </div>
      )}

      {/* Allocate Form */}
      {isAllocating && (
        <form onSubmit={handleAllocate} className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
          <span className="font-bold text-slate-800 block">Dispatch to Disaster Sector</span>
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5">Destination District</label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
            >
              {affectedAreas.map((a) => (
                <option key={a.id} value={a.district}>
                  {a.district} ({a.severity})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5">Quantity ({resource.unit})</label>
            <input
              type="number"
              min="1"
              max={resource.available}
              value={allocQty}
              onChange={(e) => setAllocQty(Number(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800 font-mono"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAllocating(false)}
              className="flex-1 py-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-1 rounded-md bg-blue-600 text-white font-bold"
            >
              Confirm
            </button>
          </div>
        </form>
      )}

      {/* Replenish Form */}
      {isReplenishing && (
        <form onSubmit={handleReplenish} className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
          <span className="font-bold text-slate-800 block">Replenish Depot Reserve</span>
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5">Add Units ({resource.unit})</label>
            <input
              type="number"
              min="1"
              value={replenishQty}
              onChange={(e) => setReplenishQty(Number(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800 font-mono"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsReplenishing(false)}
              className="flex-1 py-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-1 rounded-md bg-emerald-600 text-white font-bold"
            >
              Add Stock
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
