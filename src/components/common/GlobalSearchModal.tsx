import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Radio,
  LifeBuoy,
  Boxes,
  Users,
  PhoneCall,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const navigate = useNavigate();
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    incidents,
    operations,
    resources,
    volunteers,
    contacts
  } = useApp();

  const [term, setTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setTerm('');
    }
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const query = term.toLowerCase().trim();

  const filteredIncidents = query
    ? incidents.filter(
        i =>
          i.id.toLowerCase().includes(query) ||
          i.title.toLowerCase().includes(query) ||
          i.location.toLowerCase().includes(query) ||
          i.district.toLowerCase().includes(query) ||
          i.disasterType.toLowerCase().includes(query) ||
          i.reporterName.toLowerCase().includes(query) ||
          (i.assignedTeam && i.assignedTeam.toLowerCase().includes(query))
      )
    : incidents.slice(0, 3);

  const filteredOperations = query
    ? operations.filter(
        o =>
          o.id.toLowerCase().includes(query) ||
          o.title.toLowerCase().includes(query) ||
          o.teamName.toLowerCase().includes(query) ||
          o.location.toLowerCase().includes(query) ||
          o.district.toLowerCase().includes(query)
      )
    : operations.slice(0, 2);

  const filteredResources = query
    ? resources.filter(
        r =>
          r.name.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query) ||
          r.depotLocation.toLowerCase().includes(query)
      )
    : [];

  const filteredVolunteers = query
    ? volunteers.filter(
        v =>
          v.name.toLowerCase().includes(query) ||
          v.skill.toLowerCase().includes(query) ||
          v.district.toLowerCase().includes(query)
      )
    : [];

  const filteredContacts = query
    ? contacts.filter(
        c =>
          c.name.toLowerCase().includes(query) ||
          c.phone.includes(query) ||
          c.department.toLowerCase().includes(query)
      )
    : [];

  const handleSelect = (path: string) => {
    setIsSearchModalOpen(false);
    navigate(path);
  };

  const totalResults =
    filteredIncidents.length +
    filteredOperations.length +
    filteredResources.length +
    filteredVolunteers.length +
    filteredContacts.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/40 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search incidents, operations, resources, volunteers, contacts..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden"
          />
          {term && (
            <button
              type="button"
              onClick={() => setTerm('')}
              className="p-1 text-slate-400 hover:text-slate-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(false)}
            className="px-2 py-0.5 text-xs font-mono bg-white text-slate-500 hover:text-slate-800 rounded border border-slate-200 shadow-xs"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
              Recent & Active Emergency Situations
            </div>
          )}

          {/* Incidents Group */}
          {filteredIncidents.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-red-600 flex items-center gap-1.5 px-2">
                <Radio className="w-3.5 h-3.5" />
                Incidents ({filteredIncidents.length})
              </div>
              <div className="space-y-1">
                {filteredIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    onClick={() => handleSelect('/incidents')}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-red-600 font-bold">{inc.id}</span>
                        <span className="text-xs font-bold text-slate-900 truncate">{inc.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {inc.location}, {inc.district}
                        </span>
                        <span>•</span>
                        <span className={`font-semibold ${
                          inc.severity === 'Critical' ? 'text-red-600' : 'text-amber-600'
                        }`}>
                          {inc.severity}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Operations Group */}
          {filteredOperations.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-amber-700 flex items-center gap-1.5 px-2">
                <LifeBuoy className="w-3.5 h-3.5" />
                Rescue Operations ({filteredOperations.length})
              </div>
              <div className="space-y-1">
                {filteredOperations.map((op) => (
                  <div
                    key={op.id}
                    onClick={() => handleSelect('/rescue')}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-amber-700 font-bold">{op.id}</span>
                        <span className="text-xs font-bold text-slate-900 truncate">{op.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Team: <span className="text-slate-800 font-semibold">{op.teamName}</span> • Status: {op.status}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Group */}
          {filteredResources.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-blue-600 flex items-center gap-1.5 px-2">
                <Boxes className="w-3.5 h-3.5" />
                Emergency Resources ({filteredResources.length})
              </div>
              <div className="space-y-1">
                {filteredResources.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => handleSelect('/resources')}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900">{res.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Avail: <span className="font-bold text-emerald-700">{res.available}</span> / {res.total} {res.unit} • {res.depotLocation}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Volunteers Group */}
          {filteredVolunteers.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 px-2">
                <Users className="w-3.5 h-3.5" />
                Volunteers ({filteredVolunteers.length})
              </div>
              <div className="space-y-1">
                {filteredVolunteers.map((vol) => (
                  <div
                    key={vol.id}
                    onClick={() => handleSelect('/volunteers')}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900">{vol.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {vol.skill} • {vol.district} • <span className="text-emerald-700 font-semibold">{vol.availability}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contacts Group */}
          {filteredContacts.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-purple-700 flex items-center gap-1.5 px-2">
                <PhoneCall className="w-3.5 h-3.5" />
                Emergency Directory ({filteredContacts.length})
              </div>
              <div className="space-y-1">
                {filteredContacts.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect('/contacts')}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Phone: <span className="font-mono text-red-700 font-bold">{c.phone}</span> • {c.role}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="p-8 text-center text-slate-500">
              <p className="text-sm">No emergency records match "{term}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by district name, incident ID, or disaster type.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Disaster Response Coordinator Search</span>
          <span className="hidden sm:inline">Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
