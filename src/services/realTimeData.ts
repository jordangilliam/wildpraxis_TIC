// Real-Time Environmental Data Integration
// Connects to USGS, NOAA, EPA, PFBC, and iNaturalist APIs

export interface StreamGaugeData {
  siteCode: string;
  siteName: string;
  latitude: number;
  longitude: number;
  streamflow?: {
    value: number;
    unit: string;
    dateTime: string;
  };
  gageHeight?: {
    value: number;
    unit: string;
    dateTime: string;
  };
  temperature?: {
    value: number;
    unit: string;
    dateTime: string;
  };
  status: 'active' | 'offline' | 'error';
}

export interface WeatherData {
  location: string;
  latitude: number;
  longitude: number;
  currentConditions: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    conditions: string;
    icon: string;
    timestamp: string;
  };
  forecast: {
    date: string;
    high: number;
    low: number;
    conditions: string;
    precipChance: number;
    icon: string;
  }[];
  alerts?: {
    event: string;
    severity: 'extreme' | 'severe' | 'moderate' | 'minor';
    description: string;
    onset: string;
    expires: string;
  }[];
}

export interface WaterQualityStation {
  stationId: string;
  name: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
  parameters: {
    name: string;
    value: number;
    unit: string;
    status: 'good' | 'fair' | 'poor';
  }[];
}

export interface StockingEvent {
  id: string;
  date: string;
  waterbody: string;
  county: string;
  species: string;
  size: string;
  number: number;
  latitude?: number;
  longitude?: number;
}

export interface iNaturalistObservation {
  id: number;
  species: string;
  commonName: string;
  scientificName: string;
  observedOn: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  observer: string;
  quality: 'research' | 'needs_id' | 'casual';
  iconic_taxon: string;
}

/**
 * Fetch real-time USGS stream gauge data
 * @param siteCode USGS site code (8-digit number)
 * @returns Stream gauge data including flow, temperature, and gage height
 */
export async function fetchUSGSStreamData(siteCode: string): Promise<StreamGaugeData> {
  try {
    const params = new URLSearchParams({
      format: 'json',
      sites: siteCode,
      parameterCd: '00060,00065,00010', // Flow, Gage Height, Temperature
      siteStatus: 'all'
    });

    const response = await fetch(
      `https://waterservices.usgs.gov/nwis/iv/?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`);
    }

    const data = await response.json();
    const timeSeries = data.value.timeSeries;

    if (!timeSeries || timeSeries.length === 0) {
      throw new Error('No data available for this site');
    }

    const siteInfo = timeSeries[0].sourceInfo;
    const gaugeData: StreamGaugeData = {
      siteCode,
      siteName: siteInfo.siteName,
      latitude: siteInfo.geoLocation.geogLocation.latitude,
      longitude: siteInfo.geoLocation.geogLocation.longitude,
      status: 'active'
    };

    // Parse each parameter
    timeSeries.forEach((series: any) => {
      const paramCode = series.variable.variableCode[0].value;
      const values = series.values[0].value;
      
      if (values.length === 0) return;
      
      const latestValue = values[values.length - 1];
      
      switch (paramCode) {
        case '00060': // Streamflow
          gaugeData.streamflow = {
            value: parseFloat(latestValue.value),
            unit: series.variable.unit.unitCode,
            dateTime: latestValue.dateTime
          };
          break;
        case '00065': // Gage height
          gaugeData.gageHeight = {
            value: parseFloat(latestValue.value),
            unit: series.variable.unit.unitCode,
            dateTime: latestValue.dateTime
          };
          break;
        case '00010': // Temperature
          gaugeData.temperature = {
            value: parseFloat(latestValue.value),
            unit: series.variable.unit.unitCode,
            dateTime: latestValue.dateTime
          };
          break;
      }
    });

    return gaugeData;
  } catch (error) {
    console.error('Error fetching USGS data:', error);
    return {
      siteCode,
      siteName: 'Unknown Site',
      latitude: 0,
      longitude: 0,
      status: 'error'
    };
  }
}

/**
 * Search for USGS stream gauges near a location
 * @param latitude Latitude
 * @param longitude Longitude
 * @param radiusMiles Search radius in miles (default 25)
 * @returns Array of nearby stream gauges
 */
export async function searchNearbyStreamGauges(
  latitude: number,
  longitude: number,
  radiusMiles: number = 25
): Promise<{ siteCode: string; siteName: string; distance: number }[]> {
  try {
    const params = new URLSearchParams({
      format: 'json',
      bBox: `${longitude - 0.5},${latitude - 0.5},${longitude + 0.5},${latitude + 0.5}`,
      siteType: 'ST', // Stream
      hasDataTypeCd: 'iv', // Real-time data
      siteStatus: 'active'
    });

    const response = await fetch(
      `https://waterservices.usgs.gov/nwis/site/?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`);
    }

    const data = await response.json();
    const sites = data.value.timeSeries || [];

    return sites.map((site: any) => ({
      siteCode: site.sourceInfo.siteCode[0].value,
      siteName: site.sourceInfo.siteName,
      distance: 0 // Calculate actual distance if needed
    }));
  } catch (error) {
    console.error('Error searching USGS sites:', error);
    return [];
  }
}

/**
 * Fetch current weather data from Open-Meteo (free, no API key required)
 * @param latitude Latitude
 * @param longitude Longitude
 * @returns Current weather and forecast
 */
export async function fetchWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherData | null> {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      temperature_unit: 'fahrenheit',
      wind_speed_unit: 'mph',
      precipitation_unit: 'inch',
      timezone: 'America/New_York',
      forecast_days: '7'
    });

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    const weatherCodeToConditions = (code: number): string => {
      const codes: { [key: number]: string } = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Foggy',
        51: 'Light drizzle',
        61: 'Light rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Light snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        95: 'Thunderstorm'
      };
      return codes[code] || 'Unknown';
    };

    const weatherData: WeatherData = {
      location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
      latitude,
      longitude,
      currentConditions: {
        temperature: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        windDirection: getWindDirection(data.current.wind_direction_10m),
        conditions: weatherCodeToConditions(data.current.weather_code),
        icon: getWeatherIcon(data.current.weather_code),
        timestamp: data.current.time
      },
      forecast: data.daily.time.slice(0, 7).map((date: string, i: number) => ({
        date,
        high: Math.round(data.daily.temperature_2m_max[i]),
        low: Math.round(data.daily.temperature_2m_min[i]),
        conditions: weatherCodeToConditions(data.daily.weather_code[i]),
        precipChance: data.daily.precipitation_probability_max[i] || 0,
        icon: getWeatherIcon(data.daily.weather_code[i])
      }))
    };

    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

function getWeatherIcon(code: number): string {
  if (code === 0 || code === 1) return '☀️';
  if (code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 95) return '⛈️';
  return '🌤️';
}

/**
 * Fetch recent PFBC stocking events
 * Note: This would need to scrape or use an official PFBC API if available
 * For now, returns mock data structure
 */
export async function fetchPFBCStockingData(
  county?: string,
  startDate?: Date,
  endDate?: Date
): Promise<StockingEvent[]> {
  // TODO: Implement actual PFBC data fetching when API is available
  // This would require either:
  // 1. Official PFBC API (if they provide one)
  // 2. Scraping their stocking schedule page
  // 3. Cached/imported CSV data from PFBC reports
  
  console.warn('PFBC stocking data requires backend implementation');
  return [];
}

/**
 * Fetch recent iNaturalist observations
 * @param latitude Center latitude
 * @param longitude Center longitude
 * @param radius Radius in km (default 10)
 * @param taxonId Filter by taxon (47178 = Salmonidae/trout family)
 * @returns Recent observations
 */
export async function fetchiNaturalistObservations(
  latitude: number,
  longitude: number,
  radius: number = 10,
  taxonId?: number
): Promise<iNaturalistObservation[]> {
  try {
    const params = new URLSearchParams({
      lat: latitude.toString(),
      lng: longitude.toString(),
      radius: radius.toString(),
      per_page: '50',
      order: 'desc',
      order_by: 'created_at'
    });

    if (taxonId) {
      params.append('taxon_id', taxonId.toString());
    }

    const response = await fetch(
      `https://api.inaturalist.org/v1/observations?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`iNaturalist API error: ${response.status}`);
    }

    const data = await response.json();

    return data.results.map((obs: any) => ({
      id: obs.id,
      species: obs.taxon?.id || 0,
      commonName: obs.taxon?.preferred_common_name || 'Unknown',
      scientificName: obs.taxon?.name || 'Unknown',
      observedOn: obs.observed_on,
      latitude: obs.location?.split(',')[0] || 0,
      longitude: obs.location?.split(',')[1] || 0,
      imageUrl: obs.photos[0]?.url.replace('square', 'medium') || undefined,
      observer: obs.user?.login || 'Anonymous',
      quality: obs.quality_grade,
      iconic_taxon: obs.taxon?.iconic_taxon_name || 'Unknown'
    }));
  } catch (error) {
    console.error('Error fetching iNaturalist data:', error);
    return [];
  }
}

/**
 * Get PA-specific iNaturalist projects for TIC programs
 */
export const PA_INATURALIST_PROJECTS = [
  {
    id: 'pennsylvania-stream-life',
    name: 'Pennsylvania Stream Life',
    slug: 'pennsylvania-stream-life',
    description: 'Documenting aquatic biodiversity in PA streams'
  },
  {
    id: 'pa-native-trout',
    name: 'PA Native Brook Trout',
    slug: 'pennsylvania-native-brook-trout',
    description: 'Observations of native brook trout in Pennsylvania'
  },
  {
    id: 'chesapeake-bay-watershed',
    name: 'Chesapeake Bay Watershed',
    slug: 'chesapeake-bay',
    description: 'Species observations in the Chesapeake Bay watershed'
  }
];

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9/5) + 32;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
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
 * Format date for display
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Check if stream temperature is suitable for trout
 */
export function evaluateStreamTemp(tempF: number): {
  status: 'excellent' | 'good' | 'marginal' | 'poor' | 'critical';
  message: string;
  color: string;
} {
  if (tempF < 45) {
    return {
      status: 'marginal',
      message: 'Very cold - trout less active',
      color: 'text-blue-400'
    };
  } else if (tempF <= 55) {
    return {
      status: 'excellent',
      message: 'Ideal for brook trout',
      color: 'text-green-600'
    };
  } else if (tempF <= 65) {
    return {
      status: 'good',
      message: 'Good for trout',
      color: 'text-green-500'
    };
  } else if (tempF <= 70) {
    return {
      status: 'marginal',
      message: 'Marginal - trout stressed',
      color: 'text-yellow-500'
    };
  } else if (tempF <= 75) {
    return {
      status: 'poor',
      message: 'Too warm - trout stressed',
      color: 'text-orange-500'
    };
  } else {
    return {
      status: 'critical',
      message: 'Critical - lethal for trout',
      color: 'text-red-600'
    };
  }
}

// Popular PA stream gauge sites for quick reference
export const PA_POPULAR_GAUGES = [
  { siteCode: '01540500', name: 'West Branch Susquehanna River at Lewisburg' },
  { siteCode: '01555000', name: 'Penns Creek at Penns Creek' },
  { siteCode: '01567000', name: 'Yellow Breeches Creek near Camp Hill' },
  { siteCode: '01573560', name: 'Swatara Creek near Hershey' },
  { siteCode: '01447500', name: 'Lehigh River at Stoddartsville' },
  { siteCode: '01447800', name: 'Pohopoco Creek near Parryville' },
  { siteCode: '03049800', name: 'Little Mahoning Creek at McCormick' },
  { siteCode: '03010655', name: 'Clarion River at Ridgway' }
];

