// Macroinvertebrate Identification Tool
// Interactive guide for stream health assessment
// Integrated with macroinvertebrates.org and iNaturalist

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Badge } from "./badge";
import {
  Bug,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Search,
  Camera,
  Database,
  TrendingUp,
  Award,
  BookOpen
} from "lucide-react";

interface MacroInvertebrate {
  id: string;
  commonName: string;
  scientificName: string;
  group: "sensitive" | "somewhat-sensitive" | "tolerant";
  toleranceValue: number;
  habitat: string;
  description: string;
  identifyingFeatures: string[];
  imageUrl?: string;
  iNaturalistUrl: string;
  macroOrgUrl: string;
}

// Based on Dr. Sara Mueller's Penn State Extension guides and macroinvertebrates.org
const MACROINVERTEBRATES: MacroInvertebrate[] = [
  // SENSITIVE (High Water Quality Indicators)
  {
    id: "stonefly",
    commonName: "Stonefly Nymph",
    scientificName: "Order Plecoptera",
    group: "sensitive",
    toleranceValue: 1,
    habitat: "Fast-flowing, cold, highly oxygenated streams. Found clinging to rocks.",
    description: "Excellent indicator of high water quality. Stoneflies require cold, clean, well-oxygenated water. Their presence indicates an excellent stream ecosystem.",
    identifyingFeatures: [
      "Two long tails (cerci) at rear",
      "Two claws per leg",
      "Gills along underside or thorax",
      "Flattened body",
      "6 legs",
      "Antennae visible"
    ],
    iNaturalistUrl: "https://www.inaturalist.org/taxa/47651-Plecoptera",
    macroOrgUrl: "https://www.macroinvertebrates.org/taxa-characters/plecoptera-stoneflies"
  },
  {
    id: "mayfly",
    commonName: "Mayfly Nymph",
    scientificName: "Order Ephemeroptera",
    group: "sensitive",
    toleranceValue: 2,
    habitat: "Riffles and pools in streams. Some species burrow in sediment.",
    description: "Highly sensitive to pollution. Mayflies are among the most abundant insects in healthy coldwater streams. Excellent indicator species.",
    identifyingFeatures: [
      "Three long tails (cerci)",
      "Leaf-like gills along abdomen",
      "One claw per leg",
      "6 legs",
      "Small head with large eyes",
      "Streamlined body"
    ],
    iNaturalistUrl: "https://www.inaturalist.org/taxa/47208-Ephemeroptera",
    macroOrgUrl: "https://www.macroinvertebrates.org/taxa-characters/ephemeroptera-mayflies"
  },
  {
    id: "caddisfly",
    commonName: "Caddisfly Larva",
    scientificName: "Order Trichoptera",
    group: "sensitive",
    toleranceValue: 3,
    habitat: "Streams and ponds. Many build protective cases from pebbles, sticks, or leaves.",
    description: "Sensitive to moderate pollution. Many species build characteristic cases. Important food source for trout.",
    identifyingFeatures: [
      "May have protective case made of stones/sticks",
      "Soft segmented abdomen",
      "Two hooks at rear end",
      "6 legs on thorax",
      "Head and thorax harder than abdomen",
      "Some species free-living (no case)"
    ],
    iNaturalistUrl: "https://www.inaturalist.org/taxa/47744-Trichoptera",
    macroOrgUrl: "https://www.macroinvertebrates.org/taxa-characters/trichoptera-caddisflies"
  },
  {
    id: "riffle-beetle",
    commonName: "Riffle Beetle (Adult)",
    scientificName: "Family Elmidae",
    group: "sensitive",
    toleranceValue: 4,
    habitat: "Fast-moving water, clinging to rocks and wood in riffles.",
    description: "Sensitive to pollution. One of the few aquatic beetles found as adults (not larvae) underwater. Breathe through plastron (air film).",
    identifyingFeatures: [
      "Hard shell/exoskeleton",
      "6 legs",
      "Antennae",
      "Small (2-8mm)",
      "Oval or elongated body",
      "Adults live underwater"
    ],
    iNaturalistUrl: "https://www.inaturalist.org/taxa/51165-Elmidae",
    macroOrgUrl: "https://www.macroinvertebrates.org/taxa-characters/coleoptera-riffle-beetles"
  },

  // SOMEWHAT SENSITIVE (Moderate Water Quality)
  {
    id: "damselfly",
    commonName: "Damselfly Nymph",
    scientificName: "Suborder Zygoptera",
    group: "somewhat-sensitive",
    toleranceValue: 5,
    habitat: "Slow-moving streams, ponds, wetlands. Found among aquatic vegetation.",
    description: "Moderately tolerant of pollution. Predators that hunt other aquatic insects. Prefer slower water than dragonflies.",
    identifyingFeatures: [
      "Three leaf-like gills at tail end",
      "Slender body",
      "6 legs",
      "Large eyes",
      "Extendable lower jaw (labium)",
      "More delicate than dragonflies"
    ],
    iNaturalistUrl: "https://www.inaturalist.org/taxa/47792-Zygoptera",
    macroOrgUrl: "https://www.macroinvertebrates.org/taxa-characters/odonata-damselflies"
  },
  {
    id: "dragonfly",
    commonName: "Dragonfly Nymph",
    scientificName: "Suborder Anisoptera",
    group: "somewhat-sensitive",
    toleranceValue: 5,
    habitat: "Streams, ponds, lakes. Predators that hunt in various aquatic habitats.",
    description: "Moderately tolerant. Top predators in aquatic systems. Can tolerate some pollution but prefer clean water.",
    identifyingFeatures: [
      "No external gills (internal)",
      "Stocky, robust body",
      "6 legs",
      "Large eyes",
      "Extendable jaw",
      "Larger than damselflies"
    ],
    iNaturalistUrl: "https://www.inaturalist.org/taxa/47792-Anisoptera",
    macroOrgUrl: "https://www.macroinvertebrates.org/taxa-characters/odonata-dragonflies"
  },
  {
    id: "scud",
    commonName: "Scud/Amphipod",
    scientificName: "Order Amphipoda",
    group: "somewhat-sensitive",
    toleranceValue: 6,
    habitat: "Springs, spring-fed streams, among aquatic vegetation and leaf litter.",
    description: "Moderately sensitive. Important food source for trout. Often abundant in cold spring-fed streams.",
    identifyingFeatures: [
      "Shrimp-like appearance",
      "Swims on side",
      "Many legs (more than 6)",
      "Segmented body",
      "Two pairs of antennae",
      "Curved body when disturbed"
    ],
    iNaturalistUrl: "https://www.inaturalist.org/taxa/47651-Amphipoda",
    macroOrgUrl: "https://www.macroinvertebrates.org/taxa-characters/amphipoda-scuds"
  },
  {
    id: "crane-fly",
    commonName: "Crane Fly Larva",
    scientificName: "Family Tipulidae",
    group: "somewhat-sensitive",
    toleranceValue: 6,
    habitat: "Leaf litter, sediment, and decaying organic matter in streams.",
    description: "Moderately tolerant. Caterpillar-like larvae that feed on decaying vegetation. Important in nutrient cycling.",
    identifyingFeatures: [
      "Caterpillar-like appearance",
      "Finger-like lobes at rear",
      "Fleshy body (no hard shell)",
      "No distinct head",
      "Often found in muck/sediment",
      "Can be quite large (up to 2 inches)"
    ],
    iNaturalistUrl: "https://www.inaturalist.org/taxa/52319-Tipulidae",
    macroOrgUrl: "https://www.macroinvertebrates.org/taxa-characters/diptera-crane-flies"
  },

  // TOLERANT (Can survive in polluted water)
  {
    id: "aquatic-worm",
    commonName: "Aquatic Worm",
    scientificName: "Class Oligochaeta",
    group: "tolerant",
    toleranceValue: 8,
    habitat: "Muddy sediments, tolerates low oxygen. Found in all types of water bodies.",
    description: "Highly tolerant of pollution. Can survive in low-oxygen, highly polluted water. High numbers indicate poor water quality.",
    identifyingFeatures: [
      "Long, thin, segmented body",
      "No distinct head",
      "No legs or appendages",
      "Resembles earthworm",
      "Often pink or red (hemoglobin)",
      "Moves with wave-like motion"
    ],
    iNaturalistUrl: "https://www.inaturalist.org/taxa/54960-Oligochaeta",
    macroOrgUrl: "https://www.macroinvertebrates.org/taxa-characters/oligochaeta-aquatic-worms"
  },
  {
    id: "midge",
    commonName: "Midge Larva",
    scientificName: "Family Chironomidae",
    group: "tolerant",
    toleranceValue: 7,
    habitat: "All aquatic habitats. Extremely abundant and diverse.",
    description: "Very tolerant of pollution. Some species (bloodworms) can survive in extremely polluted, low-oxygen water. Not all indicate poor quality.",
    identifyingFeatures: [
      "Worm-like body",
      "Distinct head capsule",
      "Small prolegs",
      "Often bright red (bloodworms)",
      "Very small (2-10mm)",
      "May build tubes in sediment"
    ],
    iNaturalistUrl: "https://www.inaturalist.org/taxa/48763-Chironomidae",
    macroOrgUrl: "https://www.macroinvertebrates.org/taxa-characters/diptera-midges"
  },
  {
    id: "leech",
    commonName: "Leech",
    scientificName: "Subclass Hirudinea",
    group: "tolerant",
    toleranceValue: 8,
    habitat: "Slow-moving water, ponds, lakes. Under rocks and in vegetation.",
    description: "Tolerant of pollution. Predators or parasites. Can survive in degraded habitats with low oxygen.",
    identifyingFeatures: [
      "Flattened body",
      "Sucker at each end",
      "Segmented (not as obvious as worms)",
      "Moves with looping motion",
      "No legs",
      "Can swim in wave-like pattern"
    ],
    iNaturalistUrl: "https://www.inaturalist.org/taxa/47693-Hirudinea",
    macroOrgUrl: "https://www.macroinvertebrates.org/taxa-characters/hirudinea-leeches"
  },
  {
    id: "black-fly",
    commonName: "Black Fly Larva",
    scientificName: "Family Simuliidae",
    group: "somewhat-sensitive",
    toleranceValue: 6,
    habitat: "Fast-flowing water, attached to rocks with silk pad. Filter feeders.",
    description: "Moderately tolerant but prefer clean, flowing water. Can be extremely abundant in some streams.",
    identifyingFeatures: [
      "Swollen rear end",
      "Small head with fan-like filters",
      "Attached to rocks with silk",
      "Dark colored",
      "Very small (2-15mm)",
      "Often in large groups"
    ],
    iNaturalistUrl: "https://www.inaturalist.org/taxa/48171-Simuliidae",
    macroOrgUrl: "https://www.macroinvertebrates.org/taxa-characters/diptera-black-flies"
  }
];

export function MacroIdentification() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedMacro, setSelectedMacro] = useState<MacroInvertebrate | null>(null);

  const filteredMacros = MACROINVERTEBRATES.filter(macro => {
    const matchesSearch = !searchQuery || 
      macro.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      macro.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      macro.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGroup = !selectedGroup || macro.group === selectedGroup;
    
    return matchesSearch && matchesGroup;
  });

  const groupedMacros = {
    sensitive: filteredMacros.filter(m => m.group === "sensitive"),
    "somewhat-sensitive": filteredMacros.filter(m => m.group === "somewhat-sensitive"),
    tolerant: filteredMacros.filter(m => m.group === "tolerant")
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Bug className="h-7 w-7 text-emerald-600" />
            Macroinvertebrate Identification Guide
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Identify stream macroinvertebrates and assess water quality. Based on Dr. Sara Mueller's Penn State Extension protocols.
            Connected to iNaturalist and macroinvertebrates.org for citizen science.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* External Resources */}
          <div className="grid md:grid-cols-3 gap-3">
            <a
              href="https://www.inaturalist.org/projects/pennsylvania-stream-life"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-xl border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <Camera className="h-5 w-5 text-green-600" />
                <span className="font-medium">iNaturalist</span>
                <ExternalLink className="h-4 w-4 text-slate-400 ml-auto" />
              </div>
              <p className="text-xs text-slate-600">
                Upload your macro photos to contribute to citizen science and get expert IDs
              </p>
            </a>

            <a
              href="https://www.macroinvertebrates.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-xl border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Macroinvertebrates.org</span>
                <ExternalLink className="h-4 w-4 text-slate-400 ml-auto" />
              </div>
              <p className="text-xs text-slate-600">
                Comprehensive identification keys and species information database
              </p>
            </a>

            <a
              href="https://extension.psu.edu/benthic-macroinvertebrate-identification"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-xl border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Penn State Extension</span>
                <ExternalLink className="h-4 w-4 text-slate-400 ml-auto" />
              </div>
              <p className="text-xs text-slate-600">
                Dr. Sara Mueller's identification guides for Pennsylvania streams
              </p>
            </a>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or description..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedGroup === "sensitive" ? "default" : "outline"}
                onClick={() => setSelectedGroup(selectedGroup === "sensitive" ? null : "sensitive")}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Sensitive
              </Button>
              <Button
                variant={selectedGroup === "somewhat-sensitive" ? "default" : "outline"}
                onClick={() => setSelectedGroup(selectedGroup === "somewhat-sensitive" ? null : "somewhat-sensitive")}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Moderate
              </Button>
              <Button
                variant={selectedGroup === "tolerant" ? "default" : "outline"}
                onClick={() => setSelectedGroup(selectedGroup === "tolerant" ? null : "tolerant")}
                className="bg-red-600 hover:bg-red-700"
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Tolerant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Macroinvertebrate Groups */}
      <div className="space-y-6">
        {/* Sensitive Species */}
        {groupedMacros.sensitive.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <h3 className="text-lg font-bold text-emerald-700">Pollution Sensitive (Excellent Water Quality)</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedMacros.sensitive.map(macro => (
                <MacroCard key={macro.id} macro={macro} onClick={() => setSelectedMacro(macro)} />
              ))}
            </div>
          </div>
        )}

        {/* Somewhat Sensitive Species */}
        {groupedMacros["somewhat-sensitive"].length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-6 w-6 text-amber-600" />
              <h3 className="text-lg font-bold text-amber-700">Moderately Sensitive (Good Water Quality)</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedMacros["somewhat-sensitive"].map(macro => (
                <MacroCard key={macro.id} macro={macro} onClick={() => setSelectedMacro(macro)} />
              ))}
            </div>
          </div>
        )}

        {/* Tolerant Species */}
        {groupedMacros.tolerant.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-bold text-red-700">Pollution Tolerant (Degraded Water Quality)</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedMacros.tolerant.map(macro => (
                <MacroCard key={macro.id} macro={macro} onClick={() => setSelectedMacro(macro)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Water Quality Scoring Card */}
      <Card className="rounded-3xl border-2 border-sky-200 bg-sky-50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-sky-600" />
            Calculate Stream Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-slate-700">
              Count the number of different types (taxa) found in each pollution tolerance group:
            </p>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="font-medium text-emerald-700">Sensitive Taxa × 3</div>
                <div className="text-xs text-slate-600 mt-1">Each sensitive species counts for 3 points</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <div className="font-medium text-amber-700">Moderate Taxa × 2</div>
                <div className="text-xs text-slate-600 mt-1">Each moderate species counts for 2 points</div>
              </div>
              <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                <div className="font-medium text-red-700">Tolerant Taxa × 1</div>
                <div className="text-xs text-slate-600 mt-1">Each tolerant species counts for 1 point</div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl border">
              <div className="font-medium mb-2">Stream Health Rating:</div>
              <div className="text-sm space-y-1">
                <div><strong>23+ points:</strong> Excellent water quality</div>
                <div><strong>17-22 points:</strong> Good water quality</div>
                <div><strong>11-16 points:</strong> Fair water quality</div>
                <div><strong>&lt;11 points:</strong> Poor water quality</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Modal */}
      {selectedMacro && (
        <MacroDetailModal
          macro={selectedMacro}
          onClose={() => setSelectedMacro(null)}
        />
      )}
    </div>
  );
}

function MacroCard({ macro, onClick }: { macro: MacroInvertebrate; onClick: () => void }) {
  const groupColors = {
    "sensitive": "border-emerald-200 bg-emerald-50",
    "somewhat-sensitive": "border-amber-200 bg-amber-50",
    "tolerant": "border-red-200 bg-red-50"
  };

  const groupBadges = {
    "sensitive": <Badge className="bg-emerald-600">Tolerance: {macro.toleranceValue}</Badge>,
    "somewhat-sensitive": <Badge className="bg-amber-600">Tolerance: {macro.toleranceValue}</Badge>,
    "tolerant": <Badge className="bg-red-600">Tolerance: {macro.toleranceValue}</Badge>
  };

  return (
    <Card
      className={`rounded-xl border-2 ${groupColors[macro.group]} cursor-pointer hover:shadow-lg transition-shadow`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base">{macro.commonName}</CardTitle>
            <CardDescription className="text-xs italic mt-1">{macro.scientificName}</CardDescription>
          </div>
          {groupBadges[macro.group]}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-700 mb-3 line-clamp-2">{macro.description}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs" onClick={(e) => { e.stopPropagation(); window.open(macro.iNaturalistUrl, '_blank'); }}>
            <Camera className="h-3 w-3 mr-1" />
            iNaturalist
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={(e) => { e.stopPropagation(); window.open(macro.macroOrgUrl, '_blank'); }}>
            <Database className="h-3 w-3 mr-1" />
            Macro.org
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MacroDetailModal({ macro, onClose }: { macro: MacroInvertebrate; onClose: () => void }) {
  const groupColors = {
    "sensitive": "from-emerald-50 to-white border-emerald-200",
    "somewhat-sensitive": "from-amber-50 to-white border-amber-200",
    "tolerant": "from-red-50 to-white border-red-200"
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <Card
        className={`rounded-3xl border-2 bg-gradient-to-br ${groupColors[macro.group]} max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl">{macro.commonName}</CardTitle>
              <CardDescription className="text-base italic mt-1">{macro.scientificName}</CardDescription>
            </div>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-slate-700">{macro.description}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Habitat</h4>
            <p className="text-sm text-slate-700">{macro.habitat}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Identifying Features</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              {macro.identifyingFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <Button asChild className="flex-1">
              <a href={macro.iNaturalistUrl} target="_blank" rel="noopener noreferrer">
                <Camera className="h-4 w-4 mr-2" />
                View on iNaturalist
              </a>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <a href={macro.macroOrgUrl} target="_blank" rel="noopener noreferrer">
                <Database className="h-4 w-4 mr-2" />
                View on Macroinvertebrates.org
              </a>
            </Button>
          </div>

          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-sm">
            <strong>🔬 Field Tip:</strong> Take clear photos of your specimen from multiple angles and upload to iNaturalist
            for expert verification. Tag @PennStateExtension or @DrSaraMueller for PA-specific identification help!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

