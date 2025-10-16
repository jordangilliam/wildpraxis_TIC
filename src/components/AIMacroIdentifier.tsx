// AI-Powered Macroinvertebrate Identifier
// Camera integration + Google Vision API + Manual key

import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Badge } from './badge';
import { Progress } from './progress';
import {
  identifyMacroWithAI,
  identifyMacroManually,
  calculateStreamHealthFromMacros,
  getMacrosByTolerance,
  searchMacros,
  MacroSpecies,
  MacroIdentificationResult,
  MACRO_DATABASE
} from '../services/macroIdentification';
import { Camera, Upload, Search, Key, CheckCircle, AlertCircle, Info, ExternalLink, BookOpen } from 'lucide-react';

export function AIMacroIdentifier() {
  const [identificationMode, setIdentificationMode] = useState<'ai' | 'manual' | 'browse'>('ai');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [aiResult, setAIResult] = useState<MacroIdentificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('google_vision_api_key') || '');
  const [selectedMacro, setSelectedMacro] = useState<MacroSpecies | null>(null);
  const [observations, setObservations] = useState<{ speciesId: string; count: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = async (file: File) => {
    // Display image
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Identify with AI
    if (apiKey && identificationMode === 'ai') {
      setLoading(true);
      try {
        const result = await identifyMacroWithAI(file, apiKey);
        setAIResult(result);
      } catch (error) {
        alert('AI identification error: ' + (error as Error).message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageCapture(file);
    }
  };

  const saveAPIKey = () => {
    localStorage.setItem('google_vision_api_key', apiKey);
    alert('API key saved securely in browser storage');
  };

  const addObservation = (speciesId: string, count: number) => {
    setObservations(prev => {
      const existing = prev.find(o => o.speciesId === speciesId);
      if (existing) {
        return prev.map(o => 
          o.speciesId === speciesId 
            ? { ...o, count: o.count + count }
            : o
        );
      }
      return [...prev, { speciesId, count }];
    });
  };

  const healthScore = observations.length > 0 
    ? calculateStreamHealthFromMacros(observations)
    : null;

  const searchResults = searchQuery.length > 2 ? searchMacros(searchQuery) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Camera className="w-8 h-8" />
          AI Macro Identifier
        </h2>
        <p className="text-gray-600 mt-1">
          Identify macroinvertebrates using AI-powered image recognition or manual keys
        </p>
      </div>

      {/* API Key Setup */}
      {!apiKey && identificationMode === 'ai' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <AlertCircle className="w-5 h-5" />
              Google Vision API Key Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-800 mb-4">
              To use AI identification, you need a Google Cloud Vision API key. 
              <a 
                href="https://cloud.google.com/vision/docs/setup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline ml-1"
              >
                Get one here (free tier available)
              </a>
            </p>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button onClick={saveAPIKey} disabled={!apiKey}>
                Save API Key
              </Button>
            </div>
            <p className="text-xs text-yellow-700 mt-2">
              Your API key is stored locally and never sent to our servers
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs value={identificationMode} onValueChange={(v: any) => setIdentificationMode(v)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ai">
            <Camera className="w-4 h-4 mr-2" />
            AI Identification
          </TabsTrigger>
          <TabsTrigger value="manual">
            <Key className="w-4 h-4 mr-2" />
            Manual Key
          </TabsTrigger>
          <TabsTrigger value="browse">
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Database
          </TabsTrigger>
        </TabsList>

        {/* AI Identification Tab */}
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Capture or Upload Image</CardTitle>
              <CardDescription>
                Take a clear photo of the macroinvertebrate or upload an existing image
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Image Capture Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Take Photo
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Image
                </Button>
              </div>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Image Preview */}
              {selectedImage && (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Captured macro"
                      className="w-full max-h-96 object-contain rounded-lg border"
                    />
                  </div>

                  {loading && (
                    <div className="text-center py-4">
                      <Progress value={undefined} className="h-2 mb-2" />
                      <p className="text-sm text-gray-600">Analyzing image with AI...</p>
                    </div>
                  )}

                  {/* AI Results */}
                  {aiResult && !loading && (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <h3 className="font-bold text-green-900 text-lg">
                              {aiResult.species.commonName}
                            </h3>
                            <p className="text-sm italic text-green-700">
                              {aiResult.species.scientificName}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <Badge variant={
                                aiResult.species.toleranceGroup === 'sensitive' ? 'default' :
                                aiResult.species.toleranceGroup === 'moderate' ? 'secondary' : 'outline'
                              }>
                                {aiResult.species.toleranceGroup.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-green-700">
                                {(aiResult.confidence * 100).toFixed(0)}% confidence
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <div>
                            <h4 className="font-semibold text-green-900 text-sm">Description:</h4>
                            <p className="text-sm text-green-800">{aiResult.species.description}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-green-900 text-sm">Identifying Features:</h4>
                            <ul className="list-disc list-inside text-sm text-green-800">
                              {aiResult.species.identifyingFeatures.map((feature, i) => (
                                <li key={i}>{feature}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-green-900 text-sm">Habitat:</h4>
                            <p className="text-sm text-green-800">{aiResult.species.habitat}</p>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                const count = prompt('How many did you observe?', '1');
                                if (count) {
                                  addObservation(aiResult.species.id, parseInt(count));
                                  alert('Added to observations!');
                                }
                              }}
                            >
                              Add to Observations
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedMacro(aiResult.species)}
                            >
                              <Info className="w-4 h-4 mr-1" />
                              More Info
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Alternative Matches */}
                      {aiResult.alternativeMatches && aiResult.alternativeMatches.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Alternative Matches:</h4>
                          <div className="space-y-2">
                            {aiResult.alternativeMatches.map((alt, i) => (
                              <div key={i} className="p-3 border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium">{alt.species.commonName}</div>
                                    <div className="text-sm text-gray-600">{alt.species.scientificName}</div>
                                  </div>
                                  <Badge variant="secondary">
                                    {(alt.confidence * 100).toFixed(0)}%
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!aiResult && !loading && apiKey && (
                    <div className="text-center py-4">
                      <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                      <p className="text-gray-600">Could not identify macroinvertebrate</p>
                      <p className="text-sm text-gray-500 mt-1">Try a clearer photo or use manual identification</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manual Key Tab */}
        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Identification Key</CardTitle>
              <CardDescription>Answer questions to narrow down the species</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label>How many tail filaments?</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Button variant="outline">None visible</Button>
                    <Button variant="outline">Two (2)</Button>
                    <Button variant="outline">Three (3)</Button>
                  </div>
                </div>

                <div>
                  <Label>Body shape</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Button variant="outline">Flattened</Button>
                    <Button variant="outline">Cylindrical</Button>
                    <Button variant="outline">Round</Button>
                  </div>
                </div>

                <div>
                  <Label>Does it have a protective case?</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button variant="outline">Yes - has case</Button>
                    <Button variant="outline">No case</Button>
                  </div>
                </div>

                <div>
                  <Label>Where was it found?</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button variant="outline">Fast-flowing water</Button>
                    <Button variant="outline">Slow/still water</Button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 italic">
                  🔧 Manual key system coming soon! For now, use Browse Database tab.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Browse Database Tab */}
        <TabsContent value="browse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Macroinvertebrate Database</CardTitle>
              <CardDescription>
                Browse {MACRO_DATABASE.length} Pennsylvania stream macroinvertebrates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by common name, scientific name, or order..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Browse by Tolerance Group */}
              <div className="space-y-4">
                {searchQuery.length > 2 ? (
                  /* Search Results */
                  <div>
                    <h3 className="font-semibold mb-3">Search Results ({searchResults.length})</h3>
                    <div className="space-y-2">
                      {searchResults.map(macro => (
                        <MacroCard
                          key={macro.id}
                          macro={macro}
                          onSelect={() => setSelectedMacro(macro)}
                          onAdd={() => {
                            const count = prompt('How many did you observe?', '1');
                            if (count) {
                              addObservation(macro.id, parseInt(count));
                              alert('Added to observations!');
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Browse by Group */
                  <>
                    <ToleranceGroupSection
                      title="Sensitive (Pollution-Intolerant)"
                      description="Found only in clean, high-quality water"
                      group="sensitive"
                      color="green"
                      onSelect={setSelectedMacro}
                      onAdd={addObservation}
                    />
                    
                    <ToleranceGroupSection
                      title="Moderate (Somewhat Tolerant)"
                      description="Tolerate some pollution"
                      group="moderate"
                      color="yellow"
                      onSelect={setSelectedMacro}
                      onAdd={addObservation}
                    />
                    
                    <ToleranceGroupSection
                      title="Tolerant (Pollution-Tolerant)"
                      description="Can survive in degraded water"
                      group="tolerant"
                      color="red"
                      onSelect={setSelectedMacro}
                      onAdd={addObservation}
                    />
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Current Observations */}
      {observations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Observations ({observations.reduce((sum, o) => sum + o.count, 0)} total)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {observations.map((obs) => {
                const macro = MACRO_DATABASE.find(m => m.id === obs.speciesId)!;
                return (
                  <div key={obs.speciesId} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{macro.commonName}</div>
                      <div className="text-sm text-gray-600">{macro.scientificName}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge>{obs.count}</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setObservations(prev => prev.filter(o => o.speciesId !== obs.speciesId))}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stream Health Score */}
            {healthScore && (
              <div className={`p-6 rounded-lg ${
                healthScore.grade === 'Excellent' ? 'bg-green-50 border-green-200' :
                healthScore.grade === 'Good' ? 'bg-blue-50 border-blue-200' :
                healthScore.grade === 'Fair' ? 'bg-yellow-50 border-yellow-200' :
                'bg-red-50 border-red-200'
              } border-2`}>
                <h3 className="font-bold text-lg mb-4">Stream Health Assessment</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">BIBI Score</div>
                    <div className="text-3xl font-bold">{healthScore.bibi}/100</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Grade</div>
                    <div className="text-3xl font-bold">{healthScore.grade}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">EPT Taxa</div>
                    <div className="text-3xl font-bold">{healthScore.ept}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Taxa</div>
                    <div className="text-3xl font-bold">{healthScore.totalTaxa}</div>
                  </div>
                </div>
                <Progress value={healthScore.bibi} className="h-3 mb-2" />
                <p className="text-sm text-gray-700">
                  {healthScore.grade === 'Excellent' && 'Outstanding water quality! High diversity of sensitive species.'}
                  {healthScore.grade === 'Good' && 'Good water quality with diverse macro community.'}
                  {healthScore.grade === 'Fair' && 'Moderate water quality. Some pollution stress evident.'}
                  {healthScore.grade === 'Poor' && 'Poor water quality. Dominated by pollution-tolerant species.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Macro Detail Modal */}
      {selectedMacro && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedMacro.commonName}</CardTitle>
                  <CardDescription className="italic">{selectedMacro.scientificName}</CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setSelectedMacro(null)}>×</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={
                  selectedMacro.toleranceGroup === 'sensitive' ? 'default' :
                  selectedMacro.toleranceGroup === 'moderate' ? 'secondary' : 'outline'
                }>
                  {selectedMacro.toleranceGroup.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-600">
                  Tolerance Value: {selectedMacro.toleranceValue}/10
                </span>
              </div>

              <div>
                <h4 className="font-semibold mb-1">Description</h4>
                <p className="text-sm text-gray-700">{selectedMacro.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">Habitat</h4>
                <p className="text-sm text-gray-700">{selectedMacro.habitat}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Identifying Features</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {selectedMacro.identifyingFeatures.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">References</h4>
                <div className="space-y-2">
                  {selectedMacro.references.map((ref, i) => (
                    <a
                      key={i}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {ref.source}
                    </a>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={() => {
                    const count = prompt('How many did you observe?', '1');
                    if (count) {
                      addObservation(selectedMacro.id, parseInt(count));
                      setSelectedMacro(null);
                      alert('Added to observations!');
                    }
                  }}
                >
                  Add to Observations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Helper Components
function MacroCard({
  macro,
  onSelect,
  onAdd
}: {
  macro: MacroSpecies;
  onSelect: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{macro.commonName}</h4>
          <p className="text-sm italic text-gray-600">{macro.scientificName}</p>
          <p className="text-xs text-gray-500 mt-1">Order: {macro.order}</p>
        </div>
        <Badge variant={
          macro.toleranceGroup === 'sensitive' ? 'default' :
          macro.toleranceGroup === 'moderate' ? 'secondary' : 'outline'
        }>
          {macro.toleranceGroup}
        </Badge>
      </div>
      <p className="text-sm text-gray-700 mb-3">{macro.description}</p>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onSelect}>
          <Info className="w-3 h-3 mr-1" />
          Details
        </Button>
        <Button size="sm" onClick={onAdd}>
          Add to Observations
        </Button>
      </div>
    </div>
  );
}

function ToleranceGroupSection({
  title,
  description,
  group,
  color,
  onSelect,
  onAdd
}: {
  title: string;
  description: string;
  group: 'sensitive' | 'moderate' | 'tolerant';
  color: string;
  onSelect: (macro: MacroSpecies) => void;
  onAdd: (speciesId: string, count: number) => void;
}) {
  const macros = getMacrosByTolerance(group);
  const [expanded, setExpanded] = useState(group === 'sensitive');

  return (
    <div className={`border-2 rounded-lg overflow-hidden border-${color}-200`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full p-4 bg-${color}-50 hover:bg-${color}-100 transition-colors text-left`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-bold text-${color}-900`}>{title}</h3>
            <p className={`text-sm text-${color}-700`}>{description}</p>
          </div>
          <Badge variant="secondary">{macros.length} species</Badge>
        </div>
      </button>
      {expanded && (
        <div className="p-4 space-y-2">
          {macros.map(macro => (
            <MacroCard
              key={macro.id}
              macro={macro}
              onSelect={() => onSelect(macro)}
              onAdd={() => {
                const count = prompt('How many did you observe?', '1');
                if (count) {
                  onAdd(macro.id, parseInt(count));
                  alert('Added to observations!');
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

