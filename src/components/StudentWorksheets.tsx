// Interactive Student Worksheets
// Printable and digital worksheets with auto-grading

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { Badge } from './badge';
import { Progress } from './progress';
import {
  FileText,
  Download,
  Check,
  X,
  PrinterIcon,
  Save,
  RotateCcw,
  Star,
  CheckCircle,
} from 'lucide-react';

interface WorksheetQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'short-answer' | 'matching' | 'diagram-label' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  hint?: string;
}

interface Worksheet {
  id: string;
  title: string;
  topic: string;
  gradeLevel: string[];
  standards: string[];
  objectives: string[];
  questions: WorksheetQuestion[];
  totalPoints: number;
}

const WORKSHEETS: Worksheet[] = [
  {
    id: 'worksheet-1',
    title: 'Trout Species Identification',
    topic: 'Trout Biology',
    gradeLevel: ['3-5', '6-8'],
    standards: ['3.1.5.A', '3.3.5.A'],
    objectives: [
      'Identify three PA trout species by appearance',
      'Describe key characteristics of each species',
      'Explain native vs. introduced status',
    ],
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Which trout species is native to Pennsylvania?',
        options: ['Rainbow Trout', 'Brown Trout', 'Brook Trout', 'Lake Trout'],
        correctAnswer: 'Brook Trout',
        points: 5,
        hint: 'This species has been in PA streams for thousands of years',
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'Brook trout prefer warmer water than brown trout.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        points: 3,
        hint: 'Think about which species requires the coldest, cleanest water',
      },
      {
        id: 'q3',
        type: 'matching',
        question: 'Match each trout species to its identifying feature:',
        options: [
          'Brook Trout::Worm-like markings on back',
          'Brown Trout::Red and black spots with blue halos',
          'Rainbow Trout::Pink stripe along side',
        ],
        correctAnswer: ['Brook Trout::Worm-like markings on back', 'Brown Trout::Red and black spots with blue halos', 'Rainbow Trout::Pink stripe along side'],
        points: 9,
      },
      {
        id: 'q4',
        type: 'fill-blank',
        question: 'Brook trout require water temperatures below _____°F to survive.',
        correctAnswer: '60',
        points: 5,
        hint: 'It\'s the same temperature threshold for all coldwater species',
      },
      {
        id: 'q5',
        type: 'short-answer',
        question: 'Explain why brook trout are considered indicator species for water quality. (2-3 sentences)',
        correctAnswer: 'Brook trout require very cold, clean water with high dissolved oxygen. They are sensitive to pollution and temperature changes. If brook trout are present, it indicates excellent water quality.',
        points: 8,
      },
    ],
    totalPoints: 30,
  },
  {
    id: 'worksheet-2',
    title: 'Nitrogen Cycle Diagram',
    topic: 'Water Chemistry',
    gradeLevel: ['6-8', '9-12'],
    standards: ['MS-LS2-3', 'MS-PS1-2'],
    objectives: [
      'Diagram the nitrogen cycle in an aquarium',
      'Identify beneficial bacteria roles',
      'Explain cycling process timeline',
    ],
    questions: [
      {
        id: 'q1',
        type: 'diagram-label',
        question: 'Label the nitrogen cycle diagram with: Ammonia (NH₃), Nitrite (NO₂⁻), Nitrate (NO₃⁻), Bacteria 1, Bacteria 2, Fish Waste',
        correctAnswer: ['Ammonia', 'Nitrite', 'Nitrate', 'Bacteria 1', 'Bacteria 2', 'Fish Waste'],
        points: 12,
      },
      {
        id: 'q2',
        type: 'fill-blank',
        question: 'The nitrogen cycle takes approximately _____ to _____ weeks to complete.',
        correctAnswer: '4 to 6',
        points: 4,
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'Which compound is MOST toxic to fish?',
        options: ['Ammonia (NH₃)', 'Nitrite (NO₂⁻)', 'Nitrate (NO₃⁻)', 'All are equally toxic'],
        correctAnswer: 'Ammonia (NH₃)',
        points: 5,
      },
      {
        id: 'q4',
        type: 'true-false',
        question: 'You should add fish as soon as you fill a new aquarium with water.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        points: 3,
        hint: 'What happens if beneficial bacteria aren\'t present yet?',
      },
      {
        id: 'q5',
        type: 'short-answer',
        question: 'Describe the role of beneficial bacteria in the nitrogen cycle.',
        correctAnswer: 'Beneficial bacteria convert toxic compounds into less harmful ones. Nitrosomonas bacteria convert ammonia to nitrite. Nitrobacter bacteria convert nitrite to nitrate.',
        points: 10,
      },
    ],
    totalPoints: 34,
  },
  {
    id: 'worksheet-3',
    title: 'Watershed Connections',
    topic: 'Watersheds & Water Cycle',
    gradeLevel: ['3-5', '6-8'],
    standards: ['4.6.5.A', '7.3.5.A'],
    objectives: [
      'Define watershed and explain water flow',
      'Trace local watershed connections',
      'Identify sources of water pollution',
    ],
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What is a watershed?',
        options: [
          'A building where water is stored',
          'An area where all water drains to a common point',
          'A large lake or reservoir',
          'Underground water pipes',
        ],
        correctAnswer: 'An area where all water drains to a common point',
        points: 5,
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'Everything you do on land can affect your local stream.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        points: 3,
      },
      {
        id: 'q3',
        type: 'fill-blank',
        question: 'The vegetated area along a stream bank is called the __________ zone.',
        correctAnswer: 'riparian',
        points: 5,
        hint: 'This zone provides shade and filters pollution',
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'Which of these is a source of nonpoint source pollution?',
        options: [
          'Factory discharge pipe',
          'Sewage treatment plant',
          'Fertilizer runoff from lawns',
          'Oil spill from tanker',
        ],
        correctAnswer: 'Fertilizer runoff from lawns',
        points: 5,
      },
      {
        id: 'q5',
        type: 'short-answer',
        question: 'Draw and label your school watershed. Include: school location, streams, direction of water flow, and where water eventually goes.',
        correctAnswer: 'Diagram should show school, local streams, arrows showing downhill flow, and final destination (river/ocean).',
        points: 12,
      },
    ],
    totalPoints: 30,
  },
];

export function StudentWorksheets() {
  const [selectedWorksheet, setSelectedWorksheet] = useState<Worksheet | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const submitWorksheet = () => {
    if (!selectedWorksheet) return;

    let totalScore = 0;
    selectedWorksheet.questions.forEach(q => {
      const userAnswer = answers[q.id]?.trim().toLowerCase();
      const correctAnswer = Array.isArray(q.correctAnswer)
        ? q.correctAnswer.map(a => a.toLowerCase())
        : q.correctAnswer.toLowerCase();

      let isCorrect = false;
      if (Array.isArray(correctAnswer)) {
        isCorrect = correctAnswer.some(a => userAnswer?.includes(a));
      } else {
        isCorrect = userAnswer?.includes(correctAnswer) || correctAnswer.includes(userAnswer || '');
      }

      if (isCorrect) {
        totalScore += q.points;
      }
    });

    setScore(totalScore);
    setSubmitted(true);
  };

  const resetWorksheet = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const downloadPDF = () => {
    alert('PDF download feature coming soon! For now, use Print to save as PDF.');
  };

  const printWorksheet = () => {
    window.print();
  };

  if (!selectedWorksheet) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600" />
              Student Worksheets
            </CardTitle>
            <p className="text-sm text-gray-600">
              Interactive and printable activities
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WORKSHEETS.map(worksheet => (
            <Card key={worksheet.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader onClick={() => setSelectedWorksheet(worksheet)}>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{worksheet.title}</CardTitle>
                  <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge className="text-xs">{worksheet.topic}</Badge>
                  <Badge variant="outline" className="text-xs">
                    {worksheet.totalPoints} pts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <strong>Grade Levels:</strong> {worksheet.gradeLevel.join(', ')}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Questions:</strong> {worksheet.questions.length}
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setSelectedWorksheet(worksheet)}
                  >
                    Start Worksheet
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWorksheet(worksheet);
                      setTimeout(printWorksheet, 100);
                    }}
                  >
                    <PrinterIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const percentageScore = (score / selectedWorksheet.totalPoints) * 100;

  return (
    <div className="space-y-6 print:p-8">
      {/* Header */}
      <Card className="print:shadow-none">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle>{selectedWorksheet.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{selectedWorksheet.topic}</p>
              <div className="flex gap-2 mt-2">
                {selectedWorksheet.gradeLevel.map(grade => (
                  <Badge key={grade} className="text-xs">{grade}</Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2 print:hidden">
              <Button onClick={() => setSelectedWorksheet(null)} variant="outline" size="sm">
                ← Back
              </Button>
              <Button onClick={printWorksheet} variant="outline" size="sm">
                <PrinterIcon className="w-4 h-4" />
              </Button>
              <Button onClick={downloadPDF} variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Learning Objectives:</strong>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
              {selectedWorksheet.objectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>
          <div className="text-sm text-gray-600">
            <strong>Total Points:</strong> {selectedWorksheet.totalPoints}
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-6">
        {selectedWorksheet.questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">
                  Question {index + 1} ({question.points} points)
                </CardTitle>
                {submitted && (
                  <Badge className={
                    answers[question.id]?.toLowerCase().includes(
                      Array.isArray(question.correctAnswer) 
                        ? question.correctAnswer[0].toLowerCase() 
                        : question.correctAnswer.toLowerCase()
                    ) ? 'bg-green-600' : 'bg-red-600'
                  }>
                    {answers[question.id]?.toLowerCase().includes(
                      Array.isArray(question.correctAnswer) 
                        ? question.correctAnswer[0].toLowerCase() 
                        : question.correctAnswer.toLowerCase()
                    ) ? '✓ Correct' : '✗ Incorrect'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium">{question.question}</p>

              {/* Multiple Choice */}
              {question.type === 'multiple-choice' && question.options && (
                <div className="space-y-2">
                  {question.options.map(option => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
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
                    </label>
                  ))}
                </div>
              )}

              {/* True/False */}
              {question.type === 'true-false' && question.options && (
                <div className="flex gap-4">
                  {question.options.map(option => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
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
                    </label>
                  ))}
                </div>
              )}

              {/* Fill in the Blank */}
              {question.type === 'fill-blank' && (
                <Input
                  placeholder="Type your answer..."
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  disabled={submitted}
                />
              )}

              {/* Short Answer */}
              {question.type === 'short-answer' && (
                <Textarea
                  placeholder="Write your answer here..."
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  disabled={submitted}
                  rows={4}
                />
              )}

              {/* Diagram Label */}
              {question.type === 'diagram-label' && (
                <Textarea
                  placeholder="Label the diagram parts (comma-separated)..."
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  disabled={submitted}
                  rows={3}
                />
              )}

              {/* Matching */}
              {question.type === 'matching' && question.options && (
                <div className="space-y-2">
                  {question.options.map((pair, i) => {
                    const [left, right] = pair.split('::');
                    return (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="flex-1 font-medium">{left}</span>
                        <span className="text-gray-400">→</span>
                        <span className="flex-1 text-gray-700">{right}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Hint */}
              {question.hint && !submitted && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600">Need a hint?</summary>
                  <p className="mt-2 text-gray-600 italic">{question.hint}</p>
                </details>
              )}

              {/* Correct Answer (after submission) */}
              {submitted && (
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <strong className="text-green-900">Correct Answer:</strong>
                  <p className="text-green-800 mt-1">
                    {Array.isArray(question.correctAnswer) 
                      ? question.correctAnswer.join(', ') 
                      : question.correctAnswer}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit Button */}
      {!submitted ? (
        <Card className="print:hidden">
          <CardContent className="pt-6">
            <Button onClick={submitWorksheet} className="w-full" size="lg">
              <CheckCircle className="w-5 h-5 mr-2" />
              Submit Worksheet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 print:hidden">
          <CardContent className="pt-6 space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {percentageScore >= 90 ? '🏆' : percentageScore >= 70 ? '⭐' : '📚'}
              </div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                {score}/{selectedWorksheet.totalPoints}
              </div>
              <div className="text-xl text-gray-700 mb-2">
                {percentageScore.toFixed(0)}%
              </div>
              <Badge className={`text-lg ${
                percentageScore >= 90 ? 'bg-green-600' :
                percentageScore >= 70 ? 'bg-blue-600' : 'bg-orange-600'
              }`}>
                {percentageScore >= 90 ? 'Excellent!' : 
                 percentageScore >= 70 ? 'Good Job!' : 
                 'Keep Practicing!'}
              </Badge>
            </div>
            <Progress value={percentageScore} className="[&>div]:bg-indigo-600" />
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={resetWorksheet} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={() => setSelectedWorksheet(null)}>
                Choose Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:shadow-none, .print\\:shadow-none * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:p-8 {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
}

