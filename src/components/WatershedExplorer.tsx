// Watershed Explorer & Stream Data Integration
// Interactive watershed education with PA DEP, USGS, and local stream data
// Based on Penn State Extension watershed curriculum

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Badge } from "./badge";
import {
  MapPin,
  Droplets,
  TrendingUp,
  Search,
  ExternalLink,
  Info,
  Database,
  Activity,
  Waves,
  Mountain,
  Navigation
} from "lucide-react";

interface Watershed {
  id: string;
  name: string;
  basin: string;
  counties: string[];
  area: string;
  drainageTo: string;
  characteristics: string;
  troutStreams: string[];
  conservationProjects: string[];
  majorStreams: string[];
}

// Major PA Watersheds (examples - would be expanded)
const PA_WATERSHEDS: Watershed[] = [
  {
    id: "allegheny",
    name: "Allegheny River Watershed",
    basin: "Ohio River Basin",
    counties: ["Allegheny", "Armstrong", "Butler", "Clarion", "Forest", "McKean", "Venango", "Warren"],
    area: "11,805 square miles",
    drainageTo: "Ohio River → Mississippi River → Gulf of Mexico",
    characteristics: "Major coldwater fishery. Numerous wild brook trout streams in headwaters. Mix of forested headwaters and urban/industrial lower reaches.",
    troutStreams: ["Tionesta Creek", "Oil Creek", "French Creek", "Clarion River headwaters"],
    conservationProjects: ["Allegheny River Islands Wilderness", "Cook Forest Wild Trout Streams", "French Creek Biodiversity"],
    majorStreams: ["Allegheny River", "Tionesta Creek", "Oil Creek", "French Creek", "Clarion River", "Redbank Creek"]
  },
  {
    id: "susquehanna",
    name: "Susquehanna River Watershed",
    basin: "Chesapeake Bay Watershed",
    counties: ["Centre", "Clinton", "Lycoming", "Tioga", "Bradford", "Susquehanna", "Luzerne", "Dauphin"],
    area: "27,510 square miles (PA portion)",
    drainageTo: "Chesapeake Bay → Atlantic Ocean",
    characteristics: "Largest watershed in PA. Critical for Chesapeake Bay restoration. Mix of forested mountains, agricultural valleys, urban centers. Major wild trout resource.",
    troutStreams: ["Penns Creek", "Pine Creek", "Loyalsock Creek", "Fishing Creek", "Kettle Creek"],
    conservationProjects: ["Chesapeake Bay TMDL", "Pine Creek Gorge Protection", "Spring Creek Watershed Restoration"],
    majorStreams: ["Susquehanna River (West & North Branches)", "Juniata River", "Penns Creek", "Pine Creek", "Loyalsock Creek"]
  },
  {
    id: "delaware",
    name: "Delaware River Watershed",
    basin: "Delaware River Basin",
    counties: ["Pike", "Wayne", "Monroe", "Carbon", "Northampton", "Bucks", "Philadelphia"],
    area: "6,780 square miles (PA portion)",
    drainageTo: "Delaware Bay → Atlantic Ocean",
    characteristics: "NYC water supply headwaters. High-quality coldwater fisheries. Mix of protected forests, recreation areas, urban corridor.",
    troutStreams: ["Brodhead Creek", "McMichael Creek", "Tohickon Creek", "Lackawaxen River"],
    conservationProjects: ["Delaware River Wild & Scenic", "NYC Watershed Protection", "Highlands Conservation"],
    majorStreams: ["Delaware River", "Lehigh River", "Schuylkill River", "Brandywine Creek", "Brodhead Creek"]
  },
  {
    id: "youghiogheny",
    name: "Youghiogheny River Watershed",
    basin: "Ohio River Basin",
    counties: ["Fayette", "Somerset", "Westmoreland"],
    area: "434 square miles (PA portion)",
    drainageTo: "Monongahela River → Ohio River → Mississippi River → Gulf of Mexico",
    characteristics: "Premier whitewater and coldwater fishery. Mix of AMD-impacted areas and pristine headwaters. Major recreation economy.",
    troutStreams: ["Laurel Hill Creek", "Casselman River", "Yough headwaters"],
    conservationProjects: ["Youghiogheny River Trail", "AMD Remediation Projects", "Ohiopyle State Park Protection"],
    majorStreams: ["Youghiogheny River", "Casselman River", "Laurel Hill Creek"]
  }
];

const STREAM_DATA_SOURCES = [
  {
    id: "usgs",
    name: "USGS StreamStats",
    description: "Real-time stream flow, water level, and temperature data from USGS gauging stations across PA.",
    url: "https://waterdata.usgs.gov/pa/nwis/rt",
    icon: <Activity className="h-5 w-5 text-blue-600" />,
    features: ["Real-time flow data", "Historical records", "Peak flow statistics", "Basin characteristics"]
  },
  {
    id: "dep",
    name: "PA DEP Water Quality Portal",
    description: "Water quality assessments, impaired streams list (303d), and monitoring data from PA Department of Environmental Protection.",
    url: "https://www.dep.pa.gov/Business/Water/Pages/default.aspx",
    icon: <Droplets className="h-5 w-5 text-green-600" />,
    features: ["Integrated Water Quality Report", "303(d) Impaired Streams", "TMDL data", "Monitoring locations"]
  },
  {
    id: "pfbc-unassessed",
    name: "PFBC Unassessed Waters",
    description: "Database of wild trout streams being documented by PFBC biologists and citizen scientists.",
    url: "https://www.fishandboat.com/Conservation/Habitat/Pages/UnassessedWaters.aspx",
    icon: <Database className="h-5 w-5 text-purple-600" />,
    features: ["Wild trout populations", "Stream surveys", "Thermal tolerance data", "Citizen science nominations"]
  },
  {
    id: "watershed-atlas",
    name: "PA Watershed Atlas",
    description: "Interactive maps of PA watersheds, subbasins, and stream networks from PA DEP.",
    url: "https://www.dep.pa.gov/DataandTools/Pages/Watershed-Atlas.aspx",
    icon: <MapPin className="h-5 w-5 text-amber-600" />,
    features: ["Watershed boundaries", "Stream networks", "HUC codes", "Basin delineation"]
  }
];

const WATERSHED_CONCEPTS = [
  {
    concept: "What is a Watershed?",
    definition: "A watershed (also called drainage basin) is an area of land where all water drains to a common outlet - a stream, river, lake, or ocean. Every point on Earth is part of a watershed.",
    key: "Watersheds are defined by topography (ridgelines and mountains). Water flows downhill, so the highest points define watershed boundaries.",
    example: "If you're in Pittsburgh, rain falling on your school drains to a local stream → Allegheny River → Ohio River → Mississippi River → Gulf of Mexico."
  },
  {
    concept: "Watershed Address",
    definition: "Just like a street address, every location has a watershed address showing the nested watersheds it belongs to.",
    key: "Pennsylvania has 6 major river basins (Ohio, Susquehanna, Delaware, Potomac, Erie, Genesee), which divide into smaller watersheds (HUC 8, 10, 12).",
    example: "State College, PA: Chesapeake Bay → Susquehanna River Basin → Spring Creek Watershed → local tributary"
  },
  {
    concept: "Why Watersheds Matter",
    definition: "Everything that happens on land affects the water in that watershed. Pollution, development, agriculture, forests - all impact downstream water quality.",
    key: "We all live downstream from someone, and upstream from someone else. Protecting your local stream protects the entire watershed.",
    example: "Storm runoff from parking lots carries oil and salt to streams. Riparian buffers filter pollution before it reaches water."
  },
  {
    concept: "Headwater Streams",
    definition: "Small streams at the top of a watershed. Usually coldest, cleanest water. Critical for brook trout and biodiversity.",
    key: "Headwaters are 'nurseries' for aquatic life. Protecting headwaters protects the entire river system downstream.",
    example: "A 3-foot-wide mountain spring in the Alleghenies eventually becomes the Ohio River."
  },
  {
    concept: "Riparian Buffers",
    definition: "Vegetated areas along streams that filter runoff, stabilize banks, provide shade, and create wildlife habitat.",
    key: "Ideal buffer: Trees → shrubs → grasses moving away from stream. Minimum 35 feet each side, 100+ feet is ideal.",
    example: "Trees shade streams keeping them cold for trout. Roots prevent erosion. Leaves provide food for aquatic insects."
  }
];

export function WatershedExplorer() {
  const [selectedWatershed, setSelectedWatershed] = useState<Watershed | null>(null);
  const [zipCode, setZipCode] = useState("");

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Waves className="h-7 w-7 text-blue-600" />
            Watershed Explorer
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Discover your watershed, explore PA streams, and connect to real-time water data. 
            Every stream, every drop, every watershed matters!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ZIP Code Lookup */}
          <div className="p-4 bg-white rounded-xl border">
            <h4 className="font-medium mb-3">🗺️ Find Your Watershed</h4>
            <div className="flex gap-3">
              <Input
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter your ZIP code"
                className="flex-1"
              />
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Find
              </Button>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Enter your school's ZIP code to discover which watershed you're in and find nearby trout streams.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-3">
            <div className="p-3 bg-white rounded-xl border text-center">
              <div className="text-2xl font-bold text-blue-600">6</div>
              <div className="text-xs text-slate-600">Major River Basins</div>
            </div>
            <div className="p-3 bg-white rounded-xl border text-center">
              <div className="text-2xl font-bold text-green-600">86,000+</div>
              <div className="text-xs text-slate-600">Miles of Streams</div>
            </div>
            <div className="p-3 bg-white rounded-xl border text-center">
              <div className="text-2xl font-bold text-purple-600">4,000+</div>
              <div className="text-xs text-slate-600">Wild Trout Streams</div>
            </div>
            <div className="p-3 bg-white rounded-xl border text-center">
              <div className="text-2xl font-bold text-amber-600">3</div>
              <div className="text-xs text-slate-600">Ocean Destinations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="watersheds" className="w-full">
        <TabsList className="w-full flex-wrap rounded-full bg-white/60 backdrop-blur ring-1 ring-white/60 p-1">
          <TabsTrigger value="watersheds">
            <Mountain className="h-4 w-4 mr-2" />
            PA Watersheds
          </TabsTrigger>
          <TabsTrigger value="concepts">
            <Info className="h-4 w-4 mr-2" />
            Watershed Concepts
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="h-4 w-4 mr-2" />
            Stream Data
          </TabsTrigger>
          <TabsTrigger value="explore">
            <Navigation className="h-4 w-4 mr-2" />
            Explore Tools
          </TabsTrigger>
        </TabsList>

        {/* PA Watersheds Tab */}
        <TabsContent value="watersheds" className="mt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {PA_WATERSHEDS.map((watershed) => (
              <Card
                key={watershed.id}
                className="rounded-xl border-2 border-white/60 bg-white/80 backdrop-blur hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedWatershed(watershed)}
              >
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Waves className="h-5 w-5 text-blue-600" />
                    {watershed.name}
                  </CardTitle>
                  <CardDescription>{watershed.basin}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div><strong>Area:</strong> {watershed.area}</div>
                    <div><strong>Counties:</strong> {watershed.counties.slice(0, 3).join(", ")}
                      {watershed.counties.length > 3 && ` +${watershed.counties.length - 3} more`}
                    </div>
                    <div><strong>Drains to:</strong> {watershed.drainageTo}</div>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      View Details
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Watershed Details */}
          {selectedWatershed && (
            <Card className="rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white backdrop-blur">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedWatershed.name}</CardTitle>
                    <CardDescription className="text-base mt-1">{selectedWatershed.basin}</CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedWatershed(null)}>✕</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Characteristics</h4>
                  <p className="text-sm text-slate-700">{selectedWatershed.characteristics}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Major Trout Streams</h4>
                    <ul className="text-sm space-y-1">
                      {selectedWatershed.troutStreams.map((stream, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Droplets className="h-3 w-3 text-blue-600" />
                          {stream}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Major Streams</h4>
                    <ul className="text-sm space-y-1">
                      {selectedWatershed.majorStreams.slice(0, 5).map((stream, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Waves className="h-3 w-3 text-cyan-600" />
                          {stream}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Conservation Projects</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedWatershed.conservationProjects.map((project, i) => (
                      <Badge key={i} variant="secondary">{project}</Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <h4 className="font-medium mb-2">Counties in Watershed</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedWatershed.counties.map((county, i) => (
                      <Badge key={i} className="bg-emerald-600">{county}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Watershed Concepts Tab */}
        <TabsContent value="concepts" className="mt-6 space-y-4">
          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Understanding Watersheds</CardTitle>
              <CardDescription>Core concepts for watershed education (Penn State Extension curriculum)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {WATERSHED_CONCEPTS.map((item, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-xl border">
                  <h4 className="font-bold text-lg mb-2 text-blue-700">{item.concept}</h4>
                  <p className="text-sm text-slate-700 mb-3">{item.definition}</p>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-3">
                    <strong className="text-sm">🔑 Key Point:</strong>
                    <p className="text-sm text-slate-700 mt-1">{item.key}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <strong className="text-sm">📍 Example:</strong>
                    <p className="text-sm text-slate-700 mt-1">{item.example}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-2 border-amber-200 bg-amber-50 backdrop-blur">
            <CardHeader>
              <CardTitle>Activity: Trace Your Water</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 mb-3">
                Follow the water from your school to the ocean! This helps students understand connectivity.
              </p>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-white rounded-lg border">
                  <strong>1. Your Location:</strong> Where does rain falling on your school building go?
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <strong>2. Local Stream:</strong> What's the nearest stream or creek?
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <strong>3. Tributary:</strong> Where does that stream flow to?
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <strong>4. Major River:</strong> Which major PA river?
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <strong>5. Final Destination:</strong> Ohio River/Chesapeake Bay/Delaware Bay?
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <strong>6. Ocean:</strong> Gulf of Mexico, Atlantic Ocean, or Great Lakes?
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stream Data Tab */}
        <TabsContent value="data" className="mt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {STREAM_DATA_SOURCES.map((source) => (
              <Card key={source.id} className="rounded-xl border-2 border-white/60 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {source.icon}
                    {source.name}
                  </CardTitle>
                  <CardDescription>{source.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Features:</h4>
                      <ul className="text-sm space-y-1">
                        {source.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button asChild className="w-full">
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Access Data
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="rounded-3xl border-2 border-green-200 bg-green-50 backdrop-blur">
            <CardHeader>
              <CardTitle>Using Stream Data in Your TIC Program</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-white rounded-xl border">
                <strong className="text-sm">Pre-Release Site Assessment:</strong>
                <p className="text-sm text-slate-700 mt-1">
                  Use USGS StreamStats to check flow conditions. Use DEP water quality portal to check impairment status.
                  Use PFBC Unassessed Waters to see if wild trout are already present.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border">
                <strong className="text-sm">Release Day:</strong>
                <p className="text-sm text-slate-700 mt-1">
                  Check real-time flow data (USGS). Ideal: stable flows, not flooding or extreme low flow.
                  Record GPS coordinates for iNaturalist observations.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border">
                <strong className="text-sm">Long-term Monitoring:</strong>
                <p className="text-sm text-slate-700 mt-1">
                  Return to release site seasonally. Document changes using iNaturalist. Compare your water quality
                  data with USGS gauging station data. Track conservation project progress.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Explore Tools Tab */}
        <TabsContent value="explore" className="mt-6 space-y-4">
          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Interactive Watershed Tools</CardTitle>
              <CardDescription>Explore PA watersheds with these powerful online tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start" size="lg">
                <a href="https://www.dep.pa.gov/DataandTools/Pages/Watershed-Atlas.aspx" target="_blank" rel="noopener noreferrer">
                  <MapPin className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">PA DEP Watershed Atlas</div>
                    <div className="text-xs text-slate-600">Interactive maps of all PA watersheds and stream networks</div>
                  </div>
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </a>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start" size="lg">
                <a href="https://streamstats.usgs.gov/ss/" target="_blank" rel="noopener noreferrer">
                  <Activity className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">USGS StreamStats</div>
                    <div className="text-xs text-slate-600">Delineate watersheds, get basin characteristics, flow statistics</div>
                  </div>
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </a>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start" size="lg">
                <a href="https://www.dep.pa.gov/Business/Water/CleanWater/WaterQuality/IntegratedWatersReport/Pages/default.aspx" target="_blank" rel="noopener noreferrer">
                  <Droplets className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">PA Integrated Water Quality Report</div>
                    <div className="text-xs text-slate-600">Assess water quality status of PA streams and lakes</div>
                  </div>
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </a>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start" size="lg">
                <a href="https://www.fishandboat.com/Resource/Pages/Google-Fishing-Map.aspx" target="_blank" rel="noopener noreferrer">
                  <Database className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">PFBC Interactive Fishing Map</div>
                    <div className="text-xs text-slate-600">Find stocked streams, wild trout waters, access points</div>
                  </div>
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </a>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start" size="lg">
                <a href="https://www.chesapeakebay.net/what/maps/chesapeake-bay-watershed-map" target="_blank" rel="noopener noreferrer">
                  <Waves className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Chesapeake Bay Watershed Map</div>
                    <div className="text-xs text-slate-600">Interactive map of Chesapeake watershed (covers much of PA)</div>
                  </div>
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-2 border-purple-200 bg-purple-50 backdrop-blur">
            <CardHeader>
              <CardTitle>Citizen Science Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-slate-700 mb-3">
                Connect your watershed exploration to real research:
              </p>
              <Button asChild variant="outline" className="w-full justify-start">
                <a href="https://www.allaboutstreams.org/" target="_blank" rel="noopener noreferrer">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Alliance for Aquatic Resource Monitoring (ALLARM)
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <a href="https://www.dep.pa.gov/Citizens/GrantsLoansRebates/CommunityActionGrants/Pages/default.aspx" target="_blank" rel="noopener noreferrer">
                  <Activity className="h-4 w-4 mr-2" />
                  PA DEP Community Action Grants (Watershed Projects)
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 backdrop-blur">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0 text-2xl">
              💧
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-2">We All Live in a Watershed</h4>
              <p className="text-sm text-slate-700 mb-3">
                Every action affects water quality downstream. By protecting your local streams through Trout in the Classroom,
                you're helping protect entire watersheds - and the Chesapeake Bay, Ohio River, or Delaware Bay beyond!
              </p>
              <p className="text-sm text-slate-700 font-medium">
                🔵 Find your watershed → 🐟 Release healthy trout → 📊 Monitor water quality → 🌍 Protect our waters
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

