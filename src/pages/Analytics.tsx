import React, { useState } from 'react';
import {
  BarChart2,
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useApp } from '../context/AppContext';

export const Analytics: React.FC = () => {
  const { incidents, operations, resources, affectedAreas, addNotification } = useApp();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  // Chart 1: Incidents by Disaster Type
  const disasterTypeData = [
    { name: 'Floods', count: incidents.filter(i => i.disasterType === 'flood').length, color: '#3b82f6' },
    { name: 'Cyclones', count: incidents.filter(i => i.disasterType === 'cyclone').length, color: '#0d9488' },
    { name: 'Landslides', count: incidents.filter(i => i.disasterType === 'landslide').length, color: '#f59e0b' },
    { name: 'Fires', count: incidents.filter(i => i.disasterType === 'fire').length, color: '#ef4444' },
    { name: 'Collapses', count: incidents.filter(i => i.disasterType === 'building_collapse').length, color: '#f97316' }
  ];

  // Chart 2: District Casualties & Evacuation
  const districtData = affectedAreas.map(a => ({
    district: a.district.slice(0, 10),
    affected: a.affectedPopulation,
    evacuated: a.evacuatedPopulation
  }));

  // Chart 3: Hourly Emergency Intake vs Rescues
  const hourlyData = [
    { hour: '00:00', incoming: 4, rescued: 12 },
    { hour: '03:00', incoming: 7, rescued: 28 },
    { hour: '06:00', incoming: 15, rescued: 65 },
    { hour: '09:00', incoming: 22, rescued: 140 },
    { hour: '12:00', incoming: 18, rescued: 210 },
    { hour: '15:00', incoming: 26, rescued: 340 },
    { hour: '18:00', incoming: 14, rescued: 420 },
    { hour: '21:00', incoming: 9, rescued: 490 }
  ];

  // Chart 4: Resource Distribution by Category
  const resourceCategoryData = [
    { name: 'Rescue & Marine', value: resources.filter(r => r.category === 'Rescue Boats' || r.category === 'Rescue Vehicles').reduce((a, b) => a + b.deployed, 0) || 45, color: '#6366f1' },
    { name: 'Medical & Trauma', value: resources.filter(r => r.category === 'Medical Kits' || r.category === 'Ambulances').reduce((a, b) => a + b.deployed, 0) || 35, color: '#ef4444' },
    { name: 'Rations & Water', value: resources.filter(r => r.category === 'Food Supplies' || r.category === 'Drinking Water').reduce((a, b) => a + b.deployed, 0) || 80, color: '#f59e0b' },
    { name: 'Shelters & Power', value: resources.filter(r => r.category === 'Emergency Shelters' || r.category === 'Power & Comms').reduce((a, b) => a + b.deployed, 0) || 30, color: '#0284c7' }
  ];

  const handleExportSitRep = () => {
    const reportText = `NATIONAL DISASTER RESPONSE COORDINATOR - SITUATION REPORT (SITREP)\nGenerated at: ${new Date().toLocaleString()}\n\nTotal Active Incidents: ${incidents.length}\nCritical Red Alerts: ${incidents.filter(i => i.severity === 'Critical').length}\nTotal Affected Population: ${affectedAreas.reduce((a,b)=>a+b.affectedPopulation,0)}\nTotal Evacuated: ${affectedAreas.reduce((a,b)=>a+b.evacuatedPopulation,0)}\nActive Tactical Rescue Squads: ${operations.length}\n\nSEOC Command Status: OPERATIONAL`;
    
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SITREP_DISASTER_EOC_${new Date().toISOString().slice(0,10)}.txt`;
    link.click();

    addNotification('SitRep Exported', 'Disaster Situation Report successfully downloaded.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Analytics & Tactical SitRep
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Disaster intelligence, casualty curves, response latency, and resource telemetry
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Time range switcher */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-1 text-xs font-mono">
            {(['24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  timeRange === range ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportSitRep}
            className="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export SitRep Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Avg Response Time</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-600">18.4 mins</div>
          <span className="text-[10px] text-slate-500">From logging to team on-scene</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Evacuation Clearance</span>
          <div className="text-2xl font-extrabold font-mono text-slate-800">76.8%</div>
          <span className="text-[10px] text-slate-500">Across red hazard corridors</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">AI Duplicate Accuracy</span>
          <div className="text-2xl font-extrabold font-mono text-blue-600">98.2%</div>
          <span className="text-[10px] text-blue-600 font-medium">Prevented double dispatches</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Resource Health</span>
          <div className="text-2xl font-extrabold font-mono text-amber-600">84% Stock</div>
          <span className="text-[10px] text-amber-600 font-medium">Available in regional depots</span>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Hourly Incident Inflow vs Cumulative Rescues */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Incident Influx vs Evacuated Citizens</h3>
              <p className="text-xs text-slate-500">Hourly response acceleration tracking</p>
            </div>
            <span className="text-xs font-mono text-blue-600 font-bold">24H TIMELINE</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="rescuedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="incomingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#0f172a' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="rescued" name="Citizens Rescued" stroke="#10b981" fillOpacity={1} fill="url(#rescuedGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="incoming" name="New Incidents Logged" stroke="#ef4444" fillOpacity={1} fill="url(#incomingGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: District Evacuation vs Affected */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">District Population vs Evacuated</h3>
              <p className="text-xs text-slate-500">Headcount comparison per disaster zone</p>
            </div>
            <span className="text-xs font-mono text-emerald-600 font-bold">BY DISTRICT</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData}>
                <XAxis dataKey="district" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#0f172a' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="affected" name="Affected Inhabitants" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="evacuated" name="Successfully Evacuated" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Incident Breakdown by Disaster Type */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Disaster Classification Distribution</h3>
              <p className="text-xs text-slate-500">Proportion of hazard causes logged</p>
            </div>
            <span className="text-xs font-mono text-blue-600 font-bold">HAZARD SHARE</span>
          </div>

          <div className="h-64 w-full pt-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={disasterTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {disasterTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#0f172a' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Resource Deployment Footprint */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Deployed Resource Footprint</h3>
              <p className="text-xs text-slate-500">Equipment utilization across active sectors</p>
            </div>
            <span className="text-xs font-mono text-amber-600 font-bold">LOGISTICS</span>
          </div>

          <div className="h-64 w-full pt-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resourceCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {resourceCategoryData.map((entry, index) => (
                    <Cell key={`cell-res-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#0f172a' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
