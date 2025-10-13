// Dashboard and other interactive components
// These are the remaining pieces needed for the enhanced app

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Badge } from "./badge";
import { Progress } from "./progress";
import { motion } from "framer-motion";
import {
  Plus,
  ChevronRight,
  MapPin,
  Waves,
  Upload,
  Microscope,
  TrendingUp,
  RefreshCw,
  Calendar,
  ExternalLink,
  Award
} from "lucide-react";
import type { Map } from "mapbox-gl";

// Re-using types
interface AppState {
  profile: any;
  progress: any;
  waterQuality: any[];
  habitats: any[];
  macros: any[];
  troutMilestones: any[];
  opportunities: any[];
  map: any;
}

// Dashboard Component
export function Dashboard({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const chartData = useMemo(() => buildNitrogenDemoChart(state), [state]);
  
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-sky-50 via-emerald-50 to-fuchsia-50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back, {state.profile.name || "Student"}! 🐟</CardTitle>
          <CardDescription className="text-base">
            You're Level {state.progress.level} with {state.progress.conservationPoints} conservation points. 
            Keep learning to unlock more badges and level up!
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              📚 Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Water Reading
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Log Observation
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Award className="h-4 w-4 mr-2" />
              Continue Lesson
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base">📊 Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {state.waterQuality.slice(0, 3).map((wq: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <span className="text-slate-600">Water test</span>
                  <span className="text-xs text-slate-500">{new Date(wq.date).toLocaleDateString()}</span>
                </div>
              ))}
              {state.waterQuality.length === 0 && (
                <div className="text-slate-500 text-center py-4">No activity yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-sky-50 rounded-lg">
                <div className="font-medium">Spring Release Day</div>
                <div className="text-xs text-slate-600">May 15, 2025</div>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <div className="font-medium">WLA Field Day</div>
                <div className="text-xs text-slate-600">April 20, 2025</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Water Quality Chart */}
      <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Nitrogen Cycle Tracking</CardTitle>
          <CardDescription>Monitor ammonia → nitrite → nitrate levels over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <NitrogenChart data={chartData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NitrogenChart({ data }: { data: any[] }) {
  const [lib, setLib] = useState<any | null>(null);
  useEffect(() => {
    (async () => {
      const mod = await import("recharts");
      setLib(mod);
    })();
  }, []);
  
  if (!lib) return <div className="text-sm text-slate-500">Loading chart…</div>;
  
  const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } = lib;
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <XAxis dataKey="week" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="ammonia" stroke="#ef4444" strokeWidth={2} dot={false} />
        <Line yAxisId="left" type="monotone" dataKey="nitrite" stroke="#f59e0b" strokeWidth={2} dot={false} />
        <Line yAxisId="left" type="monotone" dataKey="nitrate" stroke="#10b981" strokeWidth={2} dot={false} />
        <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#3b82f6" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function buildNitrogenDemoChart(state: AppState) {
  const base = [
    { w: 1, a: 0.2, i: 0, n: 5, t: 54 },
    { w: 2, a: 0.5, i: 0.1, n: 8, t: 54 },
    { w: 3, a: 0.7, i: 0.2, n: 10, t: 55 },
    { w: 4, a: 0.5, i: 0.4, n: 12, t: 55 },
    { w: 5, a: 0.2, i: 0.6, n: 15, t: 55 },
    { w: 6, a: 0.1, i: 0.4, n: 20, t: 55 },
    { w: 7, a: 0.05, i: 0.2, n: 25, t: 55 },
    { w: 8, a: 0.05, i: 0.1, n: 30, t: 55 },
    { w: 9, a: 0.05, i: 0.05, n: 28, t: 55 },
    { w: 10, a: 0.05, i: 0.05, n: 22, t: 55 },
  ];
  return base.map((r) => ({ week: r.w, ammonia: r.a, nitrite: r.i, nitrate: r.n, temperature: r.t }));
}

// Watershed Explorer - using original code
export function WatershedExplorer({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !state.map.token) return;
    let cancelled = false;
    (async () => {
      const mapboxgl = await import("mapbox-gl");
      mapboxgl.default.accessToken = state.map.token!;
      const map = new mapboxgl.default.Map({
        container: containerRef.current!,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [-79.95, 40.45],
        zoom: 11.2,
      });
      mapRef.current = map as unknown as Map;
      map.on("load", () => {
        if (!cancelled) setReady(true);
      });
      return () => {
        cancelled = true;
        map.remove();
      };
    })();
  }, [state.map.token]);

  useEffect(() => {
    if (!ready) return;
    (async () => {
      const mapboxgl = await import("mapbox-gl");
      const map = mapRef.current as any;
      state.map.savedSites.forEach((site: any) => {
        const el = document.createElement("div");
        el.className = "rounded-full bg-sky-600 shadow text-white text-xs px-2 py-1";
        el.textContent = "●";
        new mapboxgl.default.Marker(el)
          .setLngLat([site.lng, site.lat])
          .setPopup(new mapboxgl.default.Popup().setHTML(`<strong>${site.name}</strong><br/>${site.notes ?? ""}`))
          .addTo(map);
      });
    })();
  }, [ready, state.map.savedSites]);

  const [name, setName] = useState("");
  const [lng, setLng] = useState("-79.916");
  const [lat, setLat] = useState("40.468");
  const [notes, setNotes] = useState("");

  return (
    <div className="space-y-4">
      {!state.map.token && (
        <Card className="border-dashed rounded-3xl border-2 border-white/60 bg-white/60 backdrop-blur">
          <CardContent className="py-6 text-sm text-slate-700">
            To enable the interactive map, you'll need a Mapbox token. You can get one free at mapbox.com. 
            For now, you can still add sites and they'll appear once you add the token.
          </CardContent>
        </Card>
      )}
      <div className="h-96 rounded-2xl overflow-hidden border-2 border-white/60" ref={containerRef} />
      <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-5 w-5 text-sky-600" />
            Add Local Site
          </CardTitle>
          <CardDescription>Save field trip locations, sampling sites, or release sites</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-1 md:col-span-2">
            <Label>Site Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Negley Run – Washington Blvd." />
          </div>
          <div className="space-y-1">
            <Label>Longitude</Label>
            <Input value={lng} onChange={(e) => setLng(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Latitude</Label>
            <Input value={lat} onChange={(e) => setLat(e.target.value)} />
          </div>
          <div className="md:col-span-4 space-y-1">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Field notes, water quality, habitat observations..." />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => {
            const id = `${Date.now()}`;
            setState((s: any) => ({
              ...s,
              map: {
                ...s.map,
                savedSites: [...s.map.savedSites, { id, name: name || "Unnamed site", lng: Number(lng), lat: Number(lat), notes }]
              }
            }));
            setName("");
            setNotes("");
          }}>
            <Plus className="h-4 w-4 mr-2" /> Add Site
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Habitat Builder - simplified version
export function HabitatBuilder({ state, setState, addBadge }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; addBadge: (b: string) => void }) {
  const [temperatureF, setTemperatureF] = useState(55);
  const [flow, setFlow] = useState<"riffle" | "run" | "pool">("riffle");
  const [shade, setShade] = useState(60);
  const [cover, setCover] = useState(50);
  const [notes, setNotes] = useState("");

  const score = useMemo(() => {
    let s = 0;
    s += 50 - Math.min(50, Math.abs(54 - temperatureF) * 10);
    s += flow === "riffle" ? 20 : flow === "run" ? 15 : 5;
    s += Math.min(15, shade * 0.12);
    s += Math.min(15, cover * 0.12);
    return Math.round(Math.max(0, Math.min(100, s)));
  }, [temperatureF, flow, shade, cover]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Waves className="h-5 w-5 text-sky-600" />
            Build a Trout Habitat
          </CardTitle>
          <CardDescription>Adjust parameters to create ideal trout habitat</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label>Temperature: {temperatureF}°F (Target: 52-56°F)</Label>
              <input type="range" min={45} max={62} value={temperatureF} onChange={(e) => setTemperatureF(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <Label>Flow Type</Label>
              <div className="flex gap-2">
                {(["riffle", "run", "pool"] as const).map((f) => (
                  <Button key={f} size="sm" variant={flow === f ? "default" : "outline"} onClick={() => setFlow(f)} className="flex-1">
                    {f}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label>Shade: {shade}%</Label>
              <input type="range" min={0} max={100} value={shade} onChange={(e) => setShade(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <Label>Cover: {cover}%</Label>
              <input type="range" min={0} max={100} value={cover} onChange={(e) => setCover(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe this habitat..." />
            </div>
            <div>
              <Label>Habitat Score</Label>
              <Progress value={score} className="h-3" />
              <div className="text-sm mt-1">{score}/100</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => {
            setState((s: any) => ({
              ...s,
              habitats: [...s.habitats, {
                id: `${Date.now()}`,
                date: new Date().toISOString(),
                temperatureF,
                dissolvedOxygen: 11 - (temperatureF - 45) * (4 / 17),
                flow,
                shade,
                cover,
                notes,
                score
              }],
              progress: {
                ...s.progress,
                conservationPoints: s.progress.conservationPoints + 10
              }
            }));
            addBadge("habitat-hero");
          }} className="w-full">
            Save Habitat Design (+10 pts)
          </Button>
        </CardFooter>
      </Card>

      <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Saved Habitats</CardTitle>
        </CardHeader>
        <CardContent>
          {state.habitats.length === 0 ? (
            <div className="text-sm text-slate-500 text-center py-8">No habitats saved yet</div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {state.habitats.map((h: any) => (
                <div key={h.id} className="p-3 border rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{h.flow} - {h.temperatureF}°F</div>
                    <Badge>{h.score}/100</Badge>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Shade {h.shade}% • Cover {h.cover}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Macro ID Game - simplified
export function MacroKeyGame({ state, setState, addBadge }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; addBadge: (b: string) => void }) {
  const [fileName, setFileName] = useState<string | undefined>();

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Microscope className="h-5 w-5 text-purple-600" />
            Macroinvertebrate Identification
          </CardTitle>
          <CardDescription>Learn to identify stream insects - indicators of water quality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="font-semibold text-emerald-900 mb-2">Pollution Sensitive</div>
              <ul className="text-sm space-y-1">
                <li>• Mayflies (3 tails)</li>
                <li>• Stoneflies (2 tails)</li>
                <li>• Caddisflies (cases)</li>
              </ul>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="font-semibold text-amber-900 mb-2">Somewhat Tolerant</div>
              <ul className="text-sm space-y-1">
                <li>• Dragonflies</li>
                <li>• Crayfish</li>
                <li>• Scuds</li>
              </ul>
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="font-semibold text-red-900 mb-2">Pollution Tolerant</div>
              <ul className="text-sm space-y-1">
                <li>• Aquatic worms</li>
                <li>• Leeches</li>
                <li>• Midges</li>
              </ul>
            </div>
          </div>

          <div>
            <Label>Upload Macro Photo (Optional)</Label>
            <Input type="file" accept="image/*" onChange={(e) => {
              const f = e.target.files?.[0];
              setFileName(f ? f.name : undefined);
              if (f) addBadge("macro-master");
            }} />
            <div className="text-xs text-slate-500 mt-2">
              Photos are stored locally. Use them with the dichotomous key to identify your findings!
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Recent Identifications</CardTitle>
        </CardHeader>
        <CardContent>
          {state.macros.length === 0 ? (
            <div className="text-sm text-slate-500 text-center py-8">No identifications yet</div>
          ) : (
            <div className="space-y-2">
              {state.macros.map((m: any) => (
                <div key={m.id} className="p-3 border rounded-xl">
                  <div className="font-medium">{m.outcome}</div>
                  <div className="text-xs text-slate-600">{new Date(m.date).toLocaleDateString()}</div>
                  {m.imageName && <div className="text-xs mt-1">📷 {m.imageName}</div>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Careers & Opportunities
export function CareersAndOpportunities({ state, setState, addPoints }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; addPoints: (pts: number) => void }) {
  const [query, setQuery] = useState("");
  const items = state.opportunities.filter((o: any) =>
    (o.title + o.org + o.location + o.tags.join(" ")).toLowerCase().includes(query.toLowerCase())
  );

  async function syncOpportunities() {
    try {
      const res = await fetch(import.meta.env.BASE_URL + "data/opportunities.json");
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data.items || []);
        setState(s => ({
          ...s,
          opportunities: items,
          lastOpptySync: new Date().toISOString()
        }));
      }
    } catch (e) {
      console.error("Failed to sync opportunities", e);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search internships, volunteer events, training..."
          className="flex-1"
        />
        <Button onClick={syncOpportunities}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {items.length === 0 && (
          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur md:col-span-2">
            <CardContent className="text-center py-12 text-slate-500">
              No opportunities found. Click Refresh to load latest listings.
            </CardContent>
          </Card>
        )}
        
        {items.map((opp: any) => (
          <Card key={opp.id} className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">{opp.title}</CardTitle>
                  <CardDescription className="mt-1">{opp.org} • {opp.location}</CardDescription>
                </div>
                {opp.pointValue && (
                  <Badge className="bg-amber-600">+{opp.pointValue} pts</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {opp.description && (
                <p className="text-sm text-slate-700 mb-3">{opp.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {opp.tags?.map((tag: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              {opp.url && (
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <a href={opp.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Learn More
                  </a>
                </Button>
              )}
              {opp.pointValue && (
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    addPoints(opp.pointValue);
                  }}
                >
                  I Participated
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Helper function for report download
export function downloadReport(state: AppState) {
  const lines: string[] = [];
  lines.push(`# PA Trout in the Classroom - Activity Report`);
  lines.push(`Student: ${state.profile.name || "(anonymous)"}`);
  lines.push(`School: ${state.profile.school || "N/A"}`);
  lines.push(`Grade Band: ${state.profile.gradeBand}`);
  lines.push(``);
  lines.push(`Conservation Points: ${state.progress.conservationPoints}`);
  lines.push(`Level: ${state.progress.level}`);
  lines.push(`Lessons Completed: ${state.progress.lessonsCompleted.length}`);
  lines.push(`Badges: ${state.progress.badges.join(", ") || "None"}`);
  lines.push(``);
  lines.push(`Water Quality Tests: ${state.waterQuality.length}`);
  lines.push(`Macro Identifications: ${state.macros.length}`);
  lines.push(`Habitat Designs: ${state.habitats.length}`);
  lines.push(``);
  lines.push(`Generated: ${new Date().toLocaleString()}`);

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tic_report.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
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

export { MIT_LICENSE };

