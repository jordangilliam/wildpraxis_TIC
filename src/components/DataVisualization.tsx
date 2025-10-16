// Enhanced Data Visualization with Historical Trends and Climate Analysis
// Interactive charts for temperature, flow, and multi-site comparisons

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card';
import { Button } from './button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Badge } from './badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import {
  fetchHistoricalUSGSData,
  fetchMultiSiteComparison,
  analyzeClimateTrend,
  generateClimateScenario,
  calculateHabitatDays,
  analyzeSeasonalPatterns,
  exportToCSV,
  DATE_RANGES,
  HistoricalSeries,
  ComparisonData,
  ClimateAnalysis
} from '../services/historicalData';
import { PA_POPULAR_GAUGES } from '../services/realTimeData';
import { TrendingUp, TrendingDown, Minus, Download, Calendar, BarChart3, LineChart as LineChartIcon, AlertTriangle } from 'lucide-react';

export function DataVisualization() {
  const [selectedSites, setSelectedSites] = useState<string[]>([PA_POPULAR_GAUGES[0].siteCode]);
  const [parameter, setParameter] = useState('00010'); // Temperature
  const [dateRange, setDateRange] = useState(DATE_RANGES.LAST_MONTH());
  const [historicalData, setHistoricalData] = useState<HistoricalSeries | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [climateAnalysis, setClimateAnalysis] = useState<ClimateAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'comparison' | 'climate'>('single');

  const loadHistoricalData = async () => {
    setLoading(true);
    try {
      if (viewMode === 'single') {
        const data = await fetchHistoricalUSGSData(
          selectedSites[0],
          parameter,
          dateRange.start,
          dateRange.end
        );
        setHistoricalData(data);
      } else if (viewMode === 'comparison') {
        const data = await fetchMultiSiteComparison(
          selectedSites,
          parameter,
          dateRange.start,
          dateRange.end
        );
        setComparisonData(data);
      } else if (viewMode === 'climate') {
        const data = await analyzeClimateTrend(selectedSites[0], parameter, 10);
        setClimateAnalysis(data);
        
        // Also load historical for chart
        const historical = await fetchHistoricalUSGSData(
          selectedSites[0],
          parameter,
          dateRange.start,
          dateRange.end
        );
        setHistoricalData(historical);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistoricalData();
  }, [selectedSites, parameter, dateRange, viewMode]);

  const handleExport = () => {
    if (!historicalData) return;
    const csv = exportToCSV(historicalData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stream-data-${historicalData.siteCode}-${dateRange.start}-to-${dateRange.end}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Data Visualization & Analysis</h2>
        <p className="text-gray-600 mt-1">
          Historical trends, multi-site comparisons, and climate projections
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* View Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Type</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setViewMode('single')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  viewMode === 'single'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <LineChartIcon className="w-5 h-5 mx-auto mb-1" />
                <div className="text-sm font-medium">Single Site</div>
              </button>
              <button
                onClick={() => setViewMode('comparison')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  viewMode === 'comparison'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="w-5 h-5 mx-auto mb-1" />
                <div className="text-sm font-medium">Multi-Site</div>
              </button>
              <button
                onClick={() => setViewMode('climate')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  viewMode === 'climate'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                <div className="text-sm font-medium">Climate Trends</div>
              </button>
            </div>
          </div>

          {/* Site Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Site{viewMode === 'comparison' ? 's (up to 4)' : ''}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PA_POPULAR_GAUGES.map((gauge) => (
                <button
                  key={gauge.siteCode}
                  onClick={() => {
                    if (viewMode === 'comparison') {
                      setSelectedSites(prev =>
                        prev.includes(gauge.siteCode)
                          ? prev.filter(s => s !== gauge.siteCode)
                          : prev.length < 4
                          ? [...prev, gauge.siteCode]
                          : prev
                      );
                    } else {
                      setSelectedSites([gauge.siteCode]);
                    }
                  }}
                  className={`p-2 text-left rounded border text-sm ${
                    selectedSites.includes(gauge.siteCode)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {gauge.name}
                </button>
              ))}
            </div>
          </div>

          {/* Parameter Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parameter</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setParameter('00010')}
                className={`p-3 rounded-lg border-2 ${
                  parameter === '00010'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">Water Temperature</div>
                <div className="text-xs text-gray-500">°C (converted to °F)</div>
              </button>
              <button
                onClick={() => setParameter('00060')}
                className={`p-3 rounded-lg border-2 ${
                  parameter === '00060'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">Stream Flow</div>
                <div className="text-xs text-gray-500">Cubic ft/sec</div>
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries({
                'Last Week': DATE_RANGES.LAST_WEEK,
                'Last Month': DATE_RANGES.LAST_MONTH,
                'Last Year': DATE_RANGES.LAST_YEAR,
                'Current Year': DATE_RANGES.CURRENT_YEAR
              }).map(([label, rangeFunc]) => (
                <button
                  key={label}
                  onClick={() => setDateRange(rangeFunc())}
                  className="p-2 text-sm rounded border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button onClick={loadHistoricalData} disabled={loading}>
              {loading ? 'Loading...' : 'Update Chart'}
            </Button>
            {historicalData && (
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Visualization Tabs */}
      <Tabs defaultValue="chart" className="w-full">
        <TabsList>
          <TabsTrigger value="chart">Time Series Chart</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Analysis</TabsTrigger>
          {viewMode === 'climate' && <TabsTrigger value="projections">Climate Projections</TabsTrigger>}
        </TabsList>

        {/* Chart Tab */}
        <TabsContent value="chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {viewMode === 'single' && 'Historical Time Series'}
                {viewMode === 'comparison' && 'Multi-Site Comparison'}
                {viewMode === 'climate' && 'Climate Trend Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="h-96 flex items-center justify-center text-gray-500">
                  Loading chart data...
                </div>
              )}

              {!loading && viewMode === 'single' && historicalData && (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={historicalData.data.map(d => ({
                    date: new Date(d.dateTime).toLocaleDateString(),
                    value: parameter === '00010' ? (d.value * 9/5 + 32) : d.value // Convert C to F
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
                    <YAxis label={{ value: parameter === '00010' ? '°F' : historicalData.unit, angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    {parameter === '00010' && (
                      <>
                        <ReferenceLine y={55} stroke="#10b981" strokeDasharray="3 3" label="Ideal (55°F)" />
                        <ReferenceLine y={65} stroke="#f59e0b" strokeDasharray="3 3" label="Marginal (65°F)" />
                        <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label="Critical (70°F)" />
                      </>
                    )}
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" name={historicalData.parameterName} />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {!loading && viewMode === 'comparison' && comparisonData && (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      type="category" 
                      allowDuplicatedCategory={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis label={{ value: parameter === '00010' ? '°F' : comparisonData.unit, angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    {comparisonData.sites.map((site) => (
                      <Line
                        key={site.siteCode}
                        data={site.data.map(d => ({
                          date: new Date(d.dateTime).toLocaleDateString(),
                          value: parameter === '00010' ? (d.value * 9/5 + 32) : d.value
                        }))}
                        type="monotone"
                        dataKey="value"
                        stroke={site.color}
                        name={site.siteName}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-4">
          {historicalData && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Descriptive Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600">Minimum</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {parameter === '00010' 
                          ? (historicalData.statistics!.min * 9/5 + 32).toFixed(1) 
                          : historicalData.statistics!.min.toFixed(1)}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">Mean</div>
                      <div className="text-2xl font-bold text-green-600">
                        {parameter === '00010' 
                          ? (historicalData.statistics!.mean * 9/5 + 32).toFixed(1) 
                          : historicalData.statistics!.mean.toFixed(1)}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600">Median</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {parameter === '00010' 
                          ? (historicalData.statistics!.median * 9/5 + 32).toFixed(1) 
                          : historicalData.statistics!.median.toFixed(1)}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-sm text-gray-600">Maximum</div>
                      <div className="text-2xl font-bold text-red-600">
                        {parameter === '00010' 
                          ? (historicalData.statistics!.max * 9/5 + 32).toFixed(1) 
                          : historicalData.statistics!.max.toFixed(1)}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Range</div>
                      <div className="text-2xl font-bold text-gray-600">
                        {parameter === '00010' 
                          ? (historicalData.statistics!.range * 9/5).toFixed(1) 
                          : historicalData.statistics!.range.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {parameter === '00010' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Trout Habitat Suitability</CardTitle>
                    <CardDescription>Days in each temperature range</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const tempDataF = historicalData.data.map(d => ({
                        ...d,
                        value: d.value * 9/5 + 32
                      }));
                      const habitatDays = calculateHabitatDays(tempDataF);
                      
                      return (
                        <>
                          <div className="mb-6">
                            <div className="text-center mb-2">
                              <span className="text-4xl font-bold text-green-600">
                                {habitatDays.percentSuitable.toFixed(1)}%
                              </span>
                              <p className="text-sm text-gray-600 mt-1">of days suitable for trout</p>
                            </div>
                          </div>

                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={[
                              { range: 'Excellent\n(<55°F)', days: habitatDays.excellent, fill: '#10b981' },
                              { range: 'Good\n(55-65°F)', days: habitatDays.good, fill: '#3b82f6' },
                              { range: 'Marginal\n(65-70°F)', days: habitatDays.marginal, fill: '#f59e0b' },
                              { range: 'Poor\n(>70°F)', days: habitatDays.poor, fill: '#ef4444' }
                            ]}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="range" />
                              <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                              <Tooltip />
                              <Bar dataKey="days" />
                            </BarChart>
                          </ResponsiveContainer>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* Seasonal Analysis Tab */}
        <TabsContent value="seasonal" className="space-y-4">
          {historicalData && (
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Patterns</CardTitle>
                <CardDescription>Average values by season</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const tempDataF = parameter === '00010' 
                    ? historicalData.data.map(d => ({ ...d, value: d.value * 9/5 + 32 }))
                    : historicalData.data;
                  const seasonal = analyzeSeasonalPatterns(tempDataF);
                  
                  return (
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={[
                        { season: 'Winter', value: seasonal.winter },
                        { season: 'Spring', value: seasonal.spring },
                        { season: 'Summer', value: seasonal.summer },
                        { season: 'Fall', value: seasonal.fall }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="season" />
                        <YAxis label={{ value: parameter === '00010' ? '°F' : historicalData.unit, angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" />
                        {parameter === '00010' && (
                          <>
                            <ReferenceLine y={55} stroke="#10b981" strokeDasharray="3 3" />
                            <ReferenceLine y={65} stroke="#f59e0b" strokeDasharray="3 3" />
                            <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
                          </>
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Climate Projections Tab */}
        {viewMode === 'climate' && (
          <TabsContent value="projections" className="space-y-4">
            {climateAnalysis && historicalData && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {climateAnalysis.trend.direction === 'warming' && <TrendingUp className="w-5 h-5 text-red-500" />}
                      {climateAnalysis.trend.direction === 'cooling' && <TrendingDown className="w-5 h-5 text-blue-500" />}
                      {climateAnalysis.trend.direction === 'stable' && <Minus className="w-5 h-5 text-gray-500" />}
                      Climate Trend: {climateAnalysis.trend.direction.toUpperCase()}
                    </CardTitle>
                    <CardDescription>
                      {climateAnalysis.site} • {climateAnalysis.parameter} • {climateAnalysis.timeframe}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Change per Year</div>
                        <div className={`text-2xl font-bold ${
                          climateAnalysis.trend.changePerYear > 0 ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {climateAnalysis.trend.changePerYear > 0 ? '+' : ''}
                          {climateAnalysis.trend.changePerYear.toFixed(3)}°F
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Confidence</div>
                        <div>
                          <Badge variant={
                            climateAnalysis.trend.confidence === 'high' ? 'default' :
                            climateAnalysis.trend.confidence === 'medium' ? 'secondary' : 'outline'
                          }>
                            {climateAnalysis.trend.confidence.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">10-Year Projection</div>
                        <div className="text-2xl font-bold text-orange-600">
                          {climateAnalysis.trend.changePerYear > 0 ? '+' : ''}
                          {(climateAnalysis.trend.changePerYear * 10).toFixed(1)}°F
                        </div>
                      </div>
                    </div>

                    {parameter === '00010' && climateAnalysis.trend.direction === 'warming' && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-yellow-900 mb-1">Climate Impact Warning</h4>
                            <p className="text-sm text-yellow-800">
                              This warming trend could significantly impact trout habitat suitability.
                              If trends continue, suitable habitat days may decrease by{' '}
                              <strong>{Math.abs(climateAnalysis.trend.changePerYear * 10).toFixed(0)}°F</strong> over the next decade.
                              Brook trout are especially vulnerable to warming streams.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Temperature Extremes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {climateAnalysis.extremes.map((extreme, i) => (
                        <div key={i} className={`p-4 rounded-lg ${extreme.type === 'high' ? 'bg-red-50' : 'bg-blue-50'}`}>
                          <div className="text-sm text-gray-600">{extreme.type === 'high' ? 'Highest' : 'Lowest'} Temperature</div>
                          <div className={`text-3xl font-bold ${extreme.type === 'high' ? 'text-red-600' : 'text-blue-600'}`}>
                            {(extreme.value * 9/5 + 32).toFixed(1)}°F
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(extreme.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

