// Mobile Field Data Collection
// GPS-based stream finder, offline data storage, photo upload

export interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  timestamp: number;
}

export interface FieldObservation {
  id: string;
  timestamp: string;
  location: GPSLocation;
  siteName: string;
  siteCode?: string;
  observers: string[];
  observations: {
    waterTemperature?: number;
    airTemperature?: number;
    pH?: number;
    dissolvedOxygen?: number;
    streamWidth?: number;
    streamDepth?: number;
    flow?: 'low' | 'moderate' | 'high';
    clarity?: 'clear' | 'slightly_turbid' | 'turbid' | 'very_turbid';
    weather?: string;
    macros?: {
      type: string;
      count: number;
      toleranceGroup: 'sensitive' | 'moderate' | 'tolerant';
    }[];
    troutObserved?: {
      species: 'brook' | 'brown' | 'rainbow' | 'unknown';
      count: number;
      sizeRange: string;
    }[];
    habitatFeatures?: string[];
    invasiveSpecies?: string[];
  };
  photos?: {
    id: string;
    timestamp: string;
    caption?: string;
    dataUrl: string; // base64 for offline storage
    uploaded: boolean;
  }[];
  notes?: string;
  synced: boolean;
}

export interface NearbyGauge {
  siteCode: string;
  siteName: string;
  distance: number;
  latitude: number;
  longitude: number;
  hasRealTimeData: boolean;
}

/**
 * Get current GPS location
 */
export async function getCurrentLocation(): Promise<GPSLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || undefined,
          timestamp: position.timestamp
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

/**
 * Find nearest USGS stream gauges to current location
 */
export async function findNearbyGauges(
  location: GPSLocation,
  radiusMiles: number = 25
): Promise<NearbyGauge[]> {
  try {
    // Convert miles to decimal degrees (approximate)
    const degreeRadius = radiusMiles / 69; // 1 degree latitude ≈ 69 miles
    
    const params = new URLSearchParams({
      format: 'json',
      bBox: `${location.longitude - degreeRadius},${location.latitude - degreeRadius},${location.longitude + degreeRadius},${location.latitude + degreeRadius}`,
      siteType: 'ST',
      hasDataTypeCd: 'iv',
      siteStatus: 'active'
    });

    const response = await fetch(
      `https://waterservices.usgs.gov/nwis/site/?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error('USGS API error');
    }

    const data = await response.json();
    const sites = data.value.timeSeries || [];

    const gauges: NearbyGauge[] = sites.map((site: any) => {
      const siteLat = site.sourceInfo.geoLocation.geogLocation.latitude;
      const siteLon = site.sourceInfo.geoLocation.geogLocation.longitude;
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        siteLat,
        siteLon
      );

      return {
        siteCode: site.sourceInfo.siteCode[0].value,
        siteName: site.sourceInfo.siteName,
        distance,
        latitude: siteLat,
        longitude: siteLon,
        hasRealTimeData: true
      };
    });

    // Sort by distance
    gauges.sort((a, b) => a.distance - b.distance);

    return gauges.slice(0, 10); // Return top 10 nearest
  } catch (error) {
    console.error('Error finding nearby gauges:', error);
    return [];
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Save field observation to local storage
 */
export function saveObservationOffline(observation: FieldObservation): void {
  const key = 'field_observations';
  const stored = localStorage.getItem(key);
  const observations: FieldObservation[] = stored ? JSON.parse(stored) : [];
  
  // Update existing or add new
  const existingIndex = observations.findIndex(o => o.id === observation.id);
  if (existingIndex >= 0) {
    observations[existingIndex] = observation;
  } else {
    observations.push(observation);
  }
  
  localStorage.setItem(key, JSON.stringify(observations));
}

/**
 * Load all offline observations
 */
export function loadOfflineObservations(): FieldObservation[] {
  const key = 'field_observations';
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get unsynced observations
 */
export function getUnsyncedObservations(): FieldObservation[] {
  return loadOfflineObservations().filter(o => !o.synced);
}

/**
 * Mark observation as synced
 */
export function markObservationSynced(id: string): void {
  const observations = loadOfflineObservations();
  const obs = observations.find(o => o.id === id);
  if (obs) {
    obs.synced = true;
    localStorage.setItem('field_observations', JSON.stringify(observations));
  }
}

/**
 * Delete observation
 */
export function deleteObservation(id: string): void {
  const observations = loadOfflineObservations();
  const filtered = observations.filter(o => o.id !== id);
  localStorage.setItem('field_observations', JSON.stringify(filtered));
}

/**
 * Compress and convert image to base64
 */
export async function processPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas and resize
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to JPEG with compression
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Export observations to CSV
 */
export function exportObservationsToCSV(observations: FieldObservation[]): string {
  const headers = [
    'ID',
    'Date',
    'Time',
    'Latitude',
    'Longitude',
    'Site Name',
    'Site Code',
    'Observers',
    'Water Temp (°F)',
    'Air Temp (°F)',
    'pH',
    'DO (ppm)',
    'Stream Width (ft)',
    'Stream Depth (ft)',
    'Flow',
    'Clarity',
    'Weather',
    'Macros Found',
    'Trout Observed',
    'Habitat Features',
    'Invasive Species',
    'Notes',
    'Photos',
    'Synced'
  ];

  const rows = observations.map(obs => [
    obs.id,
    new Date(obs.timestamp).toLocaleDateString(),
    new Date(obs.timestamp).toLocaleTimeString(),
    obs.location.latitude.toFixed(6),
    obs.location.longitude.toFixed(6),
    obs.siteName,
    obs.siteCode || '',
    obs.observers.join('; '),
    obs.observations.waterTemperature || '',
    obs.observations.airTemperature || '',
    obs.observations.pH || '',
    obs.observations.dissolvedOxygen || '',
    obs.observations.streamWidth || '',
    obs.observations.streamDepth || '',
    obs.observations.flow || '',
    obs.observations.clarity || '',
    obs.observations.weather || '',
    obs.observations.macros?.map(m => `${m.type} (${m.count})`).join('; ') || '',
    obs.observations.troutObserved?.map(t => `${t.species} (${t.count})`).join('; ') || '',
    obs.observations.habitatFeatures?.join('; ') || '',
    obs.observations.invasiveSpecies?.join('; ') || '',
    obs.notes || '',
    obs.photos?.length || 0,
    obs.synced ? 'Yes' : 'No'
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  return csv;
}

/**
 * Check if online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Get device storage info
 */
export function getStorageInfo(): { used: number; total: number; available: number } {
  const observations = loadOfflineObservations();
  const jsonSize = JSON.stringify(observations).length;
  const bytesUsed = jsonSize;
  
  // LocalStorage typically has 5-10MB limit
  const estimatedTotal = 5 * 1024 * 1024; // 5MB
  
  return {
    used: bytesUsed,
    total: estimatedTotal,
    available: estimatedTotal - bytesUsed
  };
}

/**
 * Generate unique observation ID
 */
export function generateObservationId(): string {
  return `obs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate observation data
 */
export function validateObservation(obs: FieldObservation): string[] {
  const errors: string[] = [];
  
  if (!obs.siteName || obs.siteName.trim() === '') {
    errors.push('Site name is required');
  }
  
  if (!obs.location || !obs.location.latitude || !obs.location.longitude) {
    errors.push('GPS location is required');
  }
  
  if (!obs.observers || obs.observers.length === 0) {
    errors.push('At least one observer name is required');
  }
  
  if (obs.observations.waterTemperature && (obs.observations.waterTemperature < 32 || obs.observations.waterTemperature > 100)) {
    errors.push('Water temperature seems unrealistic');
  }
  
  if (obs.observations.pH && (obs.observations.pH < 0 || obs.observations.pH > 14)) {
    errors.push('pH must be between 0 and 14');
  }
  
  return errors;
}

/**
 * Calculate stream health score based on observations
 */
export function calculateStreamHealthScore(obs: FieldObservation): {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  factors: { name: string; value: number; weight: number }[];
} {
  const factors: { name: string; value: number; weight: number }[] = [];
  
  // Water temperature (weight: 25%)
  if (obs.observations.waterTemperature) {
    const temp = obs.observations.waterTemperature;
    let tempScore = 0;
    if (temp < 55) tempScore = 100;
    else if (temp < 65) tempScore = 85;
    else if (temp < 70) tempScore = 60;
    else if (temp < 75) tempScore = 30;
    else tempScore = 0;
    factors.push({ name: 'Water Temperature', value: tempScore, weight: 0.25 });
  }
  
  // Dissolved oxygen (weight: 25%)
  if (obs.observations.dissolvedOxygen) {
    const doPpm = obs.observations.dissolvedOxygen;
    let doScore = 0;
    if (doPpm >= 9) doScore = 100;
    else if (doPpm >= 7) doScore = 85;
    else if (doPpm >= 5) doScore = 60;
    else if (doPpm >= 3) doScore = 30;
    else doScore = 0;
    factors.push({ name: 'Dissolved Oxygen', value: doScore, weight: 0.25 });
  }
  
  // pH (weight: 15%)
  if (obs.observations.pH) {
    const pH = obs.observations.pH;
    let pHScore = 0;
    if (pH >= 6.5 && pH <= 8.0) pHScore = 100;
    else if (pH >= 6.0 && pH <= 8.5) pHScore = 80;
    else if (pH >= 5.5 && pH <= 9.0) pHScore = 50;
    else pHScore = 20;
    factors.push({ name: 'pH', value: pHScore, weight: 0.15 });
  }
  
  // Macroinvertebrates (weight: 25%)
  if (obs.observations.macros && obs.observations.macros.length > 0) {
    const sensitive = obs.observations.macros.filter(m => m.toleranceGroup === 'sensitive').length;
    const moderate = obs.observations.macros.filter(m => m.toleranceGroup === 'moderate').length;
    const tolerant = obs.observations.macros.filter(m => m.toleranceGroup === 'tolerant').length;
    
    // Penn State Extension scoring
    let macroScore = 0;
    if (sensitive >= 2) macroScore = 100;
    else if (sensitive >= 1 || moderate >= 3) macroScore = 75;
    else if (moderate >= 1 || tolerant >= 3) macroScore = 50;
    else macroScore = 25;
    
    factors.push({ name: 'Macroinvertebrates', value: macroScore, weight: 0.25 });
  }
  
  // Clarity (weight: 10%)
  if (obs.observations.clarity) {
    let clarityScore = 0;
    if (obs.observations.clarity === 'clear') clarityScore = 100;
    else if (obs.observations.clarity === 'slightly_turbid') clarityScore = 75;
    else if (obs.observations.clarity === 'turbid') clarityScore = 40;
    else clarityScore = 20;
    factors.push({ name: 'Water Clarity', value: clarityScore, weight: 0.1 });
  }
  
  // Calculate weighted score
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const score = factors.reduce((sum, f) => sum + (f.value * f.weight), 0) / (totalWeight || 1);
  
  // Assign grade
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  else grade = 'F';
  
  return { score, grade, factors };
}

