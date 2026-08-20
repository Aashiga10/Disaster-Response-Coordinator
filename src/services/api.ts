import { Incident, RescueOperation, EmergencyResource, Volunteer, AlertItem, AffectedArea, EmergencyContact } from '../types';

const API_BASE = '/api';

export interface BackendHealthResponse {
  status: string;
  uptime: number;
  timestamp: string;
  counts: {
    incidents: number;
    criticalIncidents: number;
    operations: number;
    activeOperations: number;
    resources: number;
    volunteers: number;
    activeAlerts: number;
    districts: number;
  };
  aiTriageAvailable: boolean;
}

export interface AITriageResult {
  source: string;
  triage: {
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    priority: string;
    estimatedCasualtyRisk: string;
    suggestedResources: string[];
    evacuationPerimeterMeters: number;
    isLikelyDuplicate: boolean;
    potentialDuplicateIncidentId: string | null;
    actionableGuidance: string;
    // Step 5 Credibility & Fake Detection
    credibilityScore: number; // 0-100%
    isLikelyFake: boolean;
    credibilityReasoning: string;
    misinformationRisk: 'Low' | 'Medium' | 'High' | 'Suspected Hoax';
  };
}

export const api = {
  // System Health
  async getHealth(): Promise<BackendHealthResponse> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch system health');
    return res.json();
  },

  // Incidents
  async getIncidents(params?: { severity?: string; district?: string; disasterType?: string; status?: string; search?: string }): Promise<Incident[]> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v && v !== 'all') query.append(k, v);
      });
    }
    const res = await fetch(`${API_BASE}/incidents?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return res.json();
  },

  async createIncident(incident: Partial<Incident>): Promise<Incident> {
    const res = await fetch(`${API_BASE}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incident)
    });
    if (!res.ok) throw new Error('Failed to create incident');
    return res.json();
  },

  async updateIncident(id: string, updates: Partial<Incident>): Promise<Incident> {
    const res = await fetch(`${API_BASE}/incidents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update incident');
    return res.json();
  },

  async deleteIncident(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/incidents/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete incident');
    return res.json();
  },

  // Rescue Operations
  async getOperations(): Promise<RescueOperation[]> {
    const res = await fetch(`${API_BASE}/operations`);
    if (!res.ok) throw new Error('Failed to fetch operations');
    return res.json();
  },

  async createOperation(op: Partial<RescueOperation>): Promise<RescueOperation> {
    const res = await fetch(`${API_BASE}/operations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(op)
    });
    if (!res.ok) throw new Error('Failed to create operation');
    return res.json();
  },

  async updateOperation(id: string, updates: Partial<RescueOperation>): Promise<RescueOperation> {
    const res = await fetch(`${API_BASE}/operations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update operation');
    return res.json();
  },

  // Resources
  async getResources(): Promise<EmergencyResource[]> {
    const res = await fetch(`${API_BASE}/resources`);
    if (!res.ok) throw new Error('Failed to fetch resources');
    return res.json();
  },

  async allocateResource(id: string, quantity: number, destination: string): Promise<{ message: string; resource: EmergencyResource }> {
    const res = await fetch(`${API_BASE}/resources/${id}/allocate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity, destination })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to allocate resource');
    }
    return res.json();
  },

  async replenishResource(id: string, quantity: number): Promise<{ message: string; resource: EmergencyResource }> {
    const res = await fetch(`${API_BASE}/resources/${id}/replenish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    });
    if (!res.ok) throw new Error('Failed to replenish resource');
    return res.json();
  },

  // Volunteers
  async getVolunteers(): Promise<Volunteer[]> {
    const res = await fetch(`${API_BASE}/volunteers`);
    if (!res.ok) throw new Error('Failed to fetch volunteers');
    return res.json();
  },

  async registerVolunteer(volunteer: Partial<Volunteer>): Promise<Volunteer> {
    const res = await fetch(`${API_BASE}/volunteers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(volunteer)
    });
    if (!res.ok) throw new Error('Failed to register volunteer');
    return res.json();
  },

  async updateVolunteer(id: string, updates: Partial<Volunteer>): Promise<Volunteer> {
    const res = await fetch(`${API_BASE}/volunteers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update volunteer');
    return res.json();
  },

  // Alerts
  async getAlerts(): Promise<AlertItem[]> {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  async createAlert(alert: Partial<AlertItem>): Promise<AlertItem> {
    const res = await fetch(`${API_BASE}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert)
    });
    if (!res.ok) throw new Error('Failed to create alert');
    return res.json();
  },

  async dismissAlert(id: string): Promise<AlertItem> {
    const res = await fetch(`${API_BASE}/alerts/${id}/dismiss`, {
      method: 'PATCH'
    });
    if (!res.ok) throw new Error('Failed to dismiss alert');
    return res.json();
  },

  // AI Triage
  async runAITriage(payload: { title: string; description: string; location: string; district: string; disasterType: string }): Promise<AITriageResult> {
    const res = await fetch(`${API_BASE}/ai/triage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to perform AI triage');
    return res.json();
  },

  // Dataset Export & Import
  async exportDataset(): Promise<void> {
    window.location.href = `${API_BASE}/dataset/export`;
  },

  async importDataset(dataset: any): Promise<{ message: string; stats: any }> {
    const res = await fetch(`${API_BASE}/dataset/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataset })
    });
    if (!res.ok) throw new Error('Failed to import dataset');
    return res.json();
  },

  // Simulation
  async triggerSurge(): Promise<{ message: string; incident: Incident; alert: AlertItem }> {
    const res = await fetch(`${API_BASE}/simulation/surge`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to trigger surge simulation');
    return res.json();
  },

  async resetSimulation(): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/simulation/reset`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset simulation');
    return res.json();
  },

  // Live Real-Time Feed Synchronization (GDACS / USGS / News)
  async syncLiveFeeds(sourceType?: string): Promise<{ success: boolean; syncedCount: number; incidents: Incident[]; summary: string }> {
    const res = await fetch(`${API_BASE}/live-feed/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceType: sourceType || 'all' })
    });
    if (!res.ok) throw new Error('Failed to sync live disaster feeds');
    return res.json();
  },

  // Government Situation Report (SitRep)
  async generateSitRep(): Promise<{ generatedAt: string; reportTitle: string; executiveSummary: string; districtHighlights: any[]; recommendations: string[]; rawText: string }> {
    const res = await fetch(`${API_BASE}/government/sitrep`);
    if (!res.ok) throw new Error('Failed to generate government situation report');
    return res.json();
  }
};
