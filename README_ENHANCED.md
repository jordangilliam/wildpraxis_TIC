# PA Trout in the Classroom - Enhanced Platform

## 🌲 Complete Rebuild - WildPraxis TIC

A world-class educational platform for Pennsylvania's Trout in the Classroom program, built to Carnegie Mellon development standards, integrating complete PATIC curriculum, Wildlife Leadership Academy resources, and comprehensive PA conservation connections.

## 🎯 Features

### ✅ Complete PATIC Curriculum
- **All 12 modules** from PA Trout in the Classroom program
- Interactive lessons with objectives, activities, and assessments
- Aligned with PA academic standards
- Progress tracking and completion badges

### ⭐ Wildlife Leadership Academy Integration
- Direct connection to [WildPraxis platform](https://wla-app.vercel.app/)
- WLA-aligned badge system
- Conservation points and leveling system
- Ambassador training pathways
- Field research opportunities

### 🤖 Brook AI Assistant
- Intelligent conservation helper powered by AI
- Answers questions about:
  - Trout care and biology
  - Water quality and nitrogen cycle
  - Macroinvertebrates and stream health
  - Watersheds and PA water resources
  - Conservation careers
  - PA Fish & Boat Commission resources

### 🔬 Interactive Tools
- **Water Quality Tracker**: Log ammonia, nitrite, nitrate, temperature, pH, DO
- **Habitat Builder**: Design and score ideal trout habitats
- **Macro ID Key**: Identify aquatic insects and assess stream health
- **Watershed Explorer**: Interactive mapping with Mapbox integration
- **Data Visualization**: Charts for nitrogen cycle and water quality trends

### 🌲 PA Resource Connections
- **PA Fish & Boat Commission**: Direct contacts, regional offices, events
- **State Parks & DCNR**: Field trip locations, education programs
- **Public Libraries**: Citizen science kits, research databases, community programs
- **Volunteer Organizations**: Trout Unlimited, watershed groups, conservation corps
- **Opportunities Hub**: Internships, training, volunteer events (auto-synced)

### 🎮 Gamification
- Conservation Points system
- Level progression (1-100+)
- Daily streak tracking
- Achievement badges
- Leaderboard integration with WLA

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animation**: Framer Motion
- **Data Viz**: Recharts
- **Mapping**: Mapbox GL JS
- **Build**: Vite
- **State**: React hooks + localStorage persistence

### Project Structure
```
wildpraxisTIC/
├── src/
│   ├── App_Enhanced.tsx              # Main app component
│   ├── components/
│   │   ├── BrookAI.tsx              # AI assistant
│   │   ├── LessonViewer.tsx         # Curriculum browser
│   │   ├── ResourceHub.tsx          # PA resources
│   │   ├── EnhancedComponents.tsx   # Profile, Progress, Stats
│   │   ├── DashboardComponents.tsx  # Dashboard, tools
│   │   └── ui/                      # Base UI components
│   ├── data/
│   │   └── curriculum.ts            # Complete PATIC content
│   └── index.css                    # Global styles
├── public/
│   ├── data/
│   │   └── opportunities.json       # Auto-synced opportunities
│   └── branding/                    # Logos and assets
├── org docs/                        # Original PATIC PDFs (12)
└── README_ENHANCED.md              # This file
```

## 📚 Curriculum Modules

1. **About and Background** - TIC program history, conservation context
2. **About Trout** - Biology, life cycle, PA species
3. **Aquarium Setup** - Equipment, cycling, salt treatment
4. **Water Quality** - Nitrogen cycle, testing protocols
5. **Daily Care** - Feeding, maintenance, observation
6. **Watersheds** - Water cycle, PA river basins
7. **Habitat Needs** - Temperature, DO, flow, cover
8. **Aquatic Invasive Species** - Clean-Drain-Dry, prevention
9. **Macroinvertebrates** - Stream health indicators
10. **Record Keeping** - Data collection, analysis
11. **Release Day** - Preparation, protocols, celebration
12. **End of Year** - Cleanup, reflection, next steps
13. **Troubleshooting** - Common problems and solutions

## 🚀 Quick Start

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Visit http://localhost:5173

# Optional: Add Mapbox token
# Get free token at https://mapbox.com
# Enter in Map Access card in sidebar
```

## 📊 Data Model

### Student Profile
- Name, school, classroom, grade band, county
- Privacy: All data stored locally (localStorage)
- No cloud login required

### Progress Tracking
- Lessons completed
- Badges earned
- Conservation points
- Current level
- Daily streak

### Scientific Data
- Water quality readings (with nitrogen cycle visualization)
- Habitat designs (scored and saved)
- Macro identifications (with decision paths)
- Trout milestones (eggs, hatch, swim-up, release)
- Field site locations (mapped)

### Opportunities
- Auto-synced from PA organizations
- Filterable by type, location, organization
- Point values for participation tracking

## 🌐 External Integrations

### WildPraxis / Wildlife Leadership Academy
- URL: https://wla-app.vercel.app/
- Integration: Badge alignment, point system, ambassador pathways
- Purpose: Continue conservation journey beyond TIC

### PA Fish & Boat Commission
- Education Division: 717-705-7835
- Regional offices (4 regions)
- TIC program support, egg supply, release permits

### County/City Resources
- State parks (field trips)
- Public libraries (citizen science)
- County parks (stream access)
- Watershed associations (volunteer days)

## 🎨 Design Philosophy

- **Modern & Playful**: Gradient backgrounds, rounded corners, smooth animations
- **Accessible**: WCAG 2.1 Level AA compliant, keyboard navigation
- **Mobile-First**: Responsive design, touch-friendly
- **Offline-Capable**: localStorage persistence, works without internet
- **Performance**: Lazy loading, code splitting, optimized assets

## 🔐 Privacy & Security

- **No user accounts** - Everything stored locally
- **No tracking** - No analytics, cookies, or third-party scripts
- **No server** - Static site, can run from file://
- **Open Source** - MIT licensed, fully transparent

## 🤝 Contributing

This is an open-source educational resource. Contributions welcome!

**Priority areas:**
- Additional lesson content and activities
- More AI assistant knowledge
- Expanded opportunity listings
- Mobile app version
- Spanish translation

## 📄 License

MIT License - Copyright (c) 2025 String Theory Solutions

Built with ❤️ for Pennsylvania's young conservationists

## 🙏 Acknowledgments

- **PA Fish & Boat Commission** - TIC program support and curriculum
- **Wildlife Leadership Academy** - Conservation training and WildPraxis platform
- **Trout Unlimited** - Stream restoration expertise
- **DCNR** - State parks and environmental education
- **All TIC teachers and students** - Making conservation real

---

### For Technical Support
- GitHub Issues: [wildpraxisTIC/issues]
- PFBC Education: ra-pfbceducation@pa.gov
- WildPraxis: https://wla-app.vercel.app/

### For WLA Information
- Visit: https://wla-app.vercel.app/
- Apply: Youth Conservation Ambassador Program
- Ages: Grades 6-12
- Benefits: Field research, badges, college mentorship, career pathways

---

**Start your conservation journey today!** 🐟🌲

