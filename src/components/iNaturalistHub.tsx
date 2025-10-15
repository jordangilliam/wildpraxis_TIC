// iNaturalist Citizen Science Hub
// Connect TIC programs to global biodiversity research
// Upload observations, track species, contribute to science

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Badge } from "./badge";
import {
  Camera,
  ExternalLink,
  MapPin,
  Users,
  TrendingUp,
  Award,
  BookOpen,
  Search,
  Leaf,
  Bug,
  Droplets,
  Info
} from "lucide-react";

interface iNatProject {
  id: string;
  name: string;
  description: string;
  url: string;
  focus: string;
  participants: string;
  observations: string;
}

const PA_INAT_PROJECTS: iNatProject[] = [
  {
    id: "pa-stream-life",
    name: "Pennsylvania Stream Life",
    description: "Document aquatic macroinvertebrates, fish, and stream biodiversity across Pennsylvania watersheds. Perfect for TIC programs!",
    url: "https://www.inaturalist.org/projects/pennsylvania-stream-life",
    focus: "Aquatic species",
    participants: "500+",
    observations: "10,000+"
  },
  {
    id: "pa-trout",
    name: "Pennsylvania Native Trout",
    description: "Document brook trout populations and native salmonid habitats. Help map PA's remaining wild brook trout streams.",
    url: "https://www.inaturalist.org/projects/pennsylvania-native-trout",
    focus: "Native trout",
    participants: "300+",
    observations: "2,500+"
  },
  {
    id: "pa-watersheds",
    name: "Three Rivers Biodiversity",
    description: "Catalog species in the Allegheny, Monongahela, and Ohio River watersheds. Urban and rural observations welcome.",
    url: "https://www.inaturalist.org/projects/three-rivers-biodiversity",
    focus: "Watershed species",
    participants: "800+",
    observations: "25,000+"
  },
  {
    id: "trout-unlimited",
    name: "Trout Unlimited Youth Observations",
    description: "TU's national citizen science project. Upload observations from TIC programs, stream cleanups, and field trips.",
    url: "https://www.inaturalist.org/projects/trout-unlimited-youth",
    focus: "TU youth programs",
    participants: "1,000+",
    observations: "15,000+"
  },
  {
    id: "chesapeake-bay",
    name: "Chesapeake Bay Watershed Biodiversity",
    description: "Document species in streams flowing to the Chesapeake Bay. Includes much of southern and central PA.",
    url: "https://www.inaturalist.org/projects/chesapeake-bay-watershed",
    focus: "Chesapeake watershed",
    participants: "2,000+",
    observations: "50,000+"
  }
];

const GETTING_STARTED_STEPS = [
  {
    step: 1,
    title: "Create iNaturalist Account",
    description: "Sign up for free at iNaturalist.org. Use your school email or create a classroom account.",
    icon: <Users className="h-5 w-5" />
  },
  {
    step: 2,
    title: "Download the App",
    description: "Get the iNaturalist app on iOS or Android. The app works offline for field trips!",
    icon: <Camera className="h-5 w-5" />
  },
  {
    step: 3,
    title: "Join PA Projects",
    description: "Join Pennsylvania Stream Life and other relevant projects to connect with local naturalists.",
    icon: <MapPin className="h-5 w-5" />
  },
  {
    step: 4,
    title: "Upload Observations",
    description: "Take photos of macroinvertebrates, plants, fish, and upload with location data.",
    icon: <Leaf className="h-5 w-5" />
  },
  {
    step: 5,
    title: "Get Expert IDs",
    description: "Community experts will help identify your observations and suggest improvements.",
    icon: <Award className="h-5 w-5" />
  },
  {
    step: 6,
    title: "Contribute to Science",
    description: "Research-grade observations are used by scientists worldwide for biodiversity studies.",
    icon: <TrendingUp className="h-5 w-5" />
  }
];

export function INaturalistHub() {
  const [selectedProject, setSelectedProject] = useState<iNatProject | null>(null);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Camera className="h-7 w-7 text-green-600" />
            iNaturalist Citizen Science Hub
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Connect your Trout in the Classroom program to the world's largest citizen science platform.
            Upload observations, contribute to real research, and connect with Pennsylvania naturalists.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border">
              <div className="text-3xl font-bold text-green-600">148M+</div>
              <div className="text-sm text-slate-600">Global Observations</div>
            </div>
            <div className="p-4 bg-white rounded-xl border">
              <div className="text-3xl font-bold text-blue-600">500K+</div>
              <div className="text-sm text-slate-600">Species Documented</div>
            </div>
            <div className="p-4 bg-white rounded-xl border">
              <div className="text-3xl font-bold text-purple-600">2.9M+</div>
              <div className="text-sm text-slate-600">Active Users</div>
            </div>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Info className="h-5 w-5 text-green-600" />
              Why iNaturalist for TIC Programs?
            </h4>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>✓ Document species at your release site and create a biodiversity baseline</li>
              <li>✓ Get expert help identifying macroinvertebrates and aquatic plants</li>
              <li>✓ Contribute data used by Penn State researchers, DEP, and conservation groups</li>
              <li>✓ Connect with Dr. Sara Mueller and other PA watershed educators</li>
              <li>✓ Track species over time to monitor ecosystem health</li>
              <li>✓ Engage students in authentic scientific research</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="w-full flex-wrap rounded-full bg-white/60 backdrop-blur ring-1 ring-white/60 p-1">
          <TabsTrigger value="projects">
            <MapPin className="h-4 w-4 mr-2" />
            PA Projects
          </TabsTrigger>
          <TabsTrigger value="getting-started">
            <BookOpen className="h-4 w-4 mr-2" />
            Getting Started
          </TabsTrigger>
          <TabsTrigger value="tic-guide">
            <Droplets className="h-4 w-4 mr-2" />
            TIC Program Guide
          </TabsTrigger>
          <TabsTrigger value="species">
            <Bug className="h-4 w-4 mr-2" />
            What to Document
          </TabsTrigger>
        </TabsList>

        {/* PA Projects Tab */}
        <TabsContent value="projects" className="mt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {PA_INAT_PROJECTS.map((project) => (
              <Card
                key={project.id}
                className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {project.name}
                    <ExternalLink className="h-4 w-4 text-slate-400 ml-auto" />
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="secondary">{project.focus}</Badge>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-slate-600">Participants</div>
                        <div className="font-medium">{project.participants}</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Observations</div>
                        <div className="font-medium">{project.observations}</div>
                      </div>
                    </div>
                    <Button asChild className="w-full mt-3">
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <Camera className="h-4 w-4 mr-2" />
                        Join Project
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="rounded-3xl border-2 border-blue-200 bg-blue-50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Search for More Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 mb-3">
                Find additional projects focused on your county, watershed, or specific taxa:
              </p>
              <Button asChild variant="outline">
                <a href="https://www.inaturalist.org/projects" target="_blank" rel="noopener noreferrer">
                  <Search className="h-4 w-4 mr-2" />
                  Browse All iNaturalist Projects
                </a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Getting Started Tab */}
        <TabsContent value="getting-started" className="mt-6 space-y-4">
          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Getting Started with iNaturalist</CardTitle>
              <CardDescription>Step-by-step guide for classrooms and TIC programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {GETTING_STARTED_STEPS.map((item) => (
                  <div key={item.step} className="p-4 bg-slate-50 rounded-xl border">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1 flex items-center gap-2">
                          {item.icon}
                          {item.title}
                        </h4>
                        <p className="text-sm text-slate-700">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <h4 className="font-medium mb-2">📱 Quick Links</h4>
                <div className="space-y-2">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <a href="https://www.inaturalist.org/signup" target="_blank" rel="noopener noreferrer">
                      <Users className="h-4 w-4 mr-2" />
                      Create Account
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <a href="https://www.inaturalist.org/pages/getting+started" target="_blank" rel="noopener noreferrer">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Official Getting Started Guide
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <a href="https://www.inaturalist.org/pages/teacher's+guide" target="_blank" rel="noopener noreferrer">
                      <Award className="h-4 w-4 mr-2" />
                      Teacher's Guide
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TIC Program Guide Tab */}
        <TabsContent value="tic-guide" className="mt-6 space-y-4">
          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>iNaturalist for Trout in the Classroom</CardTitle>
              <CardDescription>How to integrate citizen science into your TIC program</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-sky-50 rounded-xl border border-sky-200">
                <h4 className="font-medium mb-2">📅 Throughout the Year</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Fall Setup:</strong> Create classroom account, join PA projects, practice with campus observations</div>
                  <div><strong>Winter (Eggs/Alevin):</strong> Document tank setup, egg development stages, water quality indicators</div>
                  <div><strong>Spring (Fry):</strong> Prepare for release site documentation with practice observations</div>
                  <div><strong>Release Day:</strong> Comprehensive biodiversity survey of release site</div>
                  <div><strong>Post-Release:</strong> Monitor site over time, track seasonal changes</div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <h4 className="font-medium mb-2">🎯 Release Day Activities</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Split into teams: Aquatic Macros, Terrestrial Insects, Plants, Herps, Birds</li>
                  <li>• Set 30-minute observation window for intensive surveying</li>
                  <li>• Upload 20-30 observations minimum to establish baseline</li>
                  <li>• Use "Pennsylvania Stream Life" project for automatic grouping</li>
                  <li>• Tag observations with "Trout Release 2024" or similar</li>
                  <li>• Compare your site's biodiversity to other PA TIC programs</li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <h4 className="font-medium mb-2">💡 Pro Tips</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• <strong>Photo Quality:</strong> Take 3-5 clear photos from different angles</li>
                  <li>• <strong>Location:</strong> iNaturalist automatically obscures rare species locations</li>
                  <li>• <strong>Identification:</strong> Start with broad categories, community will refine</li>
                  <li>• <strong>Field Guides:</strong> Create custom guides for your watershed</li>
                  <li>• <strong>Data Export:</strong> Download CSV for classroom analysis projects</li>
                  <li>• <strong>Integration:</strong> Link to WildPraxis badges and conservation points</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <h4 className="font-medium mb-2">🏆 Educational Outcomes</h4>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-slate-700">
                  <div>• Species identification skills</div>
                  <div>• Data collection protocols</div>
                  <div>• Scientific photography</div>
                  <div>• Community engagement</div>
                  <div>• Digital literacy</div>
                  <div>• Environmental stewardship</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* What to Document Tab */}
        <TabsContent value="species" className="mt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="rounded-3xl border-2 border-blue-200 bg-blue-50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  Aquatic Species
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li><strong>Macroinvertebrates:</strong> Mayflies, stoneflies, caddisflies, beetles, dragonfly nymphs</li>
                  <li><strong>Fish:</strong> Native brook trout, sculpins, darters, minnows</li>
                  <li><strong>Amphibians:</strong> Salamanders (especially spring salamanders), tadpoles, frogs</li>
                  <li><strong>Aquatic Plants:</strong> Watercress, water crowfoot, mosses</li>
                  <li><strong>Algae:</strong> Diatoms, filamentous algae</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-2 border-green-200 bg-green-50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Riparian Species
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li><strong>Trees:</strong> Sycamore, river birch, willows, hemlocks</li>
                  <li><strong>Wildflowers:</strong> Cardinal flower, jewelweed, joe-pye weed</li>
                  <li><strong>Ferns:</strong> Ostrich fern, cinnamon fern, sensitive fern</li>
                  <li><strong>Insects:</strong> Butterflies, beetles, pollinators visiting riparian flowers</li>
                  <li><strong>Birds:</strong> Louisiana waterthrush, belted kingfisher, herons</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Priority Species for PA Streams</CardTitle>
              <CardDescription>Focus on these indicator species for stream health assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50 rounded-xl border">
                  <div className="font-medium text-emerald-700 mb-2">Excellent Quality Indicators</div>
                  <ul className="text-xs space-y-1">
                    <li>• Stonefly nymphs</li>
                    <li>• Mayfly nymphs</li>
                    <li>• Caddisfly larvae</li>
                    <li>• Riffle beetles</li>
                    <li>• Brook trout</li>
                    <li>• Spring salamanders</li>
                  </ul>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border">
                  <div className="font-medium text-amber-700 mb-2">Good Quality Indicators</div>
                  <ul className="text-xs space-y-1">
                    <li>• Dragonfly/damselfly nymphs</li>
                    <li>• Scuds/amphipods</li>
                    <li>• Crane fly larvae</li>
                    <li>• Sculpins</li>
                    <li>• Dusky salamanders</li>
                    <li>• Water striders</li>
                  </ul>
                </div>
                <div className="p-3 bg-red-50 rounded-xl border">
                  <div className="font-medium text-red-700 mb-2">Degraded Quality (Note if abundant)</div>
                  <ul className="text-xs space-y-1">
                    <li>• Aquatic worms</li>
                    <li>• Midge larvae (bloodworms)</li>
                    <li>• Leeches</li>
                    <li>• Snails (some species)</li>
                    <li>• Blackfly larvae (if dominant)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="rounded-3xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center text-white flex-shrink-0 text-2xl">
              🌍
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-2">Ready to Contribute to Science?</h4>
              <p className="text-sm text-slate-700 mb-4">
                Join thousands of Pennsylvania students documenting biodiversity. Your observations help scientists
                understand species distributions, track climate change impacts, and inform conservation decisions.
              </p>
              <div className="flex gap-3">
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <a href="https://www.inaturalist.org/projects/pennsylvania-stream-life" target="_blank" rel="noopener noreferrer">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Documenting
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://www.inaturalist.org/pages/teacher's+guide" target="_blank" rel="noopener noreferrer">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Teacher Resources
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

