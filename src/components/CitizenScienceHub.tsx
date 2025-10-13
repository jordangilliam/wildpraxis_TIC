// 🔬 Citizen Science Hub - External App Integrations
// iNaturalist • BirdWeather • Macroinvertebrates.org
// AI-powered photo/audio uploads with peer review

import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Badge } from "./badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Mic,
  Upload,
  ExternalLink,
  CheckCircle2,
  Clock,
  Users,
  Sparkles,
  Eye,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Info
} from "lucide-react";

interface Observation {
  id: string;
  type: "photo" | "audio";
  platform: "inaturalist" | "birdweather" | "macros";
  file: string;
  species: string;
  confidence: number;
  aiIdentification?: string;
  peerReviewed: boolean;
  reviewCount: number;
  date: string;
  location: string;
  notes: string;
  status: "pending" | "verified" | "disputed";
}

export function CitizenScienceHub({
  onEarnBadge,
  onAddPoints
}: {
  onEarnBadge?: (badge: string) => void;
  onAddPoints?: (points: number) => void;
}) {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [activeUpload, setActiveUpload] = useState<"photo" | "audio" | null>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  async function handlePhotoUpload(file: File, platform: "inaturalist" | "macros") {
    setAiAnalyzing(true);

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    const aiResult = await simulateAIIdentification(file, "photo");

    const observation: Observation = {
      id: `${Date.now()}`,
      type: "photo",
      platform,
      file: URL.createObjectURL(file),
      species: aiResult.species,
      confidence: aiResult.confidence,
      aiIdentification: aiResult.description,
      peerReviewed: false,
      reviewCount: 0,
      date: new Date().toISOString(),
      location: "Pittsburgh, PA", // Would use GPS
      notes: "",
      status: "pending"
    };

    setObservations([observation, ...observations]);
    setAiAnalyzing(false);
    setActiveUpload(null);

    // Award points
    onAddPoints?.(15);

    // Badge if reaching milestone
    if (observations.length + 1 >= 10) {
      onEarnBadge?.("citizen-scientist");
    }
  }

  async function handleAudioUpload(file: File) {
    setAiAnalyzing(true);

    await new Promise(resolve => setTimeout(resolve, 2500));

    const aiResult = await simulateAIIdentification(file, "audio");

    const observation: Observation = {
      id: `${Date.now()}`,
      type: "audio",
      platform: "birdweather",
      file: URL.createObjectURL(file),
      species: aiResult.species,
      confidence: aiResult.confidence,
      aiIdentification: aiResult.description,
      peerReviewed: false,
      reviewCount: 0,
      date: new Date().toISOString(),
      location: "Pittsburgh, PA",
      notes: "",
      status: "pending"
    };

    setObservations([observation, ...observations]);
    setAiAnalyzing(false);
    setActiveUpload(null);

    onAddPoints?.(20); // Audio is harder, worth more!

    if (observations.filter(o => o.type === "audio").length + 1 >= 5) {
      onEarnBadge?.("bird-listener");
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 backdrop-blur overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0icmdiYSgxNiwgMTg1LCAxMjksIDAuMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
          <CardHeader className="relative">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center gap-4"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white text-3xl shadow-lg">
                🔬
              </div>
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">Citizen Science Hub</CardTitle>
                <CardDescription className="text-base">
                  Connect to global biodiversity networks • AI-powered identification • Contribute real data to science
                </CardDescription>
              </div>
            </motion.div>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid md:grid-cols-4 gap-4">
              <StatCard icon="📸" label="Observations" value={observations.length} />
              <StatCard icon="🤖" label="AI Analyzed" value={observations.length} />
              <StatCard icon="✓" label="Verified" value={observations.filter(o => o.status === "verified").length} />
              <StatCard icon="🌍" label="Global Network" value="Connected" />
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Platform Connections */}
      <div className="grid md:grid-cols-3 gap-6">
        <PlatformCard
          name="iNaturalist"
          icon="🌿"
          description="World's largest biodiversity platform. Upload photos of any organism!"
          url="https://www.inaturalist.org"
          features={[
            "100M+ observations",
            "AI species suggestion",
            "Expert verification",
            "Research quality data"
          ]}
          stats={{ observations: "100M+", species: "400K+", users: "2M+" }}
          uploadType="photo"
          onUpload={() => {
            setActiveUpload("photo");
            fileInputRef.current?.click();
          }}
        />

        <PlatformCard
          name="BirdWeather"
          icon="🦜"
          description="AI bird song identification. Record calls and get instant ID!"
          url="https://www.birdweather.com"
          features={[
            "24/7 bird monitoring",
            "Real-time AI ID",
            "Migration tracking",
            "Community network"
          ]}
          stats={{ species: "1000+", recordings: "1M+", accuracy: "95%" }}
          uploadType="audio"
          onUpload={() => {
            setActiveUpload("audio");
            audioInputRef.current?.click();
          }}
        />

        <PlatformCard
          name="Macroinvertebrates.org"
          icon="🐛"
          description="Specialized aquatic insect database. Perfect for TIC students!"
          url="https://www.macroinvertebrates.org"
          features={[
            "Stream health data",
            "Dichotomous keys",
            "Photo library",
            "Water quality tracking"
          ]}
          stats={{ taxa: "1500+", images: "10K+", streams: "5K+" }}
          uploadType="photo"
          onUpload={() => {
            setActiveUpload("photo");
            fileInputRef.current?.click();
          }}
        />
      </div>

      {/* Upload Interface */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handlePhotoUpload(file, "inaturalist");
        }}
      />
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleAudioUpload(file);
        }}
      />

      {/* AI Analysis Modal */}
      <AnimatePresence>
        {aiAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md w-full mx-4"
            >
              <Card className="rounded-3xl border-4 border-white shadow-2xl">
                <CardContent className="pt-6 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white text-3xl"
                  >
                    🤖
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">AI Analysis in Progress</h3>
                  <p className="text-sm text-slate-600">
                    Our AI is analyzing your {activeUpload === "photo" ? "photo" : "audio"}...
                  </p>
                  <div className="mt-4 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                      <span>Extracting features...</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-teal-600 animate-pulse animation-delay-200" />
                      <span>Comparing to database...</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-cyan-600 animate-pulse animation-delay-400" />
                      <span>Generating identification...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Observations Feed */}
      <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Observations</CardTitle>
              <CardDescription>{observations.length} total submissions</CardDescription>
            </div>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {observations.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 mb-4">No observations yet!</p>
              <p className="text-sm text-slate-500 mb-6">
                Start contributing to citizen science by uploading photos of organisms or recording bird songs.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => { setActiveUpload("photo"); fileInputRef.current?.click(); }}>
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
                <Button variant="outline" onClick={() => { setActiveUpload("audio"); audioInputRef.current?.click(); }}>
                  <Mic className="h-4 w-4 mr-2" />
                  Record Audio
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {observations.map((obs) => (
                <ObservationCard key={obs.id} observation={obs} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="rounded-3xl border-2 border-blue-200 bg-blue-50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            How Citizen Science Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <ProcessStep
              number={1}
              title="Observe & Document"
              description="Take photos or record sounds of organisms in nature"
            />
            <ProcessStep
              number={2}
              title="AI Analysis"
              description="Our AI suggests species identification instantly"
            />
            <ProcessStep
              number={3}
              title="Community Review"
              description="Experts and other users verify your observation"
            />
            <ProcessStep
              number={4}
              title="Scientific Data"
              description="Your observation contributes to global research!"
            />
          </div>
        </CardContent>
      </Card>

      {/* Educational Value */}
      <Card className="rounded-3xl border-2 border-purple-200 bg-purple-50 backdrop-blur">
        <CardHeader>
          <CardTitle>🎓 Why This Matters for TIC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="p-3 bg-white/60 rounded-xl">
            <strong className="text-purple-900">Connect Classroom to Real Science:</strong> Your macro identifications
            in class are the same process scientists use worldwide!
          </div>
          <div className="p-3 bg-white/60 rounded-xl">
            <strong className="text-purple-900">Build Digital Portfolio:</strong> Document your conservation work
            and learning journey with verifiable observations.
          </div>
          <div className="p-3 bg-white/60 rounded-xl">
            <strong className="text-purple-900">Contribute to Research:</strong> Your data helps scientists track
            biodiversity, climate change, and species distributions.
          </div>
          <div className="p-3 bg-white/60 rounded-xl">
            <strong className="text-purple-900">Career Skills:</strong> Learn real tools used by biologists, 
            ecologists, and conservation professionals.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="p-4 bg-white/60 rounded-2xl border border-white/60 backdrop-blur">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-emerald-600">{value}</div>
      <div className="text-xs text-slate-600 mt-1">{label}</div>
    </div>
  );
}

function PlatformCard({ name, icon, description, url, features, stats, uploadType, onUpload }: any) {
  return (
    <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="text-4xl">{icon}</div>
          <CardTitle className="text-lg">{name}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {features.map((feature: string, i: number) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t">
          {Object.entries(stats).map(([key, value]: [string, any]) => (
            <div key={key} className="text-center">
              <div className="text-lg font-bold text-emerald-600">{value}</div>
              <div className="text-xs text-slate-600 capitalize">{key}</div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={onUpload} className="flex-1">
          {uploadType === "photo" ? <Camera className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
          Upload
        </Button>
        <Button variant="outline" asChild className="flex-1">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

function ObservationCard({ observation }: { observation: Observation }) {
  const statusColors = {
    pending: "bg-amber-100 text-amber-700",
    verified: "bg-emerald-100 text-emerald-700",
    disputed: "bg-red-100 text-red-700"
  };

  return (
    <Card className="rounded-2xl border-2 border-white/60 bg-white backdrop-blur overflow-hidden">
      <div className="aspect-video bg-slate-200 relative">
        {observation.type === "photo" ? (
          <img src={observation.file} alt={observation.species} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
            <Mic className="h-12 w-12 text-white" />
          </div>
        )}
        <Badge className={`absolute top-2 right-2 ${statusColors[observation.status]}`}>
          {observation.status}
        </Badge>
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          {observation.species}
        </CardTitle>
        <CardDescription className="text-xs">
          AI Confidence: {observation.confidence}% • {observation.platform}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="h-3 w-3" />
          {new Date(observation.date).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="h-3 w-3" />
          {observation.location}
        </div>
        {observation.aiIdentification && (
          <div className="p-2 bg-blue-50 rounded-lg text-xs">
            <strong>AI Says:</strong> {observation.aiIdentification}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Users className="h-3 w-3" />
          <span>{observation.reviewCount} reviews</span>
        </div>
        <Button size="sm" variant="outline">
          <Eye className="h-3 w-3 mr-2" />
          Details
        </Button>
      </CardFooter>
    </Card>
  );
}

function ProcessStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3">
        {number}
      </div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-xs text-slate-600">{description}</p>
    </div>
  );
}

// Simulated AI Identification (would use real API in production)
async function simulateAIIdentification(file: File, type: "photo" | "audio") {
  // Simulated AI response
  const photoSpecies = [
    { species: "Brook Trout (Salvelinus fontinalis)", confidence: 94, description: "Native Pennsylvania trout, identified by worm-like markings and red spots with blue halos" },
    { species: "Ephemeroptera (Mayfly nymph)", confidence: 89, description: "Aquatic insect nymph with three tails and gills along abdomen" },
    { species: "Trichoptera (Caddisfly larva)", confidence: 92, description: "Caddisfly larva in protective case made of small stones" },
    { species: "White-tailed Deer (Odocoileus virginianus)", confidence: 96, description: "Pennsylvania's most common large mammal" }
  ];

  const audioSpecies = [
    { species: "American Robin (Turdus migratorius)", confidence: 91, description: "Cheerful caroling song, common PA backyard bird" },
    { species: "Northern Cardinal (Cardinalis cardinalis)", confidence: 88, description: "Clear whistled notes: 'cheer cheer cheer'" },
    { species: "Carolina Wren (Thryothorus ludovicianus)", confidence: 85, description: "Loud 'teakettle teakettle' song" }
  ];

  return type === "photo" 
    ? photoSpecies[Math.floor(Math.random() * photoSpecies.length)]
    : audioSpecies[Math.floor(Math.random() * audioSpecies.length)];
}

