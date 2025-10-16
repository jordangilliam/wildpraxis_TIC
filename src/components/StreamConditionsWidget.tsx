// Compact Stream Conditions Widget
// Can be embedded in any page to show real-time stream data

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { Badge } from './badge';
import {
  fetchUSGSStreamData,
  fetchWeatherData,
  StreamGaugeData,
  WeatherData,
  formatDateTime,
  evaluateStreamTemp
} from '../services/realTimeData';
import { Droplet, Thermometer, Activity, RefreshCw, ExternalLink } from 'lucide-react';

interface StreamConditionsWidgetProps {
  siteCode: string;
  title?: string;
  compact?: boolean;
}

export function StreamConditionsWidget({
  siteCode,
  title = 'Live Stream Conditions',
  compact = false
}: StreamConditionsWidgetProps) {
  const [streamData, setStreamData] = useState<StreamGaugeData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const stream = await fetchUSGSStreamData(siteCode);
      setStreamData(stream);

      if (stream.latitude && stream.longitude) {
        const weather = await fetchWeatherData(stream.latitude, stream.longitude);
        setWeatherData(weather);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading stream data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Refresh every 15 minutes
    const interval = setInterval(loadData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [siteCode]);

  if (!streamData && !loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          <p>No data available</p>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Live Stream Data</span>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-1 hover:bg-white/50 rounded transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-3 h-3 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {streamData && (
          <div className="space-y-2">
            {streamData.temperature && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Water Temp</span>
                <span className={`font-bold ${evaluateStreamTemp(streamData.temperature.value).color}`}>
                  {streamData.temperature.value}°F
                </span>
              </div>
            )}
            {streamData.streamflow && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Flow</span>
                <span className="font-bold text-blue-700">
                  {streamData.streamflow.value.toFixed(0)} {streamData.streamflow.unit}
                </span>
              </div>
            )}
            {weatherData && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Air Temp</span>
                <span className="font-bold text-gray-700">
                  {weatherData.currentConditions.temperature}°F
                </span>
              </div>
            )}
            {lastUpdated && (
              <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-blue-200">
                Updated {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-blue-500" />
            {title}
          </CardTitle>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {streamData && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{streamData.siteName}</span>
            <Badge variant={streamData.status === 'active' ? 'default' : 'destructive'} className="text-xs">
              {streamData.status}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {streamData && (
          <div className="space-y-4">
            {/* Temperature */}
            {streamData.temperature && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded">
                  <Thermometer className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Water Temperature</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-3xl font-bold ${evaluateStreamTemp(streamData.temperature.value).color}`}>
                      {streamData.temperature.value}°{streamData.temperature.unit}
                    </span>
                    <span className={`text-sm font-medium ${evaluateStreamTemp(streamData.temperature.value).color}`}>
                      {evaluateStreamTemp(streamData.temperature.value).status}
                    </span>
                  </div>
                  <div className={`text-sm mt-1 ${evaluateStreamTemp(streamData.temperature.value).color}`}>
                    {evaluateStreamTemp(streamData.temperature.value).message}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatDateTime(streamData.temperature.dateTime)}
                  </div>
                </div>
              </div>
            )}

            {/* Streamflow */}
            {streamData.streamflow && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-cyan-100 rounded">
                  <Activity className="w-5 h-5 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Stream Flow</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold text-cyan-700">
                      {streamData.streamflow.value.toFixed(0)}
                    </span>
                    <span className="text-sm text-gray-600">
                      {streamData.streamflow.unit}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatDateTime(streamData.streamflow.dateTime)}
                  </div>
                </div>
              </div>
            )}

            {/* Weather */}
            {weatherData && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Current Weather</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl">{weatherData.currentConditions.icon}</span>
                      <div>
                        <div className="font-bold text-gray-900">
                          {weatherData.currentConditions.temperature}°F
                        </div>
                        <div className="text-xs text-gray-600">
                          {weatherData.currentConditions.conditions}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>💨 {weatherData.currentConditions.windSpeed} mph</div>
                    <div>💧 {weatherData.currentConditions.humidity}%</div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t text-xs text-gray-500">
              <span>
                {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
              </span>
              <a
                href={`https://waterdata.usgs.gov/monitoring-location/${siteCode}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <span>View on USGS</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

