import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  UserCheck,
  Star,
  Award,
  Droplet
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Volunteer } from '../types';

export const Volunteers: React.FC = () => {
  const {
    volunteers,
    registerVolunteer,
    updateVolunteerStatus,
    assignVolunteer,
    operations,
    affectedAreas,
    addNotification
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');
  const [filterSkill, setFilterSkill] = useState<string>('all');
  const [isRegistering, setIsRegistering] = useState(false);
  const [assigningVolunteer, setAssigningVolunteer] = useState<Volunteer | null>(null);
  const [selectedOperationId, setSelectedOperationId] = useState<string>('');

  // New volunteer form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newDistrict, setNewDistrict] = useState(affectedAreas[0]?.district || 'Chennai');
  const [newLocation, setNewLocation] = useState('Central Chennai');
  const [newSkill, setNewSkill] = useState<Volunteer['skill']>('Medical & First Aid');
  const [newBloodGroup, setNewBloodGroup] = useState('O+ve');
  const [newExperience, setNewExperience] = useState(3);

  const availableSkills: Volunteer['skill'][] = [
    'Medical & First Aid',
    'Water Rescue / Diving',
    'Search & Rescue',
    'Logistics & Supply',
    'Ham Radio & Comms',
    'Drone Pilot',
    'Trauma Counseling',
    'Heavy Vehicle Driving'
  ];

  const totalVolunteers = volunteers.length;
  const availableVolunteers = volunteers.filter(v => v.availability === 'Available').length;
  const assignedVolunteers = volunteers.filter(v => v.availability === 'Assigned').length;
  const hamOperators = volunteers.filter(v => v.skill === 'Ham Radio & Comms').length;

  const filteredVolunteers = volunteers.filter(v => {
    if (filterAvailability !== 'all' && v.availability !== filterAvailability) return false;
    if (filterSkill !== 'all' && v.skill !== filterSkill) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.district.toLowerCase().includes(q) ||
        v.skill.toLowerCase().includes(q) ||
        v.contact.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newContact) return;

    registerVolunteer({
      name: newName,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '.')}@volunteer-eoc.org`,
      contact: newContact,
      location: newLocation,
      district: newDistrict,
      skill: newSkill,
      availability: 'Available',
      status: 'Active',
      rating: 5.0,
      experienceYears: Number(newExperience) || 1,
      bloodGroup: newBloodGroup
    });

    setIsRegistering(false);
    setNewName('');
    setNewContact('');
    setNewEmail('');
  };

  const handleQuickStatusToggle = (vol: Volunteer) => {
    const nextAvailability: Volunteer['availability'] =
      vol.availability === 'Available' ? 'On Standby' : vol.availability === 'On Standby' ? 'Offline' : 'Available';
    updateVolunteerStatus(vol.id, nextAvailability, 'Active');
    addNotification('Volunteer Status Updated', `${vol.name} availability set to ${nextAvailability}.`, 'info');
  };

  const handleAssignToOperation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningVolunteer || !selectedOperationId) return;

    assignVolunteer(assigningVolunteer.id, selectedOperationId);
    setAssigningVolunteer(null);
    setSelectedOperationId('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Volunteer Network & Community Relief Corps
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Mobilize certified emergency volunteers, boat navigators, medical doctors, and HAM operators
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsRegistering(true)}
          className="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Register New Volunteer
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Registered Force</span>
          <div className="text-2xl font-extrabold font-mono text-slate-800">{totalVolunteers} Volunteers</div>
          <span className="text-[10px] text-slate-500">Verified civil defense pool</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Ready for Deployment</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-600">{availableVolunteers} Ready</div>
          <span className="text-[10px] text-emerald-700 font-medium">Available immediately</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Field Deployed</span>
          <div className="text-2xl font-extrabold font-mono text-amber-700">{assignedVolunteers} on Missions</div>
          <span className="text-[10px] text-amber-700 font-medium">Active in disaster zones</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">HAM Radio / Comms</span>
          <div className="text-2xl font-extrabold font-mono text-blue-600">{hamOperators} Operators</div>
          <span className="text-[10px] text-blue-600 font-medium">Zero-infra wireless</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm items-stretch lg:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search volunteers by name, district, skills, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-md px-3.5 py-2 focus:outline-hidden"
          >
            <option value="all">All Availability</option>
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="On Standby">On Standby</option>
            <option value="Offline">Offline</option>
          </select>

          <select
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-md px-3.5 py-2 focus:outline-hidden"
          >
            <option value="all">All Skill Sets</option>
            {availableSkills.map((sk) => (
              <option key={sk} value={sk}>
                {sk}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Volunteer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVolunteers.map((vol) => (
          <div
            key={vol.id}
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-4 shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm font-mono">
                    {vol.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{vol.name}</h3>
                    <span className="text-[11px] font-mono text-slate-400">{vol.id}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickStatusToggle(vol)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all border ${
                    vol.availability === 'Available'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : vol.availability === 'Assigned'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                  title="Click to toggle availability"
                >
                  {vol.availability.toUpperCase()}
                </button>
              </div>

              {/* Location & Rating */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 mt-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>{vol.location}, {vol.district}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-amber-600 font-semibold">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>{vol.rating || 4.9}</span>
                  <span className="text-slate-400">({vol.experienceYears}y exp)</span>
                </div>
              </div>

              {/* Contact info & Blood group */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1 my-3 font-mono">
                <div className="flex items-center justify-between text-slate-800">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-blue-600 shrink-0" />
                    <a href={`tel:${vol.contact}`} className="hover:text-blue-600 truncate">
                      {vol.contact}
                    </a>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-red-700 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                    <Droplet className="w-2.5 h-2.5" /> {vol.bloodGroup}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{vol.email}</span>
                </div>
              </div>

              {/* Assigned Operation if any */}
              {vol.assignedOperationName && (
                <div className="p-2 rounded-md bg-amber-50 border border-amber-200 text-[11px] text-amber-800 font-mono flex items-center gap-1.5 mb-3">
                  <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate font-semibold">Mission: {vol.assignedOperationName}</span>
                </div>
              )}

              {/* Skill badge */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Specialization</span>
                <span className="inline-block px-2.5 py-1 text-xs rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                  {vol.skill}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setAssigningVolunteer(vol);
                  setSelectedOperationId(operations[0]?.id || '');
                }}
                className="flex-1 px-3 py-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" /> Assign to Mission
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Modal */}
      {assigningVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Deploy Volunteer to Mission</h3>
            <p className="text-xs text-slate-500">
              Assigning <strong className="text-slate-900">{assigningVolunteer.name}</strong> ({assigningVolunteer.district})
            </p>

            <form onSubmit={handleAssignToOperation} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Select Active Operation</label>
                <select
                  value={selectedOperationId}
                  onChange={(e) => setSelectedOperationId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-800 font-medium"
                  required
                >
                  {operations.map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.id} - {op.title} ({op.district})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningVolunteer(null)}
                  className="px-3.5 py-2 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {isRegistering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Register Emergency Volunteer</h3>
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Keerthana Ravi"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Contact Phone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 94440 12345"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. volunteer@mail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Base District</label>
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-800 font-medium"
                  >
                    {affectedAreas.map((a) => (
                      <option key={a.id} value={a.district}>
                        {a.district}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Location / Area</label>
                  <input
                    type="text"
                    placeholder="e.g. Mylapore"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-slate-700 block mb-1 font-semibold">Core Skill</label>
                  <select
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value as Volunteer['skill'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-800 font-medium"
                  >
                    {availableSkills.map((sk) => (
                      <option key={sk} value={sk}>
                        {sk}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Blood Group</label>
                  <select
                    value={newBloodGroup}
                    onChange={(e) => setNewBloodGroup(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-800 font-mono font-medium"
                  >
                    <option value="O+ve">O+ve</option>
                    <option value="O-ve">O-ve</option>
                    <option value="A+ve">A+ve</option>
                    <option value="A-ve">A-ve</option>
                    <option value="B+ve">B+ve</option>
                    <option value="B-ve">B-ve</option>
                    <option value="AB+ve">AB+ve</option>
                    <option value="AB-ve">AB-ve</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="px-3.5 py-2 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
                >
                  Register Volunteer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
