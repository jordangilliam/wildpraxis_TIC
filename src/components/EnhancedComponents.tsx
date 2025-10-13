// Enhanced Component Library for TIC App
// Supporting components for the main enhanced app

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Badge } from "./badge";
import { Progress } from "./progress";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Droplets,
  Thermometer,
  Activity,
  Calendar,
  Plus,
  Flame,
  Target,
  Award,
  Zap,
  ChevronRight
} from "lucide-react";
import type { Map } from "mapbox-gl";

// Import types from main app
interface AppState {
  profile: {
    name: string;
    gradeBand: string;
    classroom: string;
    school: string;
    county: string;
  };
  progress: {
    lessonsCompleted: string[];
    modulesCompleted: Record<string, boolean>;
    badges: string[];
    conservationPoints: number;
    level: number;
    streakDays: number;
  };
  waterQuality: Array<{
    id: string;
    date: string;
    temperature: number;
    ammonia: number;
    nitrite: number;
    nitrate: number;
    pH: number;
    dissolvedOxygen: number;
    notes?: string;
  }>;
  habitats: Array<{
    id: string;
    date: string;
    temperatureF: number;
    dissolvedOxygen: number;
    flow: "riffle" | "run" | "pool";
    shade: number;
    cover: number;
    notes?: string;
    score: number;
  }>;
  macros: Array<{
    id: string;
    date: string;
    imageName?: string;
    outcome: string;
    path: string[];
    location?: string;
  }>;
  troutMilestones: Array<{
    id: string;
    date: string;
    milestone: string;
    count?: number;
    notes?: string;
  }>;
  opportunities: any[];
  map: any;
}

// Profile Card with enhanced styling
export function ProfileCard({
  state,
  setState
}: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(state.profile.name);
  const [school, setSchool] = useState(state.profile.school);
  const [classroom, setClassroom] = useState(state.profile.classroom);
  const [band, setBand] = useState(state.profile.gradeBand);

  return (
    <Card className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-white to-sky-50 backdrop-blur shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-600 to-emerald-600 flex items-center justify-center text-white text-sm">
              {state.profile.name ? state.profile.name[0].toUpperCase() : "?"}
            </div>
            Student Profile
          </CardTitle>
        </div>
        <CardDescription className="text-xs">Local & private - no cloud login required</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {editing ? (
          <>
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="school" className="text-xs">School</Label>
              <Input id="school" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="School name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="class" className="text-xs">Classroom</Label>
              <Input id="class" value={classroom} onChange={(e) => setClassroom(e.target.value)} placeholder="Classroom/Teacher" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Grade Band</Label>
              <div className="flex gap-2">
                {(["K-2", "3-5", "6-8"] as const).map((g) => (
                  <Button
                    key={g}
                    variant={band === g ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setBand(g)}
                  >
                    {g}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => {
                  setState((s) => ({
                    ...s,
                    profile: { ...s.profile, name, school, classroom, gradeBand: band }
                  }));
                  setEditing(false);
                }}
                className="flex-1"
                size="sm"
              >
                Save
              </Button>
              <Button onClick={() => setEditing(false)} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2 text-sm">
              <div>
                <div className="text-xs text-slate-500">Name</div>
                <div className="font-medium">{state.profile.name || "Not set"}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">School</div>
                <div className="font-medium">{state.profile.school || "Not set"}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Grade</div>
                <Badge variant="secondary" className="text-xs">{state.profile.gradeBand}</Badge>
              </div>
            </div>
            <Button onClick={() => setEditing(true)} variant="outline" size="sm" className="w-full mt-2">
              Edit Profile
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Enhanced Progress Card with gamification
export function ProgressCard({
  progressPct,
  badges,
  conservationPoints,
  level,
  streakDays
}: {
  progressPct: number;
  badges: string[];
  conservationPoints: number;
  level: number;
  streakDays: number;
}) {
  const pointsToNextLevel = (level * 100) - conservationPoints;

  return (
    <Card className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-white to-emerald-50 backdrop-blur shadow-lg">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level Progress */}
        <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold">
                {level}
              </div>
              <div>
                <div className="font-semibold text-sm">Level {level} Ambassador</div>
                <div className="text-xs text-slate-600">{conservationPoints} points</div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="h-2 w-full bg-white/60 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-600"
                initial={{ width: 0 }}
                animate={{ width: `${((conservationPoints % 100) / 100) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="text-xs text-slate-600">{pointsToNextLevel} points to Level {level + 1}</div>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border border-sky-200">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-600" />
            <div>
              <div className="font-semibold text-sm">{streakDays} Day Streak</div>
              <div className="text-xs text-slate-600">Keep it up!</div>
            </div>
          </div>
        </div>

        {/* Curriculum Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span>Lessons Complete</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2 w-full bg-white/60 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-sky-600"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Badges */}
        <div>
          <div className="text-xs font-medium mb-2">{badges.length} Badges Earned</div>
          <div className="flex flex-wrap gap-2">
            {badges.length === 0 ? (
              <span className="text-xs text-slate-500">Complete activities to earn badges</span>
            ) : (
              badges.slice(0, 3).map((b) => (
                <Badge key={b} className="text-xs bg-gradient-to-r from-sky-600 to-emerald-600">
                  {b}
                </Badge>
              ))
            )}
            {badges.length > 3 && (
              <Badge variant="secondary" className="text-xs">+{badges.length - 3} more</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Quick Stats Card
export function QuickStatsCard({ state }: { state: AppState }) {
  return (
    <Card className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-white to-fuchsia-50 backdrop-blur shadow-lg">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-white/60 rounded-xl">
            <div className="text-2xl font-bold text-sky-600">{state.waterQuality.length}</div>
            <div className="text-xs text-slate-600">Water Tests</div>
          </div>
          <div className="text-center p-2 bg-white/60 rounded-xl">
            <div className="text-2xl font-bold text-emerald-600">{state.macros.length}</div>
            <div className="text-xs text-slate-600">Macro IDs</div>
          </div>
          <div className="text-center p-2 bg-white/60 rounded-xl">
            <div className="text-2xl font-bold text-amber-600">{state.habitats.length}</div>
            <div className="text-xs text-slate-600">Habitats</div>
          </div>
          <div className="text-center p-2 bg-white/60 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">{state.troutMilestones.length}</div>
            <div className="text-xs text-slate-600">Milestones</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Water Quality Tracker Component
export function WaterQualityTracker({
  state,
  setState
}: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}) {
  const [temperature, setTemperature] = useState(52);
  const [ammonia, setAmmonia] = useState(0);
  const [nitrite, setNitrite] = useState(0);
  const [nitrate, setNitrate] = useState(5);
  const [pH, setPH] = useState(7.0);
  const [dO, setDO] = useState(8.5);
  const [notes, setNotes] = useState("");

  function addReading() {
    const reading = {
      id: `${Date.now()}`,
      date: new Date().toISOString(),
      temperature,
      ammonia,
      nitrite,
      nitrate,
      pH,
      dissolvedOxygen: dO,
      notes
    };

    setState(s => ({
      ...s,
      waterQuality: [reading, ...s.waterQuality],
      progress: {
        ...s.progress,
        conservationPoints: s.progress.conservationPoints + 5
      }
    }));

    setNotes("");
  }

  // Get latest reading
  const latest = state.waterQuality[0];

  // Calculate water quality score
  const score = useMemo(() => {
    if (!latest) return 0;
    let pts = 100;
    
    // Temperature: ideal 48-55°F
    if (latest.temperature < 48 || latest.temperature > 58) pts -= 20;
    else if (latest.temperature > 55) pts -= 10;

    // Ammonia: should be 0
    if (latest.ammonia > 0.5) pts -= 30;
    else if (latest.ammonia > 0.25) pts -= 15;

    // Nitrite: should be 0
    if (latest.nitrite > 0.5) pts -= 30;
    else if (latest.nitrite > 0.25) pts -= 15;

    // Nitrate: below 40 is good
    if (latest.nitrate > 40) pts -= 20;

    // pH: 6.5-8.0 ideal
    if (latest.pH < 6.0 || latest.pH > 8.5) pts -= 15;

    // DO: above 7 ppm ideal
    if (latest.dissolvedOxygen < 7) pts -= 15;

    return Math.max(0, pts);
  }, [latest]);

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-sky-50 to-blue-50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-sky-600" />
            Water Quality Monitoring
          </CardTitle>
          <CardDescription>
            Track ammonia, nitrite, nitrate, temperature, pH, and DO. Build your nitrogen cycle data!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {latest && (
            <div className="mb-6 p-4 bg-white rounded-2xl border-2 border-sky-200">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium">Latest Reading</div>
                <Badge className={`${score >= 80 ? "bg-emerald-600" : score >= 60 ? "bg-amber-600" : "bg-red-600"}`}>
                  Score: {score}/100
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-xs text-slate-500">Temp</div>
                  <div className="font-bold">{latest.temperature}°F</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Ammonia</div>
                  <div className="font-bold">{latest.ammonia} ppm</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Nitrite</div>
                  <div className="font-bold">{latest.nitrite} ppm</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Nitrate</div>
                  <div className="font-bold">{latest.nitrate} ppm</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">pH</div>
                  <div className="font-bold">{latest.pH}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">DO</div>
                  <div className="font-bold">{latest.dissolvedOxygen} ppm</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Temperature (°F)</Label>
              <Input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                step="0.1"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Ammonia (ppm)</Label>
              <Input
                type="number"
                value={ammonia}
                onChange={(e) => setAmmonia(Number(e.target.value))}
                step="0.1"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Nitrite (ppm)</Label>
              <Input
                type="number"
                value={nitrite}
                onChange={(e) => setNitrite(Number(e.target.value))}
                step="0.1"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Nitrate (ppm)</Label>
              <Input
                type="number"
                value={nitrate}
                onChange={(e) => setNitrate(Number(e.target.value))}
                step="1"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">pH</Label>
              <Input
                type="number"
                value={pH}
                onChange={(e) => setPH(Number(e.target.value))}
                step="0.1"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Dissolved Oxygen (ppm)</Label>
              <Input
                type="number"
                value={dO}
                onChange={(e) => setDO(Number(e.target.value))}
                step="0.1"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label className="text-xs">Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observations, water changes, feeding notes..."
              rows={2}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={addReading} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Save Reading (+5 pts)
          </Button>
        </CardFooter>
      </Card>

      {/* Readings History */}
      <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Reading History</CardTitle>
          <CardDescription>{state.waterQuality.length} total readings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {state.waterQuality.length === 0 ? (
              <div className="text-sm text-slate-500 text-center py-8">No readings yet</div>
            ) : (
              state.waterQuality.map((reading) => (
                <div key={reading.id} className="p-3 border rounded-xl bg-slate-50 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{new Date(reading.date).toLocaleDateString()}</div>
                    <div className="text-xs text-slate-500">{new Date(reading.date).toLocaleTimeString()}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div><span className="text-slate-500">Temp:</span> {reading.temperature}°F</div>
                    <div><span className="text-slate-500">NH3:</span> {reading.ammonia}</div>
                    <div><span className="text-slate-500">NO2:</span> {reading.nitrite}</div>
                    <div><span className="text-slate-500">NO3:</span> {reading.nitrate}</div>
                    <div><span className="text-slate-500">pH:</span> {reading.pH}</div>
                    <div><span className="text-slate-500">DO:</span> {reading.dissolvedOxygen}</div>
                  </div>
                  {reading.notes && (
                    <div className="mt-2 text-xs text-slate-600 italic">{reading.notes}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default {
  ProfileCard,
  ProgressCard,
  QuickStatsCard,
  WaterQualityTracker
};

