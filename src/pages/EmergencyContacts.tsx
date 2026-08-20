import React, { useState } from 'react';
import {
  PhoneCall,
  Search,
  Copy,
  Check,
  Phone
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface EmergencyContact {
  id: string;
  name: string;
  category: 'National' | 'State EOC' | 'Medical' | 'Police & Fire' | 'Marine & Coast' | 'Ham Radio & NGO';
  phone: string;
  altPhone?: string;
  tollFree?: string;
  email: string;
  location: string;
  availableHours: string;
  priority: 'Immediate 24x7' | 'Operational 24x7' | 'District Hours';
  description: string;
}

export const EmergencyContacts: React.FC = () => {
  const { addNotification } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const contactsList: EmergencyContact[] = [
    {
      id: 'EC-01',
      name: 'State Emergency Operations Center (SEOC TN)',
      category: 'State EOC',
      phone: '+91 44 2859 3990',
      tollFree: '1070',
      email: 'seoc.tn@nic.in',
      location: 'Ezhilagam, Chepauk, Chennai - 600005',
      availableHours: '24 Hours / 365 Days',
      priority: 'Immediate 24x7',
      description: 'Apex state command control center coordinating all 38 district disaster collectorates.'
    },
    {
      id: 'EC-02',
      name: 'National Disaster Response Force (NDRF) HQ',
      category: 'National',
      phone: '+91 11 2436 3260',
      tollFree: '1078',
      email: 'ndrf-hq@gov.in',
      location: '4th Battalion NDRF Arakkonam Base',
      availableHours: '24 Hours / 365 Days',
      priority: 'Immediate 24x7',
      description: 'National elite tactical search and rescue force with airlift and flood deployment.'
    },
    {
      id: 'EC-03',
      name: '108 Emergency Trauma & ALS Ambulance',
      category: 'Medical',
      phone: '108',
      tollFree: '108',
      email: 'support@emri.in',
      location: 'Statewide Dispatch Matrix (Tamil Nadu)',
      availableHours: '24 Hours / 365 Days',
      priority: 'Immediate 24x7',
      description: 'Advanced life support ambulances equipped with portable oxygen, defibrillators, and paramedics.'
    },
    {
      id: 'EC-04',
      name: 'Fire & Disaster Rescue Services Command',
      category: 'Police & Fire',
      phone: '101',
      altPhone: '+91 44 2841 8100',
      tollFree: '101',
      email: 'tnfrs@tn.gov.in',
      location: 'State Fire Headquarters, Egmore, Chennai',
      availableHours: '24 Hours / 365 Days',
      priority: 'Immediate 24x7',
      description: 'Specialized structural collapse rescue, high-reach ladder trucks, and hazardous material units.'
    },
    {
      id: 'EC-05',
      name: 'Indian Coast Guard (Eastern Seaboard Marine SAR)',
      category: 'Marine & Coast',
      phone: '1554',
      altPhone: '+91 44 2346 0405',
      tollFree: '1554',
      email: 'cg-chennai@indiancoastguard.nic.in',
      location: 'Coast Guard Regional HQ, Chennai Port',
      availableHours: '24 Hours / 365 Days',
      priority: 'Immediate 24x7',
      description: 'Offshore maritime search and rescue, hovercraft flood navigation, and helicopter airlifts.'
    },
    {
      id: 'EC-06',
      name: 'District Disaster Emergency Line (DEOC)',
      category: 'State EOC',
      phone: '1077',
      tollFree: '1077',
      email: 'deoc.district@tn.gov.in',
      location: 'Direct connect to nearest District Collectorate',
      availableHours: '24 Hours / 365 Days',
      priority: 'Immediate 24x7',
      description: 'Direct hotline to local Revenue Divisional Officers, Tahsildars, and relief staging camps.'
    },
    {
      id: 'EC-07',
      name: 'Tamil Nadu Amateur Ham Radio Emergency Net (VU2)',
      category: 'Ham Radio & NGO',
      phone: '+91 94440 11223',
      email: 'ham-emergency@vu2net.org',
      location: 'VHF 145.500 MHz / HF 7.085 MHz Net',
      availableHours: 'Continuous Standby',
      priority: 'Operational 24x7',
      description: 'Auxiliary civilian radio network operating when cellular and landline towers fail.'
    },
    {
      id: 'EC-08',
      name: 'State Police Command Center (Emergency Response 112)',
      category: 'Police & Fire',
      phone: '112',
      altPhone: '100',
      tollFree: '112',
      email: 'erss112@tnpolice.gov.in',
      location: 'Director General of Police HQ, Mylapore',
      availableHours: '24 Hours / 365 Days',
      priority: 'Immediate 24x7',
      description: 'Unified national emergency number for police mobilization and perimeter cordons.'
    }
  ];

  const handleCopy = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    addNotification('Helpline Copied', `${phone} copied to clipboard.`, 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredContacts = contactsList.filter(c => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.tollFree?.includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Emergency Hotlines & Inter-Agency Directory
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Direct priority lines for NDRF, State EOC, Coast Guard, Trauma Ambulances, and Ham Radio Net
          </p>
        </div>
      </div>

      {/* Emergency Quick SOS Toll-Free Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <a
          href="tel:1070"
          className="p-3 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 transition-colors text-center block shadow-xs"
        >
          <span className="text-[10px] uppercase font-mono font-bold text-red-700 block">State EOC</span>
          <span className="text-xl font-extrabold font-mono text-red-800">1070</span>
        </a>
        <a
          href="tel:1078"
          className="p-3 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors text-center block shadow-xs"
        >
          <span className="text-[10px] uppercase font-mono font-bold text-amber-700 block">NDRF HQ</span>
          <span className="text-xl font-extrabold font-mono text-amber-800">1078</span>
        </a>
        <a
          href="tel:108"
          className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors text-center block shadow-xs"
        >
          <span className="text-[10px] uppercase font-mono font-bold text-emerald-700 block">Ambulance</span>
          <span className="text-xl font-extrabold font-mono text-emerald-800">108</span>
        </a>
        <a
          href="tel:101"
          className="p-3 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 transition-colors text-center block shadow-xs"
        >
          <span className="text-[10px] uppercase font-mono font-bold text-red-700 block">Fire Rescue</span>
          <span className="text-xl font-extrabold font-mono text-red-800">101</span>
        </a>
        <a
          href="tel:1554"
          className="p-3 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors text-center block shadow-xs"
        >
          <span className="text-[10px] uppercase font-mono font-bold text-blue-700 block">Coast Guard</span>
          <span className="text-xl font-extrabold font-mono text-blue-800">1554</span>
        </a>
        <a
          href="tel:112"
          className="p-3 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors text-center block shadow-xs"
        >
          <span className="text-[10px] uppercase font-mono font-bold text-purple-700 block">Police ERSS</span>
          <span className="text-xl font-extrabold font-mono text-purple-800">112</span>
        </a>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search helpline name, toll-free number, or organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-md px-3.5 py-2 focus:outline-hidden"
        >
          <option value="all">All Categories</option>
          <option value="State EOC">State EOC</option>
          <option value="National">National NDRF</option>
          <option value="Medical">Medical & Ambulance</option>
          <option value="Police & Fire">Police & Fire</option>
          <option value="Marine & Coast">Marine & Coast Guard</option>
          <option value="Ham Radio & NGO">Ham Radio & Civil Net</option>
        </select>
      </div>

      {/* Contacts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-4 shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {contact.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight mt-1.5">
                    {contact.name}
                  </h3>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  {contact.priority}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {contact.description}
              </p>

              {/* Numbers and Location */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Primary Phone:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>{contact.phone}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(contact.phone, contact.id + '-primary')}
                      className="p-1 hover:text-blue-600 text-slate-400"
                      title="Copy number"
                    >
                      {copiedId === contact.id + '-primary' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {contact.tollFree && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500 font-medium">Toll-Free Helpline:</span>
                    <span className="font-mono font-bold text-red-600">{contact.tollFree}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-slate-600 truncate max-w-[220px]">{contact.location}</span>
                </div>
              </div>
            </div>

            {/* Dial Button */}
            <div className="pt-2 flex gap-2">
              <a
                href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                className="flex-1 py-2 px-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" /> Dial {contact.tollFree ? `Toll Free (${contact.tollFree})` : 'Helpline'}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
