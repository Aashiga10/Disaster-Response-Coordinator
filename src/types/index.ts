export type DisasterType = 
  | 'flood' 
  | 'cyclone' 
  | 'earthquake' 
  | 'landslide' 
  | 'fire' 
  | 'building_collapse' 
  | 'tsunami' 
  | 'other';

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export type IncidentStatus = 'New' | 'Verified' | 'In Progress' | 'Resolved';

export type UserRole = 'Chief Coordinator' | 'Field Commander' | 'Logistics Officer' | 'Medical Lead' | 'Volunteer Coordinator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  agency: string;
  avatar: string;
  phone: string;
}

export interface Incident {
  id: string;
  title: string;
  disasterType: DisasterType;
  location: string;
  district: string;
  lat: number;
  lng: number;
  severity: Severity;
  status: IncidentStatus;
  affectedPeople: number;
  injuredCount: number;
  missingCount: number;
  reportedAt: string; // ISO string
  source: 'Citizen' | 'Field Responder' | 'Drone Recon' | 'Police/Fire' | 'Satellite Alert' | 'Live News / GDACS';
  verificationStatus: 'Unverified' | 'Verified' | 'Flagged' | 'Duplicate' | 'Suspected Hoax';
  reporterName: string;
  reporterContact: string;
  assignedTeam?: string;
  requiredResources: string[];
  description: string;
  priority: 'P1 - Immediate' | 'P2 - High' | 'P3 - Moderate' | 'P4 - Low';
  isDuplicate?: boolean;
  duplicateOf?: string;
  imageUrl?: string;
  videoUrl?: string;
  updatedAt?: string;
  // AI Credibility & Fake Detection (Step 5 of Workflow)
  credibilityScore?: number; // 0 - 100%
  isLikelyFake?: boolean;
  credibilityReasoning?: string;
  misinformationRisk?: 'Low' | 'Medium' | 'High' | 'Suspected Hoax';
  isLiveFeed?: boolean;
  liveFeedSource?: string;
}

export interface RescueOperation {
  id: string;
  title: string;
  location: string;
  district: string;
  teamName: string;
  disasterType: DisasterType;
  priority: 'P1 - Immediate' | 'P2 - High' | 'P3 - Moderate' | 'P4 - Low';
  startTime: string;
  status: 'Deployed' | 'En Route' | 'On Scene' | 'Evacuating' | 'Completed' | 'Standby';
  eta: string;
  teamLeader: string;
  teamSize: number;
  assignedVehicles: string[];
  rescuedCount: number;
  targetCount: number;
  notes: string;
  lat: number;
  lng: number;
}

export interface EmergencyResource {
  id: string;
  name: string;
  category: 
    | 'Ambulances' 
    | 'Rescue Boats' 
    | 'Rescue Vehicles' 
    | 'Medical Kits' 
    | 'Food Supplies' 
    | 'Drinking Water' 
    | 'Blankets' 
    | 'Emergency Shelters' 
    | 'Power & Comms'
    | 'Drones';
  total: number;
  available: number;
  deployed: number;
  criticalShortage: boolean;
  unit: string;
  depotLocation: string;
  condition: 'Optimal' | 'Requires Maintenance' | 'Operational';
  lastUpdated: string;
}

export interface Volunteer {
  id: string;
  name: string;
  skill: 'Medical & First Aid' | 'Water Rescue / Diving' | 'Search & Rescue' | 'Logistics & Supply' | 'Ham Radio & Comms' | 'Drone Pilot' | 'Trauma Counseling' | 'Heavy Vehicle Driving';
  location: string;
  district: string;
  availability: 'Available' | 'Assigned' | 'On Standby' | 'Offline';
  contact: string;
  email: string;
  assignedOperationId?: string;
  assignedOperationName?: string;
  status: 'Active' | 'En Route' | 'Resting' | 'Inactive';
  experienceYears: number;
  rating: number;
  bloodGroup: string;
  joinedDate: string;
}

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  disasterType: DisasterType;
  location: string;
  district: string;
  severity: Severity;
  targetAudience: 'All Citizens' | 'First Responders' | 'Coastal Residents' | 'River Basin Area' | 'Hospital Networks';
  createdAt: string;
  status: 'Active' | 'Broadcasted' | 'Expired' | 'Cancelled';
  broadcastChannels: ('SMS' | 'Emergency Siren' | 'App Push' | 'Radio/TV' | 'WhatsApp')[];
  expiresAt: string;
  issuer: string;
}

export interface AffectedArea {
  id: string;
  district: string;
  state: string;
  populationAffected: number;
  housesDamaged: number;
  roadsBlocked: number;
  hospitalsAffected: number;
  sheltersAvailable: number;
  shelterCapacity: number;
  severity: Severity;
  keyHazards: string[];
  reliefSuppliedPercentage: number;
  waterLevelMeters?: number;
  rainfallMm?: number;
  lat: number;
  lng: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  department: 'State Emergency Operations' | 'NDRF & Paramilitary' | 'Police & Traffic' | 'Fire & Rescue' | 'Medical & Hospitals' | 'District Administration' | 'NGO & Relief';
  phone: string;
  alternatePhone?: string;
  email: string;
  location: string;
  available24x7: boolean;
  category: 'Hotline' | 'Field Commander' | 'Hospital Chief' | 'Control Room' | 'Nodal Officer';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  read: boolean;
  link?: string;
}

export interface AIAnalysisResult {
  incidentId?: string;
  priorityScore: number;
  priorityLevel: 'P1 - Immediate' | 'P2 - High' | 'P3 - Moderate';
  estimatedAffectedPeople: number;
  duplicateProbability: number;
  potentialDuplicateId?: string;
  recommendedAction: string;
  requiredResources: string[];
  dangerIndex: number;
  reasoning: string;
}
