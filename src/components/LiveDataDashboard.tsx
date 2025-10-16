// Live Environmental Data Dashboard
// Displays real-time stream, weather, and biodiversity data

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card';
import { Button } from './button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Badge } from './badge';
import {
  fetchUSGSStreamData,
  searchNearbyStreamGauges,
  fetchWeatherData,
  fetchiNaturalistObservations,
  StreamGaugeData,
  WeatherData,
  iNaturalistObservation,
  formatDateTime,
  evaluateStreamTemp,
  PA_POPULAR_GAUGES,
  PA_INATURALIST_PROJECTS
} from '../services/realTimeData';
import { Droplet, Thermometer, Wind, Activity, MapPin, Clock, AlertTriangle, TrendingUp, TrendingDown, Fish, Eye, Leaf, Bug } from 'lucide-react';

interface LiveDataDashboardProps {
  defaultLatitude?: number;
  defaultLongitude?: number;
  defaultSiteCode?: string;
}

export function LiveDataDashboard({
  defaultLatitude = 40.7934, // State College, PA
  defaultLongitude = -77.8600,
  defaultSiteCode = '01540500'
}: LiveDataDashboardProps) {
  const [streamData, setStreamData] = useState<StreamGaugeData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [iNatData, setINatData] = useState<iNaturalistObservation[]>([]);
  const [selectedGauge, setSelectedGauge] = useState(defaultSiteCode);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load all data
  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch stream data
      const stream = await fetchUSGSStreamData(selectedGauge);
      setStreamData(stream);

      // Fetch weather data (use stream location if available)
      const lat = stream.latitude || defaultLatitude;
      const lon = stream.longitude || defaultLongitude;
      const weather = await fetchWeatherData(lat, lon);
      setWeatherData(weather);

      // Fetch iNaturalist observations
      const observations = await fetchiNaturalistObservations(lat, lon, 25);
      setINatData(observations);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadData();
    // Auto-refresh every 15 minutes
    const interval = setInterval(loadData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedGauge]);

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Live Environmental Data</h2>
          <p className="text-gray-600 mt-1">
            Real-time stream conditions, weather, and biodiversity observations
          </p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Updated {lastUpdated.toLocaleTimeString()}
            </div>
          )}
          <Button onClick={loadData} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh Data'}
          </Button>
        </div>
      </div>

      {/* Stream Gauge Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Select Stream Gauge
          </CardTitle>
          <CardDescription>
            Choose a USGS stream gauge to view real-time conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {PA_POPULAR_GAUGES.map((gauge) => (
              <button
                key={gauge.siteCode}
                onClick={() => setSelectedGauge(gauge.siteCode)}
                className={`p-3 text-left rounded-lg border-2 transition-all ${
                  selectedGauge === gauge.siteCode
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{gauge.name}</div>
                <div className="text-xs text-gray-500 mt-1">#{gauge.siteCode}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="stream" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stream">Stream Conditions</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="biodiversity">Biodiversity</TabsTrigger>
        </TabsList>

        {/* Stream Conditions Tab */}
        <TabsContent value="stream" className="space-y-4">
          {streamData && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Droplet className="w-5 h-5 text-blue-500" />
                      {streamData.siteName}
                    </span>
                    <Badge variant={streamData.status === 'active' ? 'default' : 'destructive'}>
                      {streamData.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    USGS Site #{streamData.siteCode} • {streamData.latitude.toFixed(4)}°N, {streamData.longitude.toFixed(4)}°W
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Water Temperature */}
                    {streamData.temperature && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Thermometer className="w-5 h-5" />
                          <span className="font-medium">Water Temperature</span>
                        </div>
                        <div className="space-y-1">
                          <div className={`text-4xl font-bold ${evaluateStreamTemp(streamData.temperature.value).color}`}>
                            {streamData.temperature.value}°{streamData.temperature.unit}
                          </div>
                          <div className={`text-sm font-medium ${evaluateStreamTemp(streamData.temperature.value).color}`}>
                            {evaluateStreamTemp(streamData.temperature.value).message}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDateTime(streamData.temperature.dateTime)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stream Flow */}
                    {streamData.streamflow && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Activity className="w-5 h-5" />
                          <span className="font-medium">Stream Flow</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-4xl font-bold text-blue-600">
                            {streamData.streamflow.value.toFixed(0)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {streamData.streamflow.unit}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDateTime(streamData.streamflow.dateTime)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Gage Height */}
                    {streamData.gageHeight && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <TrendingUp className="w-5 h-5" />
                          <span className="font-medium">Gage Height</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-4xl font-bold text-gray-700">
                            {streamData.gageHeight.value.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {streamData.gageHeight.unit}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDateTime(streamData.gageHeight.dateTime)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Temperature Guidance */}
                  {streamData.temperature && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Temperature Guidance for TIC Programs</h4>
                      <div className="space-y-1 text-sm text-blue-800">
                        <p>• <strong>45-55°F:</strong> Ideal for brook trout - optimal metabolism and growth</p>
                        <p>• <strong>55-65°F:</strong> Good for all trout species - active feeding</p>
                        <p>• <strong>65-70°F:</strong> Marginal - trout become stressed, seek cold water refuges</p>
                        <p>• <strong>Above 70°F:</strong> Dangerous - lethal for brook trout, very stressful for browns/rainbows</p>
                      </div>
                    </div>
                  )}

                  {/* Link to USGS */}
                  <div className="mt-4 text-center">
                    <a
                      href={`https://waterdata.usgs.gov/monitoring-location/${streamData.siteCode}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View full data and historical graphs on USGS →
                    </a>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Weather Tab */}
        <TabsContent value="weather" className="space-y-4">
          {weatherData && (
            <>
              {/* Current Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wind className="w-5 h-5" />
                    Current Conditions
                  </CardTitle>
                  <CardDescription>
                    {weatherData.location} • {new Date(weatherData.currentConditions.timestamp).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-5xl mb-2">{weatherData.currentConditions.icon}</div>
                      <div className="text-3xl font-bold">{weatherData.currentConditions.temperature}°F</div>
                      <div className="text-sm text-gray-600 mt-1">{weatherData.currentConditions.conditions}</div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-gray-500">Feels Like</div>
                        <div className="text-2xl font-semibold">{weatherData.currentConditions.feelsLike}°F</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Humidity</div>
                        <div className="text-xl font-semibold">{weatherData.currentConditions.humidity}%</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-gray-500">Wind</div>
                        <div className="text-xl font-semibold">
                          {weatherData.currentConditions.windSpeed} mph {weatherData.currentConditions.windDirection}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Field Trip Conditions */}
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Field Trip Conditions</h4>
                    <div className="text-sm text-green-800">
                      {weatherData.currentConditions.temperature < 40 ? (
                        <p>❄️ <strong>Cold:</strong> Dress warmly in layers. Stream work possible but brief.</p>
                      ) : weatherData.currentConditions.temperature < 60 ? (
                        <p>✅ <strong>Good:</strong> Comfortable for outdoor activities. Great for stream work!</p>
                      ) : weatherData.currentConditions.temperature < 80 ? (
                        <p>☀️ <strong>Warm:</strong> Stay hydrated. Ideal for release day ceremonies.</p>
                      ) : (
                        <p>🌡️ <strong>Hot:</strong> Limit exposure. Stream temperatures may be stressful for trout.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 7-Day Forecast */}
              <Card>
                <CardHeader>
                  <CardTitle>7-Day Forecast</CardTitle>
                  <CardDescription>Plan your field trips and release days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="text-center p-3 rounded-lg bg-gray-50">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-3xl mb-2">{day.icon}</div>
                        <div className="text-lg font-bold text-gray-900">{day.high}°</div>
                        <div className="text-sm text-gray-600">{day.low}°</div>
                        <div className="text-xs text-blue-600 mt-2">{day.precipChance}% 💧</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Biodiversity Tab */}
        <TabsContent value="biodiversity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Recent iNaturalist Observations
              </CardTitle>
              <CardDescription>
                Citizen science observations within 25 miles • Data from iNaturalist.org
              </CardDescription>
            </CardHeader>
            <CardContent>
              {iNatData.length > 0 ? (
                <div className="space-y-3">
                  {iNatData.slice(0, 10).map((obs) => (
                    <div key={obs.id} className="flex items-start gap-4 p-3 rounded-lg border hover:bg-gray-50">
                      {obs.imageUrl && (
                        <img
                          src={obs.imageUrl}
                          alt={obs.commonName}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{obs.commonName}</h4>
                            <p className="text-sm italic text-gray-600">{obs.scientificName}</p>
                          </div>
                          <Badge variant={obs.quality === 'research' ? 'default' : 'secondary'}>
                            {obs.quality}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(obs.observedOn).toLocaleDateString()}
                          </span>
                          <span>by {obs.observer}</span>
                          <span className="flex items-center gap-1">
                            {obs.iconic_taxon === 'Actinopterygii' && <Fish className="w-3 h-3" />}
                            {obs.iconic_taxon === 'Insecta' && <Bug className="w-3 h-3" />}
                            {obs.iconic_taxon === 'Plantae' && <Leaf className="w-3 h-3" />}
                            {obs.iconic_taxon}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent observations found in this area.</p>
                  <p className="text-sm mt-2">Try a different stream gauge location.</p>
                </div>
              )}

              {/* iNaturalist Projects */}
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3">PA TIC iNaturalist Projects</h4>
                <div className="space-y-2">
                  {PA_INATURALIST_PROJECTS.map((project) => (
                    <a
                      key={project.id}
                      href={`https://www.inaturalist.org/projects/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-white rounded border hover:border-purple-300 transition-colors"
                    >
                      <div className="font-medium text-purple-900">{project.name}</div>
                      <div className="text-sm text-gray-600">{project.description}</div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-center">
                <a
                  href="https://www.inaturalist.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline text-sm"
                >
                  Explore more on iNaturalist.org →
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Data Sources Footer */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600">
            <h4 className="font-semibold text-gray-900 mb-2">Data Sources</h4>
            <ul className="space-y-1">
              <li>• <strong>Stream Data:</strong> U.S. Geological Survey (USGS) National Water Information System</li>
              <li>• <strong>Weather:</strong> Open-Meteo API (NOAA/DWD data)</li>
              <li>• <strong>Biodiversity:</strong> iNaturalist - A joint initiative of California Academy of Sciences and National Geographic</li>
            </ul>
            <p className="mt-3 text-xs">
              Data updates every 15 minutes. For official use, verify with source agencies.
              All data subject to revision and should not be used for critical decision-making without verification.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

