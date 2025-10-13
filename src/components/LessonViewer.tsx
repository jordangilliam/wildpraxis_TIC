// Interactive Lesson Viewer for PATIC Curriculum

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./card";
import { Button } from "./button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Badge } from "./badge";
import { Progress } from "./progress";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileText,
  Lightbulb,
  Target,
  Award,
  ExternalLink
} from "lucide-react";
import type { Lesson } from "../data/curriculum";
import { PATIC_LESSONS, PATIC_TOPICS } from "../data/curriculum";

interface LessonViewerProps {
  onCompleteLesson?: (lessonId: string) => void;
  completedLessons?: string[];
  onEarnBadge?: (badge: string) => void;
}

export function LessonViewer({ onCompleteLesson, completedLessons = [], onEarnBadge }: LessonViewerProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  const progress = (completedLessons.length / PATIC_LESSONS.length) * 100;

  return (
    <div className="space-y-6">
      {!selectedLesson ? (
        <LessonLibrary
          lessons={PATIC_LESSONS}
          completedLessons={completedLessons}
          progress={progress}
          onSelectLesson={setSelectedLesson}
        />
      ) : (
        <LessonDetail
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
          onComplete={() => {
            onCompleteLesson?.(selectedLesson.id);
            // Award badge for completing certain lessons
            if (selectedLesson.id === "about-trout") onEarnBadge?.("Brookies Beginner");
            if (selectedLesson.id === "aquarium-setup") onEarnBadge?.("Water Quality Expert");
          }}
          isCompleted={completedLessons.includes(selectedLesson.id)}
        />
      )}
    </div>
  );
}

function LessonLibrary({
  lessons,
  completedLessons,
  progress,
  onSelectLesson
}: {
  lessons: Lesson[];
  completedLessons: string[];
  progress: number;
  onSelectLesson: (lesson: Lesson) => void;
}) {
  const categories = {
    setup: lessons.filter(l => l.category === "setup"),
    biology: lessons.filter(l => l.category === "biology"),
    care: lessons.filter(l => l.category === "care"),
    environment: lessons.filter(l => l.category === "environment"),
    engagement: lessons.filter(l => l.category === "engagement")
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-sky-50 to-fuchsia-50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">📚 PA Trout in the Classroom Curriculum</CardTitle>
              <CardDescription className="text-base mt-2">
                Complete curriculum based on all 12 PATIC modules. Aligned with PA academic standards and WLA conservation training.
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-sky-600">{Math.round(progress)}%</div>
              <div className="text-sm text-slate-600">Complete</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-3" />
          <div className="mt-2 text-sm text-slate-600">
            {completedLessons.length} of {lessons.length} lessons completed
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full flex-wrap rounded-full bg-white/60 backdrop-blur ring-1 ring-white/60 p-1">
          <TabsTrigger value="all">All Lessons ({lessons.length})</TabsTrigger>
          <TabsTrigger value="setup">Setup ({categories.setup.length})</TabsTrigger>
          <TabsTrigger value="biology">Biology ({categories.biology.length})</TabsTrigger>
          <TabsTrigger value="care">Care ({categories.care.length})</TabsTrigger>
          <TabsTrigger value="environment">Environment ({categories.environment.length})</TabsTrigger>
          <TabsTrigger value="engagement">Engagement ({categories.engagement.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <LessonGrid lessons={lessons} completedLessons={completedLessons} onSelect={onSelectLesson} />
        </TabsContent>

        <TabsContent value="setup" className="mt-6">
          <LessonGrid lessons={categories.setup} completedLessons={completedLessons} onSelect={onSelectLesson} />
        </TabsContent>

        <TabsContent value="biology" className="mt-6">
          <LessonGrid lessons={categories.biology} completedLessons={completedLessons} onSelect={onSelectLesson} />
        </TabsContent>

        <TabsContent value="care" className="mt-6">
          <LessonGrid lessons={categories.care} completedLessons={completedLessons} onSelect={onSelectLesson} />
        </TabsContent>

        <TabsContent value="environment" className="mt-6">
          <LessonGrid lessons={categories.environment} completedLessons={completedLessons} onSelect={onSelectLesson} />
        </TabsContent>

        <TabsContent value="engagement" className="mt-6">
          <LessonGrid lessons={categories.engagement} completedLessons={completedLessons} onSelect={onSelectLesson} />
        </TabsContent>
      </Tabs>

      <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">📖 Complete Curriculum Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {PATIC_TOPICS.map((topic, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-sm">{topic}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LessonGrid({
  lessons,
  completedLessons,
  onSelect
}: {
  lessons: Lesson[];
  completedLessons: string[];
  onSelect: (lesson: Lesson) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {lessons.map((lesson) => {
        const isCompleted = completedLessons.includes(lesson.id);
        return (
          <Card
            key={lesson.id}
            className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onSelect(lesson)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    {isCompleted && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                    <BookOpen className="h-5 w-5 text-sky-600" />
                    {lesson.title}
                  </CardTitle>
                  <CardDescription className="mt-2">{lesson.duration}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {lesson.gradeLevels.map((grade) => (
                    <Badge key={grade} variant="secondary" className="text-xs">
                      {grade}
                    </Badge>
                  ))}
                  <Badge variant="secondary" className="text-xs capitalize">
                    {lesson.category}
                  </Badge>
                </div>
                <div className="text-sm text-slate-600">
                  {lesson.objectives.length} objectives • {lesson.activities.length} activities
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" size="sm">
                {isCompleted ? "Review Lesson" : "Start Lesson"}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

function LessonDetail({
  lesson,
  onClose,
  onComplete,
  isCompleted
}: {
  lesson: Lesson;
  onClose: () => void;
  onComplete: () => void;
  isCompleted: boolean;
}) {
  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-sky-50 to-fuchsia-50 backdrop-blur">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="sm" onClick={onClose}>
                  ← Back to Lessons
                </Button>
                {isCompleted && (
                  <Badge className="bg-emerald-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl">{lesson.title}</CardTitle>
              <CardDescription className="text-base mt-2">
                {lesson.duration} • Grades {lesson.gradeLevels.join(", ")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="w-full flex-wrap rounded-full bg-white/60 backdrop-blur ring-1 ring-white/60 p-1">
          <TabsTrigger value="content">📖 Content</TabsTrigger>
          <TabsTrigger value="objectives">🎯 Objectives</TabsTrigger>
          <TabsTrigger value="activities">🔬 Activities</TabsTrigger>
          <TabsTrigger value="assessment">✅ Assessment</TabsTrigger>
          <TabsTrigger value="resources">🔗 Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6 space-y-4">
          {lesson.content.map((section, i) => (
            <Card key={i} className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-line text-slate-700">{section.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="objectives" className="mt-6">
          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-sky-600" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {lesson.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{obj}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="mt-6 space-y-4">
          {lesson.activities.map((activity, i) => (
            <Card key={i} className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                  {activity.title}
                </CardTitle>
                <CardDescription>{activity.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge className="mb-2 capitalize">{activity.type}</Badge>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Materials Needed:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                    {activity.materials.map((material, j) => (
                      <li key={j}>{material}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Procedure:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
                    {activity.procedure.map((step, j) => (
                      <li key={j} className="pl-2">{step}</li>
                    ))}
                  </ol>
                </div>

                {activity.safetyNotes && activity.safetyNotes.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <h4 className="font-medium text-amber-900 mb-2">⚠️ Safety Notes:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-amber-800">
                      {activity.safetyNotes.map((note, j) => (
                        <li key={j}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="assessment" className="mt-6 space-y-4">
          {lesson.assessments.map((assessment, i) => (
            <Card key={i} className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 capitalize">
                  <Award className="h-5 w-5 text-purple-600" />
                  {assessment.type}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assessment.questions.map((q, j) => (
                  <div key={j} className="p-4 bg-slate-50 rounded-xl">
                    <div className="font-medium mb-2">{j + 1}. {q.question}</div>
                    <Badge variant="secondary" className="text-xs capitalize">{q.type}</Badge>

                    {q.options && (
                      <div className="mt-3 space-y-1">
                        {q.options.map((opt, k) => (
                          <div key={k} className="text-sm text-slate-600">• {opt}</div>
                        ))}
                      </div>
                    )}

                    {q.rubric && (
                      <div className="mt-3">
                        <div className="text-sm font-medium mb-1">Rubric:</div>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                          {q.rubric.map((criterion, k) => (
                            <li key={k}>{criterion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-sky-600" />
                Additional Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lesson.resources.map((resource, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium flex items-center gap-2">
                        {resource.title}
                        {resource.url && <ExternalLink className="h-4 w-4 text-slate-400" />}
                      </div>
                      {resource.organization && (
                        <div className="text-sm text-slate-600 mt-1">{resource.organization}</div>
                      )}
                      <div className="text-sm text-slate-600 mt-2">{resource.description}</div>
                    </div>
                    <Badge variant="secondary" className="capitalize text-xs">{resource.type}</Badge>
                  </div>
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-sky-600 hover:underline mt-2 inline-block"
                    >
                      {resource.url}
                    </a>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {lesson.standards && lesson.standards.length > 0 && (
            <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur mt-4">
              <CardHeader>
                <CardTitle className="text-base">PA Academic Standards Addressed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lesson.standards.map((standard, i) => (
                    <div key={i} className="text-sm p-2 bg-slate-50 rounded-lg">
                      {standard}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {!isCompleted && (
        <Card className="rounded-3xl border-2 border-emerald-200 bg-emerald-50 backdrop-blur">
          <CardContent className="pt-6">
            <Button onClick={onComplete} className="w-full" size="lg">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Mark Lesson as Complete
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

