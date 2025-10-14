// 🎣 Fishing Academy - Comprehensive Fishing Education Module
// Traditional & Fly Fishing • Knots • Bait/Lures/Flies • Match the Hatch • PFBC Data Integration

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Badge } from "./badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Fish,
  Waves,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
  Info,
  TrendingUp,
  Bug,
  Droplets,
  Wind,
  Sun,
  Cloud
} from "lucide-react";

interface StockingEvent {
  id: string;
  waterName: string;
  county: string;
  species: string;
  date: string;
  location: string;
  amount?: number;
}

interface FishingLocation {
  id: string;
  name: string;
  type: "stream" | "river" | "lake" | "reservoir";
  county: string;
  species: string[];
  coordinates: { lat: number; lng: number };
  regulations?: string;
  access: string;
}

export function FishingAcademy({ 
  onEarnBadge, 
  onAddPoints 
}: { 
  onEarnBadge?: (badge: string) => void;
  onAddPoints?: (points: number) => void;
}) {
  const [activeSection, setActiveSection] = useState("overview");
  const [completedKnots, setCompletedKnots] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  function markKnotLearned(knotId: string) {
    if (!completedKnots.includes(knotId)) {
      setCompletedKnots([...completedKnots, knotId]);
      onAddPoints?.(5);
      
      if (completedKnots.length + 1 >= 5) {
        onEarnBadge?.("knot-master");
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 backdrop-blur overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU2LCAxODksIDI0OCwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
          <CardHeader className="relative">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center gap-4"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white text-3xl shadow-lg">
                🎣
              </div>
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">PA Fishing Academy</CardTitle>
                <CardDescription className="text-base">
                  Master traditional & fly fishing • Learn knots & techniques • Explore PA waters • Connect with PFBC resources
                </CardDescription>
              </div>
            </motion.div>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid md:grid-cols-4 gap-4">
              <StatCard icon="🎣" label="Knots Learned" value={completedKnots.length} total={10} />
              <StatCard icon="🐟" label="Species Guides" value={15} total={15} />
              <StatCard icon="🗺️" label="PA Waters" value="1000+" />
              <StatCard icon="📅" label="Live Events" value="Updated Weekly" />
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
        <TabsList className="w-full flex-wrap rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 p-1.5 gap-1">
          <TabsTrigger value="overview" className="rounded-full">
            <BookOpen className="h-4 w-4 mr-2" />
            Getting Started
          </TabsTrigger>
          <TabsTrigger value="knots" className="rounded-full">
            🪢 Knots
          </TabsTrigger>
          <TabsTrigger value="techniques" className="rounded-full">
            🎯 Techniques
          </TabsTrigger>
          <TabsTrigger value="bait-lures" className="rounded-full">
            🎣 Bait & Lures
          </TabsTrigger>
          <TabsTrigger value="match-hatch" className="rounded-full">
            🐛 Match the Hatch
          </TabsTrigger>
          <TabsTrigger value="pa-waters" className="rounded-full">
            🗺️ PA Waters
          </TabsTrigger>
          <TabsTrigger value="stocking" className="rounded-full">
            📅 Stocking Schedule
          </TabsTrigger>
          <TabsTrigger value="regulations" className="rounded-full">
            📋 Regulations
          </TabsTrigger>
        </TabsList>

        {/* Getting Started */}
        <TabsContent value="overview" className="pt-6">
          <GettingStarted />
        </TabsContent>

        {/* Knots Guide */}
        <TabsContent value="knots" className="pt-6">
          <KnotsGuide 
            completedKnots={completedKnots}
            onKnotLearned={markKnotLearned}
          />
        </TabsContent>

        {/* Fishing Techniques */}
        <TabsContent value="techniques" className="pt-6">
          <FishingTechniques />
        </TabsContent>

        {/* Bait & Lures */}
        <TabsContent value="bait-lures" className="pt-6">
          <BaitLuresFlies />
        </TabsContent>

        {/* Match the Hatch */}
        <TabsContent value="match-hatch" className="pt-6">
          <MatchTheHatch />
        </TabsContent>

        {/* PA Waters Map */}
        <TabsContent value="pa-waters" className="pt-6">
          <PAWatersExplorer />
        </TabsContent>

        {/* Stocking Schedule */}
        <TabsContent value="stocking" className="pt-6">
          <StockingSchedule />
        </TabsContent>

        {/* Regulations FAQ */}
        <TabsContent value="regulations" className="pt-6">
          <RegulationsFAQ />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, total }: { icon: string; label: string; value: string | number; total?: number }) {
  return (
    <div className="p-4 bg-white/60 rounded-2xl border border-white/60 backdrop-blur">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-blue-600">
        {value}{total && `/${total}`}
      </div>
      <div className="text-xs text-slate-600 mt-1">{label}</div>
    </div>
  );
}

// Getting Started Section
function GettingStarted() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎣 Traditional Fishing Basics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-xl">
            <h4 className="font-semibold mb-2">Essential Gear</h4>
            <ul className="space-y-1 text-sm">
              <li>✓ Rod & Reel (spinning combo for beginners)</li>
              <li>✓ Monofilament line (6-8 lb test)</li>
              <li>✓ Hooks (size 6-10)</li>
              <li>✓ Split shot weights</li>
              <li>✓ Bobbers/floats</li>
              <li>✓ Bait container</li>
              <li>✓ Tackle box</li>
            </ul>
          </div>
          <div className="p-3 bg-green-50 rounded-xl">
            <h4 className="font-semibold mb-2">First Steps</h4>
            <ol className="space-y-1 text-sm list-decimal list-inside">
              <li>Get your PA fishing license</li>
              <li>Learn 3 basic knots</li>
              <li>Practice casting in your yard</li>
              <li>Start at stocked ponds</li>
              <li>Fish with experienced mentor</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🪰 Fly Fishing Introduction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-amber-50 rounded-xl">
            <h4 className="font-semibold mb-2">Fly Fishing Gear</h4>
            <ul className="space-y-1 text-sm">
              <li>✓ Fly rod (5-weight for trout)</li>
              <li>✓ Fly reel with backing</li>
              <li>✓ Weight-forward fly line</li>
              <li>✓ Leader & tippet (4X-6X)</li>
              <li>✓ Assorted flies</li>
              <li>✓ Nippers & forceps</li>
              <li>✓ Vest or chest pack</li>
            </ul>
          </div>
          <div className="p-3 bg-sky-50 rounded-xl">
            <h4 className="font-semibold mb-2">Learning Path</h4>
            <ol className="space-y-1 text-sm list-decimal list-inside">
              <li>Take a TU fly fishing class</li>
              <li>Master the roll cast</li>
              <li>Learn fly selection basics</li>
              <li>Practice catch & release</li>
              <li>Join a fly fishing club</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Knots Guide with Interactive Learning
function KnotsGuide({ 
  completedKnots, 
  onKnotLearned 
}: { 
  completedKnots: string[];
  onKnotLearned: (id: string) => void;
}) {
  const knots = [
    {
      id: "improved-clinch",
      name: "Improved Clinch Knot",
      difficulty: "Beginner",
      uses: "Tying hooks, lures, swivels to line",
      strength: "95%",
      steps: [
        "Thread line through hook eye, double back 6 inches",
        "Wrap tag end around standing line 5-7 times",
        "Thread tag end through loop near hook eye",
        "Thread tag end through big loop just created",
        "Moisten and pull tight slowly",
        "Trim excess tag end"
      ],
      video: "https://www.youtube.com/watch?v=example",
      essential: true
    },
    {
      id: "palomar",
      name: "Palomar Knot",
      difficulty: "Beginner",
      uses: "Strong all-purpose knot for hooks and lures",
      strength: "95%",
      steps: [
        "Double 6 inches of line, thread loop through hook eye",
        "Tie overhand knot with doubled line",
        "Pass hook through loop",
        "Moisten and pull tight",
        "Trim tag end"
      ],
      essential: true
    },
    {
      id: "loop-knot",
      name: "Non-Slip Loop Knot",
      difficulty: "Intermediate",
      uses: "Allows lure to swim freely",
      strength: "90%",
      steps: [
        "Tie overhand knot 6 inches from tag end",
        "Thread tag through hook eye and back through overhand",
        "Wrap tag around standing line 4-5 times",
        "Thread tag back through overhand knot",
        "Moisten and tighten slowly",
        "Trim excess"
      ],
      essential: false
    },
    {
      id: "double-surgeons",
      name: "Double Surgeon's Knot",
      difficulty: "Beginner",
      uses: "Joining two lines (leader to tippet)",
      strength: "90%",
      steps: [
        "Overlap ends of two lines 6-8 inches",
        "Form loop with both lines together",
        "Pass both tag ends through loop twice",
        "Moisten and pull all four ends slowly",
        "Trim tag ends"
      ],
      essential: true
    },
    {
      id: "nail-knot",
      name: "Nail Knot",
      difficulty: "Advanced",
      uses: "Attaching leader to fly line",
      strength: "85%",
      steps: [
        "Place nail/tube alongside fly line end",
        "Wrap leader butt around line and nail 6-7 times",
        "Thread tag through nail/tube",
        "Remove nail, moisten, pull tight",
        "Trim flush"
      ],
      essential: false
    },
    {
      id: "blood-knot",
      name: "Blood Knot",
      difficulty: "Advanced",
      uses: "Joining similar diameter lines",
      strength: "85%",
      steps: [
        "Overlap lines 6 inches",
        "Wrap one tag around other line 5 times",
        "Thread tag between lines at center",
        "Repeat with other tag in opposite direction",
        "Pull both standing lines slowly",
        "Trim tags"
      ],
      essential: false
    },
    {
      id: "arbor-knot",
      name: "Arbor Knot",
      difficulty: "Beginner",
      uses: "Attaching line to reel spool",
      strength: "N/A",
      steps: [
        "Wrap line around reel arbor",
        "Tie overhand knot around standing line",
        "Tie second overhand in tag end",
        "Pull standing line to tighten",
        "Trim tag end"
      ],
      essential: true
    },
    {
      id: "trilene",
      name: "Trilene Knot",
      difficulty: "Beginner",
      uses: "Monofilament to hooks/lures",
      strength: "95%",
      steps: [
        "Thread line through hook eye twice",
        "Wrap tag around standing line 5-6 times",
        "Thread tag back through double loop at eye",
        "Moisten and pull tight",
        "Trim excess"
      ],
      essential: true
    },
    {
      id: "rapala",
      name: "Rapala Knot",
      difficulty: "Intermediate",
      uses: "Loop knot for lure action",
      strength: "90%",
      steps: [
        "Tie overhand knot, leave loose",
        "Thread through lure eye and back through overhand",
        "Wrap around standing line 3 times",
        "Thread back through overhand, then through new loop",
        "Moisten and tighten",
        "Trim tag"
      ],
      essential: false
    },
    {
      id: "uni-knot",
      name: "Uni Knot",
      difficulty: "Beginner",
      uses: "Versatile all-purpose knot",
      strength: "90%",
      steps: [
        "Thread line through hook eye 6 inches",
        "Form loop alongside standing line",
        "Wrap tag through loop 5-6 times",
        "Moisten and pull tag to tighten coils",
        "Slide knot to hook eye",
        "Trim excess"
      ],
      essential: true
    }
  ];

  const essentialKnots = knots.filter(k => k.essential);
  const advancedKnots = knots.filter(k => !k.essential);

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-2 border-amber-200 bg-amber-50 backdrop-blur">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🪢</div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Master Essential Knots</h3>
              <p className="text-sm text-slate-700 mb-3">
                Strong knots are critical! Learn these 7 essential knots first, then advance to specialty knots.
                Practice until you can tie them in the dark or with cold fingers!
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium">{completedKnots.length}/{knots.length} Mastered</span>
                </div>
                <Badge className="bg-blue-600">+5 pts per knot</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-600" />
            Essential Knots (Learn These First!)
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {essentialKnots.map((knot) => (
              <KnotCard
                key={knot.id}
                knot={knot}
                isLearned={completedKnots.includes(knot.id)}
                onMarkLearned={() => onKnotLearned(knot.id)}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Advanced & Specialty Knots
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {advancedKnots.map((knot) => (
              <KnotCard
                key={knot.id}
                knot={knot}
                isLearned={completedKnots.includes(knot.id)}
                onMarkLearned={() => onKnotLearned(knot.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KnotCard({ 
  knot, 
  isLearned, 
  onMarkLearned 
}: { 
  knot: any;
  isLearned: boolean;
  onMarkLearned: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const difficultyColor = {
    "Beginner": "bg-emerald-100 text-emerald-700",
    "Intermediate": "bg-amber-100 text-amber-700",
    "Advanced": "bg-red-100 text-red-700"
  };

  return (
    <motion.div layout>
      <Card className={`rounded-2xl border-2 ${isLearned ? 'border-emerald-200 bg-emerald-50' : 'border-white/60 bg-white/80'} backdrop-blur`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base flex items-center gap-2">
                {isLearned && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                {knot.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={difficultyColor[knot.difficulty as keyof typeof difficultyColor]} variant="secondary">
                  {knot.difficulty}
                </Badge>
                <span className="text-xs text-slate-600">Strength: {knot.strength}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <strong className="text-slate-700">Best for:</strong> {knot.uses}
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3"
              >
                <div className="p-3 bg-slate-50 rounded-xl">
                  <h5 className="font-semibold text-sm mb-2">Step-by-Step:</h5>
                  <ol className="space-y-2">
                    {knot.steps.map((step: string, i: number) => (
                      <li key={i} className="text-sm flex gap-2">
                        <span className="font-semibold text-blue-600">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={knot.video} target="_blank" rel="noopener noreferrer">
                      📹 Watch Video
                    </a>
                  </Button>
                  {!isLearned && (
                    <Button onClick={onMarkLearned} size="sm" className="flex-1">
                      ✓ I've Learned This (+5 pts)
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="w-full"
          >
            {expanded ? "Hide Details" : "Show Steps & Video"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// ==============================
// STUB COMPONENTS
// ==============================

function FishingTechniques() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fishing Techniques</CardTitle>
        <CardDescription>Learn various fishing methods</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">Fishing techniques content coming soon...</p>
      </CardContent>
    </Card>
  );
}

function BaitLuresFlies() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bait, Lures & Flies</CardTitle>
        <CardDescription>Explore different fishing gear</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">Bait and lures content coming soon...</p>
      </CardContent>
    </Card>
  );
}

function MatchTheHatch() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Match the Hatch</CardTitle>
        <CardDescription>Understanding insect hatches</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">Match the hatch content coming soon...</p>
      </CardContent>
    </Card>
  );
}

function PAWatersExplorer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PA Waters Explorer</CardTitle>
        <CardDescription>Explore Pennsylvania waterways</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">PA waters map coming soon...</p>
      </CardContent>
    </Card>
  );
}

function StockingSchedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stocking Schedule</CardTitle>
        <CardDescription>PFBC trout stocking information</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">Stocking schedule coming soon...</p>
      </CardContent>
    </Card>
  );
}

function RegulationsFAQ() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Regulations & FAQ</CardTitle>
        <CardDescription>Pennsylvania fishing regulations</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">Regulations FAQ coming soon...</p>
      </CardContent>
    </Card>
  );
}
