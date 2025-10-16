# Real-Time Environmental Data Integration

This document describes the comprehensive real-time data integration system built into the WildPraxis TIC platform. The system connects to multiple environmental data APIs to provide live stream conditions, weather forecasts, and biodiversity observations.

## 🌊 Features Overview

### 1. **Live Stream Conditions** (USGS)
- Real-time water temperature (critical for trout habitat)
- Stream flow (cubic feet per second)
- Gage height
- Automatic trout habitat suitability assessment
- 15-minute auto-refresh intervals

### 2. **Weather Data** (Open-Meteo/NOAA)
- Current conditions (temperature, humidity, wind)
- 7-day forecast
- Field trip suitability assessments
- Weather alerts (when available)

### 3. **Biodiversity Observations** (iNaturalist)
- Recent species observations within customizable radius
- Filter by taxon (fish, insects, plants, etc.)
- Research-grade verification status
- Direct links to PA-specific citizen science projects

## 📊 Data Sources

### USGS National Water Information System
**API:** `https://waterservices.usgs.gov/nwis/`
- **Data Type:** Real-time stream gauges
- **Update Frequency:** 15-60 minutes (varies by site)
- **Coverage:** 8,500+ active sites nationwide
- **PA Sites:** 400+ stream gauges
- **No API Key Required**

**Key Parameters:**
- `00010` - Water temperature (°C)
- `00060` - Discharge/streamflow (ft³/s)
- `00065` - Gage height (ft)

**Example Response:**
```json
{
  "value": {
    "timeSeries": [{
      "sourceInfo": {
        "siteName": "West Branch Susquehanna River at Lewisburg",
        "siteCode": [{"value": "01540500"}],
        "geoLocation": {
          "geogLocation": {
            "latitude": 40.9648,
            "longitude": -76.8841
          }
        }
      },
      "variable": {
        "variableCode": [{"value": "00010"}],
        "unit": {"unitCode": "deg C"}
      },
      "values": [{
        "value": [{
          "value": "12.5",
          "dateTime": "2025-10-16T14:15:00.000-04:00"
        }]
      }]
    }]
  }
}
```

### Open-Meteo Weather API
**API:** `https://api.open-meteo.com/v1/forecast`
- **Data Type:** Weather forecasts and current conditions
- **Update Frequency:** Hourly
- **Coverage:** Global (NOAA GFS and DWD ICON models)
- **Resolution:** 11km (GFS), 2km (ICON)
- **No API Key Required**

**Parameters Used:**
- Current: temperature, humidity, wind, precipitation, weather codes
- Daily: 7-day forecast with highs/lows and precipitation probability

### iNaturalist API
**API:** `https://api.inaturalist.org/v1/observations`
- **Data Type:** Citizen science biodiversity observations
- **Update Frequency:** Real-time (as users post)
- **Coverage:** Global, 100M+ observations
- **Quality Levels:** Research-grade, Needs ID, Casual
- **No API Key Required** (for read-only access)

**Filters:**
- Geographic (lat/lng/radius)
- Taxonomic (by species, family, order, etc.)
- Quality grade
- Date range

## 🛠️ Technical Implementation

### Core Service: `src/services/realTimeData.ts`

#### Main Functions

##### `fetchUSGSStreamData(siteCode: string): Promise<StreamGaugeData>`
Fetches current conditions from a specific USGS gauge site.

```typescript
const streamData = await fetchUSGSStreamData('01540500');
console.log(streamData.temperature.value); // e.g., 54.5°F
```

##### `searchNearbyStreamGauges(latitude, longitude, radiusMiles): Promise<Gauge[]>`
Finds all active stream gauges within specified radius.

```typescript
const nearbyGauges = await searchNearbyStreamGauges(40.7934, -77.8600, 25);
```

##### `fetchWeatherData(latitude, longitude): Promise<WeatherData>`
Gets current weather and 7-day forecast for a location.

```typescript
const weather = await fetchWeatherData(40.7934, -77.8600);
console.log(weather.currentConditions.temperature); // e.g., 72°F
```

##### `fetchiNaturalistObservations(lat, lng, radius, taxonId?): Promise<Observation[]>`
Retrieves recent biodiversity observations.

```typescript
// Get all observations within 10km
const obs = await fetchiNaturalistObservations(40.7934, -77.8600, 10);

// Get only fish observations (Actinopterygii = ray-finned fishes)
const fishObs = await fetchiNaturalistObservations(40.7934, -77.8600, 10, 47178);
```

#### Utility Functions

##### `evaluateStreamTemp(tempF: number)`
Analyzes water temperature for trout suitability.

```typescript
const analysis = evaluateStreamTemp(62);
// Returns: {
//   status: 'good',
//   message: 'Good for trout',
//   color: 'text-green-500'
// }
```

**Temperature Ranges:**
- **< 45°F:** Marginal - Trout less active
- **45-55°F:** ⭐ Excellent - Ideal for brook trout
- **55-65°F:** ✅ Good - All species thrive
- **65-70°F:** ⚠️ Marginal - Trout stressed
- **70-75°F:** 🔴 Poor - Dangerous for brook trout
- **> 75°F:** 💀 Critical - Lethal conditions

##### `calculateDistance(lat1, lon1, lat2, lon2): number`
Haversine formula for distance calculation in miles.

##### `formatDateTime(dateString: string): string`
Formats ISO timestamps for display.

### Components

#### `LiveDataDashboard` (Full-Featured)
**Location:** `src/components/LiveDataDashboard.tsx`

**Features:**
- Tab-based interface (Stream, Weather, Biodiversity)
- Stream gauge selector with PA popular sites
- Real-time data display with status indicators
- Temperature suitability analysis
- 7-day weather forecast
- Recent iNaturalist observations
- Auto-refresh every 15 minutes
- Direct links to source data

**Usage:**
```tsx
import { LiveDataDashboard } from '@/components/LiveDataDashboard';

<LiveDataDashboard 
  defaultLatitude={40.7934}
  defaultLongitude={-77.8600}
  defaultSiteCode="01540500"
/>
```

#### `StreamConditionsWidget` (Compact)
**Location:** `src/components/StreamConditionsWidget.tsx`

**Features:**
- Compact display for embedding
- Shows temp, flow, weather at a glance
- Two modes: compact and full
- Auto-refresh
- USGS link

**Usage:**
```tsx
import { StreamConditionsWidget } from '@/components/StreamConditionsWidget';

// Full widget
<StreamConditionsWidget siteCode="01540500" />

// Compact mode for sidebar
<StreamConditionsWidget siteCode="01540500" compact={true} />
```

## 🎓 Educational Applications

### For TIC Programs

#### 1. **Daily Monitoring**
Students can check real-time stream temperatures at their release site:
- Compare to classroom tank temperature
- Understand seasonal temperature patterns
- Identify suitable release windows

#### 2. **Release Day Planning**
Use weather forecast to plan optimal release dates:
- Check 7-day forecast
- Avoid extreme weather
- Coordinate with stream flow conditions

#### 3. **Habitat Assessment**
Compare multiple stream gauges:
- Identify coldwater streams (consistently < 65°F)
- Observe flow patterns
- Correlate with fish presence

#### 4. **Citizen Science Integration**
Connect classroom observations to iNaturalist:
- Document release day observations
- Contribute to PA-specific projects
- Track biodiversity over time

#### 5. **Data Analysis Projects**
Students can:
- Graph temperature trends
- Calculate average conditions
- Compare watersheds
- Correlate weather and stream conditions

### Integration with Curriculum

**Lesson Connections:**
- **Water Quality & Nitrogen Cycle:** Compare classroom parameters to stream conditions
- **Watersheds:** Track how weather affects stream flow
- **Habitat Needs:** Evaluate real streams against ideal trout habitat
- **Release Day:** Use live data to confirm suitability
- **Record Keeping:** Incorporate external data into student logs

## 📍 Pennsylvania Popular Gauges

Pre-configured PA stream gauges for quick access:

| Site Code | Stream Name | Location |
|-----------|-------------|----------|
| 01540500 | West Branch Susquehanna River | Lewisburg |
| 01555000 | Penns Creek | Penns Creek |
| 01567000 | Yellow Breeches Creek | Camp Hill |
| 01573560 | Swatara Creek | Hershey |
| 01447500 | Lehigh River | Stoddartsville |
| 01447800 | Pohopoco Creek | Parryville |
| 03049800 | Little Mahoning Creek | McCormick |
| 03010655 | Clarion River | Ridgway |

### Finding Additional Gauges

**By Location:**
1. Visit [USGS Water Data](https://waterdata.usgs.gov/nwis)
2. Use map interface to find sites
3. Note the 8-digit site code
4. Add to your dashboard

**By Watershed:**
Use `searchNearbyStreamGauges()` function programmatically.

## 🔧 Advanced Usage

### Custom Data Queries

#### Filter iNaturalist by Taxon

```typescript
// Common PA stream taxa
const TAXON_IDS = {
  TROUT_FAMILY: 47178,        // Salmonidae
  BROOK_TROUT: 62061,          // Salvelinus fontinalis
  MAYFLIES: 47158,             // Ephemeroptera
  CADDISFLIES: 47744,          // Trichoptera
  STONEFLIES: 47744,           // Plecoptera
  AQUATIC_PLANTS: 47126,       // Plantae (aquatic)
};

// Get only brook trout observations
const brookTrout = await fetchiNaturalistObservations(
  40.7934, 
  -77.8600, 
  25, 
  TAXON_IDS.BROOK_TROUT
);
```

#### Multi-Site Comparison

```typescript
const sites = ['01540500', '01555000', '01567000'];
const data = await Promise.all(
  sites.map(site => fetchUSGSStreamData(site))
);

// Compare temperatures
data.forEach(site => {
  console.log(`${site.siteName}: ${site.temperature?.value}°F`);
});
```

### Integration with Other Features

#### Add Widget to Dashboard

```tsx
// In src/App.tsx or custom component
import { StreamConditionsWidget } from '@/components/StreamConditionsWidget';

function CustomDashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StreamConditionsWidget siteCode="01540500" />
      <StreamConditionsWidget siteCode="01555000" />
    </div>
  );
}
```

#### Connect to Watershed Explorer

```tsx
// Show live data for selected watershed
function WatershedWithData({ watershedGaugeId }) {
  return (
    <div>
      <WatershedMap />
      <StreamConditionsWidget siteCode={watershedGaugeId} compact />
    </div>
  );
}
```

## 🚀 Future Enhancements

### Planned Features

1. **Historical Data Analysis**
   - Graph temperature trends over weeks/months
   - Compare year-over-year patterns
   - Identify climate change impacts

2. **PFBC Stocking Data Integration**
   - Real-time stocking reports (when API available)
   - Map recent stockings
   - Filter by species and date

3. **Water Quality Station Integration**
   - PA DEP monitoring stations
   - EPA STORET database
   - Volunteer monitoring programs

4. **Alert System**
   - Temperature threshold warnings
   - Flow alerts (drought/flood)
   - Weather warnings for field trips

5. **Data Export**
   - CSV export of selected timeframes
   - Integration with student data logs
   - Automated report generation

6. **Mobile App**
   - Field data collection
   - Offline caching
   - Location-based site recommendations

### Contributing Data

Students and teachers can contribute observations:

**iNaturalist:**
1. Create free account at [inaturalist.org](https://www.inaturalist.org)
2. Download mobile app
3. Upload observations from release day
4. Join PA TIC projects

**Protocols:**
- Photo of organism
- GPS location (automatic)
- Date/time (automatic)
- Identification (can be crowd-sourced)

## 📝 Data Quality & Limitations

### USGS Data
- **Accuracy:** Professional instrumentation, regularly calibrated
- **Frequency:** Most sites update every 15-60 minutes
- **Provisional Data:** Subject to revision
- **Gaps:** Occasional sensor failures or maintenance

### Weather Data
- **Model-Based:** Forecasts are predictions, not certainties
- **Resolution:** 11km grid, may not capture microclimates
- **Updates:** Hourly for current, 6-hourly for forecasts

### iNaturalist Data
- **Citizen Science:** Variable quality depending on observer
- **Verification:** Research-grade = reviewed by multiple experts
- **Coverage:** Uneven - popular areas have more observations
- **Identification:** Some observations may be misidentified

### Best Practices
1. ✅ Use data for educational purposes and general awareness
2. ✅ Verify critical decisions with multiple sources
3. ✅ Understand data is provisional and subject to revision
4. ❌ Don't use for life-safety decisions without verification
5. ❌ Don't assume absence of observations = absence of species

## 🔗 Additional Resources

### APIs & Documentation
- [USGS Water Services](https://waterservices.usgs.gov/)
- [Open-Meteo API Docs](https://open-meteo.com/en/docs)
- [iNaturalist API](https://www.inaturalist.org/pages/api+reference)
- [PFBC Stocking Schedule](https://www.fishandboat.com/Fish/Stocking/Pages/default.aspx)

### Educational Resources
- [USGS Water Science School](https://www.usgs.gov/special-topics/water-science-school)
- [iNaturalist Educator's Guide](https://www.inaturalist.org/pages/teacher's+guide)
- [NOAA Weather Education](https://www.noaa.gov/education)

### Contact & Support
- **Technical Issues:** Submit GitHub issue
- **Educational Questions:** Contact WildPraxis support
- **Data Questions:** Contact respective API providers

---

**Last Updated:** October 16, 2025  
**Version:** 1.0  
**License:** MIT

