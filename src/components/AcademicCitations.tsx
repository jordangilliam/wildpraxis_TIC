// Academic Citations & Expert Resources Viewer
// Showcases Dr. Sara Mueller, Penn State Extension, and Trout Unlimited resources

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Badge } from "./badge";
import {
  BookOpen,
  ExternalLink,
  GraduationCap,
  Mail,
  Phone,
  Search,
  FileText,
  Award,
  Users,
  Microscope
} from "lucide-react";
import academicResources, {
  DR_SARA_MUELLER_RESOURCES,
  PENN_STATE_EXTENSION_RESOURCES,
  TROUT_UNLIMITED_RESOURCES,
  PFBC_RESOURCES,
  EXPERT_CONTACTS,
  PA_ACADEMIC_STANDARDS,
  NGSS_STANDARDS,
  type AcademicResource
} from "../data/academicResources";

export function AcademicCitations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Get all unique topics
  const allTopics = Array.from(
    new Set(
      [
        ...DR_SARA_MUELLER_RESOURCES,
        ...PENN_STATE_EXTENSION_RESOURCES,
        ...TROUT_UNLIMITED_RESOURCES,
        ...PFBC_RESOURCES
      ].flatMap(r => r.topics)
    )
  ).sort();

  // Filter resources by search query
  const filterResources = (resources: AcademicResource[]) => {
    if (!searchQuery && !selectedTopic) return resources;
    
    return resources.filter(resource => {
      const matchesSearch = !searchQuery || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTopic = !selectedTopic ||
        resource.topics.includes(selectedTopic);
      
      return matchesSearch && matchesTopic;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-purple-50 via-sky-50 to-emerald-50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-purple-600" />
            Academic Resources & Citations
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Research-based resources from leading experts and institutions supporting Pennsylvania's Trout in the Classroom programs.
            All citations are formatted for academic use.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, author, or keyword..."
                className="pl-10"
              />
            </div>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear
              </Button>
            )}
          </div>

          {/* Topic Filters */}
          <div>
            <div className="text-sm font-medium mb-2">Filter by Topic:</div>
            <div className="flex flex-wrap gap-2">
              {allTopics.slice(0, 12).map(topic => (
                <Badge
                  key={topic}
                  className={`cursor-pointer hover:opacity-80 transition-opacity ${
                    selectedTopic === topic
                      ? "bg-purple-600"
                      : "bg-slate-200 text-slate-700"
                  }`}
                  onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
                >
                  {topic}
                </Badge>
              ))}
              {selectedTopic && (
                <Badge
                  className="bg-red-100 text-red-700 cursor-pointer"
                  onClick={() => setSelectedTopic(null)}
                >
                  Clear Filter
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="mueller" className="w-full">
        <TabsList className="w-full flex-wrap rounded-full bg-white/60 backdrop-blur ring-1 ring-white/60 p-1">
          <TabsTrigger value="mueller">
            <Microscope className="h-4 w-4 mr-2" />
            Dr. Sara Mueller
          </TabsTrigger>
          <TabsTrigger value="pennstate">
            <BookOpen className="h-4 w-4 mr-2" />
            Penn State Extension
          </TabsTrigger>
          <TabsTrigger value="troutunlimited">
            <Users className="h-4 w-4 mr-2" />
            Trout Unlimited
          </TabsTrigger>
          <TabsTrigger value="pfbc">
            <FileText className="h-4 w-4 mr-2" />
            PFBC Resources
          </TabsTrigger>
          <TabsTrigger value="standards">
            <Award className="h-4 w-4 mr-2" />
            Standards
          </TabsTrigger>
          <TabsTrigger value="experts">
            <Mail className="h-4 w-4 mr-2" />
            Expert Contacts
          </TabsTrigger>
        </TabsList>

        {/* Dr. Sara Mueller Tab */}
        <TabsContent value="mueller" className="mt-6 space-y-4">
          <Card className="rounded-3xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Microscope className="h-6 w-6 text-purple-600" />
                Dr. Sara Grisé Mueller, PhD
              </CardTitle>
              <CardDescription>
                Extension Educator - Environmental Education, Penn State Extension
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-sm text-slate-700 leading-relaxed">
                  <strong>Expertise:</strong> Stream ecology, benthic macroinvertebrates, watershed education, and citizen science monitoring.
                  Dr. Mueller develops research-based educational programs connecting youth and communities to Pennsylvania's water resources.
                  Her work is foundational to watershed education across the state.
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-600" />
                    <a href="mailto:sgm17@psu.edu" className="text-purple-600 hover:underline">
                      sgm17@psu.edu
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-600" />
                    <a href="tel:814-865-6448" className="text-purple-600 hover:underline">
                      814-865-6448
                    </a>
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-600 bg-white p-2 rounded">
                  💡 <strong>For Teachers:</strong> Dr. Mueller is available for virtual presentations to classrooms.
                  Schedule 4-6 weeks in advance for watershed education workshops and Q&A sessions.
                </div>
              </div>

              <div className="space-y-3">
                {filterResources(DR_SARA_MUELLER_RESOURCES).map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>

              {filterResources(DR_SARA_MUELLER_RESOURCES).length === 0 && (
                <div className="text-center text-slate-600 py-8">
                  No resources match your search criteria
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Penn State Extension Tab */}
        <TabsContent value="pennstate" className="mt-6 space-y-4">
          <Card className="rounded-3xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-sky-600" />
                Penn State Extension
              </CardTitle>
              <CardDescription>
                Land-grant university extension providing research-based environmental education
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-sky-50 rounded-xl border border-sky-200">
                <p className="text-sm text-slate-700 leading-relaxed">
                  Penn State Extension brings university research directly to Pennsylvania communities through practical, science-based education.
                  Their watershed and water quality programs are the gold standard for environmental education in the Commonwealth.
                </p>
                <div className="mt-3">
                  <a
                    href="https://extension.psu.edu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-sky-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Penn State Extension
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                {filterResources(PENN_STATE_EXTENSION_RESOURCES).map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>

              {filterResources(PENN_STATE_EXTENSION_RESOURCES).length === 0 && (
                <div className="text-center text-slate-600 py-8">
                  No resources match your search criteria
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trout Unlimited Tab */}
        <TabsContent value="troutunlimited" className="mt-6 space-y-4">
          <Card className="rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                Trout Unlimited
              </CardTitle>
              <CardDescription>
                National coldwater conservation organization with 31 active chapters in Pennsylvania
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Trout Unlimited is the nation's oldest and largest coldwater fisheries conservation organization.
                  PA chapters provide hands-on conservation opportunities for students through stream cleanups, restoration projects,
                  fly fishing workshops, and conservation camps.
                </p>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <strong className="block mb-2">Youth Programs:</strong>
                    <ul className="space-y-1 text-slate-700">
                      <li>• Trout in the Classroom support</li>
                      <li>• Stream habitat restoration workdays</li>
                      <li>• Fly fishing instruction</li>
                      <li>• Conservation camps & scholarships</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="block mb-2">Chapter Network:</strong>
                    <ul className="space-y-1 text-slate-700">
                      <li>• 31 chapters statewide</li>
                      <li>• Local stream expertise</li>
                      <li>• Volunteer opportunities</li>
                      <li>• Technical assistance</li>
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
                    <ExternalLink className="h-4 w-4" />
                    Visit PA Council of Trout Unlimited
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                {filterResources(TROUT_UNLIMITED_RESOURCES).map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>

              {filterResources(TROUT_UNLIMITED_RESOURCES).length === 0 && (
                <div className="text-center text-slate-600 py-8">
                  No resources match your search criteria
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PFBC Resources Tab */}
        <TabsContent value="pfbc" className="mt-6 space-y-4">
          <Card className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-emerald-600" />
                PA Fish & Boat Commission
              </CardTitle>
              <CardDescription>
                Official state agency resources for Trout in the Classroom programs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-sm text-slate-700 leading-relaxed">
                  The PA Fish & Boat Commission manages Pennsylvania's aquatic resources and coordinates the official
                  Trout in the Classroom program. PFBC provides eggs, technical support, curriculum resources, and release site permits.
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-600" />
                    <span className="text-slate-700">Education Division:</span>
                    <a href="tel:717-705-7835" className="text-emerald-600 hover:underline">
                      717-705-7835
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {filterResources(PFBC_RESOURCES).map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>

              {filterResources(PFBC_RESOURCES).length === 0 && (
                <div className="text-center text-slate-600 py-8">
                  No resources match your search criteria
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Standards Tab */}
        <TabsContent value="standards" className="mt-6 space-y-4">
          <Card className="rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-amber-600" />
                Academic Standards Alignment
              </CardTitle>
              <CardDescription>
                PA Academic Standards & Next Generation Science Standards (NGSS)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* PA Standards */}
              <div>
                <h3 className="font-bold text-lg mb-3">Pennsylvania Academic Standards</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-xl border">
                    <h4 className="font-medium text-sky-700 mb-2">Science - Biological Sciences (3.1)</h4>
                    <div className="text-sm text-slate-700 space-y-1">
                      <div><strong>3.1.4.A:</strong> Know that living things are made up of parts that have specific functions</div>
                      <div><strong>3.1.7.A:</strong> Describe the relationship between structure and function at multiple levels</div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border">
                    <h4 className="font-medium text-emerald-700 mb-2">Environment & Ecology - Watersheds (4.1)</h4>
                    <div className="text-sm text-slate-700 space-y-1">
                      <div><strong>4.1.4.A:</strong> Explain how water, plants and animals interact</div>
                      <div><strong>4.1.7.A:</strong> Describe ecosystem dynamics illustrating energy flow</div>
                      <div><strong>4.1.8.A:</strong> Explain the impacts of changes in environmental variables</div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border">
                    <h4 className="font-medium text-purple-700 mb-2">Ecosystems (4.6)</h4>
                    <div className="text-sm text-slate-700 space-y-1">
                      <div><strong>4.6.4.A:</strong> Identify career opportunities in environmental management</div>
                      <div><strong>4.6.7.B:</strong> Explain adaptation as response to environmental challenges</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NGSS Standards */}
              <div>
                <h3 className="font-bold text-lg mb-3">Next Generation Science Standards (NGSS)</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-xl border">
                    <h4 className="font-medium text-blue-700 mb-2">Elementary (K-5)</h4>
                    <ul className="text-xs text-slate-700 space-y-1">
                      {NGSS_STANDARDS.elementary.map((standard, i) => (
                        <li key={i}>• {standard}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-white rounded-xl border">
                    <h4 className="font-medium text-green-700 mb-2">Middle School (6-8)</h4>
                    <ul className="text-xs text-slate-700 space-y-1">
                      {NGSS_STANDARDS.middle.map((standard, i) => (
                        <li key={i}>• {standard}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-white rounded-xl border">
                    <h4 className="font-medium text-purple-700 mb-2">High School (9-12)</h4>
                    <ul className="text-xs text-slate-700 space-y-1">
                      {NGSS_STANDARDS.high.map((standard, i) => (
                        <li key={i}>• {standard}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl">
                <p className="text-sm text-slate-700">
                  <strong>💡 For Teachers:</strong> All lessons in this platform are aligned with these standards.
                  Each lesson module includes specific standard codes for easy curriculum integration and documentation.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expert Contacts Tab */}
        <TabsContent value="experts" className="mt-6 space-y-4">
          <Card className="rounded-3xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-6 w-6 text-violet-600" />
                Connect with Experts
              </CardTitle>
              <CardDescription>
                Direct contacts for program support, classroom presentations, and technical assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Dr. Mueller Contact */}
              <div className="p-4 bg-violet-50 rounded-xl border border-violet-200">
                <h3 className="font-bold text-lg mb-2">Dr. Sara Grisé Mueller, PhD</h3>
                <p className="text-sm text-slate-600 mb-3">{EXPERT_CONTACTS.mueller.title}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-600" />
                    <a href={`mailto:${EXPERT_CONTACTS.mueller.email}`} className="text-violet-600 hover:underline">
                      {EXPERT_CONTACTS.mueller.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-600" />
                    <a href={`tel:${EXPERT_CONTACTS.mueller.phone}`} className="text-violet-600 hover:underline">
                      {EXPERT_CONTACTS.mueller.phone}
                    </a>
                  </div>
                  <div className="mt-3 text-xs bg-white p-3 rounded border">
                    <strong>Areas of Expertise:</strong>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {EXPERT_CONTACTS.mueller.expertise.map(exp => (
                        <Badge key={exp} variant="secondary" className="text-xs">{exp}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-600 bg-amber-50 p-2 rounded">
                    📅 {EXPERT_CONTACTS.mueller.availability}
                  </div>
                </div>
              </div>

              {/* PFBC Education Contact */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <h3 className="font-bold text-lg mb-2">PA Fish & Boat Commission - Education Division</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-600" />
                    <a href={`mailto:${EXPERT_CONTACTS.pfbcEducation.email}`} className="text-emerald-600 hover:underline">
                      {EXPERT_CONTACTS.pfbcEducation.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-600" />
                    <a href={`tel:${EXPERT_CONTACTS.pfbcEducation.phone}`} className="text-emerald-600 hover:underline">
                      {EXPERT_CONTACTS.pfbcEducation.phone}
                    </a>
                  </div>
                  <div className="mt-3 text-xs bg-white p-3 rounded border">
                    <strong>Services Provided:</strong>
                    <ul className="mt-1 space-y-1">
                      {EXPERT_CONTACTS.pfbcEducation.services.map((service, i) => (
                        <li key={i}>• {service}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2 text-xs text-slate-600 bg-sky-50 p-2 rounded">
                    ⏱️ Response time: {EXPERT_CONTACTS.pfbcEducation.responseTime}
                  </div>
                </div>
              </div>

              {/* Trout Unlimited Contact */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="font-bold text-lg mb-2">PA Council of Trout Unlimited</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-600" />
                    <a href={`mailto:${EXPERT_CONTACTS.troutUnlimited.email}`} className="text-blue-600 hover:underline">
                      {EXPERT_CONTACTS.troutUnlimited.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-slate-600" />
                    <a href={EXPERT_CONTACTS.troutUnlimited.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {EXPERT_CONTACTS.troutUnlimited.url}
                    </a>
                  </div>
                  <div className="mt-3 text-xs bg-white p-3 rounded border">
                    <strong>Services Available:</strong>
                    <ul className="mt-1 space-y-1">
                      {EXPERT_CONTACTS.troutUnlimited.services.map((service, i) => (
                        <li key={i}>• {service}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2 text-xs text-slate-600 bg-amber-50 p-2 rounded">
                    💡 {EXPERT_CONTACTS.troutUnlimited.note}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Resource Card Component
function ResourceCard({ resource }: { resource: AcademicResource }) {
  return (
    <div className="p-4 bg-white rounded-xl border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-slate-900 mb-1">{resource.title}</h4>
          {resource.authors && (
            <div className="text-sm text-slate-600 mb-1">
              {resource.authors.join(", ")}
              {resource.year && ` (${resource.year})`}
            </div>
          )}
          <p className="text-sm text-slate-700 mt-2">{resource.description}</p>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {resource.topics.map(topic => (
              <Badge key={topic} variant="secondary" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>

          {resource.citation && (
            <div className="mt-3 p-2 bg-slate-50 rounded text-xs text-slate-600 font-mono">
              {resource.citation}
            </div>
          )}
        </div>

        <div className="ml-4">
          <Badge className="capitalize">{resource.type}</Badge>
        </div>
      </div>

      {resource.url && (
        <div className="mt-3">
          <Button variant="outline" size="sm" asChild>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-2" />
              View Resource
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}

