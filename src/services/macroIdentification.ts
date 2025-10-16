// AI-Powered Macroinvertebrate Identification
// Google Cloud Vision API integration with custom macro dataset

export interface MacroSpecies {
  id: string;
  commonName: string;
  scientificName: string;
  order: string;
  toleranceGroup: 'sensitive' | 'moderate' | 'tolerant';
  toleranceValue: number; // 1-10 scale
  description: string;
  habitat: string;
  identifyingFeatures: string[];
  imageUrl?: string;
  references: {
    source: string;
    url: string;
  }[];
}

export interface MacroIdentificationResult {
  species: MacroSpecies;
  confidence: number; // 0-1
  alternativeMatches?: {
    species: MacroSpecies;
    confidence: number;
  }[];
  identificationMethod: 'ai' | 'manual' | 'hybrid';
  timestamp: string;
}

// Comprehensive PA macroinvertebrate database
export const MACRO_DATABASE: MacroSpecies[] = [
  // SENSITIVE (Pollution-intolerant) - Found in clean water
  {
    id: 'mayfly-ephemeroptera',
    commonName: 'Mayfly Nymph',
    scientificName: 'Ephemeroptera (various species)',
    order: 'Ephemeroptera',
    toleranceGroup: 'sensitive',
    toleranceValue: 9,
    description: 'Delicate aquatic insects with three tail filaments (cerci). Key indicators of excellent water quality.',
    habitat: 'Clean, cold, well-oxygenated streams with rocky substrate',
    identifyingFeatures: [
      'Three long tail filaments (cerci)',
      'Gills along abdomen (7 pairs)',
      'Single claw on each leg',
      'Flattened body',
      'Usually 1/4 to 3/4 inch long'
    ],
    references: [
      { source: 'Macroinvertebrates.org', url: 'https://www.macroinvertebrates.org/taxa/mayfly' },
      { source: 'Penn State Extension', url: 'https://extension.psu.edu/stream-monitoring' }
    ]
  },
  {
    id: 'stonefly-plecoptera',
    commonName: 'Stonefly Nymph',
    scientificName: 'Plecoptera (various species)',
    order: 'Plecoptera',
    toleranceGroup: 'sensitive',
    toleranceValue: 10,
    description: 'Most pollution-sensitive. Requires cold, clean, highly oxygenated water.',
    habitat: 'Cold, fast-flowing streams with high oxygen content',
    identifyingFeatures: [
      'Two tail filaments (cerci)',
      'Two claws on each leg',
      'Gills under thorax or none visible',
      'Flattened body',
      'Antennae clearly visible'
    ],
    references: [
      { source: 'Macroinvertebrates.org', url: 'https://www.macroinvertebrates.org/taxa/stonefly' },
      { source: 'PFBC Stream Assessment', url: 'https://www.fishandboat.com/' }
    ]
  },
  {
    id: 'caddisfly-trichoptera',
    commonName: 'Caddisfly Larva',
    scientificName: 'Trichoptera (various species)',
    order: 'Trichoptera',
    toleranceGroup: 'sensitive',
    toleranceValue: 8,
    description: 'Build protective cases from sand, gravel, or plant material. Indicators of good water quality.',
    habitat: 'Clean streams with varied substrate for case building',
    identifyingFeatures: [
      'Lives in protective case (sand, sticks, or pebbles)',
      'Three pairs of segmented legs',
      'Head and thorax hardened',
      'Hooks at end of abdomen to grip case',
      'Some species free-living without cases'
    ],
    references: [
      { source: 'Macroinvertebrates.org', url: 'https://www.macroinvertebrates.org/taxa/caddisfly' }
    ]
  },
  {
    id: 'riffle-beetle',
    commonName: 'Riffle Beetle',
    scientificName: 'Elmidae family',
    order: 'Coleoptera',
    toleranceGroup: 'sensitive',
    toleranceValue: 8,
    description: 'Small beetles that cling to rocks in fast-flowing water. Adults and larvae both aquatic.',
    habitat: 'Fast riffles with rocky substrate',
    identifyingFeatures: [
      'Hard-shelled beetle appearance',
      'Six legs with claws',
      'Oval or elongated body',
      'Usually less than 1/4 inch',
      'Clings tightly to rocks'
    ],
    references: [
      { source: 'Penn State Extension', url: 'https://extension.psu.edu/' }
    ]
  },
  {
    id: 'water-penny',
    commonName: 'Water Penny',
    scientificName: 'Psephenidae family',
    order: 'Coleoptera',
    toleranceGroup: 'sensitive',
    toleranceValue: 9,
    description: 'Flattened, penny-shaped beetle larvae. Found clinging to rocks in fast water.',
    habitat: 'Fast-flowing, well-oxygenated streams',
    identifyingFeatures: [
      'Round, flat, coin-shaped',
      'Brown color',
      'Legs hidden underneath',
      'About 1/4 inch diameter',
      'Clings to rocks in fast current'
    ],
    references: [
      { source: 'Macroinvertebrates.org', url: 'https://www.macroinvertebrates.org/taxa/water-penny' }
    ]
  },

  // MODERATE (Somewhat pollution-tolerant)
  {
    id: 'damselfly-zygoptera',
    commonName: 'Damselfly Nymph',
    scientificName: 'Zygoptera (various species)',
    order: 'Odonata',
    toleranceGroup: 'moderate',
    toleranceValue: 6,
    description: 'Slender nymphs with three leaf-like gills at tail end. Related to dragonflies.',
    habitat: 'Slower streams, ponds with vegetation',
    identifyingFeatures: [
      'Three leaf-like gills at tail end',
      'Slender body',
      'Large eyes',
      'Six legs',
      'Long antennae'
    ],
    references: [
      { source: 'Macroinvertebrates.org', url: 'https://www.macroinvertebrates.org/taxa/damselfly' }
    ]
  },
  {
    id: 'dragonfly-anisoptera',
    commonName: 'Dragonfly Nymph',
    scientificName: 'Anisoptera (various species)',
    order: 'Odonata',
    toleranceGroup: 'moderate',
    toleranceValue: 5,
    description: 'Robust predators with internal gills. Tolerate moderate pollution.',
    habitat: 'Varied aquatic habitats, including slower streams',
    identifyingFeatures: [
      'Stout, robust body',
      'No external gills',
      'Large eyes',
      'Extendable jaw (labium)',
      'Six spiny legs'
    ],
    references: [
      { source: 'Penn State Extension', url: 'https://extension.psu.edu/' }
    ]
  },
  {
    id: 'aquatic-sowbug',
    commonName: 'Aquatic Sowbug',
    scientificName: 'Asellidae family',
    order: 'Isopoda',
    toleranceGroup: 'moderate',
    toleranceValue: 5,
    description: 'Flattened, segmented crustaceans. Tolerate moderate pollution and low oxygen.',
    habitat: 'Under rocks and debris in streams',
    identifyingFeatures: [
      'Oval, flattened body',
      'Seven pairs of legs',
      'Segmented body',
      'Gray or brown color',
      'About 1/4 to 1/2 inch long'
    ],
    references: [
      { source: 'Macroinvertebrates.org', url: 'https://www.macroinvertebrates.org/taxa/sowbug' }
    ]
  },
  {
    id: 'scud-amphipod',
    commonName: 'Scud (Amphipod)',
    scientificName: 'Gammarus and related genera',
    order: 'Amphipoda',
    toleranceGroup: 'moderate',
    toleranceValue: 6,
    description: 'Shrimp-like crustaceans that swim on their sides. Important food for trout.',
    habitat: 'Streams with vegetation and organic matter',
    identifyingFeatures: [
      'Curved, shrimp-like body',
      'Swims on its side',
      'Many pairs of legs',
      'Two sets of antennae',
      'Usually 1/4 to 1/2 inch'
    ],
    references: [
      { source: 'Macroinvertebrates.org', url: 'https://www.macroinvertebrates.org/taxa/scud' }
    ]
  },
  {
    id: 'crayfish',
    commonName: 'Crayfish',
    scientificName: 'Decapoda (various species)',
    order: 'Decapoda',
    toleranceGroup: 'moderate',
    toleranceValue: 5,
    description: 'Small freshwater crustaceans with claws. Tolerate varied water quality.',
    habitat: 'Under rocks and in burrows',
    identifyingFeatures: [
      'Large claws (chelae)',
      'Eight walking legs',
      'Hard shell',
      'Long antennae',
      'Fan-shaped tail'
    ],
    references: [
      { source: 'PFBC', url: 'https://www.fishandboat.com/' }
    ]
  },

  // TOLERANT (Pollution-tolerant) - Found even in degraded water
  {
    id: 'aquatic-worm',
    commonName: 'Aquatic Worm',
    scientificName: 'Oligochaeta (various species)',
    order: 'Oligochaeta',
    toleranceGroup: 'tolerant',
    toleranceValue: 2,
    description: 'Segmented worms, often red (bloodworms). Thrive in low-oxygen, polluted water.',
    habitat: 'Muddy bottoms, polluted streams, low oxygen areas',
    identifyingFeatures: [
      'Long, thin, segmented body',
      'Often red color (hemoglobin)',
      'No legs',
      'Wriggles actively',
      'Various sizes'
    ],
    references: [
      { source: 'Macroinvertebrates.org', url: 'https://www.macroinvertebrates.org/taxa/aquatic-worm' }
    ]
  },
  {
    id: 'blackfly-simuliidae',
    commonName: 'Blackfly Larva',
    scientificName: 'Simuliidae family',
    order: 'Diptera',
    toleranceGroup: 'tolerant',
    toleranceValue: 4,
    description: 'Small larvae attached to rocks. Tolerate wide range of conditions.',
    habitat: 'Fast-flowing water attached to rocks',
    identifyingFeatures: [
      'Attached to rocks by silk pad',
      'Swollen rear end',
      'Fan-like mouthparts',
      'Black or brown color',
      'About 1/8 inch long'
    ],
    references: [
      { source: 'Penn State Extension', url: 'https://extension.psu.edu/' }
    ]
  },
  {
    id: 'midge-chironomidae',
    commonName: 'Midge Larva',
    scientificName: 'Chironomidae family',
    order: 'Diptera',
    toleranceGroup: 'tolerant',
    toleranceValue: 3,
    description: 'Small, worm-like larvae. Very pollution-tolerant, found in all water types.',
    habitat: 'All aquatic habitats, including highly polluted',
    identifyingFeatures: [
      'Worm-like, segmented',
      'Often red color',
      'Distinct head capsule',
      'Pair of prolegs at each end',
      'Very small (1/8 to 1/2 inch)'
    ],
    references: [
      { source: 'Macroinvertebrates.org', url: 'https://www.macroinvertebrates.org/taxa/midge' }
    ]
  },
  {
    id: 'leech',
    commonName: 'Leech',
    scientificName: 'Hirudinea (various species)',
    order: 'Hirudinea',
    toleranceGroup: 'tolerant',
    toleranceValue: 3,
    description: 'Segmented worms with suckers. Very tolerant of pollution.',
    habitat: 'All aquatic habitats, especially slow water with organic matter',
    identifyingFeatures: [
      'Flattened, segmented body',
      'Sucker at each end',
      'Moves by looping',
      'Various colors',
      'Can extend and contract'
    ],
    references: [
      { source: 'Macroinvertebrates.org', url: 'https://www.macroinvertebrates.org/taxa/leech' }
    ]
  },
  {
    id: 'pouch-snail',
    commonName: 'Pouch Snail',
    scientificName: 'Physidae family',
    order: 'Gastropoda',
    toleranceGroup: 'tolerant',
    toleranceValue: 4,
    description: 'Left-coiled snail shells. Tolerant of poor water quality.',
    habitat: 'Slow water with vegetation',
    identifyingFeatures: [
      'Spiral shell (coiled left)',
      'Soft body visible',
      'Moves slowly',
      'About 1/4 to 1/2 inch',
      'Breathes air at surface'
    ],
    references: [
      { source: 'Penn State Extension', url: 'https://extension.psu.edu/' }
    ]
  }
];

/**
 * AI-powered identification using Google Cloud Vision API
 */
export async function identifyMacroWithAI(
  imageFile: File,
  apiKey: string
): Promise<MacroIdentificationResult | null> {
  try {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);
    
    // Call Google Cloud Vision API
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image.split(',')[1] // Remove data:image/jpeg;base64, prefix
              },
              features: [
                { type: 'LABEL_DETECTION', maxResults: 10 },
                { type: 'WEB_DETECTION', maxResults: 5 },
                { type: 'IMAGE_PROPERTIES' }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Vision API error: ${response.status}`);
    }

    const data = await response.json();
    const annotations = data.responses[0];

    // Match labels to our macro database
    const matches = matchLabelsToMacros(
      annotations.labelAnnotations || [],
      annotations.webDetection?.webEntities || []
    );

    if (matches.length === 0) {
      return null;
    }

    return {
      species: matches[0].species,
      confidence: matches[0].confidence,
      alternativeMatches: matches.slice(1, 4).map(m => ({
        species: m.species,
        confidence: m.confidence
      })),
      identificationMethod: 'ai',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('AI identification error:', error);
    return null;
  }
}

/**
 * Manual identification using key-based system
 */
export function identifyMacroManually(characteristics: {
  tailFilaments?: 2 | 3;
  hasCase?: boolean;
  bodyShape?: 'flattened' | 'cylindrical' | 'round';
  habitat?: 'fast' | 'slow';
  size?: 'small' | 'medium' | 'large';
  color?: string;
}): MacroSpecies[] {
  let candidates = [...MACRO_DATABASE];

  // Filter by characteristics
  if (characteristics.tailFilaments === 3) {
    candidates = candidates.filter(m => 
      m.identifyingFeatures.some(f => f.toLowerCase().includes('three tail'))
    );
  } else if (characteristics.tailFilaments === 2) {
    candidates = candidates.filter(m => 
      m.identifyingFeatures.some(f => f.toLowerCase().includes('two tail'))
    );
  }

  if (characteristics.hasCase !== undefined) {
    if (characteristics.hasCase) {
      candidates = candidates.filter(m => m.id.includes('caddisfly'));
    } else {
      candidates = candidates.filter(m => !m.id.includes('caddisfly'));
    }
  }

  if (characteristics.bodyShape) {
    candidates = candidates.filter(m => 
      m.identifyingFeatures.some(f => 
        f.toLowerCase().includes(characteristics.bodyShape!)
      )
    );
  }

  return candidates;
}

/**
 * Calculate stream health score based on macro diversity
 * Based on Penn State Extension protocols
 */
export function calculateStreamHealthFromMacros(
  observations: { speciesId: string; count: number }[]
): {
  score: number;
  grade: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  bibi: number; // Benthic Index of Biotic Integrity
  ept: number; // EPT (Ephemeroptera, Plecoptera, Trichoptera) richness
  totalTaxa: number;
  dominance: number;
} {
  const species = observations.map(obs => 
    MACRO_DATABASE.find(m => m.id === obs.speciesId)!
  ).filter(Boolean);

  // EPT Richness (# of sensitive taxa)
  const eptTaxa = species.filter(s => 
    s.order === 'Ephemeroptera' || 
    s.order === 'Plecoptera' || 
    s.order === 'Trichoptera'
  ).length;

  // Total taxa richness
  const totalTaxa = species.length;

  // Calculate tolerance-weighted average
  const toleranceScores = observations.map(obs => {
    const sp = MACRO_DATABASE.find(m => m.id === obs.speciesId);
    return sp ? sp.toleranceValue * obs.count : 0;
  });
  const totalCount = observations.reduce((sum, obs) => sum + obs.count, 0);
  const avgTolerance = toleranceScores.reduce((a, b) => a + b, 0) / totalCount;

  // Dominance (Simpson's Index)
  const dominance = observations.reduce((sum, obs) => {
    const proportion = obs.count / totalCount;
    return sum + (proportion * proportion);
  }, 0);

  // Calculate BIBI (0-100 scale)
  let bibi = 0;
  
  // EPT richness metric (0-30 points)
  if (eptTaxa >= 6) bibi += 30;
  else if (eptTaxa >= 4) bibi += 20;
  else if (eptTaxa >= 2) bibi += 10;
  else if (eptTaxa >= 1) bibi += 5;

  // Total taxa richness (0-25 points)
  if (totalTaxa >= 15) bibi += 25;
  else if (totalTaxa >= 10) bibi += 20;
  else if (totalTaxa >= 7) bibi += 15;
  else if (totalTaxa >= 5) bibi += 10;
  else bibi += 5;

  // Tolerance score (0-30 points) - higher tolerance = lower score
  if (avgTolerance >= 8) bibi += 30;
  else if (avgTolerance >= 6) bibi += 20;
  else if (avgTolerance >= 4) bibi += 10;
  else bibi += 5;

  // Dominance metric (0-15 points) - lower dominance = higher score
  if (dominance < 0.3) bibi += 15;
  else if (dominance < 0.5) bibi += 10;
  else if (dominance < 0.7) bibi += 5;

  // Assign grade
  let grade: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  if (bibi >= 75) grade = 'Excellent';
  else if (bibi >= 60) grade = 'Good';
  else if (bibi >= 40) grade = 'Fair';
  else grade = 'Poor';

  return {
    score: bibi,
    grade,
    bibi,
    ept: eptTaxa,
    totalTaxa,
    dominance: Math.round(dominance * 100) / 100
  };
}

/**
 * Helper function to match Google Vision labels to macros
 */
function matchLabelsToMacros(
  labels: any[],
  webEntities: any[]
): { species: MacroSpecies; confidence: number }[] {
  const matches: { species: MacroSpecies; confidence: number }[] = [];

  // Combine labels and web entities
  const allLabels = [
    ...labels.map(l => ({ description: l.description.toLowerCase(), score: l.score })),
    ...webEntities.map(e => ({ description: e.description.toLowerCase(), score: e.score || 0.5 }))
  ];

  // Match against database
  MACRO_DATABASE.forEach(macro => {
    let maxConfidence = 0;

    allLabels.forEach(label => {
      // Check common name
      if (label.description.includes(macro.commonName.toLowerCase())) {
        maxConfidence = Math.max(maxConfidence, label.score);
      }

      // Check order
      if (label.description.includes(macro.order.toLowerCase())) {
        maxConfidence = Math.max(maxConfidence, label.score * 0.8);
      }

      // Check key features
      macro.identifyingFeatures.forEach(feature => {
        const keywords = feature.toLowerCase().split(' ');
        keywords.forEach(keyword => {
          if (keyword.length > 4 && label.description.includes(keyword)) {
            maxConfidence = Math.max(maxConfidence, label.score * 0.6);
          }
        });
      });
    });

    if (maxConfidence > 0.3) {
      matches.push({ species: macro, confidence: maxConfidence });
    }
  });

  // Sort by confidence
  matches.sort((a, b) => b.confidence - a.confidence);

  return matches;
}

/**
 * Convert File to base64
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Get macro by ID
 */
export function getMacroById(id: string): MacroSpecies | undefined {
  return MACRO_DATABASE.find(m => m.id === id);
}

/**
 * Get macros by tolerance group
 */
export function getMacrosByTolerance(group: 'sensitive' | 'moderate' | 'tolerant'): MacroSpecies[] {
  return MACRO_DATABASE.filter(m => m.toleranceGroup === group);
}

/**
 * Search macros by name
 */
export function searchMacros(query: string): MacroSpecies[] {
  const lowerQuery = query.toLowerCase();
  return MACRO_DATABASE.filter(m => 
    m.commonName.toLowerCase().includes(lowerQuery) ||
    m.scientificName.toLowerCase().includes(lowerQuery) ||
    m.order.toLowerCase().includes(lowerQuery)
  );
}

