// Vocabulary Builder System
// Interactive flashcards with audio, images, and quizzes

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';
import { Input } from './input';
import { 
  BookOpen, 
  Volume2, 
  Image as ImageIcon,
  Check,
  X,
  RotateCcw,
  Star,
  Brain,
  Filter,
  Search
} from 'lucide-react';

interface VocabTerm {
  id: string;
  term: string;
  definition: string;
  example: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  image?: string;
  pronunciation?: string;
  synonyms?: string[];
  relatedTerms?: string[];
}

const VOCABULARY_TERMS: VocabTerm[] = [
  {
    id: 'vocab-1',
    term: 'Alevin',
    definition: 'A newly hatched trout with a yolk sac attached that provides food until they can eat on their own.',
    example: 'The alevin stage lasts about 4-6 weeks, during which the fish absorbs its yolk sac.',
    category: 'Life Cycle',
    difficulty: 'easy',
    image: '🥚',
    pronunciation: 'AL-eh-vin',
    relatedTerms: ['Fry', 'Egg', 'Yolk Sac'],
  },
  {
    id: 'vocab-2',
    term: 'Ammonia (NH₃)',
    definition: 'A toxic compound produced by fish waste that must be broken down by beneficial bacteria in the nitrogen cycle.',
    example: 'High ammonia levels (>0.5 ppm) can burn fish gills and cause death.',
    category: 'Water Chemistry',
    difficulty: 'medium',
    pronunciation: 'uh-MOHN-yuh',
    synonyms: ['NH3', 'Ammonium'],
    relatedTerms: ['Nitrogen Cycle', 'Nitrite', 'Nitrate'],
  },
  {
    id: 'vocab-3',
    term: 'Benthic',
    definition: 'Living on or near the bottom of a water body.',
    example: 'Macroinvertebrates are benthic organisms that trout feed on.',
    category: 'Ecology',
    difficulty: 'hard',
    pronunciation: 'BEN-thick',
    relatedTerms: ['Macroinvertebrate', 'Substrate', 'Habitat'],
  },
  {
    id: 'vocab-4',
    term: 'Brook Trout',
    definition: 'Pennsylvania\'s only native trout species, requiring very cold, clean water.',
    example: 'Brook trout are indicators of excellent water quality.',
    category: 'Species',
    difficulty: 'easy',
    image: '🐟',
    pronunciation: 'BROOK TROUT',
    synonyms: ['Brookie', 'Salvelinus fontinalis'],
    relatedTerms: ['Native Species', 'Coldwater Fish'],
  },
  {
    id: 'vocab-5',
    term: 'Coldwater Species',
    definition: 'Fish that require water temperatures below 60°F to survive and thrive.',
    example: 'Trout are coldwater species that struggle in warm water due to low oxygen.',
    category: 'Biology',
    difficulty: 'easy',
    relatedTerms: ['Dissolved Oxygen', 'Temperature', 'Habitat'],
  },
  {
    id: 'vocab-6',
    term: 'Dissolved Oxygen (DO)',
    definition: 'The amount of oxygen gas dissolved in water, measured in mg/L or ppm.',
    example: 'Trout need at least 7 mg/L of dissolved oxygen to thrive.',
    category: 'Water Chemistry',
    difficulty: 'medium',
    pronunciation: 'diss-OLVED OX-ih-jen',
    relatedTerms: ['Temperature', 'Aeration', 'Air Stone'],
  },
  {
    id: 'vocab-7',
    term: 'Eutrophication',
    definition: 'Excessive nutrient enrichment in water that leads to algae blooms and oxygen depletion.',
    example: 'Fertilizer runoff causes eutrophication in streams, harming trout populations.',
    category: 'Ecology',
    difficulty: 'hard',
    pronunciation: 'yoo-troh-fih-KAY-shun',
    relatedTerms: ['Algae Bloom', 'Nutrient Pollution', 'Water Quality'],
  },
  {
    id: 'vocab-8',
    term: 'Fry',
    definition: 'Young fish that have absorbed their yolk sac and can swim and eat on their own.',
    example: 'Trout fry begin eating tiny zooplankton and crushed trout pellets.',
    category: 'Life Cycle',
    difficulty: 'easy',
    image: '🐠',
    pronunciation: 'FRY',
    relatedTerms: ['Alevin', 'Parr', 'Feeding'],
  },
  {
    id: 'vocab-9',
    term: 'Habitat',
    definition: 'The natural environment where an organism lives, including food, water, shelter, and space.',
    example: 'Trout habitat includes cold streams with rocky substrate and overhanging vegetation.',
    category: 'Ecology',
    difficulty: 'easy',
    relatedTerms: ['Niche', 'Ecosystem', 'Watershed'],
  },
  {
    id: 'vocab-10',
    term: 'Lateral Line',
    definition: 'A sensory organ in fish that detects water movement and vibrations.',
    example: 'The lateral line helps trout sense prey and avoid predators in murky water.',
    category: 'Anatomy',
    difficulty: 'medium',
    pronunciation: 'LAT-er-ul LINE',
    relatedTerms: ['Sensory System', 'Anatomy'],
  },
  {
    id: 'vocab-11',
    term: 'Macroinvertebrate',
    definition: 'Small aquatic animals without backbones that are visible to the naked eye, used as water quality indicators.',
    example: 'Mayfly nymphs are pollution-sensitive macroinvertebrates found in healthy streams.',
    category: 'Ecology',
    difficulty: 'hard',
    pronunciation: 'MACK-roh-in-VERT-uh-brate',
    synonyms: ['Aquatic Insect', 'Benthic Organism'],
    relatedTerms: ['Water Quality', 'Bioindicator', 'Stream Health'],
  },
  {
    id: 'vocab-12',
    term: 'Nitrogen Cycle',
    definition: 'The biological process where beneficial bacteria convert toxic ammonia from fish waste into less harmful compounds.',
    example: 'The nitrogen cycle takes 4-6 weeks to establish in a new aquarium.',
    category: 'Water Chemistry',
    difficulty: 'medium',
    relatedTerms: ['Ammonia', 'Nitrite', 'Nitrate', 'Bacteria'],
  },
  {
    id: 'vocab-13',
    term: 'Parr',
    definition: 'Young trout with distinctive vertical bars (parr marks) on their sides.',
    example: 'Parr marks help camouflage juvenile trout from predators.',
    category: 'Life Cycle',
    difficulty: 'medium',
    image: '🐟',
    pronunciation: 'PAR',
    relatedTerms: ['Fry', 'Juvenile', 'Coloration'],
  },
  {
    id: 'vocab-14',
    term: 'pH',
    definition: 'A measure of how acidic or basic water is, on a scale from 0-14 (7 is neutral).',
    example: 'Trout prefer pH between 6.5 and 8.0.',
    category: 'Water Chemistry',
    difficulty: 'easy',
    pronunciation: 'P-H',
    relatedTerms: ['Water Quality', 'Acid', 'Base'],
  },
  {
    id: 'vocab-15',
    term: 'Riparian Zone',
    definition: 'The vegetated area along a stream bank that provides shade, food, and habitat.',
    example: 'Healthy riparian zones keep streams cool and filter pollutants.',
    category: 'Ecology',
    difficulty: 'hard',
    pronunciation: 'rih-PAIR-ee-un ZONE',
    synonyms: ['Stream Bank', 'Buffer Zone'],
    relatedTerms: ['Watershed', 'Habitat', 'Stream Protection'],
  },
  {
    id: 'vocab-16',
    term: 'Watershed',
    definition: 'An area of land where all water drains to a common point, like a stream or river.',
    example: 'Your school is part of a watershed that eventually flows to the ocean.',
    category: 'Geography',
    difficulty: 'easy',
    pronunciation: 'WAH-ter-shed',
    synonyms: ['Drainage Basin', 'Catchment'],
    relatedTerms: ['Stream', 'River', 'Pollution'],
  },
];

export function VocabularyBuilder() {
  const [mode, setMode] = useState<'browse' | 'flashcards' | 'quiz'>('browse');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [masteredTerms, setMasteredTerms] = useState<string[]>([]);

  const categories = ['all', ...Array.from(new Set(VOCABULARY_TERMS.map(t => t.category)))];

  const filteredTerms = VOCABULARY_TERMS.filter(term => {
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const masteryProgress = (masteredTerms.length / VOCABULARY_TERMS.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-600" />
                Vocabulary Builder
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Master {VOCABULARY_TERMS.length} essential TIC terms
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {masteredTerms.length}/{VOCABULARY_TERMS.length}
              </div>
              <div className="text-xs text-gray-600">Mastered</div>
            </div>
          </div>
          <Progress value={masteryProgress} className="mt-3 [&>div]:bg-purple-600" />
        </CardHeader>
      </Card>

      {/* Mode Selection */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant={mode === 'browse' ? 'default' : 'outline'}
          onClick={() => setMode('browse')}
          className="h-auto py-4 flex-col gap-2"
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-sm">Browse</span>
        </Button>
        <Button
          variant={mode === 'flashcards' ? 'default' : 'outline'}
          onClick={() => setMode('flashcards')}
          className="h-auto py-4 flex-col gap-2"
        >
          <Brain className="w-5 h-5" />
          <span className="text-sm">Flashcards</span>
        </Button>
        <Button
          variant={mode === 'quiz' ? 'default' : 'outline'}
          onClick={() => setMode('quiz')}
          className="h-auto py-4 flex-col gap-2"
        >
          <Star className="w-5 h-5" />
          <span className="text-sm">Quiz</span>
        </Button>
      </div>

      {/* Filters (for Browse mode) */}
      {mode === 'browse' && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search vocabulary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  <Filter className="w-3 h-3 mr-1" />
                  {cat === 'all' ? 'All' : cat}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      {mode === 'browse' && <BrowseMode terms={filteredTerms} mastered={masteredTerms} setMastered={setMasteredTerms} />}
      {mode === 'flashcards' && <FlashcardsMode terms={filteredTerms} mastered={masteredTerms} setMastered={setMasteredTerms} />}
      {mode === 'quiz' && <QuizMode terms={filteredTerms} mastered={masteredTerms} setMastered={setMasteredTerms} />}
    </div>
  );
}

function BrowseMode({ terms, mastered, setMastered }: { 
  terms: VocabTerm[], 
  mastered: string[],
  setMastered: (ids: string[]) => void 
}) {
  const toggleMastered = (id: string) => {
    setMastered(
      mastered.includes(id)
        ? mastered.filter(m => m !== id)
        : [...mastered, id]
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {terms.map(term => (
        <Card key={term.id} className={mastered.includes(term.id) ? 'border-green-300 bg-green-50' : ''}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{term.term}</CardTitle>
                  {term.image && <span className="text-2xl">{term.image}</span>}
                </div>
                {term.pronunciation && (
                  <div className="flex items-center gap-2 mt-1">
                    <Volume2 className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{term.pronunciation}</span>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleMastered(term.id)}
                className={mastered.includes(term.id) ? 'text-green-600' : ''}
              >
                <Star className={`w-5 h-5 ${mastered.includes(term.id) ? 'fill-current' : ''}`} />
              </Button>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge className="text-xs">{term.category}</Badge>
              <Badge className={`text-xs ${
                term.difficulty === 'easy' ? 'bg-green-600' :
                term.difficulty === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
              }`}>
                {term.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">{term.definition}</p>
            <div className="p-3 bg-blue-50 rounded text-sm text-blue-900">
              <strong>Example:</strong> {term.example}
            </div>
            {term.synonyms && (
              <div className="text-xs text-gray-600">
                <strong>Also called:</strong> {term.synonyms.join(', ')}
              </div>
            )}
            {term.relatedTerms && (
              <div className="flex gap-1 flex-wrap">
                {term.relatedTerms.map(rt => (
                  <Badge key={rt} variant="outline" className="text-xs">
                    {rt}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FlashcardsMode({ terms, mastered, setMastered }: { 
  terms: VocabTerm[], 
  mastered: string[],
  setMastered: (ids: string[]) => void 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);

  const currentTerm = terms[currentIndex];

  const nextCard = () => {
    setShowDefinition(false);
    setCurrentIndex((currentIndex + 1) % terms.length);
  };

  const prevCard = () => {
    setShowDefinition(false);
    setCurrentIndex((currentIndex - 1 + terms.length) % terms.length);
  };

  const markMastered = (mastered: boolean) => {
    const newMastered = mastered
      ? [...new Set([...masteredTerms, currentTerm.id])]
      : masteredTerms.filter(id => id !== currentTerm.id);
    setMastered(newMastered);
    nextCard();
  };

  if (!currentTerm) return <div className="text-center py-8">No terms available</div>;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="text-center text-sm text-gray-600">
        Card {currentIndex + 1} of {terms.length}
      </div>

      {/* Flashcard */}
      <Card 
        className="min-h-[400px] cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setShowDefinition(!showDefinition)}
      >
        <CardContent className="flex flex-col items-center justify-center min-h-[400px] p-8">
          {!showDefinition ? (
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-purple-600">{currentTerm.term}</div>
              {currentTerm.image && <div className="text-6xl">{currentTerm.image}</div>}
              {currentTerm.pronunciation && (
                <div className="text-gray-600 italic">({currentTerm.pronunciation})</div>
              )}
              <div className="text-sm text-gray-500 mt-8">Click to reveal definition</div>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className="text-lg">{currentTerm.definition}</div>
              <div className="p-4 bg-blue-50 rounded text-sm">
                <strong>Example:</strong> {currentTerm.example}
              </div>
              <div className="text-sm text-gray-500">Click to flip back</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex gap-3">
        <Button onClick={prevCard} variant="outline" className="flex-1">
          ← Previous
        </Button>
        <Button onClick={nextCard} variant="outline" className="flex-1">
          Next →
        </Button>
      </div>

      {/* Mastery Buttons */}
      {showDefinition && (
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => markMastered(false)} variant="outline" className="text-orange-600">
            <RotateCcw className="w-4 h-4 mr-2" />
            Review Again
          </Button>
          <Button onClick={() => markMastered(true)} className="bg-green-600 hover:bg-green-700">
            <Check className="w-4 h-4 mr-2" />
            I Know This!
          </Button>
        </div>
      )}
    </div>
  );
}

function QuizMode({ terms, mastered, setMastered }: { 
  terms: VocabTerm[], 
  mastered: string[],
  setMastered: (ids: string[]) => void 
}) {
  const [quizTerms, setQuizTerms] = useState<VocabTerm[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    startQuiz();
  }, [terms]);

  const startQuiz = () => {
    const shuffled = [...terms].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuizTerms(shuffled);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  };

  if (quizTerms.length === 0) return null;

  const currentTerm = quizTerms[currentQ];
  
  // Generate multiple choice options
  const generateOptions = () => {
    const correct = currentTerm;
    const others = terms.filter(t => t.id !== correct.id).sort(() => Math.random() - 0.5).slice(0, 3);
    return [correct, ...others].sort(() => Math.random() - 0.5);
  };

  const options = generateOptions();

  const checkAnswer = (selectedId: string) => {
    setSelectedAnswer(selectedId);
    if (selectedId === currentTerm.id) {
      setScore(score + 1);
      if (!mastered.includes(currentTerm.id)) {
        setMastered([...mastered, currentTerm.id]);
      }
    }
  };

  const nextQuestion = () => {
    if (currentQ < quizTerms.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    const percentage = (score / quizTerms.length) * 100;
    return (
      <Card>
        <CardContent className="pt-6 text-center space-y-6">
          <div className="text-6xl">
            {percentage >= 90 ? '🏆' : percentage >= 70 ? '🌟' : '📚'}
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {score}/{quizTerms.length}
            </div>
            <div className="text-gray-600">
              {percentage >= 90 ? 'Excellent!' : percentage >= 70 ? 'Good Job!' : 'Keep Practicing!'}
            </div>
          </div>
          <Progress value={percentage} className="[&>div]:bg-purple-600" />
          <Button onClick={startQuiz} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Question {currentQ + 1} of {quizTerms.length}
        </span>
        <span className="font-semibold">Score: {score}</span>
      </div>
      <Progress value={((currentQ + 1) / quizTerms.length) * 100} />

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What does this term mean?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-purple-600">{currentTerm.term}</div>
            {currentTerm.pronunciation && (
              <div className="text-sm text-gray-600 mt-2">({currentTerm.pronunciation})</div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2">
            {options.map(option => (
              <Button
                key={option.id}
                variant="outline"
                className={`w-full text-left h-auto py-4 ${
                  selectedAnswer === option.id
                    ? option.id === currentTerm.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : ''
                }`}
                onClick={() => !selectedAnswer && checkAnswer(option.id)}
                disabled={selectedAnswer !== null}
              >
                <div className="flex items-start gap-3">
                  {selectedAnswer === option.id && (
                    option.id === currentTerm.id ? (
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-red-600 flex-shrink-0" />
                    )
                  )}
                  <span className="flex-1">{option.definition}</span>
                </div>
              </Button>
            ))}
          </div>

          {selectedAnswer && (
            <Button onClick={nextQuestion} className="w-full">
              {currentQ < quizTerms.length - 1 ? 'Next Question →' : 'See Results'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

