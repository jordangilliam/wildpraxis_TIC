# Phase 2: Advanced Features Roadmap
## WildPraxis Trout in the Classroom

**Date**: October 16, 2025  
**Status**: Planning & Implementation Guide

---

## 🎉 Phase 1 COMPLETE (Just Deployed!)

### ✅ Completed Features
1. **AI-Powered Macro Identification** 
   - Google Cloud Vision API integration
   - 15-species PA macroinvertebrate database
   - Camera capture & upload support
   - Stream health scoring (BIBI)
   - Manual identification keys
   - **Location**: `src/components/AIMacroIdentifier.tsx`

2. **BrookAI Chat Integration**
   - Skillbuilder.io agent (privacy & security built-in)
   - Context-aware trout care assistance
   - Suggested questions & resources
   - **Location**: `src/components/BrookAIChat.tsx`

3. **Virtual Trout Life Cycle Tour**
   - Interactive 5-stage journey (egg→adult)
   - Auto-play & manual navigation
   - Care requirements per stage
   - Common issues & prevention
   - PA standards alignment
   - **Location**: `src/components/VirtualTroutLifeCycle.tsx`

4. **Crisis Management Scenarios**
   - Timed emergency response training
   - 3 realistic scenarios (ammonia spike, chiller failure, power outage)
   - Scoring & feedback system
   - Prevention tips
   - **Location**: `src/components/CrisisScenarios.tsx`

---

## 📋 Phase 2: Accessibility & Internationalization

### 🎯 Priority: HIGH | Timeline: 2-3 weeks

### 1. Full Accessibility (WCAG 2.1 AA Compliance)

#### **A. Screen Reader Support**
**Files to Create/Modify:**
- `src/hooks/useAnnouncements.ts` - Live region announcements
- `src/components/SkipLinks.tsx` - Skip navigation component
- All existing components - Add ARIA labels

**Implementation Tasks:**
```typescript
// 1. Add semantic HTML everywhere
<main role="main">
<nav aria-label="Main navigation">
<section aria-labelledby="lesson-title">

// 2. ARIA labels for interactive elements
<button aria-label="Start Crisis Scenario">
<div role="status" aria-live="polite"> // For dynamic updates

// 3. Focus management
// In modal/dialog components:
useEffect(() => {
  const firstFocusable = dialogRef.current?.querySelector('button, [href], input, select');
  firstFocusable?.focus();
  return () => previouslyFocused?.focus();
}, [isOpen]);

// 4. Image alt text
<img src={macro.image} alt={`${macro.commonName} - ${macro.description}`} />
```

**Required npm packages:**
```bash
npm install @react-aria/interactions @react-aria/focus
npm install react-focus-lock
```

**Testing checklist:**
- [ ] Navigate entire app with keyboard only
- [ ] Test with NVDA (Windows) / VoiceOver (Mac)
- [ ] Verify color contrast ratios (4.5:1 minimum)
- [ ] Test with Windows High Contrast mode

#### **B. Enhanced Keyboard Navigation**
**Files to Create:**
- `src/hooks/useKeyboardShortcuts.ts`
- `src/components/ShortcutGuide.tsx`

**Keyboard Shortcuts:**
```typescript
const shortcuts = {
  'Alt + 1': 'Go to Dashboard',
  'Alt + 2': 'Go to Live Data',
  'Alt + 3': 'Go to AI Macro ID',
  'Alt + 4': 'Go to BrookAI Chat',
  'Alt + L': 'Open Lessons',
  'Alt + G': 'Open Games',
  '?': 'Show keyboard shortcuts',
  'Esc': 'Close modal/dialog',
  'Tab': 'Navigate forward',
  'Shift + Tab': 'Navigate backward',
  'Enter/Space': 'Activate button',
  'Arrow keys': 'Navigate lists/tabs'
};
```

#### **C. High Contrast & Dark Mode**
**Files to Create:**
- `src/contexts/AccessibilityContext.tsx`
- `src/components/AccessibilityPanel.tsx`
- `tailwind.config.js` - Add dark mode variants

```typescript
// Accessibility Context
interface AccessibilitySettings {
  highContrast: boolean;
  darkMode: boolean;
  fontSize: 'normal' | 'large' | 'x-large';
  reduceMotion: boolean;
  dyslexiaFont: boolean;
}

// Tailwind Dark Mode
module.exports = {
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        // High contrast palette
        'hc-bg': '#000000',
        'hc-text': '#FFFFFF',
        'hc-accent': '#FFFF00',
      }
    }
  }
}
```

**CSS for reduced motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### **D. Dyslexia-Friendly Features**
**Implementation:**
```typescript
// Add OpenDyslexic font
// In index.css:
@font-face {
  font-family: 'OpenDyslexic';
  src: url('/fonts/OpenDyslexic-Regular.woff2') format('woff2');
}

// Apply conditionally
<body className={dyslexiaFont ? 'font-opendyslexic' : 'font-sans'}>
```

**Download font:** https://opendyslexic.org/

---

### 2. Multilingual Support (i18n)

#### **A. Spanish Translation (Priority)**
**Files to Create:**
- `src/i18n/en.json`
- `src/i18n/es.json`
- `src/i18n/config.ts`
- `src/contexts/LanguageContext.tsx`

**Required packages:**
```bash
npm install react-i18next i18next i18next-browser-languagedetector
```

**Translation Structure:**
```json
{
  "nav": {
    "dashboard": "Dashboard",
    "liveData": "Live Data",
    "aiMacro": "AI Macro ID",
    "brookAI": "BrookAI"
  },
  "crisis": {
    "title": "Crisis Management Scenarios",
    "ammonia": {
      "title": "Ammonia Emergency",
      "situation": "Monday morning, you test the water..."
    }
  }
}
```

**Implementation:**
```typescript
import { useTranslation } from 'react-i18next';

function Component() {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('crisis.title')}</h1>
      <button onClick={() => i18n.changeLanguage('es')}>
        Español
      </button>
    </div>
  );
}
```

**Translation priorities:**
1. Main navigation & UI controls (Week 1)
2. Crisis scenarios & life cycle content (Week 1)
3. Lessons & curriculum (Week 2)
4. All other content (Week 2-3)

**Translation vendors:**
- Gengo.com (professional, $0.06/word)
- Community translation via Crowdin (free, slower)
- Penn State Extension Spanish resources (may already exist!)

#### **B. Audio Narration**
**Files to Create:**
- `src/services/textToSpeech.ts`
- `src/components/AudioPlayer.tsx`
- `src/hooks/useNarration.ts`

**Options:**

**Option 1: Web Speech API (Free, browser-based)**
```typescript
export function useSpeechSynthesis() {
  const speak = (text: string, lang: string = 'en-US') => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };
  
  return { speak };
}
```

**Option 2: Google Cloud Text-to-Speech (Premium quality)**
```typescript
// More natural voices, but costs ~$4 per 1M characters
async function generateAudio(text: string, lang: string) {
  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: 'POST',
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: lang, ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' }
      })
    }
  );
  return response.json();
}
```

**Option 3: Pre-recorded narration**
- Record all lesson content with Dr. Sara Mueller or PFBC educators
- Host MP3 files on Vercel/CloudFront
- Higher quality, authentic educator voices
- One-time effort, no ongoing costs

**Recommended approach:**
- Option 1 (Web Speech) for immediate deployment
- Option 3 (pre-recorded) for lesson content over summer

**UI Component:**
```typescript
<div className="narration-controls">
  <button 
    onClick={() => speak(content)} 
    aria-label="Read aloud"
  >
    🔊 Listen
  </button>
  <select onChange={(e) => setVoice(e.target.value)}>
    <option value="en-US">English</option>
    <option value="es-ES">Español</option>
  </select>
  <input 
    type="range" 
    min="0.5" 
    max="2" 
    step="0.1" 
    value={speed}
    aria-label="Speech speed"
  />
</div>
```

---

## 📱 Phase 3: AR Features

### 🎯 Priority: MEDIUM | Timeline: 3-4 weeks

### 1. AR Trout Anatomy

**Technology Options:**

**Option A: WebXR (AR in browser)**
```bash
npm install @react-three/fiber @react-three/drei @react-three/xr
npm install three
```

**Option B: 8th Wall (Premium AR platform)**
- $99/month
- Better tracking & features
- Real-world placement

**Option C: Model Viewer (Simplest)**
```bash
npm install @google/model-viewer
```

**Implementation (Model Viewer approach):**

**Files to Create:**
- `src/components/ARTroutAnatomy.tsx`
- `public/models/trout.glb` (3D model)

```typescript
import '@google/model-viewer';

function ARTroutAnatomy() {
  return (
    <model-viewer
      src="/models/trout.glb"
      ar
      ar-modes="webxr scene-viewer quick-look"
      camera-controls
      environment-image="neutral"
      shadow-intensity="1"
      ar-scale="auto"
    >
      <button slot="ar-button">
        👁️ View in AR
      </button>
      
      {/* Hotspots for anatomy labels */}
      <button 
        slot="hotspot-1" 
        data-position="0.1m 0.05m 0m"
        data-normal="0 1 0"
      >
        <div class="annotation">Dorsal Fin</div>
      </button>
      
      <button slot="hotspot-2" data-position="-0.05m 0 0.05m">
        <div class="annotation">Gills</div>
      </button>
    </model-viewer>
  );
}
```

**3D Model Options:**
1. **Commission custom trout model**
   - Sketchfab freelancers: $200-500
   - Turnaround: 2 weeks
   
2. **Use existing models**
   - Sketchfab.com (search "trout")
   - Must check license (CC-BY allows reuse)

3. **Photogrammetry**
   - Use actual specimen from PFBC
   - Create 3D scan with phone (free apps: Polycam, Scaniverse)
   - PA Fish & Boat Commission may have models

**Anatomy labels to include:**
- External: Fins (dorsal, pectoral, pelvic, anal, caudal), lateral line, operculum, adipose fin
- Internal (x-ray view): Heart, swim bladder, stomach, intestines, gills, brain

### 2. AR Watershed Overlay

**Technology:** Google ARCore + Geospatial API

**Implementation:**
```typescript
// Show watershed boundaries overlaid on camera view
<ARWatershedView 
  location={userLocation}
  watershedGeoJSON={paWatersheds}
/>

// Features:
// - Point phone at terrain, see watershed boundaries
// - Tap to see watershed name & data
// - Show stream network in 3D
// - Pollution sources marked
```

**Data sources:**
- USGS HUC (Hydrologic Unit Code) boundaries GeoJSON
- PA DEP stream network data
- Already integrated StreamStats API

**Challenges:**
- Requires GPS + compass + accelerometer
- Works best outdoors
- May need fallback to 2D map for classroom use

---

## 🎙️ Phase 4: Podcast Content

### 🎯 Priority: MEDIUM | Timeline: 4-6 weeks (ongoing)

### Podcast Series: "Trout Talk" 🐟🎧

**Format:** Educational audio series for students, teachers, and citizen scientists

#### **Episode Structure:**
- Length: 15-20 minutes
- Format: Interview + storytelling + practical tips
- Frequency: Bi-weekly (during school year), monthly (summer)

#### **Season 1 Episode Ideas:**

1. **"Meet the Trout Species of Pennsylvania"** (Pilot)
   - Interview with PFBC biologist
   - Brook, brown, rainbow trout profiles
   - Sound effects: stream sounds, fish jumping

2. **"Dr. Sara Mueller on TIC Best Practices"**
   - Penn State Extension expert interview
   - Water quality tips
   - Common teacher mistakes

3. **"From Egg to Stream: A Trout's Journey"**
   - Narrated life cycle story
   - Student voices reading observations
   - Ambient stream sounds

4. **"Macro Hunters: Stream Bug Safari"**
   - Field recording at PA stream
   - Identification tips
   - Sound quiz: "Can you hear the mayfly?"

5. **"Release Day Stories"**
   - Compilation of student experiences
   - Emotional/educational moments
   - PFBC liaison insights

6. **"Wild vs. Stocked: The Conservation Debate"**
   - Trout Unlimited expert
   - Native brook trout restoration
   - Youth perspective

7. **"Climate Change & Cold Water"**
   - Scientist interview
   - Data from real PA streams
   - What students can do

8. **"Careers in Conservation"**
   - PFBC biologist day-in-the-life
   - Penn State aquaculture researcher
   - Stream restoration engineer

**Technical Setup:**

**Equipment (Budget: $500-1000):**
- USB Microphone: Blue Yeti or Audio-Technica AT2020
- Pop filter
- Headphones
- Audacity (free) or Adobe Audition (paid)
- Portable recorder for field interviews (Zoom H1n)

**Hosting:**
```bash
# Options:
1. Anchor.fm (Spotify) - FREE, easiest
2. Buzzsprout - $12/mo, better analytics
3. Self-hosted on Vercel/AWS - FREE, full control
```

**Implementation:**
**Files to Create:**
- `src/components/PodcastPlayer.tsx`
- `src/data/podcastEpisodes.ts`
- `public/podcasts/` folder for MP3s

```typescript
interface Episode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number; // seconds
  releaseDate: string;
  guests: string[];
  transcript?: string; // Accessibility!
  resources: { title: string; url: string }[];
}

function PodcastPlayer({ episode }: { episode: Episode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{episode.title}</CardTitle>
        <CardDescription>{episode.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <audio controls className="w-full">
          <source src={episode.audioUrl} type="audio/mpeg" />
        </audio>
        
        {episode.transcript && (
          <details className="mt-4">
            <summary>View Transcript</summary>
            <div className="prose">{episode.transcript}</div>
          </details>
        )}
        
        <div className="mt-4">
          <h4>Episode Resources:</h4>
          <ul>
            {episode.resources.map(r => (
              <li><a href={r.url}>{r.title}</a></li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Production Workflow:**
1. **Pre-production** (1 week)
   - Book guest
   - Prepare questions
   - Send guest tech check instructions

2. **Recording** (1 hour)
   - Use Zoom/Riverside.fm for remote
   - Record both audio & video backup

3. **Post-production** (2-3 hours)
   - Edit: Remove ums, long pauses
   - Add intro/outro music (royalty-free from Epidemic Sound)
   - Equalize audio levels
   - Export MP3 (128kbps for web)

4. **Publish**
   - Upload to hosting
   - Create transcript (Otter.ai auto-transcription $10/mo)
   - Add to app
   - Share on social media

**Collaborations:**
- PFBC Communications team
- Penn State Extension
- Trout Unlimited chapters
- Student podcasting clubs (youth hosts!)

---

## 📹 Phase 5: Video Content Library

### 🎯 Priority: MEDIUM-HIGH | Timeline: Ongoing

### Video Strategy

#### **Content Categories:**

**1. How-To Videos (Priority 1)**
- Tank setup & cycling (10 min)
- Water testing procedures (5 min each test)
- Feeding techniques by life stage (7 min)
- Chiller maintenance (8 min)
- Release day preparation (15 min)

**2. Expert Interviews**
- Dr. Sara Mueller Q&A series
- PFBC biologist virtual visits
- Trout Unlimited conservationists

**3. Virtual Field Trips**
- PA hatchery tours
- Stream habitat assessments
- Release site explorations
- Behind-the-scenes at PFBC

**4. Student Showcase**
- School TIC program highlights
- Release day compilations
- Science fair projects

**5. Time-Lapse**
- Egg hatching (32-day time-lapse)
- Fry growth (90-day compilation)
- Tank cycling (nitrogen cycle visualization)

#### **Technical Implementation:**

**Files to Create:**
- `src/components/VideoLibrary.tsx`
- `src/data/videos.ts`
- Consider video hosting: Vimeo Pro ($20/mo) or YouTube (free)

```typescript
interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string; // Vimeo/YouTube embed
  duration: number;
  category: 'how-to' | 'interview' | 'field-trip' | 'showcase' | 'timelapse';
  topics: string[]; // Tags for search
  relatedLessons: string[]; // Link to curriculum
  transcript?: string;
  captions?: string; // VTT file URL
  resources: { title: string; url: string }[];
  educatorNotes?: string;
}

function VideoLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      {/* Category filters */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList>
          <TabsTrigger value="all">All Videos</TabsTrigger>
          <TabsTrigger value="how-to">How-To</TabsTrigger>
          <TabsTrigger value="interview">Interviews</TabsTrigger>
          <TabsTrigger value="field-trip">Field Trips</TabsTrigger>
          <TabsTrigger value="showcase">Student Showcase</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search */}
      <Input 
        placeholder="Search videos..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}

function VideoCard({ video }: { video: Video }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <img src={video.thumbnail} alt={video.title} className="w-full" />
      <CardHeader>
        <CardTitle>{video.title}</CardTitle>
        <CardDescription>
          {video.duration}m • {video.category}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700">{video.description}</p>
        <Button onClick={() => openVideoModal(video)} className="mt-4">
          Watch Now
        </Button>
      </CardContent>
    </Card>
  );
}
```

**Video Embedding:**
```typescript
// Use react-player for universal video support
npm install react-player

import ReactPlayer from 'react-player';

<ReactPlayer
  url={video.videoUrl}
  controls
  width="100%"
  height="100%"
  config={{
    youtube: {
      playerVars: { showinfo: 1, modestbranding: 1 }
    },
    vimeo: {
      playerOptions: { title: true, byline: false }
    }
  }}
/>
```

#### **Content Sourcing:**

**Existing Resources to Integrate:**
1. **PFBC YouTube Channel**
   - Embed existing videos
   - Request permission to feature

2. **Penn State Extension**
   - Water quality testing videos
   - Aquaculture best practices

3. **Trout Unlimited**
   - Conservation project videos
   - Restoration case studies

4. **Partner Schools**
   - Collect student release day videos
   - Create compilation reel

**Original Content Production:**

**Equipment Needed:**
- Smartphone with good camera (most recent iPhones/Androids sufficient)
- Tripod ($30)
- Lapel microphone ($40)
- Ring light ($50)
- Free editing software: iMovie, DaVinci Resolve

**Production Tips:**
- 1080p minimum, 4K ideal
- Good audio is MORE important than video quality
- Natural lighting or ring light
- Keep videos short (5-15 min max)
- Add captions (YouTube auto-generates, but edit for accuracy)

---

## 👨‍👩‍👧‍👦 Phase 6: Parent Portal

### 🎯 Priority: HIGH | Timeline: 2-3 weeks

### Portal Features

#### **1. Authentication & Roles**

**Files to Create:**
- `src/contexts/AuthContext.tsx`
- `src/components/auth/Login.tsx`
- `src/components/auth/SignUp.tsx`
- `src/components/ParentPortal.tsx`

**User Roles:**
```typescript
type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  school?: string;
  classroomCode?: string; // Links parents to teacher's classroom
  students?: string[]; // Parent can have multiple students
}
```

**Authentication Options:**

**Option A: Firebase Auth (Easiest)**
```bash
npm install firebase
```
- Free tier: 10k/month
- Email/password + Google sign-in
- Handles password reset
- No backend needed

**Option B: Supabase (More control)**
```bash
npm install @supabase/supabase-js
```
- Free tier: 50k users
- PostgreSQL database included
- Row-level security
- Real-time updates

**Option C: Auth0 (Enterprise)**
- Free tier: 7k users
- Social login (Google, Facebook, etc.)
- Advanced security features

**Recommended: Supabase** (best balance of features & control)

#### **2. Parent Dashboard**

**Components:**
- `src/components/parent/ParentDashboard.tsx`
- `src/components/parent/StudentProgress.tsx`
- `src/components/parent/ClassroomUpdates.tsx`
- `src/components/parent/VolunteerOpportunities.tsx`

```typescript
function ParentDashboard() {
  const { user } = useAuth();
  const students = useStudents(user.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Welcome, {user.name}!</h1>
        <p>Stay connected with your child's Trout in the Classroom journey</p>
      </div>

      {/* Student Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {students.map(student => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>

      {/* Classroom Updates Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Classroom Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdatesFeed classroomId={students[0].classroomId} />
        </CardContent>
      </Card>

      {/* Volunteer Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Ways to Help</CardTitle>
        </CardHeader>
        <CardContent>
          <VolunteerOpportunities classroomId={students[0].classroomId} />
        </CardContent>
      </Card>

      {/* Release Day Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <EventCalendar classroomId={students[0].classroomId} />
        </CardContent>
      </Card>
    </div>
  );
}
```

#### **3. Student Progress Reports**

**Data to Display:**
```typescript
interface StudentProgress {
  lessonsCompleted: number;
  quizzesScores: { lesson: string; score: number }[];
  badgesEarned: Badge[];
  gameHighScores: { game: string; score: number }[];
  macroinvertebratesIdentified: number;
  fieldObservations: number;
  participationDays: number;
  strengths: string[]; // Auto-generated insights
  nextSteps: string[]; // Recommended activities
}

function StudentProgressCard({ student }: { student: Student }) {
  const progress = useStudentProgress(student.id);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{student.name}</CardTitle>
          <Badge>Grade {student.grade}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Overall Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span>Overall Progress</span>
            <span className="font-bold">{progress.completionPercent}%</span>
          </div>
          <Progress value={progress.completionPercent} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            icon="📚" 
            label="Lessons" 
            value={`${progress.lessonsCompleted}/12`} 
          />
          <StatCard 
            icon="🏆" 
            label="Badges" 
            value={progress.badgesEarned.length} 
          />
          <StatCard 
            icon="🐛" 
            label="Macros ID'd" 
            value={progress.macroinvertebratesIdentified} 
          />
          <StatCard 
            icon="📊" 
            label="Observations" 
            value={progress.fieldObservations} 
          />
        </div>

        {/* Recent Badges */}
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Recent Achievements</h4>
          <div className="flex gap-2">
            {progress.badgesEarned.slice(-3).map(badge => (
              <img 
                key={badge.id} 
                src={badge.imageUrl} 
                alt={badge.name}
                className="w-12 h-12"
                title={badge.name}
              />
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <h4 className="font-semibold text-blue-900 mb-1">Next Steps:</h4>
          <ul className="text-sm text-blue-800 list-disc list-inside">
            {progress.nextSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>

        <Button variant="outline" className="w-full mt-4">
          View Detailed Report
        </Button>
      </CardContent>
    </Card>
  );
}
```

#### **4. Teacher Communication**

**Files to Create:**
- `src/components/teacher/UpdatesComposer.tsx`
- `src/components/parent/NotificationSettings.tsx`

```typescript
// Teacher can post updates
interface ClassroomUpdate {
  id: string;
  teacherId: string;
  classroomId: string;
  title: string;
  content: string;
  type: 'announcement' | 'photo' | 'video' | 'reminder';
  media?: { type: 'image' | 'video'; url: string }[];
  timestamp: string;
  likes: number;
  comments: Comment[];
}

// Parents receive notifications
interface NotificationSettings {
  email: boolean;
  emailFrequency: 'instant' | 'daily' | 'weekly';
  pushNotifications: boolean;
  sms: boolean; // Optional, requires Twilio
  notifyOn: {
    classroomUpdates: boolean;
    studentAchievements: boolean;
    upcomingEvents: boolean;
    volunteerRequests: boolean;
  };
}
```

**Email Notifications (Resend.com recommended):**
```bash
npm install resend
```
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendParentNotification(parent: User, update: ClassroomUpdate) {
  await resend.emails.send({
    from: 'trout@wildpraxis.org',
    to: parent.email,
    subject: `New Update: ${update.title}`,
    html: `
      <h2>${update.title}</h2>
      <p>${update.content}</p>
      <a href="https://wildpraxis.org/portal">View in Portal</a>
    `
  });
}
```

#### **5. Volunteer Opportunities**

```typescript
interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'release-day' | 'tank-maintenance' | 'field-trip' | 'presentation' | 'other';
  slotsNeeded: number;
  slotsFilled: number;
  signedUpParents: string[];
}

function VolunteerOpportunities({ classroomId }: { classroomId: string }) {
  const opportunities = useVolunteerOpportunities(classroomId);
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      {opportunities.map(opp => (
        <Card key={opp.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{opp.title}</CardTitle>
                <CardDescription>
                  {new Date(opp.date).toLocaleDateString()} at {opp.time}
                </CardDescription>
              </div>
              <Badge variant={opp.slotsFilled >= opp.slotsNeeded ? 'secondary' : 'default'}>
                {opp.slotsFilled}/{opp.slotsNeeded} filled
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">{opp.description}</p>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{opp.location}</span>
            </div>
            {opp.signedUpParents.includes(user.id) ? (
              <Button variant="outline" className="w-full mt-4" disabled>
                ✓ You're signed up!
              </Button>
            ) : opp.slotsFilled >= opp.slotsNeeded ? (
              <Button variant="outline" className="w-full mt-4" disabled>
                Full
              </Button>
            ) : (
              <Button className="w-full mt-4" onClick={() => signUp(opp.id)}>
                Sign Up to Help
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

#### **6. Photo/Video Sharing**

```typescript
// Teacher uploads photos from class
interface ClassroomGallery {
  photos: {
    url: string;
    caption: string;
    uploadedBy: string;
    timestamp: string;
    tags: string[]; // Student IDs (if permission granted)
  }[];
}

// Parent privacy controls
interface PrivacySettings {
  allowPhotoSharing: boolean; // Can my child's photo be shared?
  allowNameDisplay: boolean; // Display child's name with achievements?
  allowPublicGallery: boolean; // Include in school webpage showcase?
}
```

**Image Storage:**
- Vercel Blob Storage (simple)
- AWS S3 + CloudFront (scalable)
- Cloudinary (image optimization built-in)

---

## 📊 Implementation Timeline

### Week 1-2: Accessibility Foundation
- [ ] Semantic HTML audit
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] High contrast mode

### Week 3-4: Internationalization
- [ ] Set up i18next
- [ ] English JSON extraction
- [ ] Spanish translation (professional vendor)
- [ ] Web Speech API integration
- [ ] Language switcher UI

### Week 5-6: Parent Portal MVP
- [ ] Supabase setup
- [ ] Authentication flows
- [ ] Parent dashboard
- [ ] Student progress reports
- [ ] Volunteer sign-ups

### Week 7-8: Video Library
- [ ] Video data structure
- [ ] Embed existing PFBC/Penn State videos
- [ ] Create 3 original how-to videos
- [ ] Transcript generation

### Week 9-10: Podcast Launch
- [ ] Record pilot episode
- [ ] Set up Anchor.fm
- [ ] Integrate player into app
- [ ] Plan season 1 episodes

### Week 11-12: AR Prototypes
- [ ] Model Viewer implementation
- [ ] Source/commission 3D trout model
- [ ] AR anatomy labels
- [ ] Test on multiple devices

---

## 💰 Budget Estimate

### One-Time Costs:
| Item | Cost |
|------|------|
| Spanish translation (15,000 words @ $0.06/word) | $900 |
| 3D trout model (commissioned) | $400 |
| Podcast equipment | $600 |
| Video production equipment | $120 |
| Professional voice-over (lesson narration) | $500 |
| **Total One-Time** | **$2,520** |

### Monthly Costs:
| Service | Cost |
|---------|------|
| Supabase Pro (for parent portal) | $25 |
| Vimeo Pro (video hosting) | $20 |
| Buzzsprout (podcast hosting) | $12 |
| Google Cloud (Vision API, TTS) | ~$20 |
| Resend (email notifications) | $0-20 |
| **Total Monthly** | **$77-97** |

### Free Tier Alternatives:
- Supabase free (up to 50k users) → $0
- YouTube (video hosting) → $0
- Anchor.fm (podcast) → $0
- Web Speech API (narration) → $0
- **Total Monthly (Free Tier)**: **~$20** (just Google Cloud)

---

## 📈 Success Metrics

### Accessibility:
- [ ] Pass WAVE accessibility checker (0 errors)
- [ ] Lighthouse accessibility score > 95
- [ ] Tested with 3+ screen readers
- [ ] Keyboard navigation 100% functional

### Internationalization:
- [ ] Spanish translation 100% complete
- [ ] Audio narration on 50%+ of content
- [ ] 10%+ of users switch to Spanish

### Parent Portal:
- [ ] 70%+ parent sign-up rate
- [ ] 80%+ check progress monthly
- [ ] 50%+ volunteer sign-up rate for events
- [ ] 90%+ satisfaction rating

### Engagement:
- [ ] Avg. session time increases 30%
- [ ] Video completion rate > 60%
- [ ] Podcast downloads > 500/episode
- [ ] AR feature used by 40%+ of classrooms

---

## 🚀 Next Steps

### Immediate Actions (This Week):
1. ✅ Review this roadmap with team
2. ✅ Prioritize Phase 2 features (vote on top 3)
3. ✅ Set up project management (GitHub Projects or Trello)
4. ✅ Reach out to Spanish translator vendors
5. ✅ Contact PFBC about video content partnership

### Short-Term (Next 2 Weeks):
1. Begin accessibility audit
2. Start i18n setup
3. Design parent portal mockups
4. Record podcast pilot
5. Research 3D model options

### Long-Term (Next 3 Months):
1. Launch parent portal beta (5 pilot classrooms)
2. Release Spanish version
3. Publish first 3 podcast episodes
4. Complete video library (20 videos)
5. AR prototype testing

---

## 📞 Questions & Support

For questions about this roadmap, contact:
- **Technical**: development@wildpraxis.org
- **Educational Content**: Dr. Sara Grisé Mueller (Penn State Extension)
- **PFBC Liaison**: [Your assigned contact]

**Last Updated**: October 16, 2025  
**Document Version**: 1.0

