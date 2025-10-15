// Interactive Trout Biology Learning Module
// Visual anatomy, life cycle, adaptations, and species comparison
// Based on PFBC and Penn State Extension educational materials

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Badge } from "./badge";
import {
  Fish,
  Eye,
  Heart,
  Waves,
  TrendingUp,
  Info,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Droplets,
  Thermometer,
  Activity
} from "lucide-react";

interface TroutSpecies {
  id: string;
  commonName: string;
  scientificName: string;
  status: "native" | "introduced";
  stateFish: boolean;
  description: string;
  identifyingFeatures: string[];
  habitat: string;
  temperatureTolerance: string;
  colorPattern: string;
  spotPattern: string;
  finEdges: string;
  conservationStatus: string;
  funFacts: string[];
}

const PA_TROUT_SPECIES: TroutSpecies[] = [
  {
    id: "brook-trout",
    commonName: "Brook Trout",
    scientificName: "Salvelinus fontinalis",
    status: "native",
    stateFish: true,
    description: "Pennsylvania's only native trout and official state fish. Brook trout are the most cold-sensitive salmonid and require pristine, cold headwater streams. They evolved in Pennsylvania over thousands of years and are perfectly adapted to our mountain streams.",
    identifyingFeatures: [
      "Worm-like markings (vermiculations) on back and dorsal fin",
      "Red spots with blue halos along sides",
      "White-edged fins (leading edges of lower fins)",
      "Square or slightly forked tail",
      "Pink to red belly (especially males in fall)",
      "Olive-green to dark brown back"
    ],
    habitat: "Cold, clean headwater streams with temperatures below 65°F. Prefers spring-fed streams with lots of cover (undercut banks, overhanging vegetation, woody debris).",
    temperatureTolerance: "48-65°F (lethal above 75°F). Most active 50-60°F.",
    colorPattern: "Olive-green back fading to cream/pink belly. Dark green to black back with light spots.",
    spotPattern: "Red spots with distinctive blue halos. Back has worm-like vermiculations.",
    finEdges: "White leading edges on pectoral, pelvic, and anal fins. Black stripe behind white edge.",
    conservationStatus: "Special concern in many areas due to habitat loss and warming temperatures. Wild populations are carefully protected.",
    funFacts: [
      "Pennsylvania's official state fish since 1970",
      "Can live in streams as small as 3 feet wide",
      "Males develop hooked jaws (kype) during spawning season",
      "Spawn in fall (October-November) unlike other trout",
      "Can hybridize with lake trout to create 'splake'",
      "Native range: Appalachian Mountains to Hudson Bay"
    ]
  },
  {
    id: "brown-trout",
    commonName: "Brown Trout",
    scientificName: "Salmo trutta",
    status: "introduced",
    stateFish: false,
    description: "Introduced from Europe in the 1880s. Brown trout are more tolerant of warm water and human disturbance than brook trout. They've become naturalized in many PA streams and are important for recreational fishing.",
    identifyingFeatures: [
      "Golden-brown coloration overall",
      "Black spots and red/orange spots (with light halos)",
      "Square tail with few or no spots",
      "Large spots on head and body",
      "Light golden to yellow sides",
      "White belly"
    ],
    habitat: "Adaptable to various stream sizes. Tolerates slightly warmer water than brook trout. Found in limestone streams, freestone streams, and tail waters.",
    temperatureTolerance: "50-68°F optimal (can survive to 75°F). More heat-tolerant than brook trout.",
    colorPattern: "Golden-brown to olive back, golden-yellow sides, cream to white belly.",
    spotPattern: "Black spots on head, body, and dorsal fin. Red or orange spots with light halos on sides.",
    finEdges: "No distinctive white edges. Fins golden to olive colored.",
    conservationStatus: "Widely established. Self-sustaining wild populations in many streams. Not native but not considered invasive.",
    funFacts: [
      "First stocked in PA in 1886 in Chester County",
      "Can grow much larger than brook trout (20+ pounds)",
      "More wary and difficult to catch than other trout",
      "Primarily nocturnal feeders as adults",
      "Native to Europe, North Africa, and western Asia",
      "Spawn in fall like brook trout"
    ]
  },
  {
    id: "rainbow-trout",
    commonName: "Rainbow Trout",
    scientificName: "Oncorhynchus mykiss",
    status: "introduced",
    stateFish: false,
    description: "Introduced from western North America. Rainbow trout are popular for stocking programs due to their fast growth and willingness to bite. Most PA rainbows are stocked, but some wild populations exist in tail waters and spring creeks.",
    identifyingFeatures: [
      "Distinctive pink-red lateral stripe along sides",
      "Black spots on back, sides, tail, and dorsal fin",
      "White belly and lower sides",
      "Slightly forked tail covered in spots",
      "Silver to greenish-blue back",
      "No red spots (unlike brook or brown trout)"
    ],
    habitat: "Adaptable to various conditions. Prefers cool, flowing water with good oxygen. Often found in riffles and runs. Some populations migrate to lakes.",
    temperatureTolerance: "50-65°F optimal (can tolerate up to 70°F). Falls between brook and brown trout in temperature tolerance.",
    colorPattern: "Blue-green to olive back, silver sides with pink-red stripe, white belly.",
    spotPattern: "Black spots uniformly distributed over back, sides, fins, and tail. No red spots.",
    finEdges: "No white edges. Fins are typically clear to slightly pigmented.",
    conservationStatus: "Stocked annually in PA. Limited wild reproduction in most streams. Steelhead (sea-run rainbows) in Lake Erie tributaries.",
    funFacts: [
      "Native to Pacific coast from Alaska to Mexico",
      "Spawn in spring (March-May) unlike other PA trout",
      "Steelhead are sea-run rainbows (Great Lakes in PA)",
      "Can jump up to 7 feet out of water",
      "Most commonly stocked trout in PA",
      "Closely related to Pacific salmon"
    ]
  }
];

const LIFE_CYCLE_STAGES = [
  {
    stage: "Egg",
    duration: "30-60 days (temperature dependent)",
    description: "Fertilized eggs are orange and pea-sized. Developing embryo visible through translucent shell. Eyes appear as dark spots ('eyed eggs') after 2-3 weeks.",
    key: "Development occurs in gravel nests (redds) or classroom egg baskets. Requires cold, well-oxygenated water.",
    icon: "🥚"
  },
  {
    stage: "Alevin",
    duration: "2-4 weeks",
    description: "Newly hatched with large yolk sac attached for nutrition. Hide in gravel or egg basket. Very vulnerable stage.",
    key: "Don't feed alevins - they absorb yolk sac. Provide gentle water flow and avoid bright lights.",
    icon: "🐛"
  },
  {
    stage: "Fry",
    duration: "2-3 months",
    description: "Yolk absorbed, 'swim-up' stage begins. Start feeding on tiny insects and fish food. Develop parr marks (dark vertical bars).",
    key: "Critical feeding stage. Provide high-quality food 3-4 times daily. Monitor water quality closely.",
    icon: "🐟"
  },
  {
    stage: "Juvenile/Parr",
    duration: "6-12 months",
    description: "Grow rapidly, develop adult coloration. Parr marks gradually fade. Establish territories in stream.",
    key: "Most fish are released at this stage (2-3 inches). Ready for stream life with proper acclimation.",
    icon: "🎣"
  },
  {
    stage: "Adult",
    duration: "1-7 years (species dependent)",
    description: "Sexually mature and can reproduce. Brook trout may live 5-7 years in wild. Browns can exceed 10 years.",
    key: "Wild trout spawn in fall (brook/brown) or spring (rainbow). PA's self-sustaining populations are critical for conservation.",
    icon: "🐠"
  }
];

const ANATOMY_PARTS = [
  {
    id: "fins",
    name: "Fins",
    description: "Trout have 8 fins total. Adipose fin (small fleshy fin between dorsal and tail) is unique to salmonids.",
    types: [
      "Dorsal fin: Balance and steering",
      "Adipose fin: Fat storage, salmonid identifier",
      "Caudal (tail) fin: Propulsion and speed",
      "Anal fin: Stability",
      "Pelvic fins (paired): Braking and stability",
      "Pectoral fins (paired): Steering and braking"
    ]
  },
  {
    id: "gills",
    name: "Gills",
    description: "Extract dissolved oxygen from water. Require 7+ ppm DO. Red color from blood flow.",
    function: "Water flows over gill filaments where oxygen diffuses into blood and CO2 diffuses out. Gill rakers filter food particles."
  },
  {
    id: "lateral-line",
    name: "Lateral Line",
    description: "Sensory organ running along each side. Detects vibrations, water movement, and low-frequency sounds.",
    function: "Allows trout to 'feel' approaching predators, prey, and obstacles even in murky water or darkness."
  },
  {
    id: "swim-bladder",
    name: "Swim Bladder",
    description: "Gas-filled organ for buoyancy control. Allows trout to maintain position in water column without expending energy.",
    function: "Trout can adjust depth by changing gas volume in swim bladder. Damaged bladders prevent normal swimming."
  },
  {
    id: "coloration",
    name: "Coloration & Camouflage",
    description: "Countershading: dark back (viewed from above against dark stream bottom), light belly (viewed from below against bright surface).",
    function: "Spots and patterns break up body outline. Can change shade slightly to match substrate. Males brighten during spawning."
  }
];

export function TroutBiology() {
  const [selectedSpecies, setSelectedSpecies] = useState<TroutSpecies>(PA_TROUT_SPECIES[0]);
  const [selectedAnatomyPart, setSelectedAnatomyPart] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Fish className="h-7 w-7 text-blue-600" />
            Interactive Trout Biology
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Explore Pennsylvania's trout species, anatomy, adaptations, and life cycle. Based on PFBC and Penn State Extension educational materials.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="species" className="w-full">
        <TabsList className="w-full flex-wrap rounded-full bg-white/60 backdrop-blur ring-1 ring-white/60 p-1">
          <TabsTrigger value="species">
            <Fish className="h-4 w-4 mr-2" />
            Species Guide
          </TabsTrigger>
          <TabsTrigger value="lifecycle">
            <TrendingUp className="h-4 w-4 mr-2" />
            Life Cycle
          </TabsTrigger>
          <TabsTrigger value="anatomy">
            <Eye className="h-4 w-4 mr-2" />
            Anatomy
          </TabsTrigger>
          <TabsTrigger value="adaptations">
            <Waves className="h-4 w-4 mr-2" />
            Adaptations
          </TabsTrigger>
        </TabsList>

        {/* Species Guide Tab */}
        <TabsContent value="species" className="mt-6 space-y-4">
          {/* Species Selector */}
          <div className="grid md:grid-cols-3 gap-4">
            {PA_TROUT_SPECIES.map((species) => (
              <Card
                key={species.id}
                className={`rounded-xl cursor-pointer transition-all ${
                  selectedSpecies.id === species.id
                    ? "border-2 border-blue-500 bg-blue-50"
                    : "border-2 border-white/60 bg-white/80 hover:shadow-lg"
                }`}
                onClick={() => setSelectedSpecies(species)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{species.commonName}</CardTitle>
                      <CardDescription className="text-xs italic">{species.scientificName}</CardDescription>
                    </div>
                    {species.stateFish && <Badge className="bg-amber-600">State Fish</Badge>}
                    {species.status === "native" ? (
                      <Badge className="bg-emerald-600">Native</Badge>
                    ) : (
                      <Badge variant="secondary">Introduced</Badge>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Detailed Species Info */}
          <Card className="rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white backdrop-blur">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedSpecies.commonName}</CardTitle>
                  <CardDescription className="text-base italic mt-1">{selectedSpecies.scientificName}</CardDescription>
                </div>
                <div className="flex gap-2">
                  {selectedSpecies.stateFish && <Badge className="bg-amber-600">PA State Fish</Badge>}
                  {selectedSpecies.status === "native" ? (
                    <Badge className="bg-emerald-600">Native Species</Badge>
                  ) : (
                    <Badge variant="secondary">Introduced 1880s</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-slate-700">{selectedSpecies.description}</p>
              </div>

              {/* Identification Features */}
              <div>
                <h4 className="font-medium mb-3">Identifying Features</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedSpecies.identifyingFeatures.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Field Guide Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-sky-50 rounded-xl border border-sky-200">
                  <h4 className="font-medium mb-2 text-sky-900">Visual Identification</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Color Pattern:</strong> {selectedSpecies.colorPattern}</div>
                    <div><strong>Spot Pattern:</strong> {selectedSpecies.spotPattern}</div>
                    <div><strong>Fin Edges:</strong> {selectedSpecies.finEdges}</div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <h4 className="font-medium mb-2 text-emerald-900">Habitat & Temperature</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Habitat:</strong> {selectedSpecies.habitat}</div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-red-600" />
                      <span><strong>Temp Range:</strong> {selectedSpecies.temperatureTolerance}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conservation Status */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  Conservation Status
                </h4>
                <p className="text-sm text-slate-700">{selectedSpecies.conservationStatus}</p>
              </div>

              {/* Fun Facts */}
              <div>
                <h4 className="font-medium mb-3">Fun Facts</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {selectedSpecies.funFacts.map((fact, i) => (
                    <div key={i} className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-sm">
                      💡 {fact}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Species Comparison */}
          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Quick Comparison Guide</CardTitle>
              <CardDescription>Key differences between Pennsylvania's three trout species</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Feature</th>
                      <th className="text-left p-2">Brook Trout</th>
                      <th className="text-left p-2">Brown Trout</th>
                      <th className="text-left p-2">Rainbow Trout</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Status</td>
                      <td className="p-2"><Badge className="bg-emerald-600">Native</Badge></td>
                      <td className="p-2"><Badge variant="secondary">Introduced</Badge></td>
                      <td className="p-2"><Badge variant="secondary">Introduced</Badge></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Back Pattern</td>
                      <td className="p-2">Worm-like vermiculations</td>
                      <td className="p-2">Large black spots</td>
                      <td className="p-2">Small black spots</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Spot Color</td>
                      <td className="p-2">Red with blue halos</td>
                      <td className="p-2">Black + red/orange</td>
                      <td className="p-2">Black only</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Fin Edges</td>
                      <td className="p-2">White-edged lower fins</td>
                      <td className="p-2">No white edges</td>
                      <td className="p-2">No white edges</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Special Feature</td>
                      <td className="p-2">Blue halos on red spots</td>
                      <td className="p-2">Golden-brown color</td>
                      <td className="p-2">Pink lateral stripe</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Spawn Time</td>
                      <td className="p-2">Fall (Oct-Nov)</td>
                      <td className="p-2">Fall (Oct-Nov)</td>
                      <td className="p-2">Spring (Mar-May)</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Cold Tolerance</td>
                      <td className="p-2">Most sensitive (needs coldest water)</td>
                      <td className="p-2">Moderate (tolerates warmer)</td>
                      <td className="p-2">Between brook and brown</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Life Cycle Tab */}
        <TabsContent value="lifecycle" className="mt-6 space-y-4">
          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Trout Life Cycle</CardTitle>
              <CardDescription>From egg to adult: Understanding trout development stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline */}
                <div className="space-y-6">
                  {LIFE_CYCLE_STAGES.map((stage, index) => (
                    <div key={stage.stage} className="relative pl-8">
                      {/* Timeline connector */}
                      {index < LIFE_CYCLE_STAGES.length - 1 && (
                        <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-blue-200" />
                      )}
                      
                      {/* Stage marker */}
                      <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl">
                        {stage.icon}
                      </div>

                      {/* Stage content */}
                      <div className="bg-slate-50 rounded-xl p-4 border">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-lg">{stage.stage}</h4>
                          <Badge variant="secondary">{stage.duration}</Badge>
                        </div>
                        <p className="text-sm text-slate-700 mb-2">{stage.description}</p>
                        <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 text-sm">
                          <strong>🔑 Key Point:</strong> {stage.key}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <h4 className="font-medium mb-2">Temperature & Development</h4>
                <p className="text-sm text-slate-700 mb-2">
                  Development rate is temperature-dependent. Colder water = slower development but often healthier fish.
                </p>
                <div className="grid md:grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-white rounded border">
                    <strong>48-50°F:</strong> Slow development, 50-60 days to hatch
                  </div>
                  <div className="p-2 bg-white rounded border">
                    <strong>52-55°F:</strong> Optimal, 30-40 days to hatch
                  </div>
                  <div className="p-2 bg-white rounded border">
                    <strong>Above 60°F:</strong> Too warm, high mortality risk
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Anatomy Tab */}
        <TabsContent value="anatomy" className="mt-6 space-y-4">
          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Trout Anatomy & Physiology</CardTitle>
              <CardDescription>Understanding how trout are perfectly adapted for life in cold streams</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ANATOMY_PARTS.map((part) => (
                <div
                  key={part.id}
                  className="p-4 bg-slate-50 rounded-xl border cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedAnatomyPart(selectedAnatomyPart === part.id ? null : part.id)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-lg">{part.name}</h4>
                    <ChevronRight className={`h-5 w-5 transition-transform ${selectedAnatomyPart === part.id ? 'rotate-90' : ''}`} />
                  </div>
                  
                  {selectedAnatomyPart === part.id && (
                    <div className="mt-3 space-y-3">
                      <p className="text-sm text-slate-700">{part.description}</p>
                      
                      {part.types && (
                        <div>
                          <strong className="text-sm">Types & Functions:</strong>
                          <ul className="mt-2 space-y-1">
                            {part.types.map((type, i) => (
                              <li key={i} className="text-sm text-slate-700 ml-4">• {type}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {part.function && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <strong className="text-sm">Function:</strong>
                          <p className="text-sm text-slate-700 mt-1">{part.function}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-2 border-purple-200 bg-purple-50 backdrop-blur">
            <CardHeader>
              <CardTitle>The Adipose Fin: Salmonid Signature</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 mb-3">
                The small, fleshy fin between the dorsal fin and tail is called the <strong>adipose fin</strong>.
                It's the defining characteristic of all salmonids (trout, salmon, char, whitefish).
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-white rounded-lg border">
                  <strong>Purpose:</strong> Fat storage, sensory function (recent research suggests it detects water flow)
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <strong>Identification:</strong> If a fish has an adipose fin, it's in the salmon family!
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Adaptations Tab */}
        <TabsContent value="adaptations" className="mt-6 space-y-4">
          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Adaptations for Cold Water Life</CardTitle>
              <CardDescription>How trout survive and thrive in Pennsylvania's coldwater streams</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-blue-600" />
                    Cold Water Adaptations
                  </h4>
                  <ul className="text-sm space-y-2">
                    <li>• <strong>Antifreeze proteins</strong> prevent ice crystal formation in blood</li>
                    <li>• <strong>Slow metabolism</strong> in cold water conserves energy</li>
                    <li>• <strong>High oxygen demand</strong> requires 7+ ppm dissolved oxygen</li>
                    <li>• <strong>Cold-water enzymes</strong> function best at 50-60°F</li>
                  </ul>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-emerald-600" />
                    Sensory Adaptations
                  </h4>
                  <ul className="text-sm space-y-2">
                    <li>• <strong>Excellent vision</strong> in clear, cold water</li>
                    <li>• <strong>Lateral line</strong> detects vibrations from prey/predators</li>
                    <li>• <strong>Smell (olfaction)</strong> detects chemical cues in parts per billion</li>
                    <li>• <strong>Taste buds</strong> on lips and in mouth for food selection</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Waves className="h-5 w-5 text-purple-600" />
                    Swimming & Feeding
                  </h4>
                  <ul className="text-sm space-y-2">
                    <li>• <strong>Streamlined body</strong> reduces drag in current</li>
                    <li>• <strong>Powerful tail</strong> for bursts of speed (catch prey, escape)</li>
                    <li>• <strong>Territory establishment</strong> in prime feeding locations</li>
                    <li>• <strong>Opportunistic feeding</strong> on drifting insects</li>
                  </ul>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-amber-600" />
                    Behavioral Adaptations
                  </h4>
                  <ul className="text-sm space-y-2">
                    <li>• <strong>Cover-seeking</strong> reduces predation risk and energy use</li>
                    <li>• <strong>Seasonal movements</strong> to spawning grounds</li>
                    <li>• <strong>Feeding stations</strong> behind rocks in optimal current</li>
                    <li>• <strong>Circadian rhythms</strong> peak feeding at dawn/dusk</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl">
                <h4 className="font-medium mb-2">🌡️ Why Cold Water?</h4>
                <p className="text-sm text-slate-700">
                  Cold water holds more dissolved oxygen than warm water. Trout need high oxygen levels for their active metabolism.
                  At 50°F, water can hold ~11 ppm oxygen. At 70°F, only ~8 ppm. Above 75°F, trout cannot get enough oxygen and die.
                  This is why protecting cold headwater streams is critical for native brook trout survival.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Educational Resources */}
      <Card className="rounded-3xl border-2 border-green-200 bg-green-50 backdrop-blur">
        <CardContent className="pt-6">
          <h4 className="font-medium mb-3">📚 Learn More About Trout Biology</h4>
          <div className="grid md:grid-cols-2 gap-3">
            <Button variant="outline" asChild>
              <a href="https://www.fishandboat.com/Fish/PennsylvaniaFishes/Trout/Pages/default.aspx" target="_blank" rel="noopener noreferrer">
                <Fish className="h-4 w-4 mr-2" />
                PFBC Trout Biology Resources
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://extension.psu.edu/" target="_blank" rel="noopener noreferrer">
                <Info className="h-4 w-4 mr-2" />
                Penn State Extension Aquatic Education
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

