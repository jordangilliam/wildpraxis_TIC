// PA Resource Connection Hub
// Links students to PFBC, libraries, county/city parks, and conservation organizations

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Badge } from "./badge";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Calendar,
  Users,
  Waves,
  TreePine,
  BookOpen,
  Search
} from "lucide-react";
import { PA_RESOURCES } from "../data/curriculum";

export function ResourceHub() {
  const [zipCode, setZipCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-sky-50 to-emerald-50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">🌲 PA Conservation Resource Hub</CardTitle>
          <CardDescription className="text-base mt-2">
            Connect with PA Fish & Boat Commission, local libraries, county/city parks, and conservation organizations. 
            Find volunteer opportunities, field trips, and expert support for your TIC program.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter your ZIP code to find local resources"
                className="w-full"
              />
            </div>
            <Button>
              <MapPin className="h-4 w-4 mr-2" />
              Find Near Me
            </Button>
          </div>
          <div className="text-sm text-slate-600">
            💡 Find nearby parks, libraries, trout streams, and volunteer opportunities
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pfbc" className="w-full">
        <TabsList className="w-full flex-wrap rounded-full bg-white/60 backdrop-blur ring-1 ring-white/60 p-1">
          <TabsTrigger value="pfbc">
            <Waves className="h-4 w-4 mr-2" />
            PA Fish & Boat
          </TabsTrigger>
          <TabsTrigger value="parks">
            <TreePine className="h-4 w-4 mr-2" />
            Parks & DCNR
          </TabsTrigger>
          <TabsTrigger value="libraries">
            <BookOpen className="h-4 w-4 mr-2" />
            Libraries
          </TabsTrigger>
          <TabsTrigger value="volunteers">
            <Users className="h-4 w-4 mr-2" />
            Volunteer Orgs
          </TabsTrigger>
        </TabsList>

        {/* PA Fish & Boat Commission */}
        <TabsContent value="pfbc" className="mt-6 space-y-4">
          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5 text-sky-600" />
                PA Fish & Boat Commission
              </CardTitle>
              <CardDescription>
                Official state agency managing PA's aquatic resources and TIC programs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-sky-50 rounded-xl">
                  <h4 className="font-medium mb-2">Education Division</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-600" />
                      <a href="tel:717-705-7835" className="text-sky-600 hover:underline">
                        717-705-7835
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-600" />
                      <a href="mailto:ra-pfbceducation@pa.gov" className="text-sky-600 hover:underline text-xs">
                        ra-pfbceducation@pa.gov
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-slate-600" />
                      <a href="https://www.fishandboat.com/Education/TIC/Pages/default.aspx" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline text-xs">
                        TIC Program Website
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-sky-50 rounded-xl">
                  <h4 className="font-medium mb-2">What PFBC Provides</h4>
                  <ul className="space-y-1 text-sm text-slate-700">
                    <li>✓ Trout eggs for classroom</li>
                    <li>✓ Technical support & training</li>
                    <li>✓ Release site permits</li>
                    <li>✓ Curriculum resources</li>
                    <li>✓ Biologist visits (virtual/in-person)</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Regional Fisheries Offices</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { region: "Northwest", city: "Meadville", phone: "814-337-0444", counties: "Erie, Crawford, Mercer, Venango, Warren, Forest" },
                    { region: "Southwest", city: "Somerset", phone: "814-445-8974", counties: "Allegheny, Westmoreland, Fayette, Washington, Greene" },
                    { region: "Southcentral", city: "Bellefonte", phone: "814-359-5130", counties: "Centre, Huntingdon, Mifflin, Blair, Bedford" },
                    { region: "Northcentral", city: "Pleasant Gap", phone: "814-359-5110", counties: "Lycoming, Clinton, Cameron, Potter, Tioga" }
                  ].map((office, i) => (
                    <div key={i} className="p-3 border rounded-xl bg-white">
                      <div className="font-medium text-sky-700">{office.region} Region</div>
                      <div className="text-sm text-slate-600 mt-1">{office.city}</div>
                      <div className="flex items-center gap-2 mt-2 text-sm">
                        <Phone className="h-3 w-3" />
                        <a href={`tel:${office.phone}`} className="text-sky-600 hover:underline">{office.phone}</a>
                      </div>
                      <div className="text-xs text-slate-500 mt-2">Serves: {office.counties}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="font-medium text-amber-900 mb-2">📅 Upcoming PFBC Events</h4>
                <ul className="space-y-2 text-sm text-amber-800">
                  <li><strong>March 15:</strong> Spring Trout Stocking - Volunteer Day (Statewide)</li>
                  <li><strong>April 10:</strong> TIC Teacher Workshop - Virtual (1-3 PM)</li>
                  <li><strong>May 5:</strong> Youth Fishing Derby (County parks)</li>
                  <li><strong>June 1:</strong> Stream Explorer Day - Bellefonte office</li>
                </ul>
                <Button variant="outline" size="sm" className="mt-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Full Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parks & DCNR */}
        <TabsContent value="parks" className="mt-6 space-y-4">
          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="h-5 w-5 text-emerald-600" />
                PA State Parks & DCNR
              </CardTitle>
              <CardDescription>
                Field trip locations, environmental education, and watershed programming
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium mb-2">DCNR Environmental Education</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-slate-600" />
                        <a href="https://www.dcnr.pa.gov/Education/Pages/default.aspx" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                          DCNR Education Programs
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h5 className="font-medium text-sm mb-2">Available Programs:</h5>
                  <ul className="grid md:grid-cols-2 gap-2 text-sm text-slate-700">
                    <li>✓ Stream Studies field trips</li>
                    <li>✓ Watershed education kits</li>
                    <li>✓ Macroinvertebrate sampling</li>
                    <li>✓ Forest ecology programs</li>
                    <li>✓ Water quality monitoring</li>
                    <li>✓ Conservation careers talks</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Nearby State Parks with Trout Streams</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { name: "Raccoon Creek State Park", county: "Beaver", features: "Wildflower Reserve, hiking, stream access" },
                    { name: "Moraine State Park", county: "Butler", features: "Lake Arthur, environmental learning center" },
                    { name: "Ohiopyle State Park", county: "Fayette", features: "Youghiogheny River, rafting, fishing" },
                    { name: "McConnells Mill State Park", county: "Lawrence", features: "Slippery Rock Creek Gorge, native brook trout" }
                  ].map((park, i) => (
                    <div key={i} className="p-3 border rounded-xl bg-white hover:shadow-md transition-shadow">
                      <div className="font-medium text-emerald-700">{park.name}</div>
                      <div className="text-sm text-slate-600 mt-1">{park.county} County</div>
                      <div className="text-xs text-slate-500 mt-2">{park.features}</div>
                      <Button variant="outline" size="sm" className="mt-3">
                        <MapPin className="h-3 w-3 mr-1" />
                        Plan Field Trip
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>County & City Parks</CardTitle>
              <CardDescription>Local parks for stream monitoring and release sites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-medium">Allegheny County Parks</h4>
                <div className="grid md:grid-cols-3 gap-3">
                  {["North Park", "South Park", "Boyce Park"].map((park) => (
                    <div key={park} className="p-3 border rounded-xl bg-white">
                      <div className="font-medium">{park}</div>
                      <div className="text-xs text-slate-600 mt-1">Streams, trails, education programs</div>
                      <Button variant="ghost" size="sm" className="mt-2 text-xs">
                        View Amenities
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 mt-4">
                  <div className="text-sm">
                    <strong>💡 Pro Tip:</strong> Contact your county parks department to coordinate:
                  </div>
                  <ul className="text-sm text-slate-700 mt-2 space-y-1">
                    <li>• Water quality monitoring field trips</li>
                    <li>• Potential trout release sites</li>
                    <li>• Stream restoration volunteer days</li>
                    <li>• Naturalist-led programs</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Libraries */}
        <TabsContent value="libraries" className="mt-6 space-y-4">
          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Public Libraries - Environmental Resources
              </CardTitle>
              <CardDescription>
                Research materials, presentation spaces, citizen science kits, and community programs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 rounded-xl">
                  <h4 className="font-medium mb-2">What Libraries Offer TIC Programs</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>✓ Stream monitoring equipment kits (borrow)</li>
                    <li>✓ Environmental databases (research)</li>
                    <li>✓ Meeting rooms for presentations</li>
                    <li>✓ Nature-themed maker spaces</li>
                    <li>✓ Citizen science programs</li>
                    <li>✓ Community education events</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl">
                  <h4 className="font-medium mb-2">Partner with Your Library</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>📚 Host TIC release day celebration</li>
                    <li>🔬 Display student research posters</li>
                    <li>💻 Access iNaturalist & water quality databases</li>
                    <li>🎤 Present findings to community</li>
                    <li>📖 Check out field guides & reference books</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Featured Library Programs</h4>
                <div className="space-y-3">
                  {[
                    {
                      system: "Carnegie Library of Pittsburgh",
                      program: "Citizen Science Saturdays",
                      description: "Monthly hands-on science programs including water quality testing, macro identification, and iNaturalist uploads",
                      contact: "science@carnegielibrary.org"
                    },
                    {
                      system: "Allegheny County Library Association",
                      program: "Environmental Exploration Kits",
                      description: "Lending library of stream monitoring equipment, field guides, and data collection tools",
                      contact: "Contact your local branch"
                    }
                  ].map((lib, i) => (
                    <div key={i} className="p-3 border rounded-xl bg-white">
                      <div className="font-medium text-purple-700">{lib.system}</div>
                      <div className="text-sm font-medium mt-2">{lib.program}</div>
                      <div className="text-sm text-slate-600 mt-1">{lib.description}</div>
                      {lib.contact && (
                        <div className="text-xs text-slate-500 mt-2">Contact: {lib.contact}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="font-medium text-amber-900 mb-2">💡 Ideas for Library Partnerships</h4>
                <ul className="grid md:grid-cols-2 gap-2 text-sm text-amber-800">
                  <li>• "Meet the Trout" public program</li>
                  <li>• Water quality data collection workshops</li>
                  <li>• Conservation career speaker series</li>
                  <li>• Watershed photo/art exhibition</li>
                  <li>• Family stream exploration events</li>
                  <li>• Science fair project support</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Volunteer Organizations */}
        <TabsContent value="volunteers" className="mt-6 space-y-4">
          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-600" />
                Conservation & Volunteer Organizations
              </CardTitle>
              <CardDescription>
                Connect with Trout Unlimited, Wildlife Leadership Academy, and watershed groups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Wildlife Leadership Academy */}
              <div className="p-4 bg-gradient-to-br from-sky-50 to-emerald-50 rounded-xl border-2 border-sky-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg flex items-center gap-2">
                      ⭐ Wildlife Leadership Academy
                      <Badge className="bg-sky-600">Featured</Badge>
                    </h4>
                    <p className="text-sm text-slate-700 mt-2">
                      Pennsylvania's premier conservation training program for youth ambassadors. Take your TIC experience to the next level!
                    </p>

                    <div className="mt-4 grid md:grid-cols-2 gap-3">
                      <div>
                        <h5 className="font-medium text-sm mb-2">WLA Programs:</h5>
                        <ul className="text-sm text-slate-700 space-y-1">
                          <li>✓ Youth Ambassador training</li>
                          <li>✓ Field research projects</li>
                          <li>✓ Conservation career mentorship</li>
                          <li>✓ College-level workshops</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-2">WildPraxis Platform:</h5>
                        <ul className="text-sm text-slate-700 space-y-1">
                          <li>✓ Track conservation achievements</li>
                          <li>✓ Earn badges & level up</li>
                          <li>✓ Interactive watershed tools</li>
                          <li>✓ Connect with ambassadors</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <Button asChild className="bg-sky-600 hover:bg-sky-700">
                        <a href="https://wla-app.vercel.app/" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit WildPraxis
                        </a>
                      </Button>
                      <Button variant="outline">
                        Learn About WLA Programs
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trout Unlimited */}
              <div className="p-4 bg-blue-50 rounded-xl">
                <h4 className="font-medium mb-2">Trout Unlimited - Pennsylvania Council</h4>
                <p className="text-sm text-slate-700 mb-3">
                  National coldwater conservation organization with active local chapters across PA
                </p>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <h5 className="font-medium text-sm mb-2">TU Youth Programs:</h5>
                    <ul className="text-sm text-slate-700 space-y-1">
                      <li>• Stream cleanup volunteer days</li>
                      <li>• Habitat restoration projects</li>
                      <li>• Fly fishing workshops</li>
                      <li>• Conservation camps</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm mb-2">Local Chapters:</h5>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• Allegheny Mountain Chapter</li>
                      <li>• Three Rivers Chapter (Pittsburgh)</li>
                      <li>• Forbes Trail Chapter</li>
                      <li>• + 30 more statewide</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-3">
                  <a
                    href="https://www.patrout.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Visit PA Trout Unlimited
                  </a>
                </div>
              </div>

              {/* Other Organizations */}
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  {
                    name: "Western PA Conservancy",
                    focus: "Land & water conservation, stream restoration",
                    programs: "Volunteer workdays, internships, education programs"
                  },
                  {
                    name: "3 Rivers Wet Weather",
                    focus: "Stormwater education, green infrastructure",
                    programs: "Stream monitoring, rain garden projects"
                  },
                  {
                    name: "Chesapeake Bay Foundation",
                    focus: "Watershed restoration (Susquehanna)",
                    programs: "Student summit, field experiences"
                  },
                  {
                    name: "PA Environmental Council",
                    focus: "Land use, watershed policy",
                    programs: "Watershed planning, advocacy training"
                  }
                ].map((org, i) => (
                  <div key={i} className="p-3 border rounded-xl bg-white">
                    <div className="font-medium">{org.name}</div>
                    <div className="text-xs text-slate-600 mt-1">Focus: {org.focus}</div>
                    <div className="text-xs text-slate-500 mt-2">{org.programs}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="rounded-3xl border-2 border-emerald-200 bg-emerald-50 backdrop-blur">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white flex-shrink-0">
              💡
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-2">Ready to Connect?</h4>
              <p className="text-sm text-slate-700 mb-3">
                Reach out to any of these organizations to enhance your TIC program! Most offer free resources,
                expert speakers, field trip opportunities, and volunteer days.
              </p>
              <p className="text-sm text-slate-700">
                <strong>Start with:</strong> Contact your regional PFBC office, visit WildPraxis to track your conservation work,
                and connect with your local library to plan a community celebration of your release day!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

