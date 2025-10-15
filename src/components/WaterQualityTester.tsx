// Interactive Water Quality Testing Module
// Comprehensive tool for recording, tracking, and analyzing water quality data
// Based on Penn State Extension protocols and PFBC standards

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Badge } from "./badge";
import {
  Droplets,
  Thermometer,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Info,
  Download,
  Calendar,
  LineChart
} from "lucide-react";

interface WaterTestResult {
  id: string;
  date: Date;
  time: string;
  temperature: number;
  dissolvedOxygen: number;
  pH: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  salinity?: number;
  notes?: string;
}

interface WaterQualityRanges {
  parameter: string;
  unit: string;
  ideal: string;
  acceptable: string;
  danger: string;
  icon: React.ReactNode;
}

// Optimal ranges for coldwater trout (based on PFBC and Penn State Extension standards)
const WATER_QUALITY_RANGES: WaterQualityRanges[] = [
  {
    parameter: "Temperature",
    unit: "°F",
    ideal: "48-55",
    acceptable: "45-58",
    danger: "<45 or >65",
    icon: <Thermometer className="h-5 w-5" />
  },
  {
    parameter: "Dissolved Oxygen",
    unit: "ppm",
    ideal: "8-12",
    acceptable: "7-13",
    danger: "<7",
    icon: <Activity className="h-5 w-5" />
  },
  {
    parameter: "pH",
    unit: "",
    ideal: "6.5-7.5",
    acceptable: "6.0-8.0",
    danger: "<6.0 or >8.5",
    icon: <Droplets className="h-5 w-5" />
  },
  {
    parameter: "Ammonia (NH3)",
    unit: "ppm",
    ideal: "0",
    acceptable: "0-0.25",
    danger: ">0.5",
    icon: <AlertTriangle className="h-5 w-5" />
  },
  {
    parameter: "Nitrite (NO2)",
    unit: "ppm",
    ideal: "0",
    acceptable: "0-0.25",
    danger: ">0.5",
    icon: <AlertTriangle className="h-5 w-5" />
  },
  {
    parameter: "Nitrate (NO3)",
    unit: "ppm",
    ideal: "0-10",
    acceptable: "10-20",
    danger: ">40",
    icon: <CheckCircle2 className="h-5 w-5" />
  }
];

export function WaterQualityTester() {
  const [testResults, setTestResults] = useState<WaterTestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<Partial<WaterTestResult>>({
    date: new Date(),
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  });

  // Load saved results from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('water-quality-tests');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date strings back to Date objects
      setTestResults(parsed.map((r: any) => ({ ...r, date: new Date(r.date) })));
    }
  }, []);

  // Save results to localStorage whenever they change
  useEffect(() => {
    if (testResults.length > 0) {
      localStorage.setItem('water-quality-tests', JSON.stringify(testResults));
    }
  }, [testResults]);

  const handleInputChange = (field: keyof WaterTestResult, value: string | number) => {
    setCurrentTest(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitTest = () => {
    if (!currentTest.temperature || !currentTest.dissolvedOxygen || !currentTest.pH) {
      alert("Please enter at least Temperature, DO, and pH values");
      return;
    }

    const newTest: WaterTestResult = {
      id: Date.now().toString(),
      date: currentTest.date || new Date(),
      time: currentTest.time || new Date().toLocaleTimeString(),
      temperature: Number(currentTest.temperature),
      dissolvedOxygen: Number(currentTest.dissolvedOxygen),
      pH: Number(currentTest.pH),
      ammonia: Number(currentTest.ammonia || 0),
      nitrite: Number(currentTest.nitrite || 0),
      nitrate: Number(currentTest.nitrate || 0),
      salinity: currentTest.salinity ? Number(currentTest.salinity) : undefined,
      notes: currentTest.notes
    };

    setTestResults(prev => [newTest, ...prev]);
    
    // Reset form but keep date/time
    setCurrentTest({
      date: new Date(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    });
  };

  const getStatusColor = (parameter: string, value: number): string => {
    const ranges = WATER_QUALITY_RANGES.find(r => r.parameter === parameter);
    if (!ranges) return "text-slate-600";

    // Temperature
    if (parameter === "Temperature") {
      if (value >= 48 && value <= 55) return "text-emerald-600";
      if (value >= 45 && value <= 58) return "text-amber-600";
      return "text-red-600";
    }

    // Dissolved Oxygen
    if (parameter === "Dissolved Oxygen") {
      if (value >= 8 && value <= 12) return "text-emerald-600";
      if (value >= 7) return "text-amber-600";
      return "text-red-600";
    }

    // pH
    if (parameter === "pH") {
      if (value >= 6.5 && value <= 7.5) return "text-emerald-600";
      if (value >= 6.0 && value <= 8.0) return "text-amber-600";
      return "text-red-600";
    }

    // Ammonia
    if (parameter === "Ammonia (NH3)") {
      if (value === 0) return "text-emerald-600";
      if (value <= 0.25) return "text-amber-600";
      return "text-red-600";
    }

    // Nitrite
    if (parameter === "Nitrite (NO2)") {
      if (value === 0) return "text-emerald-600";
      if (value <= 0.25) return "text-amber-600";
      return "text-red-600";
    }

    // Nitrate
    if (parameter === "Nitrate (NO3)") {
      if (value <= 10) return "text-emerald-600";
      if (value <= 20) return "text-amber-600";
      return "text-red-600";
    }

    return "text-slate-600";
  };

  const exportData = () => {
    const csv = [
      ["Date", "Time", "Temp (°F)", "DO (ppm)", "pH", "NH3 (ppm)", "NO2 (ppm)", "NO3 (ppm)", "Salinity", "Notes"],
      ...testResults.map(r => [
        r.date.toLocaleDateString(),
        r.time,
        r.temperature,
        r.dissolvedOxygen,
        r.pH,
        r.ammonia,
        r.nitrite,
        r.nitrate,
        r.salinity || "",
        r.notes || ""
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `water-quality-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Droplets className="h-7 w-7 text-sky-600" />
            Water Quality Testing Station
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Record and track water quality parameters for your classroom trout tank. Based on PA Fish & Boat Commission and Penn State Extension protocols.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="test" className="w-full">
        <TabsList className="w-full flex-wrap rounded-full bg-white/60 backdrop-blur ring-1 ring-white/60 p-1">
          <TabsTrigger value="test">
            <Activity className="h-4 w-4 mr-2" />
            New Test
          </TabsTrigger>
          <TabsTrigger value="history">
            <LineChart className="h-4 w-4 mr-2" />
            Test History ({testResults.length})
          </TabsTrigger>
          <TabsTrigger value="ranges">
            <Info className="h-4 w-4 mr-2" />
            Ideal Ranges
          </TabsTrigger>
        </TabsList>

        {/* New Test Tab */}
        <TabsContent value="test" className="mt-6">
          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Record Water Parameters</CardTitle>
              <CardDescription>Test your tank water and record all parameters below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date/Time */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="test-date">Date</Label>
                  <Input
                    id="test-date"
                    type="date"
                    value={currentTest.date?.toISOString().split('T')[0]}
                    onChange={(e) => handleInputChange('date', new Date(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="test-time">Time</Label>
                  <Input
                    id="test-time"
                    type="time"
                    value={currentTest.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                  />
                </div>
              </div>

              {/* Primary Parameters */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="temperature">
                    <Thermometer className="h-4 w-4 inline mr-1" />
                    Temperature (°F) *
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="50-55"
                    value={currentTest.temperature || ""}
                    onChange={(e) => handleInputChange('temperature', e.target.value)}
                    className="mt-1"
                  />
                  <div className="text-xs text-slate-600 mt-1">Ideal: 48-55°F</div>
                </div>

                <div>
                  <Label htmlFor="dissolvedOxygen">
                    <Activity className="h-4 w-4 inline mr-1" />
                    Dissolved Oxygen (ppm) *
                  </Label>
                  <Input
                    id="dissolvedOxygen"
                    type="number"
                    step="0.1"
                    placeholder="8-12"
                    value={currentTest.dissolvedOxygen || ""}
                    onChange={(e) => handleInputChange('dissolvedOxygen', e.target.value)}
                    className="mt-1"
                  />
                  <div className="text-xs text-slate-600 mt-1">Ideal: 8-12 ppm</div>
                </div>

                <div>
                  <Label htmlFor="pH">
                    <Droplets className="h-4 w-4 inline mr-1" />
                    pH *
                  </Label>
                  <Input
                    id="pH"
                    type="number"
                    step="0.1"
                    placeholder="6.5-7.5"
                    value={currentTest.pH || ""}
                    onChange={(e) => handleInputChange('pH', e.target.value)}
                    className="mt-1"
                  />
                  <div className="text-xs text-slate-600 mt-1">Ideal: 6.5-7.5</div>
                </div>
              </div>

              {/* Nitrogen Cycle Parameters */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Nitrogen Cycle Parameters
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="ammonia">Ammonia (NH3) ppm</Label>
                    <Input
                      id="ammonia"
                      type="number"
                      step="0.01"
                      placeholder="0"
                      value={currentTest.ammonia || ""}
                      onChange={(e) => handleInputChange('ammonia', e.target.value)}
                      className="mt-1"
                    />
                    <div className="text-xs text-slate-600 mt-1">Should be 0</div>
                  </div>

                  <div>
                    <Label htmlFor="nitrite">Nitrite (NO2) ppm</Label>
                    <Input
                      id="nitrite"
                      type="number"
                      step="0.01"
                      placeholder="0"
                      value={currentTest.nitrite || ""}
                      onChange={(e) => handleInputChange('nitrite', e.target.value)}
                      className="mt-1"
                    />
                    <div className="text-xs text-slate-600 mt-1">Should be 0</div>
                  </div>

                  <div>
                    <Label htmlFor="nitrate">Nitrate (NO3) ppm</Label>
                    <Input
                      id="nitrate"
                      type="number"
                      step="0.1"
                      placeholder="0-10"
                      value={currentTest.nitrate || ""}
                      onChange={(e) => handleInputChange('nitrate', e.target.value)}
                      className="mt-1"
                    />
                    <div className="text-xs text-slate-600 mt-1">Ideal: 0-10 ppm</div>
                  </div>
                </div>
              </div>

              {/* Optional Parameters */}
              <div>
                <Label htmlFor="salinity">Salinity (optional, during egg/alevin stage)</Label>
                <Input
                  id="salinity"
                  type="number"
                  step="0.01"
                  placeholder="0.2%"
                  value={currentTest.salinity || ""}
                  onChange={(e) => handleInputChange('salinity', e.target.value)}
                  className="mt-1"
                />
                <div className="text-xs text-slate-600 mt-1">Typical: 0.2% (1 tbsp per 5 gallons)</div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Any observations, changes made, or concerns..."
                  value={currentTest.notes || ""}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button onClick={handleSubmitTest} size="lg" className="w-full">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Save Test Results
              </Button>

              <div className="text-xs text-slate-600 text-center">
                * Required parameters. Test at the same time each day for consistent data.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6 space-y-4">
          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Test History</CardTitle>
                  <CardDescription>View and export your water quality data</CardDescription>
                </div>
                {testResults.length > 0 && (
                  <Button onClick={exportData} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <div className="text-center py-12 text-slate-600">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                  <p>No test results yet. Record your first test to start tracking!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {testResults.map((result) => (
                    <div key={result.id} className="p-4 bg-slate-50 rounded-xl border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium">
                          {result.date.toLocaleDateString()} at {result.time}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
                        <div>
                          <div className="text-slate-600">Temp</div>
                          <div className={`font-medium ${getStatusColor('Temperature', result.temperature)}`}>
                            {result.temperature}°F
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-600">DO</div>
                          <div className={`font-medium ${getStatusColor('Dissolved Oxygen', result.dissolvedOxygen)}`}>
                            {result.dissolvedOxygen} ppm
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-600">pH</div>
                          <div className={`font-medium ${getStatusColor('pH', result.pH)}`}>
                            {result.pH}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-600">NH3</div>
                          <div className={`font-medium ${getStatusColor('Ammonia (NH3)', result.ammonia)}`}>
                            {result.ammonia} ppm
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-600">NO2</div>
                          <div className={`font-medium ${getStatusColor('Nitrite (NO2)', result.nitrite)}`}>
                            {result.nitrite} ppm
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-600">NO3</div>
                          <div className={`font-medium ${getStatusColor('Nitrate (NO3)', result.nitrate)}`}>
                            {result.nitrate} ppm
                          </div>
                        </div>
                      </div>

                      {result.notes && (
                        <div className="mt-3 text-sm text-slate-700 bg-white p-2 rounded">
                          <strong>Notes:</strong> {result.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ranges Tab */}
        <TabsContent value="ranges" className="mt-6">
          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Ideal Water Quality Ranges</CardTitle>
              <CardDescription>Optimal parameters for raising trout (based on PFBC & Penn State Extension)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {WATER_QUALITY_RANGES.map((range) => (
                  <div key={range.parameter} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-sky-600">{range.icon}</div>
                      <h4 className="font-medium">{range.parameter} {range.unit && `(${range.unit})`}</h4>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="text-emerald-600 font-medium">✓ Ideal</div>
                        <div>{range.ideal}</div>
                      </div>
                      <div>
                        <div className="text-amber-600 font-medium">⚠ Acceptable</div>
                        <div>{range.acceptable}</div>
                      </div>
                      <div>
                        <div className="text-red-600 font-medium">⚠ Danger</div>
                        <div>{range.danger}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-sky-50 border border-sky-200 rounded-xl">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Info className="h-5 w-5 text-sky-600" />
                  Testing Tips
                </h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Test at the same time each day for consistent data</li>
                  <li>• Record baseline values before adding eggs</li>
                  <li>• If ammonia or nitrite spike, do immediate 25-50% water change</li>
                  <li>• Temperature is critical - never let it exceed 65°F</li>
                  <li>• Dissolved oxygen should stay above 7 ppm at all times</li>
                  <li>• Graph your data weekly to spot trends early</li>
                </ul>
              </div>

              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <h4 className="font-medium mb-2">📚 Learn More</h4>
                <p className="text-sm text-slate-700 mb-2">
                  For detailed water quality monitoring protocols, see:
                </p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Penn State Extension: Water Quality Monitoring Handbook</li>
                  <li>• PFBC TIC Teacher Handbook - Water Chemistry Section</li>
                  <li>• Dr. Sara Mueller's stream monitoring protocols</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

