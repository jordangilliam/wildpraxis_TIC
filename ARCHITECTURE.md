# 🏗️ Architecture Overview - PA TIC Enhanced Platform

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PA TIC Enhanced App                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         App_Enhanced.tsx (Main Component)            │  │
│  │  • State Management (AppState)                       │  │
│  │  • Router/Tabs Control                               │  │
│  │  • Gamification Logic                                │  │
│  │  • LocalStorage Persistence                          │  │
│  └───────────┬──────────────────────────────────────────┘  │
│              │                                              │
│              ├──────────┬───────────┬──────────┬────────────┤
│              │          │           │          │            │
│  ┌───────────▼───┐ ┌───▼─────┐ ┌──▼──────┐ ┌─▼──────────┐ │
│  │  LessonViewer│ │ BrookAI  │ │Resource │ │  Dashboard │ │
│  │               │ │          │ │   Hub   │ │ Components │ │
│  │ • Curriculum │ │ • Q&A    │ │ • PFBC  │ │ • Water    │ │
│  │ • Progress   │ │ • Help   │ │ • Parks │ │ • Habitat  │ │
│  │ • Lessons    │ │ • Guide  │ │ • Libs  │ │ • Macros   │ │
│  └──────────────┘ └──────────┘ └─────────┘ └────────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Shared Components & UI                     │  │
│  │  Card │ Button │ Input │ Badge │ Progress │ Tabs    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Uses/Integrates
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Mapbox GL   │  │  WildPraxis  │  │  PA Resources    │  │
│  │  (Maps)      │  │  (WLA)       │  │  (Links)         │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Stores/Reads
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Browser Storage                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              localStorage (All Data)                  │  │
│  │  • Student Profile                                    │  │
│  │  • Progress & Badges                                  │  │
│  │  • Water Quality Readings                             │  │
│  │  • Habitat Designs                                    │  │
│  │  • Macro Identifications                              │  │
│  │  • Field Sites                                        │  │
│  │  • Opportunities Cache                                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### User Interaction Flow:
```
User Action
    ↓
Component Event Handler
    ↓
State Update (setState)
    ↓
React Re-render
    ↓
localStorage Save (useEffect)
    ↓
UI Reflects New State
```

### Example: Adding Water Test
```
1. User fills form in WaterQualityTracker
2. Clicks "Save Reading"
3. addReading() function called
4. Creates reading object with data
5. Updates state.waterQuality array
6. Awards +5 conservation points
7. useEffect saves to localStorage
8. UI shows new reading in list
9. Chart updates with new data point
```

---

## Component Hierarchy

```
App_Enhanced
├── Header
│   ├── Logo & Title
│   └── Stats (Points, Level)
│
├── Sidebar (Left Column)
│   ├── ProfileCard
│   ├── ProgressCard
│   └── QuickStatsCard
│
├── Main Content (Right Column)
│   └── Tabs Component
│       ├── Dashboard
│       │   ├── Welcome Banner
│       │   ├── Quick Actions
│       │   ├── Recent Activity
│       │   └── Nitrogen Chart
│       │
│       ├── Lessons Tab
│       │   └── LessonViewer
│       │       ├── Lesson Library (Grid)
│       │       └── Lesson Detail
│       │           ├── Content Sections
│       │           ├── Objectives
│       │           ├── Activities
│       │           ├── Assessments
│       │           └── Resources
│       │
│       ├── Brook AI Tab
│       │   └── BrookAI
│       │       ├── Message History
│       │       ├── Input Field
│       │       └── Quick Tips
│       │
│       ├── Watershed Tab
│       │   └── WatershedExplorer
│       │       ├── Map Container
│       │       └── Site Add Form
│       │
│       ├── Habitat Tab
│       │   └── HabitatBuilder
│       │       ├── Parameter Controls
│       │       ├── Score Display
│       │       └── Saved Designs List
│       │
│       ├── Macros Tab
│       │   └── MacroKeyGame
│       │       ├── Info Cards
│       │       ├── Photo Upload
│       │       └── ID History
│       │
│       ├── Water Data Tab
│       │   └── WaterQualityTracker
│       │       ├── Current Readings
│       │       ├── Input Form
│       │       └── History List
│       │
│       ├── Resources Tab
│       │   └── ResourceHub
│       │       ├── PFBC Section
│       │       ├── Parks Section
│       │       ├── Libraries Section
│       │       └── Volunteers Section
│       │
│       └── Opportunities Tab
│           └── CareersAndOpportunities
│               ├── Search Bar
│               └── Opportunity Cards
│
└── Footer
    ├── Copyright
    ├── Partner Links
    └── WildPraxis Link
```

---

## State Management

### AppState Interface:
```typescript
interface AppState {
  profile: {
    name: string
    gradeBand: "K-2" | "3-5" | "6-8"
    classroom: string
    school: string
    county: string
  }
  
  progress: {
    lessonsCompleted: string[]
    modulesCompleted: Record<string, boolean>
    badges: string[]
    conservationPoints: number
    level: number
    streakDays: number
  }
  
  waterQuality: WaterQualityReading[]
  habitats: HabitatDesign[]
  macros: MacroRecord[]
  troutMilestones: TroutMilestone[]
  opportunities: Opportunity[]
  
  map: {
    token?: string
    savedSites: SavedSite[]
  }
  
  lastOpptySync?: string
  lastLogin?: string
}
```

### State Updates:
- **Local**: Component useState for UI state
- **Global**: App-level useState for shared data
- **Persistent**: useEffect → localStorage sync
- **Computed**: useMemo for derived values

---

## Data Persistence

### Storage Strategy:
```
localStorage Key: "tic_enhanced_v2"

Read Priority:
1. Try load from localStorage
2. If null/error, use DEFAULT_STATE
3. Save on every state change

Data Lifecycle:
Init → Load → Use → Update → Save → Load → ...
```

### What's Stored:
✅ Student profile & settings
✅ All progress & achievements
✅ Scientific observations
✅ Field sites
✅ Cached opportunities
❌ Sensitive data (none!)
❌ Images (file refs only)

---

## External Integrations

### Mapbox GL JS:
```
Purpose: Interactive watershed maps
Usage: Optional (requires API token)
Data Flow: 
  - Token from user input
  - Saved in state.map.token
  - Passed to Mapbox on init
  - Markers from state.map.savedSites
```

### WildPraxis (WLA):
```
Type: External link integration
Connection: Hyperlinks throughout app
Data Sharing: None (separate platforms)
Alignment: 
  - Badge system compatible
  - Point values similar
  - Career pathways connected
```

### PA Resources:
```
Type: Contact information & links
Storage: Static data in curriculum.ts
Updates: Manual (or future API integration)
Categories:
  - PFBC (phones, emails, websites)
  - Parks (locations, programs)
  - Libraries (programs, contacts)
  - Orgs (TU, WLA, conservancies)
```

### Opportunities Feed:
```
Source: public/data/opportunities.json
Update: GitHub Actions weekly sync
Format: JSON array of Opportunity objects
Display: CareersAndOpportunities component
Interaction: Filter, view, mark participated
```

---

## File Organization

### Core Files:
```
src/
  App_Enhanced.tsx          - Main app (700+ lines)
  main.tsx                  - Entry point
  index.css                 - Global styles

  components/
    BrookAI.tsx            - AI assistant (300+ lines)
    LessonViewer.tsx       - Curriculum browser (600+ lines)
    ResourceHub.tsx        - PA connections (400+ lines)
    EnhancedComponents.tsx - Profile, progress (400+ lines)
    DashboardComponents.tsx- Tools & views (500+ lines)
    
    [ui components]        - Reusable primitives
    card.tsx
    button.tsx
    input.tsx
    badge.tsx
    progress.tsx
    tabs.tsx
    ... etc

  data/
    curriculum.ts          - PATIC content (1000+ lines)
```

### Data Files:
```
public/
  data/
    opportunities.json     - Synced opportunities
  
  branding/
    wildpraxis_transparent.png
    string_theory_transparent.png
```

### Documentation:
```
README_ENHANCED.md      - Complete documentation
QUICK_START.md          - 5-minute guide
DEPLOYMENT.md           - Hosting instructions
ARCHITECTURE.md         - This file
PROJECT_SUMMARY.md      - Accomplishments overview
```

---

## Build & Deploy Pipeline

### Development:
```
npm run dev
  ↓
Vite Dev Server (port 5173)
  ↓
Hot Module Replacement
  ↓
Instant updates in browser
```

### Production Build:
```
npm run build
  ↓
TypeScript Compile
  ↓
Vite Bundle & Optimize
  ↓
Output to dist/
  ↓
Static files ready to deploy
```

### GitHub Actions (Auto-deploy):
```
Push to main branch
  ↓
.github/workflows/deploy.yml triggers
  ↓
Checkout code
  ↓
npm ci (clean install)
  ↓
npm run build
  ↓
Upload dist/ to GitHub Pages
  ↓
Site live at username.github.io/repo
```

### Weekly Opportunities Sync:
```
Monday 12:00 UTC (cron)
  ↓
.github/workflows/sync-opportunities.yml
  ↓
Fetch from external APIs
  ↓
Update public/data/opportunities.json
  ↓
Commit & push
  ↓
Triggers deploy workflow
  ↓
Updated site deployed
```

---

## Technology Stack

### Frontend Framework:
- **React 18**: Component library
- **TypeScript**: Type safety
- **Vite**: Build tool & dev server

### Styling:
- **Tailwind CSS**: Utility-first CSS
- **Framer Motion**: Animations
- **Custom Design System**: Colors, spacing, components

### Data & Charts:
- **Recharts**: Data visualization
- **Mapbox GL JS**: Interactive maps
- **localStorage**: Persistence

### Development:
- **TypeScript**: Static typing
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Git**: Version control
- **GitHub Actions**: CI/CD

---

## Performance Optimizations

### Code Splitting:
```typescript
// Lazy load heavy libraries
const recharts = await import("recharts")
const mapboxgl = await import("mapbox-gl")
```

### Memoization:
```typescript
const chartData = useMemo(() => buildChart(state), [state])
```

### Event Batching:
```typescript
useEffect(() => {
  // Save after state updates, not during
  saveState(state)
}, [state])
```

### Asset Optimization:
- SVG icons (Lucide React)
- WebP images where supported
- Minified bundles
- Gzip compression

---

## Security & Privacy

### Data Security:
✅ All data local (localStorage)
✅ No server communication
✅ No user authentication
✅ No cookies
✅ No tracking scripts

### Content Security:
✅ TypeScript prevents many bugs
✅ Input validation
✅ XSS protection (React escapes)
✅ No eval() or dangerous patterns

### Third-Party:
⚠️ Mapbox (optional, user provides token)
⚠️ External links (to PA resources)
✅ No analytics
✅ No ads

---

## Accessibility

### WCAG 2.1 AA Compliance:
- ✅ Keyboard navigation (Tab, Enter, Arrow keys)
- ✅ ARIA labels on interactive elements
- ✅ Color contrast ratios (4.5:1 minimum)
- ✅ Focus indicators visible
- ✅ Semantic HTML structure
- ✅ Alt text on images
- ✅ Responsive text sizing

### Testing:
- Chrome Lighthouse: Accessibility score
- axe DevTools: Automated checking
- Manual keyboard testing
- Screen reader testing (NVDA, JAWS)

---

## Browser Compatibility

### Supported:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

### Required Features:
- ES2020 JavaScript
- CSS Grid & Flexbox
- localStorage API
- Fetch API
- Async/Await

### Progressive Enhancement:
- Core features work without JS (limited)
- Mapbox gracefully degrades
- Charts show data tables as fallback

---

## Extensibility

### Easy to Add:
1. **New Lessons**: Add to `curriculum.ts`
2. **New Badges**: Add to `WLA_ALIGNED_BADGES`
3. **New Resources**: Add to `PA_RESOURCES`
4. **New Opportunities**: Update `opportunities.json`
5. **New Components**: Follow existing patterns

### Customization Points:
- Colors in `tailwind.config.js`
- Logos in `public/branding/`
- Default state in `DEFAULT_STATE`
- Badge thresholds in gamification logic

---

## Future Architecture Considerations

### Potential Enhancements:
1. **Backend API**: User accounts, cloud sync
2. **Database**: PostgreSQL for multi-user
3. **Real-time**: WebSockets for collaboration
4. **Mobile Native**: React Native version
5. **Offline-First**: Service worker, IndexedDB
6. **Internationalization**: i18n framework
7. **Analytics**: Privacy-friendly (Plausible)
8. **Testing**: Jest, React Testing Library

---

**This architecture provides a solid foundation for a world-class educational platform!** 🏗️🚀

