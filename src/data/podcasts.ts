// Podcast Episode Data
// "Trout Talk" educational podcast series

export interface PodcastEpisode {
  id: string;
  season: number;
  episode: number;
  title: string;
  description: string;
  audioUrl: string;
  duration: number; // seconds
  releaseDate: string;
  guests: string[];
  topics: string[];
  transcript?: string;
  resources: { title: string; url: string }[];
  thumbnail?: string;
}

export const PODCAST_EPISODES: PodcastEpisode[] = [
  {
    id: 's1e1-meet-trout',
    season: 1,
    episode: 1,
    title: 'Meet the Trout Species of Pennsylvania',
    description: 'Explore the three trout species found in Pennsylvania: native brook trout, introduced brown trout, and rainbow trout. Learn about their identifying features, habitats, and conservation status with PFBC biologist Mike Depew.',
    audioUrl: '/podcasts/s1e1-meet-trout.mp3',
    duration: 1080, // 18 minutes
    releaseDate: '2024-09-15',
    guests: ['Mike Depew, PFBC Fisheries Biologist'],
    topics: ['brook-trout', 'brown-trout', 'rainbow-trout', 'species-identification'],
    resources: [
      { title: 'PFBC Trout Species Guide', url: 'https://www.fishandboat.com/Fish/PennsylvaniaFishes/Pages/Trout.aspx' },
      { title: 'PA Native Brook Trout', url: 'https://www.fishandboat.com/Fish/PennsylvaniaFishes/Pages/BrookTrout.aspx' }
    ],
    transcript: undefined // Will be added when available
  },
  {
    id: 's1e2-dr-mueller',
    season: 1,
    episode: 2,
    title: 'Dr. Sara Mueller on TIC Best Practices',
    description: 'Penn State Extension aquaculture specialist Dr. Sara Grisé Mueller shares expert advice on water quality, common mistakes to avoid, and tips for a successful TIC program.',
    audioUrl: '/podcasts/s1e2-dr-mueller.mp3',
    duration: 1500, // 25 minutes
    releaseDate: '2024-09-29',
    guests: ['Dr. Sara Grisé Mueller, Penn State Extension'],
    topics: ['water-quality', 'best-practices', 'troubleshooting', 'expert-advice'],
    resources: [
      { title: 'Penn State Extension Aquaculture', url: 'https://extension.psu.edu/aquaculture' },
      { title: 'TIC Water Quality Guide', url: 'https://extension.psu.edu/trout-classroom-water-quality' }
    ]
  },
  {
    id: 's1e3-trout-journey',
    season: 1,
    episode: 3,
    title: 'From Egg to Stream: A Trout\'s Journey',
    description: 'Follow the complete life cycle of a trout through narration, student observations, and ambient stream sounds. Perfect for classroom listening!',
    audioUrl: '/podcasts/s1e3-trout-journey.mp3',
    duration: 900, // 15 minutes
    releaseDate: '2024-10-13',
    guests: ['Mrs. Johnson\'s 4th Grade Class, Center Valley Elementary'],
    topics: ['life-cycle', 'development', 'student-voices'],
    resources: [
      { title: 'Virtual Life Cycle Tour', url: '/app#life-cycle' }
    ]
  },
  {
    id: 's1e4-macro-hunters',
    season: 1,
    episode: 4,
    title: 'Macro Hunters: Stream Bug Safari',
    description: 'Field recording from a Pennsylvania stream. Learn to identify mayflies, stoneflies, and caddisflies by sound and sight. Includes a sound quiz!',
    audioUrl: '/podcasts/s1e4-macro-hunters.mp3',
    duration: 1200, // 20 minutes
    releaseDate: '2024-10-27',
    guests: ['Dave Pensiero, Trout Unlimited'],
    topics: ['macroinvertebrates', 'stream-assessment', 'field-work'],
    resources: [
      { title: 'Macroinvertebrates.org', url: 'https://www.macroinvertebrates.org' },
      { title: 'AI Macro Identifier', url: '/app#ai-macro' }
    ]
  },
  {
    id: 's1e5-release-stories',
    season: 1,
    episode: 5,
    title: 'Release Day Stories',
    description: 'Compilation of heartfelt and educational moments from release days across Pennsylvania. Students, teachers, and PFBC liaisons share their experiences.',
    audioUrl: '/podcasts/s1e5-release-stories.mp3',
    duration: 960, // 16 minutes
    releaseDate: '2024-11-10',
    guests: ['Multiple PA TIC Classrooms'],
    topics: ['release-day', 'student-stories', 'reflections'],
    resources: [
      { title: 'Release Day Preparation Guide', url: '/app#lessons/release-day' }
    ]
  },
  {
    id: 's1e6-conservation-debate',
    season: 1,
    episode: 6,
    title: 'Wild vs. Stocked: The Conservation Debate',
    description: 'Explore the complex issues around wild native brook trout versus stocked trout. Featuring Trout Unlimited\'s conservation director and student perspectives.',
    audioUrl: '/podcasts/s1e6-conservation-debate.mp3',
    duration: 1350, // 22.5 minutes
    releaseDate: '2024-11-24',
    guests: ['Ken Undercoffer, Trout Unlimited PA', 'Summit Hill High School Students'],
    topics: ['conservation', 'native-trout', 'restoration'],
    resources: [
      { title: 'PA Brook Trout Conservation', url: 'https://www.tu.org/pennsylvania/' }
    ]
  },
  {
    id: 's1e7-climate-change',
    season: 1,
    episode: 7,
    title: 'Climate Change & Cold Water',
    description: 'Dr. Emily Stork from Penn State discusses climate impacts on Pennsylvania streams and what students can do to help.',
    audioUrl: '/podcasts/s1e7-climate-change.mp3',
    duration: 1140, // 19 minutes
    releaseDate: '2024-12-08',
    guests: ['Dr. Emily Stork, Penn State Environmental Science'],
    topics: ['climate-change', 'water-temperature', 'conservation-action'],
    resources: [
      { title: 'PA Climate Impacts Assessment', url: 'https://www.dep.pa.gov/climate' },
      { title: 'Stream Temperature Data', url: '/app#datavis' }
    ]
  },
  {
    id: 's1e8-careers',
    season: 1,
    episode: 8,
    title: 'Careers in Conservation',
    description: 'Day-in-the-life stories from a PFBC biologist, Penn State aquaculture researcher, and stream restoration engineer.',
    audioUrl: '/podcasts/s1e8-careers.mp3',
    duration: 1440, // 24 minutes
    releaseDate: '2024-12-22',
    guests: ['Multiple Conservation Professionals'],
    topics: ['careers', 'STEM', 'fisheries-biology', 'environmental-engineering'],
    resources: [
      { title: 'Careers & Opportunities', url: '/app#careers' }
    ]
  }
];

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

