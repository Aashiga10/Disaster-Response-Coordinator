import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResourceCard } from '../components/resources/ResourceCard';
import { EmergencyResource } from '../types';

export const Resources: React.FC = () => {
  const { resources, addNotification } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showShortagesOnly, setShowShortagesOnly] = useState(false);
  const [isAddingResource, setIsAddingResource] = useState(false);

  // New Resource Form
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<EmergencyResource['category']>('Rescue Boats');
  const [newTotal, setNewTotal] = useState(50);
  const [newUnit, setNewUnit] = useState('Units');
  const [newDepot, setNewDepot] = useState('Central EOC Disaster Depot, Koyambedu');

  // Computed metrics
  const totalUnits = resources.reduce((acc, r) => acc + r.total, 0);
  const availableUnits = resources.reduce((acc, r) => acc + r.available, 0);
  const deployedUnits = resources.reduce((acc, r) => acc + r.deployed, 0);
  const shortagesCount = resources.filter(r => r.criticalShortage).length;

  const categories: EmergencyResource['category'][] = [
    'Ambulances',
    'Rescue Boats',
    'Rescue Vehicles',
    'Medical Kits',
    'Food Supplies',
    'Drinking Water',
    'Blankets',
    'Emergency Shelters',
    'Power & Comms',
    'Drones'
  ];

  const filteredResources = resources.filter(r => {
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    if (showShortagesOnly && !r.criticalShortage) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.depotLocation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    addNotification('Resource Class Registered', `${newName} (${newTotal} ${newUnit}) added to ${newDepot}.`, 'success');

    setIsAddingResource(false);
    setNewName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Emergency Resources & Logistics
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time tracking of rescue equipment, medical trauma reserves, rations, and depot inventory
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingResource(true)}
          className="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Register New Asset
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Total Inventory</span>
          <div className="text-2xl font-extrabold font-mono text-slate-800">{totalUnits.toLocaleString()} Units</div>
          <span className="text-[10px] text-slate-500">Across {resources.length} asset classes</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Available in Depots</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-600">{availableUnits.toLocaleString()} Units</div>
          <span className="text-[10px] text-emerald-700 font-medium">Ready for instant dispatch</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Actively Deployed</span>
          <div className="text-2xl font-extrabold font-mono text-amber-700">{deployedUnits.toLocaleString()} Units</div>
          <span className="text-[10px] text-amber-700 font-medium">Currently in disaster zones</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-red-600 uppercase">Critical Shortages</span>
          <div className="text-2xl font-extrabold font-mono text-red-600">{shortagesCount} Categories</div>
          <span className="text-[10px] text-red-600 font-medium">Procurement needed</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm items-stretch lg:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search resources by name, category, or depot location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-md px-3.5 py-2 focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowShortagesOnly(!showShortagesOnly)}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              showShortagesOnly
                ? 'bg-red-50 text-red-700 border-red-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Shortages Only
          </button>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => (
          <ResourceCard key={res.id} resource={res} />
        ))}
      </div>

      {/* Register Asset Modal */}
      {isAddingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Register Emergency Resource Asset</h3>
            <form onSubmit={handleAddNew} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Equipment / Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. High-Pressure Water Evacuation Pumps"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EmergencyResource['category'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-800"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Initial Stock Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newTotal}
                    onChange={(e) => setNewTotal(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-900 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Measurement Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. Units, Packets, Liters, Boats"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Depot / Base Hub</label>
                  <input
                    type="text"
                    value={newDepot}
                    onChange={(e) => setNewDepot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingResource(false)}
                  className="px-3.5 py-2 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
                >
                  Register Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
