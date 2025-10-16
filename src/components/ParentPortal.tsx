// Parent Portal Component
// Student progress tracking and classroom updates (Foundation)

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { Progress } from './progress';
import { Users, Calendar, Bell, Award, BookOpen, TrendingUp, Heart } from 'lucide-react';

export function ParentPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <ParentLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return <ParentDashboard />;
}

function ParentLogin({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Users className="w-8 h-8" />
          Parent Portal
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track your child's Trout in the Classroom journey
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your classroom access code to view student progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input type="email" placeholder="parent@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Classroom Code</label>
            <Input type="text" placeholder="e.g., TIC-2024-SMITH" />
          </div>
          <Button className="w-full" onClick={onLogin}>
            Sign In
          </Button>
          
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have a code? Ask your child's teacher.
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Coming Soon: Full Parent Portal
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>✓ Real-time student progress tracking</li>
            <li>✓ Classroom updates and photos</li>
            <li>✓ Release day notifications</li>
            <li>✓ Volunteer opportunity sign-ups</li>
            <li>✓ Achievement badges and certificates</li>
            <li>✓ Direct messaging with teachers</li>
          </ul>
          <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded">
            <p className="text-xs text-gray-700 dark:text-gray-300">
              <strong>Authentication:</strong> Full portal will use Supabase for secure email/password 
              and Google sign-in. Parent accounts link to classroom via unique codes issued by teachers.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ParentDashboard() {
  const mockStudent = {
    name: 'Emma Johnson',
    grade: 4,
    classroom: 'Mrs. Smith\'s Class',
    progress: {
      lessonsCompleted: 8,
      totalLessons: 12,
      badgesEarned: 6,
      macrosIdentified: 15,
      fieldObservations: 3,
      gameHighScores: {
        'Trout Tower': 2450,
        'Macro Match': 18
      }
    }
  };

  const upcomingEvents = [
    { date: '2024-11-15', title: 'Release Day', location: 'Spring Creek', volunteersNeeded: 3 },
    { date: '2024-11-08', title: 'Stream Assessment Field Trip', location: 'Local Tributary', volunteersNeeded: 2 }
  ];

  const recentUpdates = [
    { date: '2024-10-20', title: 'Trout eggs have eyed!', content: 'The eggs are developing well and we can now see the eyes of the embryos!' },
    { date: '2024-10-18', title: 'Water quality perfect', content: 'All parameters looking great: Temp 50°F, Ammonia 0ppm, Nitrite 0ppm.' },
    { date: '2024-10-15', title: 'New lesson: Watersheds', content: 'Students learned about watershed boundaries and how water flows to our streams.' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="w-8 h-8" />
          Parent Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's {mockStudent.name}'s progress.
        </p>
      </div>

      {/* Student Progress */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{mockStudent.name}</CardTitle>
              <CardDescription>
                Grade {mockStudent.grade} • {mockStudent.classroom}
              </CardDescription>
            </div>
            <Badge variant="default" className="text-lg px-4 py-2">
              <Award className="w-4 h-4 mr-2" />
              {mockStudent.progress.badgesEarned} Badges
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Overall Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Overall Progress</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round((mockStudent.progress.lessonsCompleted / mockStudent.progress.totalLessons) * 100)}%
              </span>
            </div>
            <Progress 
              value={(mockStudent.progress.lessonsCompleted / mockStudent.progress.totalLessons) * 100} 
              className="h-3"
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              icon={<BookOpen className="w-5 h-5 text-blue-500" />}
              label="Lessons" 
              value={`${mockStudent.progress.lessonsCompleted}/${mockStudent.progress.totalLessons}`}
            />
            <StatCard 
              icon={<Award className="w-5 h-5 text-yellow-500" />}
              label="Badges" 
              value={mockStudent.progress.badgesEarned}
            />
            <StatCard 
              icon={<TrendingUp className="w-5 h-5 text-green-500" />}
              label="Macros ID'd" 
              value={mockStudent.progress.macrosIdentified}
            />
            <StatCard 
              icon={<Heart className="w-5 h-5 text-red-500" />}
              label="Observations" 
              value={mockStudent.progress.fieldObservations}
            />
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">{event.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      📍 {event.location}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-2">
                      {event.volunteersNeeded} volunteers needed
                    </Badge>
                    <Button size="sm">Sign Up to Help</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Classroom Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Recent Classroom Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUpdates.map((update, i) => (
              <div key={i} className="pb-4 border-b last:border-b-0 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-gray-900 dark:text-white">{update.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(update.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">{update.content}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Notice */}
      <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
            🚧 Demo Mode
          </h3>
          <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
            You're viewing a preview of the Parent Portal with sample data. The full implementation requires:
          </p>
          <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
            <li><strong>Backend:</strong> Supabase for authentication, database, and real-time updates</li>
            <li><strong>Teacher Tools:</strong> Update composer, photo uploads, event management</li>
            <li><strong>Email Notifications:</strong> Resend.com integration for automated updates</li>
            <li><strong>Privacy Controls:</strong> Parent opt-in for photo sharing and data display</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <div className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</div>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
    </div>
  );
}

