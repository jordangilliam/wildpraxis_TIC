// Crisis Management Scenarios
// Timed emergency response training for TIC programs

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';
import { AlertTriangle, Clock, CheckCircle, XCircle, Award, RotateCcw, Play } from 'lucide-react';

interface Crisis {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  situation: string;
  data: {
    temperature?: number;
    ammonia?: number;
    nitrite?: number;
    pH?: number;
    dissolvedOxygen?: number;
    timeOfDay?: string;
    dayOfWeek?: string;
    observations?: string[];
  };
  immediateActions: {
    id: string;
    action: string;
    isCorrect: boolean;
    explanation: string;
    points: number;
  }[];
  followUpActions: {
    id: string;
    action: string;
    isCorrect: boolean;
    explanation: string;
    points: number;
  }[];
  preventionTips: string[];
  timeLimit: number; // seconds
}

const CRISIS_SCENARIOS: Crisis[] = [
  {
    id: 'ammonia-spike',
    title: 'Ammonia Emergency',
    severity: 'high',
    situation: 'Monday morning, you test the water and find ammonia is 2.0 ppm (should be 0 ppm). The trout are gasping at the surface. Temperature is normal at 52°F.',
    data: {
      temperature: 52,
      ammonia: 2.0,
      nitrite: 0,
      pH: 7.2,
      dissolvedOxygen: 8.5,
      timeOfDay: 'Morning',
      dayOfWeek: 'Monday',
      observations: [
        'Trout gasping at surface',
        'Some lethargy',
        'Normal temperature',
        'Filter running normally'
      ]
    },
    immediateActions: [
      {
        id: 'water-change',
        action: 'Perform 50% water change immediately',
        isCorrect: true,
        explanation: 'Correct! A large (50%+) water change is the fastest way to dilute ammonia. This is an emergency.',
        points: 30
      },
      {
        id: 'add-chemical',
        action: 'Add ammonia-removing chemical',
        isCorrect: false,
        explanation: 'Not ideal. Chemicals can help but water change is faster and more reliable. Use chemicals only as backup.',
        points: 0
      },
      {
        id: 'stop-feeding',
        action: 'Stop feeding for 24-48 hours',
        isCorrect: true,
        explanation: 'Correct! Feeding produces more waste/ammonia. Skip meals until ammonia is back to 0 ppm.',
        points: 20
      },
      {
        id: 'increase-filtration',
        action: 'Add extra filter',
        isCorrect: false,
        explanation: 'Won\'t help immediately. Beneficial bacteria take weeks to establish. Water change is needed now.',
        points: 0
      }
    ],
    followUpActions: [
      {
        id: 'test-daily',
        action: 'Test ammonia daily until back to 0 ppm',
        isCorrect: true,
        explanation: 'Correct! Monitor closely to ensure the problem is resolved.',
        points: 15
      },
      {
        id: 'check-filter',
        action: 'Check filter - is it clogged or not running properly?',
        isCorrect: true,
        explanation: 'Correct! A malfunctioning filter is a common cause of ammonia spikes.',
        points: 15
      },
      {
        id: 'remove-dead-fish',
        action: 'Look for and remove any dead trout',
        isCorrect: true,
        explanation: 'Correct! Decomposing fish produce massive amounts of ammonia.',
        points: 10
      },
      {
        id: 'call-pfbc',
        action: 'Contact PFBC liaison if problem persists',
        isCorrect: true,
        explanation: 'Correct! If ammonia stays high, get expert help immediately.',
        points: 10
      }
    ],
    preventionTips: [
      'Never overfeed - only what trout can eat in 2-3 minutes',
      'Clean filter regularly (check manufacturer recommendations)',
      'Remove dead fish immediately',
      'Don\'t overcrowd tank - follow stocking density guidelines',
      'Test water 2-3 times per week',
      'Perform regular water changes (20-30% weekly)'
    ],
    timeLimit: 180
  },
  {
    id: 'chiller-failure',
    title: 'Chiller Failure',
    severity: 'high',
    situation: 'Friday afternoon, the chiller has stopped working. Water temperature has risen from 50°F to 62°F and is still climbing. You won\'t be back until Monday morning.',
    data: {
      temperature: 62,
      ammonia: 0,
      nitrite: 0,
      pH: 7.4,
      dissolvedOxygen: 7.2,
      timeOfDay: 'Friday 3pm',
      dayOfWeek: 'Friday',
      observations: [
        'Chiller not running',
        'Temperature rising',
        'Trout becoming stressed',
        'It\'s a warm spring day'
      ]
    },
    immediateActions: [
      {
        id: 'check-power',
        action: 'Check if chiller is plugged in and breaker hasn\'t tripped',
        isCorrect: true,
        explanation: 'Correct! Always check simple things first. A tripped breaker is an easy fix.',
        points: 20
      },
      {
        id: 'add-ice',
        action: 'Add ice in sealed plastic bags to tank',
        isCorrect: true,
        explanation: 'Correct! This is emergency cooling. Float ice in sealed bags (don\'t add ice directly to water).',
        points: 30
      },
      {
        id: 'reduce-lights',
        action: 'Turn off tank lights',
        isCorrect: true,
        explanation: 'Correct! Lights generate heat. Turn them off to slow warming.',
        points: 15
      },
      {
        id: 'increase-aeration',
        action: 'Increase aeration',
        isCorrect: true,
        explanation: 'Correct! Warmer water holds less oxygen. More aeration helps trout breathe.',
        points: 15
      }
    ],
    followUpActions: [
      {
        id: 'call-repair',
        action: 'Call chiller repair service immediately',
        isCorrect: true,
        explanation: 'Correct! You need professional repair ASAP. Have emergency contact ready.',
        points: 20
      },
      {
        id: 'arrange-access',
        action: 'Arrange for someone to add ice throughout weekend',
        isCorrect: true,
        explanation: 'Correct! You can\'t leave trout at high temp for 3 days. Need help.',
        points: 20
      },
      {
        id: 'reduce-feeding',
        action: 'Reduce or skip feeding while temperature is high',
        isCorrect: true,
        explanation: 'Correct! Stressed trout in warm water need less food. Reduces oxygen demand.',
        points: 10
      },
      {
        id: 'backup-plan',
        action: 'Consider emergency transfer to cooler location',
        isCorrect: true,
        explanation: 'Correct! If repair will take days, may need to move trout. Have backup plan.',
        points: 10
      }
    ],
    preventionTips: [
      'Clean chiller coils monthly (dust reduces efficiency)',
      'Have backup aerator (battery powered) on hand',
      'Know your emergency repair contact',
      'Have ice available in school freezer',
      'Test chiller regularly',
      'Have weekend/holiday contact person'
    ],
    timeLimit: 120
  },
  {
    id: 'power-outage',
    title: 'Power Outage',
    severity: 'high',
    situation: 'A severe storm has caused a power outage. Your chiller, filter, and aerator are all off. It\'s been 30 minutes and power company says it could be 4-6 hours.',
    data: {
      temperature: 50,
      timeOfDay: 'Afternoon',
      observations: [
        'No power to any equipment',
        'Storm still ongoing',
        'Temperature OK for now',
        'Trout showing some stress'
      ]
    },
    immediateActions: [
      {
        id: 'battery-aerator',
        action: 'Use battery-powered backup aerator',
        isCorrect: true,
        explanation: 'Correct! Oxygen is most critical. Battery backup saves lives.',
        points: 40
      },
      {
        id: 'manual-aeration',
        action: 'Manually aerate by stirring water or pouring',
        isCorrect: true,
        explanation: 'Correct! If no battery backup, manual aeration helps. Not ideal but works short-term.',
        points: 30
      },
      {
        id: 'reduce-feeding',
        action: 'Skip feeding during outage',
        isCorrect: true,
        explanation: 'Correct! No food = less waste = less oxygen demand.',
        points: 15
      },
      {
        id: 'add-ice',
        action: 'Add ice to keep cool',
        isCorrect: false,
        explanation: 'Not urgent yet. Temperature is OK. Focus on oxygen first.',
        points: 0
      }
    ],
    followUpActions: [
      {
        id: 'monitor-temp',
        action: 'Monitor temperature - add ice if it rises above 58°F',
        isCorrect: true,
        explanation: 'Correct! Watch temp closely. Chillers also lost power.',
        points: 15
      },
      {
        id: 'water-change',
        action: 'If outage exceeds 4 hours, do water change',
        isCorrect: true,
        explanation: 'Correct! Fresh water replenishes oxygen and removes waste.',
        points: 15
      },
      {
        id: 'test-after',
        action: 'Test water quality when power returns',
        isCorrect: true,
        explanation: 'Correct! Filter was off - may have ammonia/nitrite buildup.',
        points: 10
      },
      {
        id: 'check-equipment',
        action: 'Verify all equipment restarts properly',
        isCorrect: true,
        explanation: 'Correct! Power surges can damage equipment. Test everything.',
        points: 10
      }
    ],
    preventionTips: [
      'ALWAYS have battery-powered backup aerator',
      'Keep extra batteries charged',
      'Have ice available',
      'Know your power company emergency number',
      'Practice using backup equipment',
      'Have emergency contact list'
    ],
    timeLimit: 90
  }
];

export function CrisisScenarios() {
  const [selectedCrisis, setSelectedCrisis] = useState<Crisis | null>(null);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [score, setScore] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);

  useEffect(() => {
    if (selectedCrisis && timeRemaining > 0 && !submitted) {
      const timer = setTimeout(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && selectedCrisis && !submitted) {
      handleSubmit();
    }
  }, [timeRemaining, selectedCrisis, submitted]);

  const startCrisis = (crisis: Crisis) => {
    setSelectedCrisis(crisis);
    setSelectedActions([]);
    setSubmitted(false);
    setTimeRemaining(crisis.timeLimit);
    setScore(0);
  };

  const toggleAction = (actionId: string) => {
    if (submitted) return;
    setSelectedActions(prev =>
      prev.includes(actionId)
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  const handleSubmit = () => {
    if (!selectedCrisis) return;

    let totalScore = 0;
    const allActions = [...selectedCrisis.immediateActions, ...selectedCrisis.followUpActions];
    
    selectedActions.forEach(actionId => {
      const action = allActions.find(a => a.id === actionId);
      if (action?.isCorrect) {
        totalScore += action.points;
      }
    });

    // Bonus for speed (if finished with time remaining)
    if (timeRemaining > 0) {
      const timeBonus = Math.floor((timeRemaining / selectedCrisis.timeLimit) * 20);
      totalScore += timeBonus;
    }

    setScore(totalScore);
    setSubmitted(true);

    // If passed (70%+), mark as completed
    const maxScore = allActions
      .filter(a => a.isCorrect)
      .reduce((sum, a) => sum + a.points, 0) + 20;
    if (totalScore >= maxScore * 0.7) {
      setCompletedScenarios(prev => [...new Set([...prev, selectedCrisis.id])]);
    }
  };

  const resetScenario = () => {
    setSelectedCrisis(null);
    setSelectedActions([]);
    setSubmitted(false);
    setTimeRemaining(0);
    setScore(0);
  };

  if (!selectedCrisis) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            Crisis Management Scenarios
          </h2>
          <p className="text-gray-600 mt-1">
            Practice responding to TIC emergencies with timed scenarios
          </p>
        </div>

        {/* Scenario Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CRISIS_SCENARIOS.map(crisis => {
            const isCompleted = completedScenarios.includes(crisis.id);
            
            return (
              <Card
                key={crisis.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  crisis.severity === 'high' ? 'border-red-200' :
                  crisis.severity === 'medium' ? 'border-yellow-200' : 'border-blue-200'
                }`}
                onClick={() => startCrisis(crisis)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{crisis.title}</CardTitle>
                    {isCompleted && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      crisis.severity === 'high' ? 'destructive' :
                      crisis.severity === 'medium' ? 'secondary' : 'default'
                    }>
                      {crisis.severity.toUpperCase()} SEVERITY
                    </Badge>
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      {crisis.timeLimit}s
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 line-clamp-3">{crisis.situation}</p>
                  <div className="mt-4">
                    <Button className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Start Scenario
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Play</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Read the emergency situation carefully</li>
              <li>Review the current tank data and observations</li>
              <li>Select ALL appropriate actions (both immediate and follow-up)</li>
              <li>Submit before time runs out!</li>
              <li>Learn from explanations and prevention tips</li>
            </ol>
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Remember:</strong> In real emergencies, always contact your PFBC liaison if uncertain. 
                These scenarios are for practice!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active Scenario View
  return (
    <div className="space-y-6">
      {/* Header with Timer */}
      <Card className={`border-2 ${
        timeRemaining < 30 ? 'border-red-500 bg-red-50' :
        timeRemaining < 60 ? 'border-yellow-500 bg-yellow-50' : 'border-blue-500'
      }`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedCrisis.title}</h2>
              <Badge variant={
                selectedCrisis.severity === 'high' ? 'destructive' :
                selectedCrisis.severity === 'medium' ? 'secondary' : 'default'
              }>
                {selectedCrisis.severity.toUpperCase()} SEVERITY
              </Badge>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${
                timeRemaining < 30 ? 'text-red-600 animate-pulse' :
                timeRemaining < 60 ? 'text-yellow-600' : 'text-blue-600'
              }`}>
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-600">Time Remaining</div>
            </div>
          </div>
          <Progress 
            value={(timeRemaining / selectedCrisis.timeLimit) * 100} 
            className="mt-4 h-2"
          />
        </CardContent>
      </Card>

      {/* Situation */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Situation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-800 text-lg mb-4">{selectedCrisis.situation}</p>
          
          {/* Tank Data */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {Object.entries(selectedCrisis.data).filter(([key]) => 
              !['timeOfDay', 'dayOfWeek', 'observations'].includes(key)
            ).map(([key, value]) => (
              <div key={key} className="p-3 bg-gray-50 rounded border">
                <div className="text-xs text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                <div className="text-xl font-bold text-gray-900">{value}</div>
              </div>
            ))}
          </div>

          {/* Observations */}
          {selectedCrisis.data.observations && (
            <div>
              <h4 className="font-semibold mb-2">Observations:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {selectedCrisis.data.observations.map((obs, i) => (
                  <li key={i}>{obs}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      {!submitted && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Immediate Actions (Select ALL that apply)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedCrisis.immediateActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => toggleAction(action.id)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedActions.includes(action.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        selectedActions.includes(action.id)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedActions.includes(action.id) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-gray-800">{action.action}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Follow-Up Actions (Select ALL that apply)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedCrisis.followUpActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => toggleAction(action.id)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedActions.includes(action.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        selectedActions.includes(action.id)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedActions.includes(action.id) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-gray-800">{action.action}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={handleSubmit} size="lg" className="flex-1">
              Submit Response
            </Button>
            <Button onClick={resetScenario} variant="outline" size="lg">
              Cancel
            </Button>
          </div>
        </>
      )}

      {/* Results */}
      {submitted && (
        <>
          <Card className="border-2 border-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Scenario Complete!</CardTitle>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{score} points</div>
                  {score >= 70 && <Badge variant="default"><Award className="w-3 h-3 mr-1" />Passed</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={score} className="h-3 mb-4" />
              <p className="text-gray-700">
                {score >= 90 ? 'Excellent! You handled this crisis expertly.' :
                 score >= 70 ? 'Good job! You made the right critical decisions.' :
                 'Keep learning! Review the explanations below.'}
              </p>
            </CardContent>
          </Card>

          {/* Action Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Action Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...selectedCrisis.immediateActions, ...selectedCrisis.followUpActions].map(action => {
                  const wasSelected = selectedActions.includes(action.id);
                  const shouldBeSelected = action.isCorrect;
                  const isCorrect = wasSelected === shouldBeSelected;

                  return (
                    <div
                      key={action.id}
                      className={`p-4 rounded-lg border-2 ${
                        isCorrect && wasSelected ? 'border-green-500 bg-green-50' :
                        !isCorrect && wasSelected ? 'border-red-500 bg-red-50' :
                        !isCorrect && !wasSelected ? 'border-yellow-500 bg-yellow-50' :
                        'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        {isCorrect && wasSelected ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{action.action}</div>
                          <div className="text-sm text-gray-700 mt-1">{action.explanation}</div>
                          {action.isCorrect && <div className="text-sm font-semibold text-gray-600 mt-1">+{action.points} points</div>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Prevention Tips */}
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle>Prevention Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-purple-900">
                {selectedCrisis.preventionTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={resetScenario} size="lg" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Another Scenario
            </Button>
            <Button onClick={() => startCrisis(selectedCrisis)} variant="outline" size="lg">
              Retry This Scenario
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

