// Virtual Lab Simulations
// Interactive simulations for nitrogen cycle, water chemistry, and trout anatomy

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';
import { 
  Beaker, 
  Droplets, 
  ThermometerSun, 
  Activity,
  Play,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Info
} from 'lucide-react';

interface LabResult {
  correct: boolean;
  feedback: string;
  score: number;
}

export function VirtualLabs() {
  const [activeTab, setActiveTab] = useState<'nitrogen' | 'water-chem' | 'dissolved-o2'>('nitrogen');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="w-6 h-6 text-blue-600" />
            Virtual Laboratory Simulations
          </CardTitle>
          <p className="text-sm text-gray-600">
            Interactive experiments to explore trout science
          </p>
        </CardHeader>
      </Card>

      {/* Lab Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant={activeTab === 'nitrogen' ? 'default' : 'outline'}
          onClick={() => setActiveTab('nitrogen')}
          className="h-auto py-4 flex-col items-start gap-2"
        >
          <Activity className="w-6 h-6" />
          <div className="text-left">
            <div className="font-semibold">Nitrogen Cycle</div>
            <div className="text-xs opacity-80">Build a balanced biofilter</div>
          </div>
        </Button>

        <Button
          variant={activeTab === 'water-chem' ? 'default' : 'outline'}
          onClick={() => setActiveTab('water-chem')}
          className="h-auto py-4 flex-col items-start gap-2"
        >
          <Droplets className="w-6 h-6" />
          <div className="text-left">
            <div className="font-semibold">Water Chemistry</div>
            <div className="text-xs opacity-80">Test and adjust pH</div>
          </div>
        </Button>

        <Button
          variant={activeTab === 'dissolved-o2' ? 'default' : 'outline'}
          onClick={() => setActiveTab('dissolved-o2')}
          className="h-auto py-4 flex-col items-start gap-2"
        >
          <ThermometerSun className="w-6 h-6" />
          <div className="text-left">
            <div className="font-semibold">Dissolved Oxygen</div>
            <div className="text-xs opacity-80">Temperature vs. DO</div>
          </div>
        </Button>
      </div>

      {/* Lab Content */}
      {activeTab === 'nitrogen' && <NitrogenCycleLab />}
      {activeTab === 'water-chem' && <WaterChemistryLab />}
      {activeTab === 'dissolved-o2' && <DissolvedOxygenLab />}
    </div>
  );
}

function NitrogenCycleLab() {
  const [day, setDay] = useState(0);
  const [ammonia, setAmmonia] = useState(0);
  const [nitrite, setNitrite] = useState(0);
  const [nitrate, setNitrate] = useState(0);
  const [bacteria1, setBacteria1] = useState(10);
  const [bacteria2, setBacteria2] = useState(10);
  const [fishAdded, setFishAdded] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setDay(d => {
        const newDay = d + 1;
        
        // Simulate nitrogen cycle
        if (fishAdded) {
          setAmmonia(a => Math.min(8, a + 0.5 - (bacteria1 / 20)));
        }
        
        if (ammonia > 0.5) {
          setBacteria1(b => Math.min(100, b + 5));
          setNitrite(n => Math.min(5, n + (bacteria1 / 20) - (bacteria2 / 25)));
          setAmmonia(a => Math.max(0, a - (bacteria1 / 20)));
        }
        
        if (nitrite > 0.3) {
          setBacteria2(b => Math.min(100, b + 4));
          setNitrate(n => Math.min(40, n + (bacteria2 / 25)));
          setNitrite(n => Math.max(0, n - (bacteria2 / 25)));
        }
        
        if (newDay >= 45) {
          setRunning(false);
        }
        
        return newDay;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [running, ammonia, nitrite, bacteria1, bacteria2, fishAdded]);

  const handleReset = () => {
    setDay(0);
    setAmmonia(0);
    setNitrite(0);
    setNitrate(0);
    setBacteria1(10);
    setBacteria2(10);
    setFishAdded(false);
    setRunning(false);
  };

  const handleAddFish = () => {
    if (day === 0) {
      setFishAdded(true);
      setRunning(true);
    }
  };

  const isCycled = ammonia < 0.25 && nitrite < 0.1 && bacteria1 > 80 && bacteria2 > 80;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interactive Nitrogen Cycle Simulation</CardTitle>
        <p className="text-sm text-gray-600">
          Observe how beneficial bacteria establish in an aquarium over time
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Day Counter */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-blue-600">Day {day}</div>
            <div className="text-sm text-gray-600">of 45-day cycling period</div>
          </div>
          {isCycled && (
            <Badge className="bg-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Tank Cycled!
            </Badge>
          )}
        </div>

        {/* Visual Tank */}
        <div className="relative bg-gradient-to-b from-blue-100 to-blue-300 rounded-lg p-6 min-h-[200px] border-4 border-blue-400">
          {/* Fish */}
          {fishAdded && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-6xl animate-pulse">🐟</div>
              {ammonia > 4 && (
                <Badge className="absolute -top-2 -right-2 bg-red-600 text-xs">
                  Stressed!
                </Badge>
              )}
            </div>
          )}

          {/* Bacteria Indicators */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between">
            <div className="bg-white rounded px-3 py-1 text-xs">
              <div className="font-semibold">Bacteria 1</div>
              <div className="text-purple-600">{bacteria1.toFixed(0)}%</div>
            </div>
            <div className="bg-white rounded px-3 py-1 text-xs">
              <div className="font-semibold">Bacteria 2</div>
              <div className="text-indigo-600">{bacteria2.toFixed(0)}%</div>
            </div>
          </div>

          {/* Bubbles */}
          {running && (
            <div className="absolute top-4 right-4">
              <div className="text-2xl animate-bounce">💨</div>
            </div>
          )}
        </div>

        {/* Compound Levels */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Ammonia (NH₃)</span>
              <Badge className={ammonia > 0.5 ? 'bg-red-600' : 'bg-green-600'}>
                {ammonia.toFixed(2)} ppm
              </Badge>
            </div>
            <Progress value={(ammonia / 8) * 100} className="h-2 [&>div]:bg-red-500" />
            <div className="text-xs text-gray-600 mt-1">
              {ammonia > 0.5 ? 'Toxic to fish' : 'Safe level'}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Nitrite (NO₂⁻)</span>
              <Badge className={nitrite > 0.3 ? 'bg-orange-600' : 'bg-green-600'}>
                {nitrite.toFixed(2)} ppm
              </Badge>
            </div>
            <Progress value={(nitrite / 5) * 100} className="h-2 [&>div]:bg-orange-500" />
            <div className="text-xs text-gray-600 mt-1">
              {nitrite > 0.3 ? 'Dangerous' : 'Safe level'}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Nitrate (NO₃⁻)</span>
              <Badge className={nitrate < 20 ? 'bg-green-600' : 'bg-yellow-600'}>
                {nitrate.toFixed(1)} ppm
              </Badge>
            </div>
            <Progress value={(nitrate / 40) * 100} className="h-2 [&>div]:bg-yellow-500" />
            <div className="text-xs text-gray-600 mt-1">
              {nitrate < 20 ? 'Acceptable' : 'Water change needed'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {!fishAdded && (
            <Button onClick={handleAddFish} className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Add Fish & Start Cycle
            </Button>
          )}
          {running && (
            <Button onClick={() => setRunning(false)} variant="outline" className="flex-1">
              Pause
            </Button>
          )}
          {fishAdded && !running && !isCycled && (
            <Button onClick={() => setRunning(true)} className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
          )}
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Educational Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex gap-2">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm space-y-2">
                <p className="font-semibold text-blue-900">What's Happening?</p>
                <ul className="space-y-1 text-blue-800">
                  <li>• <strong>Week 1-2:</strong> Ammonia rises from fish waste</li>
                  <li>• <strong>Week 2-3:</strong> Nitrosomonas bacteria convert NH₃ → NO₂⁻</li>
                  <li>• <strong>Week 3-4:</strong> Nitrobacter bacteria convert NO₂⁻ → NO₃⁻</li>
                  <li>• <strong>Week 4-6:</strong> Cycle completes, bacteria colonies stable</li>
                </ul>
                {isCycled && (
                  <p className="text-green-700 font-semibold">
                    ✓ Your aquarium is now cycled and safe for trout eggs!
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

function WaterChemistryLab() {
  const [pH, setPH] = useState(7.0);
  const [targetPH, setTargetPH] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<LabResult | null>(null);

  const startChallenge = () => {
    const target = 6.5 + Math.random() * 1.5; // Random between 6.5-8.0
    setTargetPH(Number(target.toFixed(1)));
    setPH(7.0);
    setAttempts(0);
    setResult(null);
  };

  const adjustPH = (amount: number) => {
    setPH(current => Number(Math.max(5.0, Math.min(9.0, current + amount)).toFixed(1)));
    setAttempts(a => a + 1);
  };

  const checkAnswer = () => {
    const diff = Math.abs(pH - targetPH);
    const correct = diff <= 0.2;
    
    setResult({
      correct,
      feedback: correct 
        ? `Perfect! You adjusted the pH to within 0.2 of the target in ${attempts} attempts.`
        : `Close! You were ${diff.toFixed(1)} pH units away. Try again!`,
      score: correct ? Math.max(100 - attempts * 5, 50) : 0
    });
  };

  const getTroutStatus = () => {
    if (pH < 6.0 || pH > 8.5) return { status: 'danger', text: 'Fatal to trout', color: 'text-red-600' };
    if (pH < 6.5 || pH > 8.0) return { status: 'warning', text: 'Stressed', color: 'text-orange-600' };
    return { status: 'safe', text: 'Ideal range', color: 'text-green-600' };
  };

  const status = getTroutStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Water Chemistry Lab: pH Adjustment</CardTitle>
        <p className="text-sm text-gray-600">
          Adjust pH to the ideal range for trout (6.5-8.0)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {targetPH === 0 ? (
          <div className="text-center py-8">
            <Button onClick={startChallenge} size="lg">
              <Play className="w-5 h-5 mr-2" />
              Start pH Challenge
            </Button>
          </div>
        ) : (
          <>
            {/* Current pH Display */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Current pH</div>
              <div className="text-6xl font-bold text-blue-600 mb-2">{pH.toFixed(1)}</div>
              <Badge className={`${status.color} bg-opacity-10`}>
                {status.text}
              </Badge>
            </div>

            {/* pH Scale Visual */}
            <div className="relative">
              <div className="h-8 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500" />
              <div 
                className="absolute top-0 w-1 h-8 bg-black border-2 border-white"
                style={{ left: `${((pH - 5) / 4) * 100}%` }}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>5.0 (Acidic)</span>
                <span>7.0 (Neutral)</span>
                <span>9.0 (Basic)</span>
              </div>
            </div>

            {/* Target */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-blue-900">Target pH:</span>
                  <span className="text-2xl font-bold text-blue-600">{targetPH}</span>
                </div>
                <div className="text-sm text-blue-800 mt-2">
                  Attempts: {attempts}
                </div>
              </CardContent>
            </Card>

            {/* Adjustment Controls */}
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => adjustPH(-0.1)} variant="outline">
                Add Acid (- 0.1)
              </Button>
              <Button onClick={() => adjustPH(+0.1)} variant="outline">
                Add Base (+ 0.1)
              </Button>
              <Button onClick={() => adjustPH(-0.5)} variant="outline">
                Add Acid (- 0.5)
              </Button>
              <Button onClick={() => adjustPH(+0.5)} variant="outline">
                Add Base (+ 0.5)
              </Button>
            </div>

            {/* Submit */}
            {!result && (
              <Button onClick={checkAnswer} className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Check Answer
              </Button>
            )}

            {/* Result */}
            {result && (
              <Card className={result.correct ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}>
                <CardContent className="pt-4">
                  <div className="flex gap-2">
                    {result.correct ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold">{result.feedback}</p>
                      {result.correct && (
                        <p className="text-sm mt-1">Score: {result.score}/100</p>
                      )}
                    </div>
                  </div>
                  <Button onClick={startChallenge} className="w-full mt-4">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    New Challenge
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Educational Info */}
            <Card className="bg-gray-50">
              <CardContent className="pt-4 text-sm space-y-2">
                <p className="font-semibold">💡 Real-World Context:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Trout prefer pH 6.5-8.0 (slightly acidic to neutral)</li>
                  <li>• Low pH (<6.0) damages gills and skin</li>
                  <li>• High pH (>8.5) causes ammonia toxicity</li>
                  <li>• Use baking soda to raise pH, peat moss to lower</li>
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function DissolvedOxygenLab() {
  const [temperature, setTemperature] = useState(50);
  const [oxygenLevel, setOxygenLevel] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // Calculate DO based on temperature (simplified Henry's Law)
  useEffect(() => {
    // Inverse relationship: colder water holds more oxygen
    const maxDO = 14.6 - (temperature - 32) * 0.08;
    setOxygenLevel(Number(Math.max(5, maxDO).toFixed(1)));
  }, [temperature]);

  const getOxygenStatus = () => {
    if (oxygenLevel >= 9) return { status: 'excellent', text: 'Excellent', color: 'bg-green-600' };
    if (oxygenLevel >= 7) return { status: 'good', text: 'Good', color: 'bg-blue-600' };
    if (oxygenLevel >= 5) return { status: 'stressed', text: 'Stressed', color: 'bg-orange-600' };
    return { status: 'critical', text: 'Critical', color: 'bg-red-600' };
  };

  const status = getOxygenStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dissolved Oxygen vs. Temperature</CardTitle>
        <p className="text-sm text-gray-600">
          Explore the relationship between water temperature and oxygen levels
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Temperature Control */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">Water Temperature</span>
            <Badge className="text-lg">{temperature}°F</Badge>
          </div>
          <input
            type="range"
            min="32"
            max="75"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>32°F (Freezing)</span>
            <span>50°F (Ideal)</span>
            <span>75°F (Too Warm)</span>
          </div>
        </div>

        {/* Visual Representation */}
        <div className="relative bg-gradient-to-b from-blue-100 to-blue-400 rounded-lg p-6 min-h-[200px] border-4 border-blue-500">
          {/* Thermometer */}
          <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow">
            <ThermometerSun className="w-6 h-6 text-red-500" />
            <div className="text-xl font-bold mt-1">{temperature}°F</div>
          </div>

          {/* Oxygen Bubbles (more bubbles = more oxygen) */}
          <div className="absolute inset-0 p-6">
            {Array.from({ length: Math.floor(oxygenLevel) }).map((_, i) => (
              <div
                key={i}
                className="absolute text-xl animate-bounce"
                style={{
                  left: `${10 + i * 8}%`,
                  bottom: `${20 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                💨
              </div>
            ))}
          </div>

          {/* Fish */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="text-6xl">🐟</div>
            {temperature > 60 && (
              <Badge className="absolute -top-2 -right-2 bg-red-600 text-xs animate-pulse">
                Too Warm!
              </Badge>
            )}
          </div>
        </div>

        {/* DO Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Dissolved Oxygen</span>
            <Badge className={status.color}>
              {oxygenLevel} mg/L - {status.text}
            </Badge>
          </div>
          <Progress value={(oxygenLevel / 14) * 100} className="h-3" />
        </div>

        {/* Explanation Toggle */}
        <Button 
          onClick={() => setShowExplanation(!showExplanation)}
          variant="outline"
          className="w-full"
        >
          <Info className="w-4 h-4 mr-2" />
          {showExplanation ? 'Hide' : 'Show'} Explanation
        </Button>

        {showExplanation && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4 space-y-3 text-sm">
              <div>
                <p className="font-semibold text-blue-900 mb-2">Why Does This Happen?</p>
                <p className="text-blue-800">
                  Cold water can hold more dissolved oxygen than warm water due to <strong>Henry's Law</strong>. 
                  Oxygen molecules move slower in cold water and are more likely to stay dissolved.
                </p>
              </div>
              
              <div>
                <p className="font-semibold text-blue-900 mb-2">Trout Requirements:</p>
                <ul className="space-y-1 text-blue-800">
                  <li>• <strong>Excellent:</strong> 9+ mg/L (ideal for growth)</li>
                  <li>• <strong>Good:</strong> 7-9 mg/L (acceptable)</li>
                  <li>• <strong>Stressed:</strong> 5-7 mg/L (survival mode)</li>
                  <li>• <strong>Critical:</strong> <5 mg/L (life-threatening)</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-blue-900 mb-2">In Your Aquarium:</p>
                <p className="text-blue-800">
                  Keep water temperature at <strong>48-52°F</strong> using a chiller. 
                  Add air stones to increase surface agitation and oxygen exchange.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Challenge Questions */}
        <Card className="bg-gray-50">
          <CardContent className="pt-4 space-y-3">
            <p className="font-semibold">🤔 Think About It:</p>
            <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
              <li>What happens to trout in warm summer streams?</li>
              <li>Why do trout seek deep, cold pools in hot weather?</li>
              <li>How does climate change affect trout populations?</li>
              <li>What can you do to keep oxygen levels high in your tank?</li>
            </ol>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

