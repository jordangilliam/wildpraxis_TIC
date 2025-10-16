// Interactive Learning Modules
// "What If" scenarios, data interpretation exercises, graph reading, statistical calculations

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card';
import { Button } from './button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Badge } from './badge';
import { Progress } from './progress';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Brain, TrendingUp, Calculator, BookOpen, Award, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  description: string;
  category: 'climate' | 'pollution' | 'habitat' | 'invasive';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  scenario: string;
  data: any[];
  questions: {
    id: string;
    question: string;
    type: 'multiple-choice' | 'numeric' | 'short-answer';
    options?: string[];
    correctAnswer: string | number;
    explanation: string;
    points: number;
  }[];
}

interface Exercise {
  id: string;
  title: string;
  type: 'graph-interpretation' | 'statistics' | 'prediction';
  data: any[];
  question: string;
  answer: string | number;
  hints: string[];
  explanation: string;
}

const CLIMATE_SCENARIOS: Scenario[] = [
  {
    id: 'warming-streams',
    title: 'Warming Streams Impact',
    description: 'Analyze how rising water temperatures affect trout habitat',
    category: 'climate',
    difficulty: 'intermediate',
    scenario: 'Spring Creek has been monitored for 20 years. Recent data shows an average temperature increase of 0.15°F per year. The creek currently averages 58°F in summer.',
    data: Array.from({ length: 20 }, (_, i) => ({
      year: 2005 + i,
      temp: 55 + (i * 0.15) + (Math.random() * 2 - 1) // Starting at 55°F with 0.15°F/year trend
    })),
    questions: [
      {
        id: 'q1',
        question: 'If this warming trend continues, what will the average summer temperature be in 10 years?',
        type: 'numeric',
        correctAnswer: 59.5,
        explanation: 'Current temp (58°F) + (0.15°F/year × 10 years) = 59.5°F',
        points: 10
      },
      {
        id: 'q2',
        question: 'At what year will the stream exceed the critical 65°F threshold for brook trout?',
        type: 'multiple-choice',
        options: ['2032', '2035', '2038', '2042'],
        correctAnswer: '2038',
        explanation: 'Need to increase 7°F (65-58). At 0.15°F/year, that takes ~47 years from now.',
        points: 15
      },
      {
        id: 'q3',
        question: 'What percentage of suitable habitat days will be lost if temperature increases 5°F?',
        type: 'multiple-choice',
        options: ['10-20%', '30-40%', '50-60%', '70-80%'],
        correctAnswer: '50-60%',
        explanation: 'A 5°F increase pushes many days from "good" (55-65°F) into "marginal" or "poor" ranges, typically reducing suitable habitat by over half.',
        points: 15
      }
    ]
  },
  {
    id: 'stormwater-runoff',
    title: 'Urban Stormwater Impact',
    description: 'Evaluate how development affects stream temperature',
    category: 'pollution',
    difficulty: 'beginner',
    scenario: 'A new housing development will increase impervious surfaces in the watershed from 15% to 35%. Studies show each 10% increase in impervious surfaces raises summer stream temperatures by 2-3°F.',
    data: [
      { imperviousPercent: 10, avgTemp: 54 },
      { imperviousPercent: 20, avgTemp: 57 },
      { imperviousPercent: 30, avgTemp: 60 },
      { imperviousPercent: 40, avgTemp: 63 },
      { imperviousPercent: 50, avgTemp: 67 }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What temperature increase can be expected from the development?',
        type: 'multiple-choice',
        options: ['1-2°F', '3-5°F', '6-8°F', '9-11°F'],
        correctAnswer: '3-5°F',
        explanation: 'A 20% increase in impervious surfaces (35% - 15%) × (2-3°F per 10%) = 4-6°F increase',
        points: 10
      },
      {
        id: 'q2',
        question: 'If the stream is currently 56°F, will it still be suitable for brook trout after development?',
        type: 'multiple-choice',
        options: ['Yes, excellent habitat', 'Yes, but marginal', 'No, too warm', 'Depends on season'],
        correctAnswer: 'Yes, but marginal',
        explanation: '56°F + 4-6°F = 60-62°F, which is in the "good" range (55-65°F) but approaching marginal',
        points: 10
      }
    ]
  },
  {
    id: 'riparian-buffer',
    title: 'Riparian Buffer Restoration',
    description: 'Calculate the cooling effect of tree planting',
    category: 'habitat',
    difficulty: 'advanced',
    scenario: 'A stream section receives full sun for 0.5 miles, raising water temperature by 8°F through that stretch. A restoration project will plant native trees to provide 75% canopy cover.',
    data: [
      { canopyPercent: 0, tempIncrease: 8 },
      { canopyPercent: 25, tempIncrease: 6 },
      { canopyPercent: 50, tempIncrease: 3.5 },
      { canopyPercent: 75, tempIncrease: 1.5 },
      { canopyPercent: 100, tempIncrease: 0.5 }
    ],
    questions: [
      {
        id: 'q1',
        question: 'How much will 75% canopy cover reduce the temperature increase?',
        type: 'numeric',
        correctAnswer: 6.5,
        explanation: '8°F - 1.5°F = 6.5°F reduction. Trees shade the stream, dramatically reducing solar heating.',
        points: 15
      },
      {
        id: 'q2',
        question: 'If water enters this section at 54°F, what will the exit temperature be after restoration?',
        type: 'numeric',
        correctAnswer: 55.5,
        explanation: '54°F + 1.5°F = 55.5°F (vs 62°F without restoration)',
        points: 10
      }
    ]
  }
];

const GRAPH_EXERCISES: Exercise[] = [
  {
    id: 'trend-analysis',
    title: 'Identify Temperature Trends',
    type: 'graph-interpretation',
    data: Array.from({ length: 365 }, (_, i) => ({
      day: i + 1,
      temp: 45 + 15 * Math.sin((i / 365) * 2 * Math.PI) + (Math.random() * 3 - 1.5)
    })),
    question: 'What is the approximate range of temperatures (difference between highest and lowest)?',
    answer: 30,
    hints: [
      'Look at the highest point on the graph',
      'Look at the lowest point on the graph',
      'Subtract the lowest from the highest'
    ],
    explanation: 'The temperature ranges from approximately 30°F to 60°F, a range of 30°F. This is typical seasonal variation in PA streams.'
  },
  {
    id: 'statistics-calc',
    title: 'Calculate Stream Statistics',
    type: 'statistics',
    data: [52, 54, 55, 53, 56, 54, 52, 55, 54, 53],
    question: 'What is the mean (average) water temperature from these 10 readings?',
    answer: 53.8,
    hints: [
      'Add all the values together',
      'Divide by the number of readings (10)',
      'Round to one decimal place'
    ],
    explanation: '(52+54+55+53+56+54+52+55+54+53) ÷ 10 = 538 ÷ 10 = 53.8°F'
  }
];

export function InteractiveLearning() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);

  const handleAnswerChange = (questionId: string, value: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (!selectedScenario) return;

    let totalScore = 0;
    let possiblePoints = 0;

    selectedScenario.questions.forEach(q => {
      possiblePoints += q.points;
      const userAnswer = answers[q.id];
      
      if (q.type === 'numeric') {
        const numAnswer = typeof userAnswer === 'number' ? userAnswer : parseFloat(userAnswer as string);
        const correct = typeof q.correctAnswer === 'number' ? q.correctAnswer : parseFloat(q.correctAnswer as string);
        if (Math.abs(numAnswer - correct) < 0.5) {
          totalScore += q.points;
        }
      } else {
        if (userAnswer === q.correctAnswer) {
          totalScore += q.points;
        }
      }
    });

    setScore(totalScore);
    setSubmitted(true);

    if (totalScore >= possiblePoints * 0.7) {
      setCompletedScenarios(prev => [...new Set([...prev, selectedScenario.id])]);
    }
  };

  const resetScenario = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setSelectedScenario(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-8 h-8" />
            Interactive Learning Modules
          </h2>
          <p className="text-gray-600 mt-1">
            "What If" scenarios, data interpretation, and scientific analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            <Award className="w-3 h-3 mr-1" />
            {completedScenarios.length} Completed
          </Badge>
        </div>
      </div>

      {!selectedScenario ? (
        /* Scenario Selection */
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Climate Change & Conservation Scenarios</CardTitle>
              <CardDescription>
                Analyze real-world conservation challenges using scientific data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CLIMATE_SCENARIOS.map((scenario) => {
                  const isCompleted = completedScenarios.includes(scenario.id);
                  
                  return (
                    <div
                      key={scenario.id}
                      className="p-4 border-2 rounded-lg hover:border-blue-300 cursor-pointer transition-all"
                      onClick={() => setSelectedScenario(scenario)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{scenario.title}</h3>
                        {isCompleted && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          scenario.difficulty === 'beginner' ? 'default' :
                          scenario.difficulty === 'intermediate' ? 'secondary' : 'outline'
                        }>
                          {scenario.difficulty}
                        </Badge>
                        <Badge variant="secondary">
                          {scenario.questions.length} questions
                        </Badge>
                        <Badge variant="secondary">
                          {scenario.questions.reduce((sum, q) => sum + q.points, 0)} pts
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Interpretation Exercises</CardTitle>
              <CardDescription>
                Practice reading graphs and calculating statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {GRAPH_EXERCISES.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="p-4 border rounded-lg hover:border-blue-300 cursor-pointer"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{exercise.title}</h3>
                    <p className="text-sm text-gray-600">{exercise.type.replace('-', ' ')}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Selected Scenario */
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedScenario.title}</CardTitle>
                  <CardDescription>{selectedScenario.description}</CardDescription>
                </div>
                <Button variant="outline" onClick={resetScenario}>
                  Back to Scenarios
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Scenario Description */}
              <div className="p-4 bg-blue-50 rounded-lg mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">Scenario:</h3>
                <p className="text-blue-800">{selectedScenario.scenario}</p>
              </div>

              {/* Data Visualization */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Data Visualization:</h3>
                <ResponsiveContainer width="100%" height={300}>
                  {selectedScenario.id === 'warming-streams' ? (
                    <LineChart data={selectedScenario.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis label={{ value: 'Temperature (°F)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="temp" stroke="#ef4444" name="Summer Avg Temp" />
                      <ReferenceLine y={55} stroke="#10b981" strokeDasharray="3 3" label="Ideal" />
                      <ReferenceLine y={65} stroke="#f59e0b" strokeDasharray="3 3" label="Marginal" />
                      <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label="Critical" />
                    </LineChart>
                  ) : (
                    <BarChart data={selectedScenario.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={Object.keys(selectedScenario.data[0] || {})[0]} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey={Object.keys(selectedScenario.data[0] || {})[1]} fill="#3b82f6" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {selectedScenario.questions.map((question, index) => (
                  <div key={question.id} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                        <p className="text-sm text-gray-500 mb-3">{question.points} points</p>

                        {/* Answer Input */}
                        {question.type === 'multiple-choice' && (
                          <div className="space-y-2">
                            {question.options?.map((option) => (
                              <label
                                key={option}
                                className={`flex items-center gap-2 p-3 border rounded cursor-pointer transition-colors ${
                                  answers[question.id] === option
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                } ${
                                  submitted && option === question.correctAnswer
                                    ? 'border-green-500 bg-green-50'
                                    : submitted && answers[question.id] === option && option !== question.correctAnswer
                                    ? 'border-red-500 bg-red-50'
                                    : ''
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={question.id}
                                  value={option}
                                  checked={answers[question.id] === option}
                                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                  disabled={submitted}
                                  className="w-4 h-4"
                                />
                                <span>{option}</span>
                                {submitted && option === question.correctAnswer && (
                                  <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                                )}
                                {submitted && answers[question.id] === option && option !== question.correctAnswer && (
                                  <XCircle className="w-4 h-4 text-red-600 ml-auto" />
                                )}
                              </label>
                            ))}
                          </div>
                        )}

                        {question.type === 'numeric' && (
                          <input
                            type="number"
                            step="0.1"
                            value={answers[question.id] || ''}
                            onChange={(e) => handleAnswerChange(question.id, parseFloat(e.target.value))}
                            disabled={submitted}
                            className={`w-full p-2 border rounded ${
                              submitted
                                ? Math.abs((answers[question.id] as number) - (question.correctAnswer as number)) < 0.5
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                            }`}
                            placeholder="Enter your answer"
                          />
                        )}

                        {/* Explanation (shown after submit) */}
                        {submitted && (
                          <div className="mt-3 p-3 bg-gray-50 rounded">
                            <p className="text-sm font-medium text-gray-700 mb-1">Explanation:</p>
                            <p className="text-sm text-gray-600">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit / Results */}
              <div className="mt-6 pt-6 border-t">
                {!submitted ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length !== selectedScenario.questions.length}
                    size="lg"
                  >
                    Submit Answers
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            Score: {score} / {selectedScenario.questions.reduce((sum, q) => sum + q.points, 0)}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {score >= selectedScenario.questions.reduce((sum, q) => sum + q.points, 0) * 0.9
                              ? 'Excellent work! You understand these concepts well.'
                              : score >= selectedScenario.questions.reduce((sum, q) => sum + q.points, 0) * 0.7
                              ? 'Good job! Review the explanations to strengthen your understanding.'
                              : 'Keep learning! Review the material and try again.'}
                          </p>
                        </div>
                        <Award className="w-16 h-16 text-yellow-500" />
                      </div>
                      
                      <Progress 
                        value={(score / selectedScenario.questions.reduce((sum, q) => sum + q.points, 0)) * 100} 
                        className="h-3"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={resetScenario} variant="outline">
                        Try Another Scenario
                      </Button>
                      <Button onClick={() => { setAnswers({}); setSubmitted(false); setScore(0); }}>
                        Retry This Scenario
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

