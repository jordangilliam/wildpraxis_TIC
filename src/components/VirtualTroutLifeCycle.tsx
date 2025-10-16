// Virtual Trout Life Cycle Interactive Tour
// 3D/animated journey through trout development

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Info, Eye } from 'lucide-react';

interface LifeStage {
  id: string;
  name: string;
  duration: string;
  daysRange: [number, number];
  size: string;
  emoji: string;
  description: string;
  keyFeatures: string[];
  careRequirements: {
    temperature: string;
    feeding: string;
    maintenance: string;
    monitoring: string;
  };
  whatToExpect: string[];
  commonIssues: string[];
  scientificFacts: string[];
}

const LIFE_STAGES: LifeStage[] = [
  {
    id: 'egg',
    name: 'Fertilized Egg',
    duration: '28-32 days',
    daysRange: [0, 32],
    size: '3-4mm diameter',
    emoji: '🥚',
    description: 'Fertilized trout eggs are orange and translucent. The developing embryo is visible inside. As development progresses, two dark spots (eyes) become visible - these are called "eyed eggs."',
    keyFeatures: [
      'Orange color',
      'Pea-sized (3-4mm)',
      'Translucent shell',
      'Developing embryo visible',
      'Eyes appear around day 21 (eyed eggs)',
      'Attached to gravel in nature'
    ],
    careRequirements: {
      temperature: '48-52°F (optimal 50°F)',
      feeding: 'No feeding - embryo absorbs yolk nutrients',
      maintenance: 'Keep in egg basket with gentle water flow. Remove dead eggs (white/opaque) daily.',
      monitoring: 'Check daily for fungus (white fuzz). Count eggs. Note eye development.'
    },
    whatToExpect: [
      'Days 1-7: Newly fertilized, very fragile',
      'Days 8-14: Cell division visible under magnification',
      'Days 15-21: Eyes begin to appear as dark spots',
      'Days 22-28: "Eyed eggs" - embryo clearly visible',
      'Days 29-32: Eggs begin to hatch'
    ],
    commonIssues: [
      'White/opaque eggs = dead (remove immediately)',
      'Fungus (Saprolegnia) on eggs - maintain salt treatment',
      'Premature hatching - check temperature',
      'Delayed hatching - may need cooler water'
    ],
    scientificFacts: [
      'Eggs require cold, well-oxygenated water',
      'Temperature controls development speed',
      'Each female trout produces 200-4000 eggs',
      'Only 10-30% survive to adulthood in wild',
      'Eggs are heavier than water and settle'
    ]
  },
  {
    id: 'alevin',
    name: 'Alevin (Sac Fry)',
    duration: '30-40 days',
    daysRange: [32, 72],
    size: '15-20mm long',
    emoji: '🐛',
    description: 'Newly hatched trout with a large, orange yolk sac attached to their belly. Alevins hide in gravel and absorb nutrients from their yolk sac. They do not feed externally.',
    keyFeatures: [
      'Large orange yolk sac attached to belly',
      'Transparent body',
      'Eyes clearly visible',
      'Mostly motionless',
      'Hide in bottom of tank or basket',
      'Gradual yolk absorption'
    ],
    careRequirements: {
      temperature: '48-52°F',
      feeding: 'NO FEEDING! They absorb yolk sac nutrients',
      maintenance: 'Gentle water flow. Dim lighting. Minimal disturbance.',
      monitoring: 'Observe yolk sac size daily. Note when sacs are nearly absorbed. Check for abnormalities.'
    },
    whatToExpect: [
      'Days 1-10: Large yolk sac, minimal movement',
      'Days 11-20: Yolk sac shrinking, more active swimming',
      'Days 21-30: Yolk almost gone, preparing for "swim-up"',
      'Days 31-40: Swim-up stage - rise to surface for first feeding'
    ],
    commonIssues: [
      'Blue sac disease (environmental stress)',
      'Premature swim-up (may not be ready to feed)',
      'Yolk sac deformities (poor egg quality)',
      'Fungal infections'
    ],
    scientificFacts: [
      'Yolk sac provides complete nutrition for 30-40 days',
      'Alevins have instinct to hide in gravel (predator avoidance)',
      'Development speed depends on water temperature',
      'This stage is called "sac fry" in some regions',
      'Alevins can survive 2-3 weeks in dark conditions'
    ]
  },
  {
    id: 'fry',
    name: 'Fry (Swim-up Stage)',
    duration: '60-90 days',
    daysRange: [72, 162],
    size: '20-50mm long',
    emoji: '🐟',
    description: 'Yolk sac is fully absorbed and fry begin swimming up to the surface. This is the "swim-up" stage when they start feeding on external food. They develop parr marks (dark vertical bars) on their sides.',
    keyFeatures: [
      'Yolk sac fully absorbed',
      'Active swimmers',
      'Parr marks appearing (dark vertical bars)',
      'Schools together',
      'Constantly feeding',
      'Rapid growth begins'
    ],
    careRequirements: {
      temperature: '50-55°F',
      feeding: 'START FEEDING! Very fine powder food 4-5x daily. Only what they can eat in 2-3 minutes.',
      maintenance: 'Clean uneaten food daily. Begin regular water changes (10-20% weekly).',
      monitoring: 'Count fry. Measure growth weekly. Watch for feeding response. Check water quality daily.'
    },
    whatToExpect: [
      'Days 1-15: Learning to feed, high mortality possible',
      'Days 16-30: Feeding established, rapid growth',
      'Days 31-60: Clear parr marks, schooling behavior',
      'Days 61-90: Growth slows, preparing for next stage'
    ],
    commonIssues: [
      'Not eating - ensure food is fine enough',
      'Overfeeding - causes ammonia spike',
      'Aggressive behavior - ensure adequate food',
      'Fungal infections on weakened fry',
      'High mortality if water quality poor'
    ],
    scientificFacts: [
      'Critical stage - highest mortality in wild (90%+)',
      'Fry imprint on their natal stream chemistry',
      'They can detect one drop of food in 10,000 gallons',
      'Parr marks provide camouflage (break up outline)',
      'Growth rate highly temperature-dependent'
    ]
  },
  {
    id: 'parr',
    name: 'Parr (Juvenile)',
    duration: '3-6 months',
    daysRange: [162, 342],
    size: '50-100mm long',
    emoji: '🐠',
    description: 'Actively growing juveniles with pronounced parr marks. They begin to develop adult coloration and behaviors. Ready for outdoor release in appropriate PA streams.',
    keyFeatures: [
      'Pronounced parr marks (dark vertical bars)',
      'Adult fin structure',
      'Species coloration emerging',
      'Territorial behavior',
      'Strong swimmers',
      'Alert and responsive'
    ],
    careRequirements: {
      temperature: '50-58°F',
      feeding: 'Feed 2-3x daily with appropriately sized pellets. Adjust food size as they grow.',
      maintenance: 'Weekly 20-30% water changes. Clean tank substrate. Monitor equipment.',
      monitoring: 'Measure length weekly. Observe behavior. Plan release when 2-4 inches long.'
    },
    whatToExpect: [
      'Months 1-2: Rapid growth, active feeding',
      'Months 3-4: Adult coloration appears',
      'Months 5-6: Release size (2-4 inches)',
      'Behavioral development: territoriality, predator avoidance'
    ],
    commonIssues: [
      'Aggression - ensure adequate space and food',
      'Fin nipping - reduce crowding',
      'Disease outbreaks if stressed',
      'Jumping - secure tank cover'
    ],
    scientificFacts: [
      'Parr marks gradually fade as they mature',
      'In wild, parr spend 1-3 years in streams before migrating',
      'They establish territories 6-10x their body length',
      'Can learn to avoid predators through experience',
      'Growth highly dependent on food availability'
    ]
  },
  {
    id: 'adult',
    name: 'Adult Trout',
    duration: 'Multiple years',
    daysRange: [365, 1825],
    size: '200-500mm+ long',
    emoji: '🎣',
    description: 'Sexually mature adult trout. In PA streams, stocked trout provide recreation and some natural reproduction. Wild native brook trout populations are conservation priorities.',
    keyFeatures: [
      'Full adult coloration',
      'Species-specific markings',
      'Sexual dimorphism (males/females differ)',
      'Powerful swimmers',
      'Fully developed predatory behavior',
      'Ready to spawn'
    ],
    careRequirements: {
      temperature: 'Brook: <65°F, Brown: <70°F, Rainbow: <70°F',
      feeding: 'Aquatic insects, small fish, crustaceans in wild',
      maintenance: 'Cold, clean, well-oxygenated streams with gravel substrate',
      monitoring: 'Stream temperature, dissolved oxygen, habitat quality'
    },
    whatToExpect: [
      'Year 1: Reach maturity (some species)',
      'Years 2-3: Prime spawning age',
      'Years 4-7: Continued growth and spawning',
      'Lifespan: Brook 5-7 years, Brown 8-10 years, Rainbow 6-8 years (PA streams)'
    ],
    commonIssues: [
      'Temperature stress in summer',
      'Low oxygen during hot weather',
      'Predation (birds, otters, larger fish)',
      'Competition with other species',
      'Habitat degradation'
    ],
    scientificFacts: [
      'Brook trout: PA state fish, only native species',
      'Spawn in fall (Oct-Dec) in gravel beds',
      'Can live 5-10+ years in ideal conditions',
      'Growth continues throughout life',
      'Keystone species in coldwater ecosystems'
    ]
  }
];

export function VirtualTroutLifeCycle() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [viewMode, setViewMode] = useState<'overview' | 'detail'>('overview');

  const currentStage = LIFE_STAGES[currentStageIndex];
  const progress = ((currentStageIndex + 1) / LIFE_STAGES.length) * 100;

  const nextStage = () => {
    if (currentStageIndex < LIFE_STAGES.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
    }
  };

  const prevStage = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(prev => prev - 1);
    }
  };

  const resetTour = () => {
    setCurrentStageIndex(0);
    setAutoPlay(false);
  };

  React.useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        if (currentStageIndex < LIFE_STAGES.length - 1) {
          setCurrentStageIndex(prev => prev + 1);
        } else {
          setAutoPlay(false);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, currentStageIndex]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Eye className="w-8 h-8 text-blue-500" />
          Virtual Trout Life Cycle
        </h2>
        <p className="text-gray-600 mt-1">
          Interactive journey through trout development from egg to adult
        </p>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Stage {currentStageIndex + 1} of {LIFE_STAGES.length}
            </span>
            <span className="text-sm text-gray-600">
              Day {currentStage.daysRange[0]}-{currentStage.daysRange[1]}
            </span>
          </div>
          <Progress value={progress} className="h-3 mb-4" />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStage}
                disabled={currentStageIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoPlay(!autoPlay)}
              >
                {autoPlay ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {autoPlay ? 'Pause' : 'Auto-Play'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextStage}
                disabled={currentStageIndex === LIFE_STAGES.length - 1}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetTour}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Stage Display */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{currentStage.emoji}</div>
              <div>
                <CardTitle className="text-2xl">{currentStage.name}</CardTitle>
                <CardDescription className="text-lg mt-1">
                  {currentStage.duration} • {currentStage.size}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'overview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('overview')}
              >
                Overview
              </Button>
              <Button
                variant={viewMode === 'detail' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('detail')}
              >
                Details
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {viewMode === 'overview' ? (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{currentStage.description}</p>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentStage.keyFeatures.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                      <span className="text-blue-500">✓</span>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Care Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">🌡️ Temperature</h4>
                  <p className="text-sm text-gray-700">{currentStage.careRequirements.temperature}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">🍽️ Feeding</h4>
                  <p className="text-sm text-gray-700">{currentStage.careRequirements.feeding}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">🔧 Maintenance</h4>
                  <p className="text-sm text-gray-700">{currentStage.careRequirements.maintenance}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">👁️ Monitoring</h4>
                  <p className="text-sm text-gray-700">{currentStage.careRequirements.monitoring}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* What to Expect */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What to Expect</h3>
                <div className="space-y-2">
                  {currentStage.whatToExpect.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-green-50 rounded">
                      <span className="text-green-600 font-bold">{i + 1}.</span>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Issues */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Common Issues & Solutions</h3>
                <div className="space-y-2">
                  {currentStage.commonIssues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-yellow-50 rounded border border-yellow-200">
                      <span className="text-yellow-600">⚠️</span>
                      <span className="text-sm text-gray-700">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scientific Facts */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Scientific Facts</h3>
                <div className="space-y-2">
                  {currentStage.scientificFacts.map((fact, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-purple-50 rounded">
                      <span className="text-purple-600">🔬</span>
                      <span className="text-sm text-gray-700">{fact}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Life Cycle Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {LIFE_STAGES.map((stage, index) => (
              <button
                key={stage.id}
                onClick={() => setCurrentStageIndex(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  index === currentStageIndex
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{stage.emoji}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{stage.name}</div>
                    <div className="text-sm text-gray-600">
                      Day {stage.daysRange[0]}-{stage.daysRange[1]} • {stage.duration}
                    </div>
                  </div>
                  {index === currentStageIndex && (
                    <Badge>Current</Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Educational Notes */}
      <Card className="border-2 border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Teacher Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-purple-900">
            <p>
              <strong>PA Academic Standards:</strong> This interactive life cycle aligns with 3.1.4.A4 
              (changes in environment affect organisms) and 4.6.4.B (adaptation and survival).
            </p>
            <p>
              <strong>Classroom Use:</strong> Students can track their own trout's development alongside 
              this virtual tour, making observations and predictions.
            </p>
            <p>
              <strong>Assessment Ideas:</strong> Have students create their own life cycle diagrams, 
              compare development rates at different temperatures, or research differences between brook, 
              brown, and rainbow trout life cycles.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

