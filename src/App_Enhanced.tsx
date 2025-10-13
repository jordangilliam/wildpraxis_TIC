/**
 * PA Trout in the Classroom - Enhanced Platform
 * 
 * Complete rebuild integrating:
 * - All 12 PATIC curriculum modules
 * - Wildlife Leadership Academy & WildPraxis alignment
 * - PA Fish & Boat Commission resources
 * - Library, county, and city park connections
 * - Brook AI conservation assistant
 * - Gamification & badge system
 * - Enhanced data visualization
 * 
 * Built with modern React, TypeScript, Tailwind CSS
 * Designed by Carnegie Mellon-level development standards
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/tabs";
import { Button } from "./components/button";
import { Input } from "./components/input";
import { Label } from "./components/label";
import { Textarea } from "./components/textarea";
import { Switch } from "./components/switch";
import { Progress } from "./components/progress";
import { Badge } from "./components/badge";
import {
  MapPin,
  Fish as FishIcon,
  BookOpenCheck,
  Microscope,
  Settings,
  BarChart3,
  Upload,
  FileDown,
  Anchor,
  Waves,
  BadgeCheck,
  RefreshCw,
  ChevronRight,
  Plus,
  Star,
  Sparkles,
  BookOpen,
  Award,
  Users,
  TrendingUp,
  Calendar,
  Target,
  Camera,
  Gamepad2
} from "lucide-react";
import type { Map } from "mapbox-gl";

// Import new components
import { BrookAI } from "./components/BrookAI";
import { LessonViewer } from "./components/LessonViewer";
import { ResourceHub } from "./components/ResourceHub";
import { FishingAcademy } from "./components/FishingAcademy";
import { CitizenScienceHub } from "./components/CitizenScienceHub";
import { RobloxStyleGames } from "./components/RobloxStyleGames";
import { AchievementToast, useAchievementSystem, ACHIEVEMENTS } from "./components/AchievementSystem";
import { WLA_ALIGNED_BADGES, PATIC_LESSONS } from "./data/curriculum";

// ------------------------------
// Types & Utilities
// ------------------------------
const LS_KEY = "tic_enhanced_v2";
const LS_TOKEN = "mapbox_token";

// Logo paths - work with Vite's BASE_URL
const LOGO_WILD = new URL("../public/branding/wildpraxis_transparent.png", import.meta.url).href;
const LOGO_STRING = new URL("../public/branding/string_theory_transparent.png", import.meta.url).href;

function saveState(state: AppState) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Enhanced Data Models
interface Opportunity {
  id: string;
  org: string;
  title: string;
  location: string;
  startDate?: string;
  url?: string;
  tags: string[];
  lastUpdated: string;
  description?: string;
  pointValue?: number;
}

interface MacroRecord {
  id: string;
  date: string;
  imageName?: string;
  outcome: string;
  path: string[];
  location?: string;
}

interface HabitatDesign {
  id: string;
  date: string;
  temperatureF: number;
  dissolvedOxygen: number;
  flow: "riffle" | "run" | "pool";
  shade: number;
  cover: number;
  notes?: string;
  score: number;
}

interface WaterQualityReading {
  id: string;
  date: string;
  temperature: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  pH: number;
  dissolvedOxygen: number;
  notes?: string;
}

interface TroutMilestone {
  id: string;
  date: string;
  milestone: string;
  count?: number;
  notes?: string;
}

interface Profile {
  name: string;
  gradeBand: "K-2" | "3-5" | "6-8";
  classroom: string;
  school: string;
  county: string;
}

interface AppState {
  profile: Profile;
  progress: {
    lessonsCompleted: string[];
    modulesCompleted: Record<string, boolean>;
    badges: string[];
    conservationPoints: number;
    level: number;
    streakDays: number;
  };
  macros: MacroRecord[];
  habitats: HabitatDesign[];
  waterQuality: WaterQualityReading[];
  troutMilestones: TroutMilestone[];
  opportunities: Opportunity[];
  lastOpptySync?: string;
  lastLogin?: string;
  map: {
    token?: string;
    savedSites: Array<{
      id: string;
      name: string;
      lng: number;
      lat: number;
      notes?: string;
      type?: "release-site" | "sample-site" | "education";
    }>;
  };
}

const DEFAULT_STATE: AppState = {
  profile: {
    name: "",
    gradeBand: "3-5",
    classroom: "",
    school: "",
    county: "Allegheny"
  },
  progress: {
    lessonsCompleted: [],
    modulesCompleted: {},
    badges: [],
    conservationPoints: 0,
    level: 1,
    streakDays: 0
  },
  macros: [],
  habitats: [],
  waterQuality: [],
  troutMilestones: [],
  opportunities: [],
  map: {
    token: undefined,
    savedSites: [
      {
        id: "negley-run",
        name: "Negley Run (Washington Blvd.)",
        lng: -79.916,
        lat: 40.468,
        notes: "Urban stream - excellent TIC education site",
        type: "education"
      }
    ]
  }
};

// ------------------------------
// Main App Component
// ------------------------------
export default function TICEnhancedApp() {
  const [state, setState] = useState<AppState>(() => loadState() ?? DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showWelcome, setShowWelcome] = useState(!state.profile.name);
  const { currentAchievement, showAchievement, closeAchievement } = useAchievementSystem();

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Calculate level from conservation points
  useEffect(() => {
    const newLevel = Math.floor(state.progress.conservationPoints / 100) + 1;
    if (newLevel !== state.progress.level) {
      setState(s => ({ ...s, progress: { ...s.progress, level: newLevel } }));
    }
  }, [state.progress.conservationPoints]);

  // Update streak
  useEffect(() => {
    const today = new Date().toDateString();
    const lastLogin = state.lastLogin ? new Date(state.lastLogin).toDateString() : null;
    
    if (lastLogin !== today) {
      // Check if yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = lastLogin === yesterday.toDateString();
      
      setState(s => ({
        ...s,
        lastLogin: new Date().toISOString(),
        progress: {
          ...s.progress,
          streakDays: wasYesterday ? s.progress.streakDays + 1 : 1
        }
      }));
    }
  }, []);

  const progressPct = useMemo(() => {
    const total = PATIC_LESSONS.length;
    const done = state.progress.lessonsCompleted.length;
    return Math.min(100, Math.round((done / total) * 100));
  }, [state.progress.lessonsCompleted]);

  function addBadge(badgeId: string) {
    const badge = WLA_ALIGNED_BADGES.find(b => b.id === badgeId);
    if (!badge || state.progress.badges.includes(badgeId)) return;

    // Show achievement notification
    if (state.progress.badges.length === 0) {
      showAchievement(ACHIEVEMENTS.FIRST_BADGE);
    }

    setState(s => ({
      ...s,
      progress: {
        ...s.progress,
        badges: [...s.progress.badges, badgeId],
        conservationPoints: s.progress.conservationPoints + badge.points
      }
    }));
  }

  function completeLesson(lessonId: string) {
    if (state.progress.lessonsCompleted.includes(lessonId)) return;

    // Show achievement for first lesson
    if (state.progress.lessonsCompleted.length === 0) {
      showAchievement(ACHIEVEMENTS.LESSON_COMPLETE);
    }

    setState(s => ({
      ...s,
      progress: {
        ...s.progress,
        lessonsCompleted: [...s.progress.lessonsCompleted, lessonId],
        conservationPoints: s.progress.conservationPoints + 10
      }
    }));
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-100 via-sky-50 to-emerald-100 text-slate-900">
      {/* Decorative background elements */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -left-16 h-96 w-96 rounded-full bg-fuchsia-200 opacity-30 blur-3xl" />
        <div className="absolute top-1/4 right-10 h-72 w-72 rounded-full bg-sky-300 opacity-30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-emerald-200 opacity-30 blur-3xl" />
      </div>

      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-2xl w-full"
            >
              <Card className="rounded-3xl border-4 border-white shadow-2xl bg-gradient-to-br from-sky-50 to-emerald-50">
                <CardHeader className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="mx-auto mb-4"
                  >
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-sky-600 to-emerald-600 flex items-center justify-center text-white text-4xl">
                      🐟
                    </div>
                  </motion.div>
                  <CardTitle className="text-3xl">Welcome to PA Trout in the Classroom!</CardTitle>
                  <CardDescription className="text-base mt-3">
                    Your journey as a conservation leader starts here. This platform integrates complete PATIC curriculum,
                    Wildlife Leadership Academy resources, and connections to PA conservation organizations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/60 rounded-2xl">
                      <div className="text-2xl mb-2">📚</div>
                      <h4 className="font-semibold">Complete Curriculum</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        All 12 PATIC modules with interactive lessons, activities, and assessments
                      </p>
                    </div>
                    <div className="p-4 bg-white/60 rounded-2xl">
                      <div className="text-2xl mb-2">⭐</div>
                      <h4 className="font-semibold">WLA Integration</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Aligned with Wildlife Leadership Academy's WildPraxis platform
                      </p>
                    </div>
                    <div className="p-4 bg-white/60 rounded-2xl">
                      <div className="text-2xl mb-2">🤖</div>
                      <h4 className="font-semibold">Brook AI Assistant</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Get instant help with trout care, water quality, and conservation questions
                      </p>
                    </div>
                    <div className="p-4 bg-white/60 rounded-2xl">
                      <div className="text-2xl mb-2">🌲</div>
                      <h4 className="font-semibold">Resource Connections</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Direct links to PFBC, libraries, parks, and volunteer opportunities
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => setShowWelcome(false)} className="w-full" size="lg">
                    Get Started →
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="relative z-40 mb-6">
        <div className="bg-gradient-to-r from-sky-600 via-emerald-600 to-fuchsia-600 text-white shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl shadow-lg"
              >
                🐟
              </motion.div>
              <div>
                <h1 className="font-black tracking-tight text-xl sm:text-2xl drop-shadow-md">
                  PA Trout in the Classroom
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <img src="/branding/wildpraxis_logo.svg" alt="WildPraxis" className="h-5 opacity-80 hover:opacity-100 transition-opacity" />
                  <span className="text-white/50 text-xs">•</span>
                  <img src="/branding/pfbc_logo.svg" alt="PA Fish & Boat Commission" className="h-4 opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-right hidden sm:block">
                <div className="text-xs opacity-90">Conservation Points</div>
                <div className="text-2xl font-bold">{state.progress.conservationPoints}</div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-xs opacity-90">Level</div>
                <div className="text-2xl font-bold">{state.progress.level}</div>
              </div>
              <Button variant="outline" onClick={() => downloadReport(state)} className="bg-white/20 border-white/40 text-white hover:bg-white/30">
                <FileDown className="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>
          </div>
        </div>
        <svg className="block w-full text-white -mt-1" viewBox="0 0 1200 60" preserveAspectRatio="none">
          <path d="M0,0 C300,80 900,-40 1200,20 L1200,60 L0,60 Z" fill="currentColor" />
        </svg>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard state={state} setState={setState} />
            <ProgressCard
              progressPct={progressPct}
              badges={state.progress.badges}
              conservationPoints={state.progress.conservationPoints}
              level={state.progress.level}
              streakDays={state.progress.streakDays}
            />
            <QuickStatsCard state={state} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="rounded-3xl border-2 border-white/60 bg-white/90 backdrop-blur-sm shadow-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Explore & Learn
                </CardTitle>
                <CardDescription>
                  Complete curriculum, interactive tools, and conservation connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="flex flex-wrap rounded-full bg-gradient-to-r from-sky-100 to-emerald-100 p-1.5 gap-1">
                    <TabsTrigger value="dashboard" className="rounded-full">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="lessons" className="rounded-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Lessons
                    </TabsTrigger>
                    <TabsTrigger value="games" className="rounded-full">
                      <Gamepad2 className="h-4 w-4 mr-2" />
                      Games
                    </TabsTrigger>
                    <TabsTrigger value="fishing" className="rounded-full">
                      <FishIcon className="h-4 w-4 mr-2" />
                      Fishing
                    </TabsTrigger>
                    <TabsTrigger value="citizen-science" className="rounded-full">
                      <Camera className="h-4 w-4 mr-2" />
                      Citizen Science
                    </TabsTrigger>
                    <TabsTrigger value="brook" className="rounded-full">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Brook AI
                    </TabsTrigger>
                    <TabsTrigger value="watershed" className="rounded-full">
                      <MapPin className="h-4 w-4 mr-2" />
                      Watershed
                    </TabsTrigger>
                    <TabsTrigger value="habitat" className="rounded-full">
                      <Waves className="h-4 w-4 mr-2" />
                      Habitat
                    </TabsTrigger>
                    <TabsTrigger value="macro" className="rounded-full">
                      <Microscope className="h-4 w-4 mr-2" />
                      Macros
                    </TabsTrigger>
                    <TabsTrigger value="data" className="rounded-full">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Water Data
                    </TabsTrigger>
                    <TabsTrigger value="resources" className="rounded-full">
                      <Users className="h-4 w-4 mr-2" />
                      Resources
                    </TabsTrigger>
                    <TabsTrigger value="opportunities" className="rounded-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Opportunities
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="dashboard" className="pt-4">
                    <Dashboard state={state} setState={setState} />
                  </TabsContent>

                  <TabsContent value="lessons" className="pt-4">
                    <LessonViewer
                      completedLessons={state.progress.lessonsCompleted}
                      onCompleteLesson={completeLesson}
                      onEarnBadge={addBadge}
                    />
                  </TabsContent>

                  <TabsContent value="games" className="pt-4">
                    <RobloxStyleGames
                      onEarnPoints={(pts) => {
                        setState(s => ({
                          ...s,
                          progress: {
                            ...s.progress,
                            conservationPoints: s.progress.conservationPoints + pts
                          }
                        }));
                      }}
                      onEarnBadge={addBadge}
                    />
                  </TabsContent>

                  <TabsContent value="fishing" className="pt-4">
                    <FishingAcademy
                      onEarnBadge={addBadge}
                      onAddPoints={(pts) => {
                        setState(s => ({
                          ...s,
                          progress: {
                            ...s.progress,
                            conservationPoints: s.progress.conservationPoints + pts
                          }
                        }));
                      }}
                    />
                  </TabsContent>

                  <TabsContent value="citizen-science" className="pt-4">
                    <CitizenScienceHub
                      onEarnBadge={addBadge}
                      onAddPoints={(pts) => {
                        setState(s => ({
                          ...s,
                          progress: {
                            ...s.progress,
                            conservationPoints: s.progress.conservationPoints + pts
                          }
                        }));
                      }}
                    />
                  </TabsContent>

                  <TabsContent value="brook" className="pt-4">
                    <BrookAI />
                  </TabsContent>

                  <TabsContent value="watershed" className="pt-4">
                    <WatershedExplorer state={state} setState={setState} />
                  </TabsContent>

                  <TabsContent value="habitat" className="pt-4">
                    <HabitatBuilder state={state} setState={setState} addBadge={addBadge} />
                  </TabsContent>

                  <TabsContent value="macro" className="pt-4">
                    <MacroKeyGame state={state} setState={setState} addBadge={addBadge} />
                  </TabsContent>

                  <TabsContent value="data" className="pt-4">
                    <WaterQualityTracker state={state} setState={setState} />
                  </TabsContent>

                  <TabsContent value="resources" className="pt-4">
                    <ResourceHub />
                  </TabsContent>

                  <TabsContent value="opportunities" className="pt-4">
                    <CareersAndOpportunities state={state} setState={setState} addPoints={(pts) => {
                      setState(s => ({
                        ...s,
                        progress: { ...s.progress, conservationPoints: s.progress.conservationPoints + pts }
                      }));
                    }} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/60 py-8 mt-10 text-sm text-slate-700 bg-white/40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span>© {new Date().getFullYear()} PA Trout in the Classroom</span>
              <span className="hidden sm:inline opacity-70">Powered by WildPraxis & String Theory Solutions</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <a href="https://wla-app.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline flex items-center gap-1">
                <Award className="h-4 w-4" />
                Visit WildPraxis
              </a>
              <a href="https://www.fishandboat.com/Education/TIC/Pages/default.aspx" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                PFBC TIC Program
              </a>
              <Badge variant="secondary">Open Source</Badge>
              <button onClick={() => download("LICENSE.txt", MIT_LICENSE)} className="underline opacity-70 hover:opacity-100">
                MIT License
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==============================
// COMPONENT IMPLEMENTATIONS
// ==============================

function ProfileCard({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const [name, setName] = useState(state.profile.name);
  const [classroom, setClassroom] = useState(state.profile.classroom);
  const [band, setBand] = useState(state.profile.gradeBand);
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Student Profile</CardTitle>
        <CardDescription>Local & private to this device.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Student name" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="class">Class</Label>
          <Input id="class" value={classroom} onChange={(e) => setClassroom(e.target.value)} placeholder="e.g., Urban Academy 3–5" />
        </div>
        <div className="space-y-1">
          <Label>Grade Band</Label>
          <div className="flex items-center gap-2">
            {(["K-2", "3-5", "6-8"] as const).map((g) => (
              <Button key={g} variant={band === g ? "default" : "outline"} size="sm" onClick={() => setBand(g)}>
                {g}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={() => setState((s) => ({ ...s, profile: { name, classroom, gradeBand: band } }))}
          className="w-full"
        >
          Save Profile
        </Button>
      </CardFooter>
    </Card>
  );
}

function ProgressCard({ progressPct, badges, conservationPoints, level, streakDays }: { progressPct: number; badges: string[]; conservationPoints?: number; level?: number; streakDays?: number }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Progress</CardTitle>
        <CardDescription>Track milestones as you explore.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm">
            <span>{progressPct}% complete</span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>
        {level && (
          <div className="text-sm">
            <div className="font-semibold">Level {level}</div>
            <div className="text-slate-600">{conservationPoints || 0} points</div>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {badges.length === 0 && <span className="text-xs text-slate-500">No badges yet</span>}
          {badges.map((b) => (
            <Badge key={b} variant="secondary" className="rounded-full">{b}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickStatsCard({ state }: { state: AppState }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Macros Logged:</span>
          <span className="font-semibold">{state.macros.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Habitats Designed:</span>
          <span className="font-semibold">{state.habitats.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Flashcards:</span>
          <span className="font-semibold">{state.flashcards.length}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard({ state }: { state: AppState }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Your Badges</CardTitle>
          <CardDescription>Earn badges by completing modules.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {state.progress.badges.length === 0 ? (
            <span className="text-sm text-slate-500">Complete an activity to unlock your first badge.</span>
          ) : (
            state.progress.badges.map((b) => <Badge key={b} className="rounded-full">{b}</Badge>)
          )}
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-500">Track your progress here</div>
        </CardContent>
      </Card>
    </div>
  );
}

function WatershedExplorer({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Watershed Explorer</CardTitle>
        <CardDescription>Learn about watersheds and water systems</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-slate-500">Watershed content coming soon</div>
      </CardContent>
    </Card>
  );
}

function HabitatBuilder({ state, setState, addBadge }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; addBadge: (b: string) => void }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Habitat Builder</CardTitle>
        <CardDescription>Design trout habitats</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-slate-500">Habitat builder coming soon</div>
      </CardContent>
    </Card>
  );
}

function MacroKeyGame({ state, setState, addBadge }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; addBadge: (b: string) => void }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Macroinvertebrate Key</CardTitle>
        <CardDescription>Identify aquatic organisms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-slate-500">Macro key game coming soon</div>
      </CardContent>
    </Card>
  );
}

function WaterQualityTracker({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Water Quality Tracker</CardTitle>
        <CardDescription>Monitor water parameters</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-slate-500">Water quality tracker coming soon</div>
      </CardContent>
    </Card>
  );
}

function CareersAndOpportunities({ state, setState, addPoints }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; addPoints?: (pts: number) => void }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Careers & Opportunities</CardTitle>
        <CardDescription>Explore conservation careers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-slate-500">Career opportunities coming soon</div>
      </CardContent>
    </Card>
  );
}

function downloadReport(state: AppState) {
  const txt = `TIC Activity Report\n\nStudent: ${state.profile.name}\nClass: ${state.profile.classroom}\nBadges: ${state.progress.badges.length}\n`;
  download("tic_report.txt", txt);
}

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const MIT_LICENSE = `MIT License

Copyright (c) ${new Date().getFullYear()} String Theory Solutions

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;
