// Video Content Library Data
// Curated educational videos for TIC programs

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string; // YouTube or Vimeo URL
  duration: number; // minutes
  category: 'how-to' | 'interview' | 'field-trip' | 'showcase' | 'timelapse';
  topics: string[];
  relatedLessons: string[];
  educator: string;
  source: string;
  transcript?: string;
}

export const VIDEO_LIBRARY: Video[] = [
  // PFBC Videos
  {
    id: 'pfbc-intro',
    title: 'Introduction to Trout in the Classroom',
    description: 'Overview of the PFBC Trout in the Classroom program, goals, and getting started.',
    thumbnail: '/images/videos/pfbc-intro-thumb.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=PLACEHOLDER',
    duration: 8,
    category: 'how-to',
    topics: ['program-overview', 'getting-started'],
    relatedLessons: ['about-tic'],
    educator: 'PA Fish & Boat Commission',
    source: 'PFBC YouTube'
  },
  {
    id: 'water-testing',
    title: 'How to Test Water Quality',
    description: 'Step-by-step guide to testing temperature, pH, ammonia, nitrite, and nitrate in your TIC aquarium.',
    thumbnail: '/images/videos/water-testing-thumb.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=PLACEHOLDER',
    duration: 12,
    category: 'how-to',
    topics: ['water-quality', 'testing', 'maintenance'],
    relatedLessons: ['water-quality'],
    educator: 'Penn State Extension',
    source: 'Penn State Extension'
  },
  {
    id: 'tank-setup',
    title: 'Complete Tank Setup & Cycling',
    description: 'Learn how to set up your aquarium, install equipment, and cycle the tank before adding trout eggs.',
    thumbnail: '/images/videos/tank-setup-thumb.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=PLACEHOLDER',
    duration: 15,
    category: 'how-to',
    topics: ['setup', 'cycling', 'equipment'],
    relatedLessons: ['aquarium-setup'],
    educator: 'Dr. Sara Mueller',
    source: 'Penn State Extension'
  },
  {
    id: 'feeding-guide',
    title: 'Feeding Trout at Different Life Stages',
    description: 'Proper feeding techniques from swim-up fry through release-size parr.',
    thumbnail: '/images/videos/feeding-thumb.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=PLACEHOLDER',
    duration: 10,
    category: 'how-to',
    topics: ['feeding', 'care', 'life-cycle'],
    relatedLessons: ['trout-care'],
    educator: 'PFBC Biologist',
    source: 'PFBC'
  },
  
  // Expert Interviews
  {
    id: 'mueller-interview',
    title: 'Q&A with Dr. Sara Mueller',
    description: 'Penn State Extension aquaculture specialist answers common TIC questions.',
    thumbnail: '/images/videos/mueller-thumb.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=PLACEHOLDER',
    duration: 25,
    category: 'interview',
    topics: ['expert-advice', 'best-practices', 'troubleshooting'],
    relatedLessons: [],
    educator: 'Dr. Sara Grisé Mueller',
    source: 'WildPraxis'
  },
  {
    id: 'tu-conservation',
    title: 'Coldwater Conservation with Trout Unlimited',
    description: 'Learn about native brook trout restoration and stream habitat projects in Pennsylvania.',
    thumbnail: '/images/videos/tu-conservation-thumb.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=PLACEHOLDER',
    duration: 18,
    category: 'interview',
    topics: ['conservation', 'brook-trout', 'habitat'],
    relatedLessons: ['watersheds', 'aquatic-invasive-species'],
    educator: 'Trout Unlimited PA',
    source: 'Trout Unlimited'
  },

  // Virtual Field Trips
  {
    id: 'benner-hatchery',
    title: 'Virtual Tour: Benner Spring Fish Hatchery',
    description: 'Explore one of Pennsylvania\'s premier trout hatcheries and see how fish are raised.',
    thumbnail: '/images/videos/hatchery-tour-thumb.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=PLACEHOLDER',
    duration: 20,
    category: 'field-trip',
    topics: ['hatchery', 'aquaculture', 'pfbc'],
    relatedLessons: ['about-tic', 'trout-biology'],
    educator: 'PFBC',
    source: 'PFBC'
  },
  {
    id: 'stream-assessment',
    title: 'Stream Habitat Assessment in a PA Watershed',
    description: 'Follow biologists as they assess stream health using macroinvertebrates and water quality tests.',
    thumbnail: '/images/videos/stream-assessment-thumb.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=PLACEHOLDER',
    duration: 22,
    category: 'field-trip',
    topics: ['stream-assessment', 'macroinvertebrates', 'water-quality'],
    relatedLessons: ['watersheds', 'water-quality'],
    educator: 'PA DEP',
    source: 'PA DEP'
  },

  // Student Showcases
  {
    id: 'release-compilation',
    title: '2024 PA Release Day Highlights',
    description: 'Compilation of release day celebrations from TIC classrooms across Pennsylvania.',
    thumbnail: '/images/videos/release-2024-thumb.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=PLACEHOLDER',
    duration: 12,
    category: 'showcase',
    topics: ['release-day', 'student-projects'],
    relatedLessons: ['release-day'],
    educator: 'Various PA Schools',
    source: 'WildPraxis'
  },

  // Time-Lapse
  {
    id: 'egg-hatching-timelapse',
    title: 'Trout Egg Hatching Time-Lapse',
    description: '32 days of egg development compressed into 3 minutes. Watch embryos develop and hatch!',
    thumbnail: '/images/videos/hatching-timelapse-thumb.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=PLACEHOLDER',
    duration: 3,
    category: 'timelapse',
    topics: ['life-cycle', 'eggs', 'development'],
    relatedLessons: ['trout-biology'],
    educator: 'WildPraxis',
    source: 'WildPraxis'
  },
  {
    id: 'fry-growth-timelapse',
    title: 'Fry to Parr: 90-Day Growth Time-Lapse',
    description: 'Three months of trout growth from swim-up fry to release-ready parr.',
    thumbnail: '/images/videos/growth-timelapse-thumb.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=PLACEHOLDER',
    duration: 4,
    category: 'timelapse',
    topics: ['life-cycle', 'growth', 'development'],
    relatedLessons: ['trout-biology', 'trout-care'],
    educator: 'WildPraxis',
    source: 'WildPraxis'
  }
];

export const VIDEO_CATEGORIES = [
  { id: 'all', name: 'All Videos', icon: '🎬' },
  { id: 'how-to', name: 'How-To Guides', icon: '🛠️' },
  { id: 'interview', name: 'Expert Interviews', icon: '🎤' },
  { id: 'field-trip', name: 'Virtual Field Trips', icon: '🚌' },
  { id: 'showcase', name: 'Student Showcase', icon: '🌟' },
  { id: 'timelapse', name: 'Time-Lapse', icon: '⏱️' },
];

