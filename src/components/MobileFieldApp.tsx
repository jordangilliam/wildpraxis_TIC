// Mobile Field Data Collection App
// GPS-based stream finder, offline data entry, photo capture

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Badge } from './badge';
import {
  getCurrentLocation,
  findNearbyGauges,
  saveObservationOffline,
  loadOfflineObservations,
  getUnsyncedObservations,
  deleteObservation,
  processPhoto,
  exportObservationsToCSV,
  isOnline,
  getStorageInfo,
  generateObservationId,
  validateObservation,
  calculateStreamHealthScore,
  GPSLocation,
  FieldObservation,
  NearbyGauge
} from '../services/fieldDataCollection';
import { MapPin, Camera, Save, Upload, Download, Trash2, Navigation, Wifi, WifiOff, Database, Plus, Eye } from 'lucide-react';

export function MobileFieldApp() {
  const [location, setLocation] = useState<GPSLocation | null>(null);
  const [nearbyGauges, setNearbyGauges] = useState<NearbyGauge[]>([]);
  const [currentObservation, setCurrentObservation] = useState<FieldObservation | null>(null);
  const [savedObservations, setSavedObservations] = useState<FieldObservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState(isOnline());

  // Load saved observations on mount
  useEffect(() => {
    setSavedObservations(loadOfflineObservations());
    
    // Monitor online status
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getLocation = async () => {
    setLoading(true);
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);
      
      // Find nearby gauges
      const gauges = await findNearbyGauges(loc);
      setNearbyGauges(gauges);
    } catch (error) {
      alert('Error getting location: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const startNewObservation = () => {
    const obs: FieldObservation = {
      id: generateObservationId(),
      timestamp: new Date().toISOString(),
      location: location!,
      siteName: '',
      observers: [],
      observations: {},
      photos: [],
      synced: false
    };
    setCurrentObservation(obs);
  };

  const saveCurrentObservation = () => {
    if (!currentObservation) return;
    
    const errors = validateObservation(currentObservation);
    if (errors.length > 0) {
      alert('Please fix the following errors:\n' + errors.join('\n'));
      return;
    }
    
    saveObservationOffline(currentObservation);
    setSavedObservations(loadOfflineObservations());
    setCurrentObservation(null);
    alert('Observation saved offline!');
  };

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !currentObservation) return;
    
    try {
      const dataUrl = await processPhoto(e.target.files[0]);
      const photo = {
        id: `photo_${Date.now()}`,
        timestamp: new Date().toISOString(),
        dataUrl,
        uploaded: false
      };
      
      setCurrentObservation({
        ...currentObservation,
        photos: [...(currentObservation.photos || []), photo]
      });
    } catch (error) {
      alert('Error processing photo: ' + (error as Error).message);
    }
  };

  const exportData = () => {
    const csv = exportObservationsToCSV(savedObservations);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `field-observations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const storageInfo = getStorageInfo();
  const unsyncedCount = getUnsyncedObservations().length;

  return (
    <div className="space-y-6">
      {/* Header with Status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Mobile Field App</h2>
          <p className="text-gray-600 mt-1">
            GPS-enabled stream monitoring and data collection
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={online ? 'default' : 'secondary'}>
            {online ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
            {online ? 'Online' : 'Offline'}
          </Badge>
          <Badge variant="secondary">
            <Database className="w-3 h-3 mr-1" />
            {savedObservations.length} Saved
          </Badge>
          {unsyncedCount > 0 && (
            <Badge variant="destructive">
              {unsyncedCount} Unsynced
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="collect" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="collect">Data Collection</TabsTrigger>
          <TabsTrigger value="saved">Saved Data ({savedObservations.length})</TabsTrigger>
          <TabsTrigger value="gauges">Nearby Gauges</TabsTrigger>
        </TabsList>

        {/* Data Collection Tab */}
        <TabsContent value="collect" className="space-y-4">
          {/* GPS Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                GPS Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!location ? (
                <div className="text-center py-8">
                  <Navigation className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Enable GPS to begin field data collection</p>
                  <Button onClick={getLocation} disabled={loading}>
                    {loading ? 'Getting Location...' : 'Get Current Location'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Latitude:</span>
                        <div className="font-mono font-bold">{location.latitude.toFixed(6)}°N</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Longitude:</span>
                        <div className="font-mono font-bold">{location.longitude.toFixed(6)}°W</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Accuracy:</span>
                        <div className="font-bold">±{location.accuracy.toFixed(0)}m</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Altitude:</span>
                        <div className="font-bold">{location.altitude ? `${location.altitude.toFixed(0)}m` : 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  {nearbyGauges.length > 0 && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-900 mb-2">Nearest Stream Gauge:</div>
                      <div className="text-sm text-blue-800">
                        <div className="font-bold">{nearbyGauges[0].siteName}</div>
                        <div className="text-xs mt-1">
                          {nearbyGauges[0].distance.toFixed(1)} miles away • Site #{nearbyGauges[0].siteCode}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={getLocation} variant="outline" size="sm">
                      <Navigation className="w-4 h-4 mr-2" />
                      Refresh Location
                    </Button>
                    {!currentObservation && (
                      <Button onClick={startNewObservation} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Start New Observation
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Observation Form */}
          {currentObservation && (
            <Card>
              <CardHeader>
                <CardTitle>Field Observation Form</CardTitle>
                <CardDescription>
                  {new Date(currentObservation.timestamp).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Site Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Site Information</h3>
                  
                  <div>
                    <Label htmlFor="siteName">Site Name *</Label>
                    <Input
                      id="siteName"
                      value={currentObservation.siteName}
                      onChange={(e) => setCurrentObservation({
                        ...currentObservation,
                        siteName: e.target.value
                      })}
                      placeholder="e.g., Spring Creek at Benner"
                    />
                  </div>

                  <div>
                    <Label htmlFor="siteCode">USGS Site Code (if applicable)</Label>
                    <select
                      id="siteCode"
                      className="w-full p-2 border rounded"
                      value={currentObservation.siteCode || ''}
                      onChange={(e) => setCurrentObservation({
                        ...currentObservation,
                        siteCode: e.target.value
                      })}
                    >
                      <option value="">None</option>
                      {nearbyGauges.map(g => (
                        <option key={g.siteCode} value={g.siteCode}>
                          {g.siteName} ({g.distance.toFixed(1)} mi)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="observers">Observer Names * (comma separated)</Label>
                    <Input
                      id="observers"
                      value={currentObservation.observers.join(', ')}
                      onChange={(e) => setCurrentObservation({
                        ...currentObservation,
                        observers: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="John Doe, Jane Smith"
                    />
                  </div>
                </div>

                {/* Water Quality */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Water Quality Parameters</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="waterTemp">Water Temp (°F)</Label>
                      <Input
                        id="waterTemp"
                        type="number"
                        step="0.1"
                        value={currentObservation.observations.waterTemperature || ''}
                        onChange={(e) => setCurrentObservation({
                          ...currentObservation,
                          observations: {
                            ...currentObservation.observations,
                            waterTemperature: parseFloat(e.target.value) || undefined
                          }
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="airTemp">Air Temp (°F)</Label>
                      <Input
                        id="airTemp"
                        type="number"
                        step="0.1"
                        value={currentObservation.observations.airTemperature || ''}
                        onChange={(e) => setCurrentObservation({
                          ...currentObservation,
                          observations: {
                            ...currentObservation.observations,
                            airTemperature: parseFloat(e.target.value) || undefined
                          }
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="pH">pH</Label>
                      <Input
                        id="pH"
                        type="number"
                        step="0.1"
                        min="0"
                        max="14"
                        value={currentObservation.observations.pH || ''}
                        onChange={(e) => setCurrentObservation({
                          ...currentObservation,
                          observations: {
                            ...currentObservation.observations,
                            pH: parseFloat(e.target.value) || undefined
                          }
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="DO">Dissolved Oxygen (ppm)</Label>
                      <Input
                        id="DO"
                        type="number"
                        step="0.1"
                        value={currentObservation.observations.dissolvedOxygen || ''}
                        onChange={(e) => setCurrentObservation({
                          ...currentObservation,
                          observations: {
                            ...currentObservation.observations,
                            dissolvedOxygen: parseFloat(e.target.value) || undefined
                          }
                        })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="flow">Stream Flow</Label>
                      <select
                        id="flow"
                        className="w-full p-2 border rounded"
                        value={currentObservation.observations.flow || ''}
                        onChange={(e) => setCurrentObservation({
                          ...currentObservation,
                          observations: {
                            ...currentObservation.observations,
                            flow: e.target.value as any
                          }
                        })}
                      >
                        <option value="">Select...</option>
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="clarity">Water Clarity</Label>
                      <select
                        id="clarity"
                        className="w-full p-2 border rounded"
                        value={currentObservation.observations.clarity || ''}
                        onChange={(e) => setCurrentObservation({
                          ...currentObservation,
                          observations: {
                            ...currentObservation.observations,
                            clarity: e.target.value as any
                          }
                        })}
                      >
                        <option value="">Select...</option>
                        <option value="clear">Clear</option>
                        <option value="slightly_turbid">Slightly Turbid</option>
                        <option value="turbid">Turbid</option>
                        <option value="very_turbid">Very Turbid</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Photos */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Photos</h3>
                  
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoCapture}
                      className="hidden"
                      id="photoInput"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('photoInput')?.click()}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>

                  {currentObservation.photos && currentObservation.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {currentObservation.photos.map((photo) => (
                        <div key={photo.id} className="relative">
                          <img
                            src={photo.dataUrl}
                            alt="Field observation"
                            className="w-full h-24 object-cover rounded"
                          />
                          <button
                            onClick={() => setCurrentObservation({
                              ...currentObservation,
                              photos: currentObservation.photos?.filter(p => p.id !== photo.id)
                            })}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={currentObservation.notes || ''}
                    onChange={(e) => setCurrentObservation({
                      ...currentObservation,
                      notes: e.target.value
                    })}
                    placeholder="Habitat features, wildlife observed, weather conditions, etc."
                    rows={4}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={saveCurrentObservation}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Observation
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (confirm('Discard this observation?')) {
                        setCurrentObservation(null);
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Saved Data Tab */}
        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Saved Observations</CardTitle>
                  <CardDescription>
                    {savedObservations.length} observation{savedObservations.length !== 1 ? 's' : ''} saved locally
                  </CardDescription>
                </div>
                {savedObservations.length > 0 && (
                  <Button variant="outline" size="sm" onClick={exportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {savedObservations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No saved observations yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedObservations.map((obs) => {
                    const healthScore = calculateStreamHealthScore(obs);
                    
                    return (
                      <div key={obs.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{obs.siteName}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(obs.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {healthScore.score > 0 && (
                              <Badge
                                variant={
                                  healthScore.grade === 'A' || healthScore.grade === 'B' ? 'default' : 'secondary'
                                }
                              >
                                Grade: {healthScore.grade}
                              </Badge>
                            )}
                            {!obs.synced && <Badge variant="destructive">Unsynced</Badge>}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                          {obs.observations.waterTemperature && (
                            <div>Water: {obs.observations.waterTemperature}°F</div>
                          )}
                          {obs.observations.pH && <div>pH: {obs.observations.pH}</div>}
                          {obs.observers.length > 0 && (
                            <div className="col-span-2">Observers: {obs.observers.join(', ')}</div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (confirm('Delete this observation?')) {
                                deleteObservation(obs.id);
                                setSavedObservations(loadOfflineObservations());
                              }
                            }}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Storage Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Storage Usage</h4>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(storageInfo.used / storageInfo.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">
                    {(storageInfo.used / 1024).toFixed(0)} / {(storageInfo.total / 1024).toFixed(0)} KB
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nearby Gauges Tab */}
        <TabsContent value="gauges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nearby USGS Stream Gauges</CardTitle>
              <CardDescription>
                {nearbyGauges.length > 0 ? `${nearbyGauges.length} gauges within 25 miles` : 'Get your location to find nearby gauges'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {nearbyGauges.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Enable GPS to find nearby stream gauges</p>
                  <Button onClick={getLocation} disabled={loading}>
                    {loading ? 'Getting Location...' : 'Get Location'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {nearbyGauges.map((gauge) => (
                    <div key={gauge.siteCode} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{gauge.siteName}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Site #{gauge.siteCode}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {gauge.distance.toFixed(1)} mi
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {gauge.latitude.toFixed(4)}°N, {gauge.longitude.toFixed(4)}°W
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

