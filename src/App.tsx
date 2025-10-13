import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Textarea } from "@/components/textarea";
import { Switch } from "@/components/switch";
import { Progress } from "@/components/progress";
const Badge = ({ children, variant="secondary", className="" }:{ children: React.ReactNode; variant?: string; className?: string }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${variant==='secondary' ? 'bg-slate-100 text-slate-700' : ''} ${className}`}>{children}</span>
);
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
} from "lucide-react";
import type { Map } from "mapbox-gl";

// NOTE: If bundler complains about mapbox CSS, add it to your global CSS (e.g., index.css):
// @import "mapbox-gl/dist/mapbox-gl.css";

// ------------------------------
// Utilities
// ------------------------------
const LS_KEY = "tic_app_state_v1";
const LS_TOKEN = "mapbox_token";

function saveState(state: AppState) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}
function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function classNames(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
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

// ------------------------------
// Types
// ------------------------------
interface Opportunity {
  id: string;
  org: string; // e.g., WLA, TU, DCNR, PFBC
  title: string;
  location: string;
  startDate?: string; // ISO
  url?: string;
  tags: string[];
  lastUpdated: string; // ISO
}

interface MacroRecord {
  id: string;
  date: string;
  imageName?: string;
  outcome: string; // e.g., "Mayfly (Ephemeroptera)"
  path: string[]; // decision path
}

interface HabitatDesign {
  id: string;
  date: string;
  temperatureF: number;
  dissolvedOxygen: number; // ppm (if measured/assumed)
  flow: "riffle" | "run" | "pool";
  shade: number; // 0-100
  cover: number; // 0-100
  notes?: string;
  score: number; // computed
}

interface FlashcardResult {
  id: string;
  term: string;
  rating: 0 | 1 | 2; // 0=again, 1=hard, 2=easy
  when: string; // ISO
}

interface Profile {
  name: string;
  gradeBand: "K-2" | "3-5" | "6-8";
  classroom: string;
}

interface AppState {
  profile: Profile;
  progress: {
    modulesCompleted: Record<string, boolean>;
    badges: string[];
  };
  macros: MacroRecord[];
  habitats: HabitatDesign[];
  flashcards: FlashcardResult[];
  opportunities: Opportunity[];
  lastOpptySync?: string; // ISO
  map: {
    token?: string;
    savedSites: Array<{ id: string; name: string; lng: number; lat: number; notes?: string }>; // e.g., Negley Run, etc.
  };
}

const DEFAULT_STATE: AppState = {
  profile: { name: "", gradeBand: "3-5", classroom: "Urban Academy" },
  progress: { modulesCompleted: {}, badges: [] },
  macros: [],
  habitats: [],
  flashcards: [],
  opportunities: [],
  map: {
    token: undefined,
    savedSites: [
      {
        id: "negley-run",
        name: "Negley Run (Washington Blvd.)",
        // Approximate coordinates for demo; replace with verified values if needed
        lng: -79.916, // placeholder
        lat: 40.468, // placeholder
        notes: "Demo marker — update with site-specific notes and sampling protocols.",
      },
    ],
  },
};

// ------------------------------
// Sample Data (can be replaced by weekly sync)
// ------------------------------
const SAMPLE_FLASHCARDS = [
  { term: "Alevin", def: "Baby trout with a yolk sac." },
  { term: "DO (Dissolved Oxygen)", def: "Oxygen mixed into the water." },
  { term: "Riffle", def: "Shallow, fast, broken-surface flow." },
  { term: "Nitrite (NO2-)", def: "Middle stage of nitrogen cycle; spikes after first feeds." },
  { term: "Nitrate (NO3-)", def: "End product; managed with partial water changes." },
  { term: "Parr Marks", def: "Oval bars on juvenile trout." },
  { term: "Stream Order", def: "System for numbering streams by size." },
  { term: "AIS", def: "Aquatic Invasive Species; prevent with Clean–Drain–Dry." },
  { term: "Macroinvertebrate", def: "Invertebrate visible without a microscope (e.g., mayfly)." },
  { term: "RCC", def: "River Continuum Concept connecting headwaters to big rivers." },
];

const SAMPLE_OPPORTUNITIES: Opportunity[] = [
  {
    id: "wla-ambassador-spring",
    org: "Wildlife Leadership Academy",
    title: "Youth Conservation Ambassador Projects (Spring)",
    location: "SW PA",
    tags: ["youth", "field", "ambassador"],
    lastUpdated: new Date().toISOString(),
    url: "",
  },
  {
    id: "tu-stream-restore",
    org: "Trout Unlimited",
    title: "Weekend Stream Restoration Day",
    location: "Allegheny County",
    tags: ["habitat", "volunteer"],
    lastUpdated: new Date().toISOString(),
    url: "",
  },
  {
    id: "dcnr-env-ed",
    org: "DCNR",
    title: "Environmental Education Internships",
    location: "Regional",
    tags: ["internship", "education"],
    lastUpdated: new Date().toISOString(),
    url: "",
  },
  {
    id: "pfbc-field-day",
    org: "PA Fish & Boat Commission",
    title: "Coldwater Field Survey — Ride‑along",
    location: "Western PA",
    tags: ["career", "field"],
    lastUpdated: new Date().toISOString(),
    url: "",
  },
];

// ------------------------------
// App Component
// ------------------------------
export default function TICOpenSourceApp() {
  const [state, setState] = useState<AppState>(() => loadState() ?? DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    saveState(state);
  }, [state]);

  const progressPct = useMemo(() => {
    const total = 20; // arbitrary milestones (can wire to actual modules)
    const done = Object.values(state.progress.modulesCompleted).filter(Boolean).length;
    return Math.min(100, Math.round((done / total) * 100));
  }, [state.progress.modulesCompleted]);

  function addBadge(b: string) {
    setState((s) =>
      s.progress.badges.includes(b)
        ? s
        : { ...s, progress: { ...s.progress, badges: [...s.progress.badges, b] } }
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
              <div className="h-10 w-10 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow">
                <FishIcon className="h-5 w-5" />
              </div>
            </motion.div>
            <div>
              <h1 className="font-semibold leading-tight">Trout in the Classroom — Pittsburgh Watershed</h1>
              <p className="text-sm text-slate-500">Urban Academy · Negley Run + adjacent streams · Open‑source</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => downloadReport(state)}>Generate Report</Button>
            <Button size="sm" onClick={() => simulateWeeklySync(setState)}>Sync Opportunities</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard state={state} setState={setState} />
            <ProgressCard progressPct={progressPct} badges={state.progress.badges} />
            <MapboxTokenCard state={state} setState={setState} />
          </div>
          <div className="lg:col-span-3">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Explore & Learn</CardTitle>
                <CardDescription>Interactive modules for habitat, macros, watershed, memory‑boost games, and careers.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="flex flex-wrap">
                    <TabsTrigger value="dashboard"><BarChart3 className="h-4 w-4 mr-2"/>Dashboard</TabsTrigger>
                    <TabsTrigger value="watershed"><MapPin className="h-4 w-4 mr-2"/>Watershed Explorer</TabsTrigger>
                    <TabsTrigger value="habitat"><Waves className="h-4 w-4 mr-2"/>Habitat Builder</TabsTrigger>
                    <TabsTrigger value="macro"><Microscope className="h-4 w-4 mr-2"/>Macro ID</TabsTrigger>
                    <TabsTrigger value="games"><BookOpenCheck className="h-4 w-4 mr-2"/>Memory & Games</TabsTrigger>
                    <TabsTrigger value="careers"><BadgeCheck className="h-4 w-4 mr-2"/>Careers & Opportunities</TabsTrigger>
                    <TabsTrigger value="progress"><Star className="h-4 w-4 mr-2"/>Progress & Reports</TabsTrigger>
                    <TabsTrigger value="admin"><Settings className="h-4 w-4 mr-2"/>Teacher Admin</TabsTrigger>
                  </TabsList>

                  <TabsContent value="dashboard" className="pt-4"><Dashboard state={state} /></TabsContent>
                  <TabsContent value="watershed" className="pt-4">
                    <WatershedExplorer state={state} setState={setState} />
                  </TabsContent>
                  <TabsContent value="habitat" className="pt-4">
                    <HabitatBuilder state={state} setState={setState} addBadge={addBadge} />
                  </TabsContent>
                  <TabsContent value="macro" className="pt-4">
                    <MacroKeyGame state={state} setState={setState} addBadge={addBadge} />
                  </TabsContent>
                  <TabsContent value="games" className="pt-4">
                    <MemoryGames state={state} setState={setState} addBadge={addBadge} />
                  </TabsContent>
                  <TabsContent value="careers" className="pt-4">
                    <CareersAndOpportunities state={state} setState={setState} />
                  </TabsContent>
                  <TabsContent value="progress" className="pt-4">
                    <ReportView state={state} />
                  </TabsContent>
                  <TabsContent value="admin" className="pt-4">
                    <TeacherAdmin state={state} setState={setState} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 mt-10 text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} Urban Academy · TIC · String Theory Solutions / WildPraxis</div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">Open‑source</Badge>
            <a className="underline" href="#" onClick={(e)=>{e.preventDefault(); download("LICENSE.txt", MIT_LICENSE)}}>MIT License</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ------------------------------
// Header Cards
// ------------------------------
function ProfileCard({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const [name, setName] = useState(state.profile.name);
  const [classroom, setClassroom] = useState(state.profile.classroom);
  const [band, setBand] = useState(state.profile.gradeBand);
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Student Profile</CardTitle>
        <CardDescription>Local & private to this device (no cloud login).</CardDescription>
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

function ProgressCard({ progressPct, badges }: { progressPct: number; badges: string[] }) {
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

function MapboxTokenCard({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const [token, setToken] = useState(state.map.token ?? localStorage.getItem(LS_TOKEN) ?? "");
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Map Access</CardTitle>
        <CardDescription>Enter a Mapbox token to enable the interactive map.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="pk.YourMapboxToken" />
        <Button
          variant="outline"
          onClick={() => {
            localStorage.setItem(LS_TOKEN, token);
            setState((s) => ({ ...s, map: { ...s.map, token } }));
          }}
        >
          Save Token
        </Button>
        <p className="text-xs text-slate-500">Token is stored locally only.</p>
      </CardContent>
    </Card>
  );
}

// ------------------------------
// Dashboard
// ------------------------------
function Dashboard({ state }: { state: AppState }) {
  const chartData = useMemo(() => buildNitrogenDemoChart(state), [state]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Nitrogen Cycle (demo)</CardTitle>
          <CardDescription>Overlay ammonia → nitrite → nitrate with temperature.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <NitrogenChart data={chartData} />
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
}

function NitrogenChart({ data }: { data: any[] }) {
  // Lazy import recharts to avoid SSR pitfalls
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
        <Line yAxisId="left" type="monotone" dataKey="ammonia" strokeWidth={2} dot={false} />
        <Line yAxisId="left" type="monotone" dataKey="nitrite" strokeWidth={2} dot={false} />
        <Line yAxisId="left" type="monotone" dataKey="nitrate" strokeWidth={2} dot={false} />
        <Line yAxisId="right" type="monotone" dataKey="temperature" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function buildNitrogenDemoChart(state: AppState) {
  // Demo scaffold: weeks 1–10 with a typical pattern
  const base = [
    { w: 1, a: 0.2, i: 0, n: 5, t: 54 },
    { w: 2, a: 0.5, i: 0.1, n: 8, t: 54 },
    { w: 3, a: 0.7, i: 0.2, n: 10, t: 55 },
    { w: 4, a: 0.5, i: 0.4, n: 12, t: 55 }, // first feed week
    { w: 5, a: 0.2, i: 0.6, n: 15, t: 55 },
    { w: 6, a: 0.1, i: 0.4, n: 20, t: 55 },
    { w: 7, a: 0.05, i: 0.2, n: 25, t: 55 },
    { w: 8, a: 0.05, i: 0.1, n: 30, t: 55 },
    { w: 9, a: 0.05, i: 0.05, n: 28, t: 55 },
    { w: 10, a: 0.05, i: 0.05, n: 22, t: 55 },
  ];
  return base.map((r) => ({ week: r.w, ammonia: r.a, nitrite: r.i, nitrate: r.n, temperature: r.t }));
}

// ------------------------------
// Watershed Explorer (Mapbox GL)
// ------------------------------
function WatershedExplorer({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
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
        center: [-79.95, 40.45], // Pittsburgh approx
        zoom: 11.2,
      });
      mapRef.current = map as unknown as Map;

      map.on("load", () => {
        if (cancelled) return;
        setReady(true);
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
      // Render saved sites as markers
      state.map.savedSites.forEach((site) => {
        const el = document.createElement("div");
        el.className = "rounded-full bg-sky-600 shadow text-white text-xs px-2 py-1";
        el.textContent = "●";
        const marker = new mapboxgl.default.Marker(el)
          .setLngLat([site.lng, site.lat])
          .setPopup(new mapboxgl.default.Popup().setHTML(`<strong>${site.name}</strong><br/>${site.notes ?? ""}`))
          .addTo(map);
        void marker;
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
        <Card className="border-dashed">
          <CardContent className="py-6 text-sm text-slate-600">
            Enter a Mapbox token in the left sidebar to enable the interactive map. You can still add sites; they will render once the token is set.
          </CardContent>
        </Card>
      )}
      <div className="h-96 rounded-xl overflow-hidden border" ref={containerRef} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Local Site (e.g., Negley Run, Heth’s Run, etc.)</CardTitle>
          <CardDescription>Store place-based projects and field notes.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-1 md:col-span-2">
            <Label>Name</Label>
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
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Sampling day, macro counts, photos, partners…" />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              const id = `${Date.now()}`;
              setState((s) => ({
                ...s,
                map: {
                  ...s.map,
                  savedSites: [
                    ...s.map.savedSites,
                    { id, name: name || "Unnamed site", lng: Number(lng), lat: Number(lat), notes },
                  ],
                },
              }));
              setName("");
              setNotes("");
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Site
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// ------------------------------
// Habitat Builder
// ------------------------------
function HabitatBuilder({ state, setState, addBadge }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; addBadge: (b: string) => void }) {
  const [temperatureF, setTemperatureF] = useState(55);
  const [flow, setFlow] = useState<HabitatDesign["flow"]>("riffle");
  const [shade, setShade] = useState(60);
  const [cover, setCover] = useState(50);
  const [notes, setNotes] = useState("");

  const score = useMemo(() => computeHabitatScore({ temperatureF, flow, shade, cover }), [temperatureF, flow, shade, cover]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Build a Preferred Trout Habitat</CardTitle>
          <CardDescription>Adjust parameters to maximize habitat score.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Temperature (°F) — target 52–56</Label>
              <input type="range" min={45} max={62} value={temperatureF} onChange={(e) => setTemperatureF(Number(e.target.value))} className="w-full" />
              <div className="text-sm">{temperatureF} °F</div>
            </div>
            <div className="space-y-1">
              <Label>Flow Type</Label>
              <div className="flex gap-2 flex-wrap">
                {(["riffle", "run", "pool"] as const).map((f) => (
                  <Button key={f} size="sm" variant={flow === f ? "default" : "outline"} onClick={() => setFlow(f)}>
                    {f}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <Label>Shade (%)</Label>
              <input type="range" min={0} max={100} value={shade} onChange={(e) => setShade(Number(e.target.value))} className="w-full" />
              <div className="text-sm">{shade}% canopy</div>
            </div>
            <div className="space-y-1">
              <Label>Cover (%)</Label>
              <input type="range" min={0} max={100} value={cover} onChange={(e) => setCover(Number(e.target.value))} className="w-full" />
              <div className="text-sm">{cover}% logs/rocks/undercuts</div>
            </div>
          </div>
          <div>
            <Label className="mb-1 block">Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Where in Pittsburgh could this habitat exist?" />
          </div>
          <div>
            <Label className="mb-1 block">Habitat Score</Label>
            <Progress value={score} className="h-3" />
            <div className="text-sm mt-1">{score}/100</div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => {
            const design: HabitatDesign = {
              id: `${Date.now()}`,
              date: new Date().toISOString(),
              temperatureF,
              dissolvedOxygen: estimateDO(temperatureF),
              flow,
              shade,
              cover,
              notes,
              score,
            };
            setState((s) => ({ ...s, habitats: [...s.habitats, design] }));
            addBadge("Habitat Builder");
          }}>Save Design</Button>
        </CardFooter>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Saved Habitats</CardTitle>
          <CardDescription>Compare designs and iterate.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {state.habitats.length === 0 && <div className="text-sm text-slate-500">No designs yet.</div>}
          <div className="space-y-3">
            {state.habitats.map((h) => (
              <div key={h.id} className="p-3 rounded-xl border flex items-center justify-between">
                <div>
                  <div className="font-medium">{new Date(h.date).toLocaleString()}</div>
                  <div className="text-xs text-slate-500">{h.flow} · {h.temperatureF}°F · DO≈{h.dissolvedOxygen} ppm · Shade {h.shade}% · Cover {h.cover}%</div>
                  {h.notes && <div className="text-sm mt-1">{h.notes}</div>}
                </div>
                <Badge variant="secondary">{h.score}/100</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function estimateDO(tempF: number) {
  // Very rough heuristic: colder → higher DO; for demo only
  const t = Math.max(45, Math.min(62, tempF));
  const range = 10; // 7–9 typical target; widen for demo
  const val = 11 - (t - 45) * (range / (62 - 45));
  return Math.round(Math.max(6, Math.min(11, val)) * 10) / 10;
}

function computeHabitatScore({ temperatureF, flow, shade, cover }: { temperatureF: number; flow: HabitatDesign["flow"]; shade: number; cover: number }) {
  let score = 0;
  // Temperature sweet spot 52–56°F
  score += 50 - Math.min(50, Math.abs(54 - temperatureF) * 10);
  // Flow preference: riffle/run > pool for coldwater oxygen
  score += flow === "riffle" ? 20 : flow === "run" ? 15 : 5;
  // Shade and cover (diminishing returns)
  score += Math.min(15, shade * 0.12);
  score += Math.min(15, cover * 0.12);
  return Math.round(Math.max(0, Math.min(100, score)));
}

// ------------------------------
// Macro ID — Dichotomous Key + Upload (local only)
// ------------------------------
const KEY_TREE: Record<string, { q: string; a: { label: string; next?: string; result?: string }[] }> = {
  start: {
    q: "Does the insect have tails at the end of the abdomen?",
    a: [
      { label: "Yes, 3 tails", next: "threeTails" },
      { label: "Yes, 2 tails", next: "twoTails" },
      { label: "No tails", next: "noTails" },
    ],
  },
  threeTails: {
    q: "Are the gills along the sides of the abdomen (leaf-like)?",
    a: [
      { label: "Yes", result: "Mayfly (Ephemeroptera)" },
      { label: "No", next: "otherThreeTail" },
    ],
  },
  otherThreeTail: {
    q: "Are there pincers (cerci) at the tip?",
    a: [
      { label: "Yes", result: "Hellgrammite/Other — not typical 3-tailed" },
      { label: "No", result: "Possible Mayfly" },
    ],
  },
  twoTails: {
    q: "Hard wing covers or case-building behavior?",
    a: [
      { label: "Lives in a portable case of sticks/sand", result: "Caddisfly (Trichoptera)" },
      { label: "No case; flattened body; 2 tails", result: "Stonefly (Plecoptera)" },
    ],
  },
  noTails: {
    q: "Does it have a siphon tube or looks like a small worm?",
    a: [
      { label: "Yes, worm-like", result: "Midge (Diptera)" },
      { label: "No, beetle-like or other", result: "Other (Beetle larva, etc.)" },
    ],
  },
};

function MacroKeyGame({ state, setState, addBadge }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; addBadge: (b: string) => void }) {
  const [node, setNode] = useState("start");
  const [path, setPath] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const cur = KEY_TREE[node];

  function reset() {
    setNode("start");
    setPath([]);
    setFileName(undefined);
  }

  function selectOption(opt: { label: string; next?: string; result?: string }) {
    setPath((p) => [...p, `${cur.q} → ${opt.label}`]);
    if (opt.next) setNode(opt.next);
    if (opt.result) {
      const rec: MacroRecord = {
        id: `${Date.now()}`,
        date: new Date().toISOString(),
        imageName: fileName,
        outcome: opt.result,
        path: [...path, `${cur.q} → ${opt.label}`],
      };
      setState((s) => ({ ...s, macros: [rec, ...s.macros] }));
      addBadge("Macro Sleuth");
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Dichotomous Key (Game)</CardTitle>
          <CardDescription>Answer the questions to identify your macroinvertebrate.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm font-medium">{cur.q}</div>
          <div className="flex flex-col gap-2">
            {cur.a.map((opt, i) => (
              <Button key={i} variant="outline" onClick={() => selectOption(opt)}>
                <ChevronRight className="h-4 w-4 mr-2" /> {opt.label}
              </Button>
            ))}
          </div>
          <div className="text-xs text-slate-500">Path: {path.length === 0 ? "(start)" : path.length + " step(s)"}</div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={reset}>Reset</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Upload a Macro Photo (Optional)</CardTitle>
          <CardDescription>Photos are kept locally in your browser; not uploaded to any server.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input type="file" accept="image/*" onChange={(e) => {
            const f = e.target.files?.[0];
            setFileName(f ? f.name : undefined);
          }} />
          <div className="text-xs text-slate-500">(Future: connect to a teacher‑approved identifier API.)</div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => addBadge("Macro Uploader")}><Upload className="h-4 w-4 mr-2"/>Mark Upload</Button>
        </CardFooter>
      </Card>

      <Card className="lg:col-span-2 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Recent Identifications</CardTitle>
          <CardDescription>Click to review a decision path.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          {state.macros.length === 0 && <div className="text-sm text-slate-500">No IDs yet.</div>}
          {state.macros.map((m) => (
            <div key={m.id} className="p-3 border rounded-xl">
              <div className="text-sm font-medium">{m.outcome}</div>
              <div className="text-xs text-slate-500">{new Date(m.date).toLocaleString()}</div>
              {m.imageName && <div className="text-xs">📷 {m.imageName}</div>}
              <details className="mt-1">
                <summary className="text-xs cursor-pointer">Decision path</summary>
                <ul className="text-xs list-disc pl-5">
                  {m.path.map((p, i) => (<li key={i}>{p}</li>))}
                </ul>
              </details>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ------------------------------
// Memory & Games (Spaced Repetition Flashcards)
// ------------------------------
function MemoryGames({ state, setState, addBadge }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; addBadge: (b: string) => void }) {
  const [deck, setDeck] = useState(SAMPLE_FLASHCARDS);
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  const card = deck[index];

  function rate(rating: 0 | 1 | 2) {
    const rec: FlashcardResult = { id: `${Date.now()}`, term: card.term, rating, when: new Date().toISOString() };
    setState((s) => ({ ...s, flashcards: [rec, ...s.flashcards] }));
    addBadge("Memory Master");
    setShowBack(false);
    setIndex((i) => (i + 1) % deck.length);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Flashcards — Core TIC Concepts</CardTitle>
          <CardDescription>Tap to flip; rate your recall to train memory.</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            className="rounded-2xl border p-6 h-48 flex items-center justify-center text-center cursor-pointer bg-white"
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowBack((s) => !s)}
          >
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">{showBack ? "Definition" : "Term"}</div>
              <div className="text-xl font-semibold mt-1">{showBack ? card.def : card.term}</div>
            </div>
          </motion.div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-slate-500">Card {index + 1} / {deck.length}</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => rate(0)}>Again</Button>
              <Button variant="outline" onClick={() => rate(1)}>Hard</Button>
              <Button onClick={() => rate(2)}>Easy</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Memory Tips (Quick)</CardTitle>
          <CardDescription>Use these while studying trout care & watershed science.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Chunking:</strong> Group steps (e.g., test → record → respond).</li>
            <li><strong>Dual coding:</strong> Pair words and sketches of tank parts.</li>
            <li><strong>Spacing:</strong> Quick review daily vs. cramming weekly.</li>
            <li><strong>Retrieval:</strong> Close the book and explain the nitrogen cycle aloud.</li>
            <li><strong>Elaboration:</strong> Connect trout needs to Negley Run conditions.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

// ------------------------------
// Careers & Opportunities (Weekly Sync Stub)
// ------------------------------
function CareersAndOpportunities({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const [query, setQuery] = useState("");
  const items = state.opportunities.filter((o) => (o.title + o.org + o.location + o.tags.join(" ")).toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search internships, certifications, apprenticeships…" />
        <Button variant="outline" onClick={() => simulateWeeklySync(setState)}><RefreshCw className="h-4 w-4 mr-2"/>Update</Button>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {items.length === 0 && <div className="text-sm text-slate-500">No items yet — click Update to load demo opportunities.</div>}
        {items.map((o) => (
          <Card key={o.id} className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{o.title}</CardTitle>
              <CardDescription>{o.org} · {o.location}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {o.tags.map((t, i) => (<Badge key={i} variant="secondary">{t}</Badge>))}
            </CardContent>
            <CardFooter className="text-xs text-slate-500">Last updated {new Date(o.lastUpdated).toLocaleDateString()}</CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function simulateWeeklySync(setState: React.Dispatch<React.SetStateAction<AppState>>) {
  setState((s) => ({ ...s, opportunities: dedupe([...SAMPLE_OPPORTUNITIES, ...s.opportunities]), lastOpptySync: new Date().toISOString() }));
}
function dedupe(arr: Opportunity[]) {
  const map = new Map(arr.map((x) => [x.id, x]));
  return Array.from(map.values());
}

// ------------------------------
// Progress & Report
// ------------------------------
function ReportView({ state }: { state: AppState }) {
  const report = useMemo(() => buildReport(state), [state]);
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity Report</CardTitle>
          <CardDescription>Download a snapshot for portfolios or teacher records.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea className="h-64" value={report} readOnly />
        </CardContent>
        <CardFooter>
          <Button onClick={() => download("tic_report.txt", report)}><FileDown className="h-4 w-4 mr-2"/>Download .txt</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function buildReport(state: AppState) {
  const lines: string[] = [];
  lines.push(`# TIC Activity Report`);
  lines.push(`Student: ${state.profile.name || "(anonymous)"}`);
  lines.push(`Class: ${state.profile.classroom}`);
  lines.push(`Grade Band: ${state.profile.gradeBand}`);
  lines.push("");
  lines.push(`Badges: ${state.progress.badges.join(", ") || "None"}`);
  lines.push("");
  lines.push(`Saved Habitat Designs: ${state.habitats.length}`);
  state.habitats.forEach((h, i) => {
    lines.push(`  ${i + 1}. ${new Date(h.date).toLocaleString()} — ${h.flow}, ${h.temperatureF}°F, DO≈${h.dissolvedOxygen} ppm, Shade ${h.shade}%, Cover ${h.cover}% | Score ${h.score}`);
    if (h.notes) lines.push(`     Notes: ${h.notes}`);
  });
  lines.push("");
  lines.push(`Macro IDs: ${state.macros.length}`);
  state.macros.forEach((m, i) => {
    lines.push(`  ${i + 1}. ${new Date(m.date).toLocaleString()} — ${m.outcome} ${m.imageName ? `(photo: ${m.imageName})` : ""}`);
  });
  lines.push("");
  lines.push(`Opportunities: ${state.opportunities.length} (last sync: ${state.lastOpptySync ? new Date(state.lastOpptySync).toLocaleString() : "never"})`);
  state.opportunities.forEach((o, i) => {
    lines.push(`  ${i + 1}. ${o.title} — ${o.org} (${o.location}) [tags: ${o.tags.join(", ")}]`);
  });
  return lines.join("\n");
}

function downloadReport(state: AppState) {
  const txt = buildReport(state);
  download("tic_report.txt", txt);
}

// ------------------------------
// Teacher Admin
// ------------------------------
function TeacherAdmin({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Milestones</CardTitle>
          <CardDescription>Toggle milestones to reflect class progress.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {MILESTONES.map((m) => (
            <label key={m.id} className="flex items-center gap-2 text-sm p-2 rounded-lg border">
              <Switch checked={!!state.progress.modulesCompleted[m.id]} onCheckedChange={(v) => setState((s) => ({ ...s, progress: { ...s.progress, modulesCompleted: { ...s.progress.modulesCompleted, [m.id]: v } } }))} />
              <span>{m.label}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Data Reset (local device)</CardTitle>
          <CardDescription>Useful between classes. Cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Switch checked={confirm} onCheckedChange={setConfirm} />
            <span className="text-sm">Yes, I’m sure</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" disabled={!confirm} onClick={() => {
            localStorage.removeItem(LS_KEY);
            setState(DEFAULT_STATE);
          }}>Reset All Local Data</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

const MILESTONES = [
  { id: "setup-complete", label: "Setup complete (chiller, insulation, pre-filter)" },
  { id: "eggs-arrived", label: "Eggs arrived & placed" },
  { id: "hatch", label: "Hatching observed" },
  { id: "swimup", label: "First swim‑up observed" },
  { id: "first-feed", label: "First feed complete" },
  { id: "nitrite-spike", label: "Nitrite spike tracked" },
  { id: "first-water-change", label: "First partial water change" },
  { id: "parr-marks", label: "Parr marks observed" },
  { id: "pre-release-checklist", label: "Pre‑release checklist ready" },
  { id: "release-complete", label: "Release complete" },
];

// ------------------------------
// License text (downloadable)
// ------------------------------
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
