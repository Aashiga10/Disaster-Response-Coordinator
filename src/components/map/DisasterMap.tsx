import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Filter,
  Shield,
  Building,
  Home,
  LifeBuoy,
  AlertOctagon,
  AlertTriangle,
  Waves,
  Mountain,
  Wind,
  Flame,
  X,
  Eye,
  Crosshair,
  Truck,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Incident, DisasterType, Severity } from '../../types';

interface DisasterMapProps {
  onSelectIncident?: (incident: Incident) => void;
  fullHeight?: boolean;
}

export const DisasterMap: React.FC<DisasterMapProps> = ({ onSelectIncident, fullHeight = false }) => {
  const { incidents, operations, affectedAreas } = useApp();

  // Map view transformation states
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Layer toggles
  const [layers, setLayers] = useState({
    criticalIncidents: true,
    allIncidents: true,
    shelters: true,
    hospitals: true,
    rescueTeams: true,
    blockedRoads: true
  });

  // Filters
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchLoc, setSearchLoc] = useState('');

  // Selected Marker Popup
  const [activeMarker, setActiveMarker] = useState<{
    type: 'incident' | 'shelter' | 'hospital' | 'team' | 'road';
    data: any;
    x: number;
    y: number;
  } | null>(null);

  // Geographic bounds for Tamil Nadu coordinate mapping
  // Lat: 8.0 to 13.5 N, Lng: 76.2 to 80.5 E
  const minLat = 8.0;
  const maxLat = 13.6;
  const minLng = 76.0;
  const maxLng = 80.6;

  // Convert real lat/lng to SVG percentage (0-100%)
  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    // Invert Y because SVG coordinates increase downwards
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  // Mock static spatial infrastructure for emergency network
  const staticInfrastructure = useMemo(() => {
    return {
      hospitals: [
        { id: 'HOSP-01', name: 'Rajiv Gandhi General Hospital (Apex)', district: 'Chennai', lat: 13.0815, lng: 80.2770, beds: 180, status: 'Operational' },
        { id: 'HOSP-02', name: 'Cuddalore District Head Hospital', district: 'Cuddalore', lat: 11.7510, lng: 79.7680, beds: 35, status: 'Flood Submerged - Evacuating' },
        { id: 'HOSP-03', name: 'Coimbatore Medical College Hospital', district: 'Coimbatore', lat: 11.0020, lng: 76.9660, beds: 140, status: 'Operational' },
        { id: 'HOSP-04', name: 'Madurai Government Rajaji Hospital', district: 'Madurai', lat: 9.9280, lng: 78.1250, beds: 160, status: 'Operational' },
        { id: 'HOSP-05', name: 'Ooty District Government Hospital', district: 'Nilgiris', lat: 11.4110, lng: 76.7020, beds: 60, status: 'Operational' }
      ],
      shelters: [
        { id: 'SHL-01', name: 'Anna University Campus Relief Center', district: 'Chennai', lat: 13.0110, lng: 80.2350, capacity: 3500, current: 1850 },
        { id: 'SHL-02', name: 'Cuddalore Port Tsunami Shelter', district: 'Cuddalore', lat: 11.7390, lng: 79.7780, capacity: 2200, current: 1400 },
        { id: 'SHL-03', name: 'Nagapattinam Multipurpose Cyclone Shelter #4', district: 'Nagapattinam', lat: 10.7610, lng: 79.8460, capacity: 1800, current: 1250 },
        { id: 'SHL-04', name: 'Guru Nanak College Relief Hub', district: 'Chennai', lat: 12.9860, lng: 80.2200, capacity: 1500, current: 890 },
        { id: 'SHL-05', name: 'Thiruvaiyaru Higher Secondary Relief Camp', district: 'Thanjavur', lat: 10.8840, lng: 79.1090, capacity: 800, current: 420 }
      ],
      blockedRoads: [
        { id: 'ROAD-01', name: 'NH-181 Marapalam Ghat Section (Landslide)', district: 'Nilgiris', lat: 11.3532, lng: 76.7959, cause: 'Massive Boulders', status: 'Closed' },
        { id: 'ROAD-02', name: 'Sellur Causeway & Subway (Submerged)', district: 'Madurai', lat: 9.9320, lng: 78.1180, cause: '3.5ft Water Stagnation', status: 'Closed' },
        { id: 'ROAD-03', name: 'Valparai Ghat 28th Bend Culvert', district: 'Coimbatore', lat: 10.3250, lng: 76.9530, cause: 'Culvert Washout', status: 'Closed' },
        { id: 'ROAD-04', name: 'Kotturpuram Bridge Approach Lowland', district: 'Chennai', lat: 13.0185, lng: 80.2412, cause: 'Adyar Overflow', status: 'Emergency Only' }
      ]
    };
  }, []);

  // Filtered Incidents
  const filteredIncidents = incidents.filter(inc => {
    if (selectedType !== 'all' && inc.disasterType !== selectedType) return false;
    if (selectedSeverity !== 'all' && inc.severity !== selectedSeverity) return false;
    if (searchLoc && !inc.location.toLowerCase().includes(searchLoc.toLowerCase()) && !inc.district.toLowerCase().includes(searchLoc.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setActiveMarker(null);
  };

  return (
    <div className={`relative rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl flex flex-col ${
      fullHeight ? 'h-[calc(100vh-140px)] min-h-[550px]' : 'h-[600px]'
    }`}>
      {/* Map Control Bar Top */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Search location */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl px-3 py-1.5 shadow-xl max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search map location / district..."
            value={searchLoc}
            onChange={(e) => setSearchLoc(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-hidden w-full"
          />
          {searchLoc && (
            <button type="button" onClick={() => setSearchLoc('')} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="pointer-events-auto flex items-center gap-2 flex-wrap">
          {/* Disaster Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs font-mono text-slate-200 rounded-xl px-3 py-1.5 shadow-xl focus:outline-hidden"
          >
            <option value="all">All Disasters</option>
            <option value="flood">Floods</option>
            <option value="cyclone">Cyclones</option>
            <option value="landslide">Landslides</option>
            <option value="fire">Fires</option>
            <option value="building_collapse">Collapses</option>
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs font-mono text-slate-200 rounded-xl px-3 py-1.5 shadow-xl focus:outline-hidden"
          >
            <option value="all">All Severities</option>
            <option value="Critical">Critical (P1)</option>
            <option value="High">High (P2)</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Layer Toggles Floating Panel (Top-Right) */}
      <div className="absolute top-16 right-4 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-3 shadow-2xl text-xs space-y-1.5 max-w-[200px]">
        <div className="flex items-center gap-1.5 font-bold text-slate-300 pb-1 border-b border-slate-800 text-[11px] uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-rose-400" />
          Map GIS Layers
        </div>
        
        <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
          <input
            type="checkbox"
            checked={layers.criticalIncidents}
            onChange={(e) => setLayers({ ...layers, criticalIncidents: e.target.checked })}
            className="rounded text-rose-600 bg-slate-800 border-slate-700"
          />
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            Critical Incidents ({filteredIncidents.filter(i => i.severity === 'Critical').length})
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
          <input
            type="checkbox"
            checked={layers.allIncidents}
            onChange={(e) => setLayers({ ...layers, allIncidents: e.target.checked })}
            className="rounded text-amber-600 bg-slate-800 border-slate-700"
          />
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            All Incidents ({filteredIncidents.length})
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
          <input
            type="checkbox"
            checked={layers.rescueTeams}
            onChange={(e) => setLayers({ ...layers, rescueTeams: e.target.checked })}
            className="rounded text-amber-500 bg-slate-800 border-slate-700"
          />
          <span className="flex items-center gap-1.5">
            <LifeBuoy className="w-3 h-3 text-amber-400" />
            Rescue Teams ({operations.length})
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
          <input
            type="checkbox"
            checked={layers.shelters}
            onChange={(e) => setLayers({ ...layers, shelters: e.target.checked })}
            className="rounded text-emerald-600 bg-slate-800 border-slate-700"
          />
          <span className="flex items-center gap-1.5">
            <Home className="w-3 h-3 text-emerald-400" />
            Relief Shelters ({staticInfrastructure.shelters.length})
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
          <input
            type="checkbox"
            checked={layers.hospitals}
            onChange={(e) => setLayers({ ...layers, hospitals: e.target.checked })}
            className="rounded text-sky-600 bg-slate-800 border-slate-700"
          />
          <span className="flex items-center gap-1.5">
            <Building className="w-3 h-3 text-sky-400" />
            Hospitals ({staticInfrastructure.hospitals.length})
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
          <input
            type="checkbox"
            checked={layers.blockedRoads}
            onChange={(e) => setLayers({ ...layers, blockedRoads: e.target.checked })}
            className="rounded text-rose-500 bg-slate-800 border-slate-700"
          />
          <span className="flex items-center gap-1.5">
            <AlertOctagon className="w-3 h-3 text-rose-400" />
            Blocked Roads ({staticInfrastructure.blockedRoads.length})
          </span>
        </label>
      </div>

      {/* Map Zoom Controls Bottom-Right */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl p-1.5 shadow-2xl">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(2.5, z + 0.3))}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.7, z - 0.3))}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={resetView}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          title="Reset map view"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-2xl px-3.5 py-2 shadow-2xl text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-600 border border-rose-400 animate-pulse"></span>
          <span>Critical Disaster</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-300"></span>
          <span>High Severity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-sky-500 border border-sky-300"></span>
          <span>Hospital</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300"></span>
          <span>Shelter</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-purple-600 border border-purple-400"></span>
          <span>Rescue Team</span>
        </div>
      </div>

      {/* Interactive Map SVG Stage */}
      <div
        className="flex-1 w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="w-full h-full transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          {/* SVG Map Canvas */}
          <svg className="w-full h-full min-w-[700px] min-h-[500px]" viewBox="0 0 1000 750">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
              </pattern>
              
              {/* Radar pulse gradient */}
              <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Grid */}
            <rect width="1000" height="750" fill="#090d16" />
            <rect width="1000" height="750" fill="url(#grid)" />

            {/* Coastline / Regional Landmass Outline (Stylized Tamil Nadu / South Coast Shape) */}
            <path
              d="M 220 80 
                 Q 320 60, 480 90 
                 T 620 140 
                 Q 750 180, 820 220 
                 L 860 300 
                 Q 870 380, 830 460 
                 T 810 560 
                 Q 770 650, 680 710 
                 L 580 730 
                 Q 480 670, 360 590 
                 T 240 420 
                 Q 180 320, 200 210 
                 Z"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />

            {/* Ocean Waves Accent (Bay of Bengal / Indian Ocean) */}
            <path
              d="M 830 200 Q 880 280, 890 380 T 850 540 Q 800 680, 710 740"
              fill="none"
              stroke="#0284c7"
              strokeWidth="1.5"
              strokeDasharray="8 6"
              opacity="0.4"
            />
            <text x="860" y="320" fill="#0284c7" fontSize="12" fontFamily="monospace" opacity="0.6" letterSpacing="3">
              BAY OF BENGAL
            </text>

            {/* River Network Lines (Adyar, Cauvery, Geddilam, Vaigai) */}
            {/* Adyar (Chennai) */}
            <path d="M 750 180 Q 780 190, 810 195" fill="none" stroke="#38bdf8" strokeWidth="2.5" opacity="0.7" />
            <text x="760" y="175" fill="#38bdf8" fontSize="9" fontFamily="monospace">Adyar River Basin</text>

            {/* Cauvery River (Thanjavur / Trichy) */}
            <path d="M 420 400 Q 560 410, 780 430" fill="none" stroke="#38bdf8" strokeWidth="2.5" opacity="0.7" />
            <text x="590" y="405" fill="#38bdf8" fontSize="9" fontFamily="monospace">Cauvery River Delta</text>

            {/* Vaigai River (Madurai) */}
            <path d="M 450 560 Q 580 575, 720 610" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
            <text x="510" y="555" fill="#38bdf8" fontSize="9" fontFamily="monospace">Vaigai River</text>

            {/* District Regions & Coordinate Crosshairs */}
            {affectedAreas.map((area) => {
              const { x, y } = projectCoords(area.lat, area.lng);
              const svgX = (x / 100) * 1000;
              const svgY = (y / 100) * 750;

              return (
                <g key={area.id}>
                  {/* District label */}
                  <text
                    x={svgX}
                    y={svgY + 28}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    letterSpacing="1"
                  >
                    {area.district.toUpperCase()}
                  </text>
                  
                  {/* High severity zone radius */}
                  {area.severity === 'Critical' && (
                    <circle
                      cx={svgX}
                      cy={svgY}
                      r="48"
                      fill="url(#radarGlow)"
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })}

            {/* Hospital Markers */}
            {layers.hospitals &&
              staticInfrastructure.hospitals.map((hosp) => {
                const { x, y } = projectCoords(hosp.lat, hosp.lng);
                const svgX = (x / 100) * 1000;
                const svgY = (y / 100) * 750;
                return (
                  <g
                    key={hosp.id}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMarker({ type: 'hospital', data: hosp, x: svgX, y: svgY });
                    }}
                  >
                    <circle cx={svgX} cy={svgY} r="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                    <text x={svgX} y={svgY + 4} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                      +
                    </text>
                  </g>
                );
              })}

            {/* Shelter Markers */}
            {layers.shelters &&
              staticInfrastructure.shelters.map((shl) => {
                const { x, y } = projectCoords(shl.lat, shl.lng);
                const svgX = (x / 100) * 1000;
                const svgY = (y / 100) * 750;
                return (
                  <g
                    key={shl.id}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMarker({ type: 'shelter', data: shl, x: svgX, y: svgY });
                    }}
                  >
                    <circle cx={svgX} cy={svgY} r="10" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                    <text x={svgX} y={svgY + 3} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                      ▲
                    </text>
                  </g>
                );
              })}

            {/* Blocked Road Markers */}
            {layers.blockedRoads &&
              staticInfrastructure.blockedRoads.map((road) => {
                const { x, y } = projectCoords(road.lat, road.lng);
                const svgX = (x / 100) * 1000;
                const svgY = (y / 100) * 750;
                return (
                  <g
                    key={road.id}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMarker({ type: 'road', data: road, x: svgX, y: svgY });
                    }}
                  >
                    <polygon
                      points={`${svgX},${svgY - 11} ${svgX + 11},${svgY + 9} ${svgX - 11},${svgY + 9}`}
                      fill="#e11d48"
                      stroke="#ffe4e6"
                      strokeWidth="1.5"
                    />
                    <text x={svgX} y={svgY + 6} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                      !
                    </text>
                  </g>
                );
              })}

            {/* Active Rescue Teams Markers */}
            {layers.rescueTeams &&
              operations.map((op) => {
                const { x, y } = projectCoords(op.lat, op.lng);
                const svgX = (x / 100) * 1000;
                const svgY = (y / 100) * 750;
                return (
                  <g
                    key={op.id}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMarker({ type: 'team', data: op, x: svgX, y: svgY });
                    }}
                  >
                    <rect
                      x={svgX - 10}
                      y={svgY - 10}
                      width="20"
                      height="20"
                      rx="6"
                      fill="#7c3aed"
                      stroke="#c4b5fd"
                      strokeWidth="1.5"
                    />
                    <text x={svgX} y={svgY + 4} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                      T
                    </text>
                  </g>
                );
              })}

            {/* Incident Markers */}
            {layers.allIncidents &&
              filteredIncidents.map((inc) => {
                const isCrit = inc.severity === 'Critical';
                if (!layers.criticalIncidents && isCrit) return null;

                const { x, y } = projectCoords(inc.lat, inc.lng);
                const svgX = (x / 100) * 1000;
                const svgY = (y / 100) * 750;

                return (
                  <g
                    key={inc.id}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMarker({ type: 'incident', data: inc, x: svgX, y: svgY });
                      if (onSelectIncident) onSelectIncident(inc);
                    }}
                  >
                    {/* Sonar pulse ring for critical incidents */}
                    {isCrit && (
                      <circle
                        cx={svgX}
                        cy={svgY}
                        r="18"
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="2"
                        className="animate-ping opacity-75"
                      />
                    )}

                    {/* Outer pin ring */}
                    <circle
                      cx={svgX}
                      cy={svgY}
                      r={isCrit ? '12' : '9'}
                      fill={isCrit ? '#e11d48' : '#d97706'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    {/* Icon glyph */}
                    <text
                      x={svgX}
                      y={svgY + 3.5}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {inc.disasterType === 'flood' ? '≋' : inc.disasterType === 'landslide' ? '▲' : '●'}
                    </text>
                  </g>
                );
              })}
          </svg>
        </div>

        {/* Floating Marker Popup Modal */}
        {activeMarker && (
          <div
            className="absolute z-30 w-72 sm:w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150"
            style={{
              top: '20%',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase">
                  {activeMarker.type.toUpperCase()} POINT
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveMarker(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Marker content breakdown */}
            {activeMarker.type === 'incident' && (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-white text-sm">{activeMarker.data.title}</div>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{activeMarker.data.location}, {activeMarker.data.district}</span>
                </div>
                <div className="flex items-center justify-between font-mono pt-1">
                  <span className="text-rose-400 font-bold">Severity: {activeMarker.data.severity}</span>
                  <span className="text-slate-300">{activeMarker.data.affectedPeople} Affected</span>
                </div>
                <p className="text-slate-400 line-clamp-2 mt-1">{activeMarker.data.description}</p>
                
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectIncident) onSelectIncident(activeMarker.data);
                    }}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Full Details
                  </button>
                </div>
              </div>
            )}

            {activeMarker.type === 'hospital' && (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-white text-sm">{activeMarker.data.name}</div>
                <div className="text-slate-400">District: {activeMarker.data.district}</div>
                <div className="text-sky-300 font-mono">Available Trauma Beds: {activeMarker.data.beds}</div>
                <div className="text-emerald-400 font-semibold">Status: {activeMarker.data.status}</div>
              </div>
            )}

            {activeMarker.type === 'shelter' && (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-white text-sm">{activeMarker.data.name}</div>
                <div className="text-slate-400">District: {activeMarker.data.district}</div>
                <div className="text-emerald-400 font-mono">
                  Capacity: {activeMarker.data.current} / {activeMarker.data.capacity} occupants
                </div>
              </div>
            )}

            {activeMarker.type === 'team' && (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-white text-sm">{activeMarker.data.teamName}</div>
                <div className="text-purple-300 font-semibold">{activeMarker.data.title}</div>
                <div className="text-slate-400">Leader: {activeMarker.data.teamLeader} ({activeMarker.data.teamSize} personnel)</div>
                <div className="text-amber-400 font-mono">Status: {activeMarker.data.status} • ETA: {activeMarker.data.eta}</div>
              </div>
            )}

            {activeMarker.type === 'road' && (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-rose-400 text-sm">BLOCKED ROADWAY HAZARD</div>
                <div className="font-semibold text-white">{activeMarker.data.name}</div>
                <div className="text-slate-400">Cause: {activeMarker.data.cause}</div>
                <div className="text-rose-300 font-bold font-mono">Status: {activeMarker.data.status}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
