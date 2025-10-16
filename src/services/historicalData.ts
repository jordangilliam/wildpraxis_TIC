// Historical Environmental Data & Analysis
// Fetches and analyzes historical USGS data for trend analysis

export interface HistoricalDataPoint {
  dateTime: string;
  value: number;
  qualifiers?: string[];
}

export interface HistoricalSeries {
  parameter: string;
  parameterName: string;
  unit: string;
  siteCode: string;
  siteName: string;
  data: HistoricalDataPoint[];
  statistics?: {
    min: number;
    max: number;
    mean: number;
    median: number;
    range: number;
  };
}

export interface ComparisonData {
  sites: {
    siteCode: string;
    siteName: string;
    data: HistoricalDataPoint[];
    color: string;
  }[];
  parameter: string;
  unit: string;
}

export interface ClimateAnalysis {
  site: string;
  parameter: string;
  timeframe: string;
  trend: {
    direction: 'warming' | 'cooling' | 'stable';
    changePerYear: number;
    confidence: 'high' | 'medium' | 'low';
  };
  seasonalPatterns: {
    season: string;
    avgValue: number;
    trend: number;
  }[];
  extremes: {
    type: 'high' | 'low';
    value: number;
    date: string;
  }[];
}

/**
 * Fetch historical USGS data for a date range
 * @param siteCode USGS site code
 * @param parameterCode Parameter code (00010=temp, 00060=flow)
 * @param startDate ISO date string (YYYY-MM-DD)
 * @param endDate ISO date string (YYYY-MM-DD)
 * @returns Historical data series
 */
export async function fetchHistoricalUSGSData(
  siteCode: string,
  parameterCode: string,
  startDate: string,
  endDate: string
): Promise<HistoricalSeries | null> {
  try {
    const params = new URLSearchParams({
      format: 'json',
      sites: siteCode,
      parameterCd: parameterCode,
      startDT: startDate,
      endDT: endDate
    });

    const response = await fetch(
      `https://waterservices.usgs.gov/nwis/dv/?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`);
    }

    const data = await response.json();
    const timeSeries = data.value.timeSeries;

    if (!timeSeries || timeSeries.length === 0) {
      return null;
    }

    const series = timeSeries[0];
    const values = series.values[0].value;

    const dataPoints: HistoricalDataPoint[] = values.map((v: any) => ({
      dateTime: v.dateTime,
      value: parseFloat(v.value),
      qualifiers: v.qualifiers
    }));

    // Calculate statistics
    const numericValues = dataPoints.map(d => d.value).filter(v => !isNaN(v));
    const sorted = [...numericValues].sort((a, b) => a - b);
    
    const statistics = {
      min: Math.min(...numericValues),
      max: Math.max(...numericValues),
      mean: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
      median: sorted[Math.floor(sorted.length / 2)],
      range: Math.max(...numericValues) - Math.min(...numericValues)
    };

    return {
      parameter: parameterCode,
      parameterName: series.variable.variableName,
      unit: series.variable.unit.unitCode,
      siteCode: series.sourceInfo.siteCode[0].value,
      siteName: series.sourceInfo.siteName,
      data: dataPoints,
      statistics
    };
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return null;
  }
}

/**
 * Fetch data for multiple sites for comparison
 */
export async function fetchMultiSiteComparison(
  siteCodes: string[],
  parameterCode: string,
  startDate: string,
  endDate: string
): Promise<ComparisonData> {
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  
  const promises = siteCodes.map(code => 
    fetchHistoricalUSGSData(code, parameterCode, startDate, endDate)
  );

  const results = await Promise.all(promises);

  const sites = results
    .filter(r => r !== null)
    .map((result, index) => ({
      siteCode: result!.siteCode,
      siteName: result!.siteName,
      data: result!.data,
      color: colors[index % colors.length]
    }));

  return {
    sites,
    parameter: parameterCode,
    unit: results[0]?.unit || ''
  };
}

/**
 * Analyze seasonal patterns in data
 */
export function analyzeSeasonalPatterns(data: HistoricalDataPoint[]): {
  spring: number;
  summer: number;
  fall: number;
  winter: number;
} {
  const seasons = {
    spring: [] as number[],
    summer: [] as number[],
    fall: [] as number[],
    winter: [] as number[]
  };

  data.forEach(point => {
    const date = new Date(point.dateTime);
    const month = date.getMonth() + 1; // 1-12

    if (month >= 3 && month <= 5) {
      seasons.spring.push(point.value);
    } else if (month >= 6 && month <= 8) {
      seasons.summer.push(point.value);
    } else if (month >= 9 && month <= 11) {
      seasons.fall.push(point.value);
    } else {
      seasons.winter.push(point.value);
    }
  });

  return {
    spring: seasons.spring.length > 0 
      ? seasons.spring.reduce((a, b) => a + b, 0) / seasons.spring.length 
      : 0,
    summer: seasons.summer.length > 0 
      ? seasons.summer.reduce((a, b) => a + b, 0) / seasons.summer.length 
      : 0,
    fall: seasons.fall.length > 0 
      ? seasons.fall.reduce((a, b) => a + b, 0) / seasons.fall.length 
      : 0,
    winter: seasons.winter.length > 0 
      ? seasons.winter.reduce((a, b) => a + b, 0) / seasons.winter.length 
      : 0
  };
}

/**
 * Calculate linear trend from time series data
 */
export function calculateTrend(data: HistoricalDataPoint[]): {
  slope: number;
  intercept: number;
  rSquared: number;
  changePerYear: number;
} {
  if (data.length < 2) {
    return { slope: 0, intercept: 0, rSquared: 0, changePerYear: 0 };
  }

  // Convert dates to numeric (days since first date)
  const firstDate = new Date(data[0].dateTime).getTime();
  const points = data.map(d => ({
    x: (new Date(d.dateTime).getTime() - firstDate) / (1000 * 60 * 60 * 24), // days
    y: d.value
  }));

  // Linear regression
  const n = points.length;
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumX2 = points.reduce((sum, p) => sum + p.x * p.x, 0);
  const sumY2 = points.reduce((sum, p) => sum + p.y * p.y, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // R-squared
  const yMean = sumY / n;
  const ssTotal = points.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
  const ssResidual = points.reduce((sum, p) => {
    const predicted = slope * p.x + intercept;
    return sum + Math.pow(p.y - predicted, 2);
  }, 0);
  const rSquared = 1 - (ssResidual / ssTotal);

  // Change per year (slope is per day, multiply by 365)
  const changePerYear = slope * 365;

  return { slope, intercept, rSquared, changePerYear };
}

/**
 * Perform climate trend analysis
 */
export async function analyzeClimateTrend(
  siteCode: string,
  parameterCode: string,
  yearsBack: number = 10
): Promise<ClimateAnalysis | null> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - yearsBack);

  const historical = await fetchHistoricalUSGSData(
    siteCode,
    parameterCode,
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  );

  if (!historical) return null;

  const trend = calculateTrend(historical.data);
  const seasonal = analyzeSeasonalPatterns(historical.data);

  // Determine trend direction
  let direction: 'warming' | 'cooling' | 'stable';
  if (parameterCode === '00010') { // Temperature
    if (trend.changePerYear > 0.1) direction = 'warming';
    else if (trend.changePerYear < -0.1) direction = 'cooling';
    else direction = 'stable';
  } else {
    direction = 'stable'; // For other parameters
  }

  // Find extremes
  const sorted = [...historical.data].sort((a, b) => b.value - a.value);
  const extremes = [
    { type: 'high' as const, value: sorted[0].value, date: sorted[0].dateTime },
    { type: 'low' as const, value: sorted[sorted.length - 1].value, date: sorted[sorted.length - 1].dateTime }
  ];

  return {
    site: historical.siteName,
    parameter: historical.parameterName,
    timeframe: `${yearsBack} years`,
    trend: {
      direction,
      changePerYear: trend.changePerYear,
      confidence: trend.rSquared > 0.5 ? 'high' : trend.rSquared > 0.3 ? 'medium' : 'low'
    },
    seasonalPatterns: [
      { season: 'Spring', avgValue: seasonal.spring, trend: 0 },
      { season: 'Summer', avgValue: seasonal.summer, trend: 0 },
      { season: 'Fall', avgValue: seasonal.fall, trend: 0 },
      { season: 'Winter', avgValue: seasonal.winter, trend: 0 }
    ],
    extremes
  };
}

/**
 * Generate climate scenario projections
 */
export function generateClimateScenario(
  currentData: HistoricalDataPoint[],
  scenarioType: 'optimistic' | 'moderate' | 'pessimistic'
): HistoricalDataPoint[] {
  const baseline = calculateTrend(currentData);
  
  // Temperature increase scenarios per year (for water temp in °F)
  const tempIncreaseRates = {
    optimistic: 0.05,   // +0.05°F per year (Paris Agreement target)
    moderate: 0.1,      // +0.1°F per year (current trajectory)
    pessimistic: 0.2    // +0.2°F per year (worst case)
  };

  const increaseRate = tempIncreaseRates[scenarioType];
  const yearsAhead = 10;
  const projections: HistoricalDataPoint[] = [];

  const lastDate = new Date(currentData[currentData.length - 1].dateTime);
  const lastValue = currentData[currentData.length - 1].value;

  for (let year = 1; year <= yearsAhead; year++) {
    const projectedDate = new Date(lastDate);
    projectedDate.setFullYear(projectedDate.getFullYear() + year);
    
    // Project based on historical trend plus climate scenario
    const projectedValue = lastValue + (baseline.changePerYear * year) + (increaseRate * year);
    
    projections.push({
      dateTime: projectedDate.toISOString(),
      value: projectedValue
    });
  }

  return projections;
}

/**
 * Calculate suitable trout habitat days per year
 */
export function calculateHabitatDays(temperatureData: HistoricalDataPoint[]): {
  excellent: number;  // < 55°F
  good: number;       // 55-65°F
  marginal: number;   // 65-70°F
  poor: number;       // > 70°F
  percentSuitable: number;
} {
  const counts = {
    excellent: 0,
    good: 0,
    marginal: 0,
    poor: 0
  };

  temperatureData.forEach(point => {
    const temp = point.value;
    if (temp < 55) counts.excellent++;
    else if (temp < 65) counts.good++;
    else if (temp < 70) counts.marginal++;
    else counts.poor++;
  });

  const total = temperatureData.length;
  const suitable = counts.excellent + counts.good;
  const percentSuitable = (suitable / total) * 100;

  return {
    ...counts,
    percentSuitable
  };
}

/**
 * Export data to CSV format
 */
export function exportToCSV(data: HistoricalSeries): string {
  const headers = ['Date', 'Time', data.parameterName, 'Unit'];
  const rows = data.data.map(point => {
    const date = new Date(point.dateTime);
    return [
      date.toLocaleDateString(),
      date.toLocaleTimeString(),
      point.value.toFixed(2),
      data.unit
    ];
  });

  const csv = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  return csv;
}

/**
 * Common date ranges for quick selection
 */
export const DATE_RANGES = {
  LAST_WEEK: () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
  },
  LAST_MONTH: () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
  },
  LAST_YEAR: () => {
    const end = new Date();
    const start = new Date();
    start.setFullYear(start.getFullYear() - 1);
    return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
  },
  CURRENT_YEAR: () => {
    const end = new Date();
    const start = new Date(end.getFullYear(), 0, 1);
    return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
  }
};

