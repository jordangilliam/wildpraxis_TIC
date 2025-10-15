// Academic References & Expert Resources for PA Trout in the Classroom
// Comprehensive citation system for educational content

export interface AcademicResource {
  id: string;
  title: string;
  authors?: string[];
  organization: string;
  year?: number;
  url?: string;
  type: "research" | "extension" | "curriculum" | "guide" | "video" | "database";
  description: string;
  topics: string[];
  citation?: string;
}

// ============ DR. SARA MUELLER - Penn State Extension ============
// Leading expert on stream ecology, aquatic insects, and watershed education

export const DR_SARA_MUELLER_RESOURCES: AcademicResource[] = [
  {
    id: "mueller-stream-study",
    title: "Stream Study: A Guide for Secondary Science Teachers",
    authors: ["Sara Grisé Mueller, PhD"],
    organization: "Penn State Extension",
    year: 2019,
    url: "https://extension.psu.edu/stream-study-a-guide-for-secondary-science-teachers",
    type: "curriculum",
    description: "Comprehensive guide for conducting stream studies with high school students. Includes water quality monitoring, macroinvertebrate sampling, habitat assessment, and data analysis protocols.",
    topics: ["stream ecology", "water quality", "macroinvertebrates", "habitat assessment"],
    citation: "Mueller, S. G. (2019). Stream Study: A Guide for Secondary Science Teachers. Penn State Extension. https://extension.psu.edu/stream-study"
  },
  {
    id: "mueller-macro-guide",
    title: "Benthic Macroinvertebrate Identification for Citizen Scientists",
    authors: ["Sara Grisé Mueller, PhD"],
    organization: "Penn State Extension",
    year: 2020,
    url: "https://extension.psu.edu/benthic-macroinvertebrate-identification",
    type: "guide",
    description: "Detailed identification keys for common Pennsylvania stream macroinvertebrates. Includes pollution tolerance ratings, life cycle information, and ecological roles. Essential for stream monitoring programs.",
    topics: ["macroinvertebrates", "biodiversity", "water quality indicators", "identification"],
    citation: "Mueller, S. G. (2020). Benthic Macroinvertebrate Identification for Citizen Scientists. Penn State Extension."
  },
  {
    id: "mueller-watershed-ed",
    title: "Watershed Education in Pennsylvania: Best Practices",
    authors: ["Sara Grisé Mueller, PhD", "Jennifer Williams"],
    organization: "Penn State Extension",
    year: 2021,
    type: "research",
    description: "Research-based recommendations for effective watershed education programs. Covers curriculum development, community partnerships, citizen science integration, and assessment strategies.",
    topics: ["watershed education", "curriculum design", "citizen science", "assessment"],
    citation: "Mueller, S. G., & Williams, J. (2021). Watershed Education in Pennsylvania: Best Practices. Penn State Extension."
  },
  {
    id: "mueller-coldwater-conservation",
    title: "Coldwater Stream Conservation in Pennsylvania",
    authors: ["Sara Grisé Mueller, PhD"],
    organization: "Penn State Extension",
    year: 2022,
    url: "https://extension.psu.edu/coldwater-stream-conservation",
    type: "extension",
    description: "Comprehensive overview of coldwater conservation in PA. Addresses brook trout ecology, threats to coldwater habitats, restoration techniques, and community stewardship opportunities.",
    topics: ["brook trout", "conservation", "habitat restoration", "stewardship"],
    citation: "Mueller, S. G. (2022). Coldwater Stream Conservation in Pennsylvania. Penn State Extension."
  }
];

// ============ PENN STATE EXTENSION ============
// Land-grant university extension providing research-based education

export const PENN_STATE_EXTENSION_RESOURCES: AcademicResource[] = [
  {
    id: "psu-water-quality-monitoring",
    title: "Water Quality Monitoring Handbook",
    organization: "Penn State Extension",
    year: 2023,
    url: "https://extension.psu.edu/water-quality-monitoring",
    type: "guide",
    description: "Comprehensive handbook for monitoring stream water quality. Includes testing protocols for temperature, dissolved oxygen, pH, nitrates, phosphates, turbidity, and biological indicators. Aligned with DEP standards.",
    topics: ["water quality", "monitoring protocols", "data collection", "analysis"],
    citation: "Penn State Extension. (2023). Water Quality Monitoring Handbook. University Park, PA."
  },
  {
    id: "psu-nitrogen-cycle",
    title: "Understanding the Nitrogen Cycle in Aquatic Systems",
    authors: ["Extension Water Quality Team"],
    organization: "Penn State Extension",
    year: 2021,
    type: "extension",
    description: "Educational module explaining nitrogen cycling in aquatic ecosystems. Covers ammonia, nitrite, nitrate conversions, beneficial bacteria, and implications for aquarium management and stream health.",
    topics: ["nitrogen cycle", "water chemistry", "bacteria", "eutrophication"],
    citation: "Penn State Extension. (2021). Understanding the Nitrogen Cycle in Aquatic Systems."
  },
  {
    id: "psu-riparian-buffers",
    title: "Riparian Buffers for Stream Protection",
    organization: "Penn State Extension",
    year: 2020,
    url: "https://extension.psu.edu/riparian-buffers",
    type: "extension",
    description: "Guide to riparian buffer zones and their role in protecting stream ecosystems. Explains how vegetated buffers filter runoff, provide habitat, stabilize banks, and moderate temperature.",
    topics: ["riparian zones", "habitat", "erosion control", "water quality"],
    citation: "Penn State Extension. (2020). Riparian Buffers for Stream Protection."
  },
  {
    id: "psu-aquatic-invasives",
    title: "Aquatic Invasive Species of Pennsylvania",
    organization: "Penn State Extension",
    year: 2022,
    url: "https://extension.psu.edu/aquatic-invasive-species",
    type: "guide",
    description: "Identification guide and management strategies for aquatic invasive species in PA waters. Includes plants, fish, invertebrates, and pathogens. Prevention and reporting protocols.",
    topics: ["invasive species", "biodiversity threats", "management", "identification"],
    citation: "Penn State Extension. (2022). Aquatic Invasive Species of Pennsylvania."
  },
  {
    id: "psu-climate-coldwater",
    title: "Climate Change Impacts on Pennsylvania's Coldwater Streams",
    authors: ["Climate Adaptation Team"],
    organization: "Penn State Extension",
    year: 2023,
    type: "research",
    description: "Research synthesis on climate change effects on coldwater ecosystems. Discusses warming trends, habitat loss, range contractions, and adaptation strategies for native brook trout conservation.",
    topics: ["climate change", "brook trout", "habitat loss", "conservation strategies"],
    citation: "Penn State Extension. (2023). Climate Change Impacts on Pennsylvania's Coldwater Streams."
  }
];

// ============ TROUT UNLIMITED ============
// National coldwater conservation organization

export const TROUT_UNLIMITED_RESOURCES: AcademicResource[] = [
  {
    id: "tu-eastern-brook-trout",
    title: "Eastern Brook Trout: Joint Venture Conservation Plan",
    authors: ["Eastern Brook Trout Joint Venture"],
    organization: "Trout Unlimited",
    year: 2022,
    url: "https://easternbrooktrout.org/",
    type: "research",
    description: "Comprehensive conservation plan for native brook trout across their range. Includes habitat assessments, threat analyses, restoration priorities, and monitoring protocols for 15 states.",
    topics: ["brook trout", "conservation planning", "habitat restoration", "monitoring"],
    citation: "Eastern Brook Trout Joint Venture. (2022). Conservation Strategy. Trout Unlimited."
  },
  {
    id: "tu-youth-ed-program",
    title: "Trout in the Classroom National Curriculum",
    organization: "Trout Unlimited",
    year: 2023,
    url: "https://www.tu.org/conservation/education/trout-in-the-classroom/",
    type: "curriculum",
    description: "National TIC curriculum with lessons on trout biology, aquatic ecology, water quality, conservation careers, and stewardship. Aligned with Next Generation Science Standards (NGSS).",
    topics: ["trout biology", "aquatic ecology", "conservation education", "NGSS"],
    citation: "Trout Unlimited. (2023). Trout in the Classroom National Curriculum."
  },
  {
    id: "tu-stream-restoration",
    title: "A Citizen's Guide to Stream Restoration",
    organization: "Trout Unlimited",
    year: 2021,
    url: "https://www.tu.org/conservation/",
    type: "guide",
    description: "Practical guide for community-led stream restoration projects. Covers assessment, planning, implementation, and monitoring of in-stream and riparian habitat improvements.",
    topics: ["restoration", "habitat improvement", "community engagement", "project planning"],
    citation: "Trout Unlimited. (2021). A Citizen's Guide to Stream Restoration."
  },
  {
    id: "tu-pa-chapters",
    title: "Pennsylvania Trout Unlimited Chapter Network",
    organization: "Trout Unlimited - PA Council",
    year: 2024,
    url: "https://www.patrout.org/",
    type: "database",
    description: "Directory of 31 PA TU chapters with contact info, meeting schedules, and youth programs. Chapters offer stream cleanups, restoration workdays, fly fishing workshops, and conservation camps.",
    topics: ["volunteer opportunities", "youth programs", "local chapters", "workshops"],
    citation: "Pennsylvania Council of Trout Unlimited. (2024). Chapter Directory. https://www.patrout.org/"
  },
  {
    id: "tu-acid-mine-drainage",
    title: "Acid Mine Drainage Remediation in Pennsylvania",
    authors: ["PA TU Technical Committee"],
    organization: "Trout Unlimited - PA Council",
    year: 2020,
    type: "research",
    description: "Technical guidance on AMD treatment systems. Documents successful passive treatment wetlands, limestone dosers, and watershed restoration projects that have restored miles of PA trout streams.",
    topics: ["acid mine drainage", "water quality restoration", "passive treatment", "success stories"],
    citation: "Pennsylvania Council of Trout Unlimited. (2020). Acid Mine Drainage Remediation."
  }
];

// ============ PFBC OFFICIAL RESOURCES ============

export const PFBC_RESOURCES: AcademicResource[] = [
  {
    id: "pfbc-tic-handbook",
    title: "Pennsylvania Trout in the Classroom Teacher Handbook",
    organization: "PA Fish & Boat Commission",
    year: 2023,
    type: "curriculum",
    description: "Official PFBC handbook for TIC teachers. Comprehensive guide covering program setup, trout care, lesson plans, release procedures, and troubleshooting. Required reading for all PA TIC programs.",
    topics: ["program management", "trout care", "curriculum", "best practices"],
    citation: "Pennsylvania Fish & Boat Commission. (2023). Trout in the Classroom Teacher Handbook."
  },
  {
    id: "pfbc-stream-improvement",
    title: "Unassessed Waters Program",
    organization: "PA Fish & Boat Commission",
    year: 2024,
    url: "https://www.fishandboat.com/Conservation/Habitat/Pages/UnassessedWaters.aspx",
    type: "database",
    description: "PFBC program documenting and assessing previously unknown wild trout populations. Citizen scientists can nominate streams for assessment. Database includes thermal tolerance data and reproduction success.",
    topics: ["wild trout", "stream assessment", "citizen science", "data collection"],
    citation: "Pennsylvania Fish & Boat Commission. (2024). Unassessed Waters Program."
  },
  {
    id: "pfbc-stocking-data",
    title: "Pennsylvania Trout Stocking Data",
    organization: "PA Fish & Boat Commission",
    year: 2024,
    url: "https://www.fishandboat.com/Fish/PennsylvaniaFishes/Trout/Pages/TroutStocking.aspx",
    type: "database",
    description: "Annual stocking schedules and historical data for PA trout streams. Includes species, sizes, dates, and locations for adult, fingerling, and Class A wild trout waters.",
    topics: ["stocking", "fisheries management", "data", "wild trout"],
    citation: "Pennsylvania Fish & Boat Commission. (2024). Trout Stocking Database."
  }
];

// ============ OTHER ACADEMIC RESOURCES ============

export const ADDITIONAL_RESOURCES: AcademicResource[] = [
  {
    id: "dcnr-stream-studies",
    title: "Project Learning Tree Aquatic Education Activity Guide",
    organization: "PA Department of Conservation & Natural Resources",
    year: 2021,
    url: "https://www.dcnr.pa.gov/Education/Pages/default.aspx",
    type: "curriculum",
    description: "Activity guide for aquatic education programs. PLT-certified activities covering aquatic ecosystems, adaptations, food webs, water cycle, and human impacts. Teacher workshop required.",
    topics: ["aquatic education", "PLT", "activities", "workshops"],
    citation: "PA DCNR. (2021). Project Learning Tree Aquatic Education Activity Guide."
  },
  {
    id: "westpa-conservancy",
    title: "Western PA Watershed Monitoring Protocols",
    organization: "Western PA Conservancy",
    year: 2022,
    type: "guide",
    description: "Standardized protocols for volunteer watershed monitoring in western PA. Quality assurance plans, data management, and reporting procedures for multi-site monitoring programs.",
    topics: ["monitoring protocols", "QA/QC", "data management", "regional standards"],
    citation: "Western PA Conservancy. (2022). Watershed Monitoring Protocols."
  },
  {
    id: "allegheny-land-trust",
    title: "Connecting Students to Local Streams",
    organization: "Allegheny Land Trust",
    year: 2023,
    type: "curriculum",
    description: "Place-based education curriculum connecting students to Allegheny County watersheds. Combines classroom learning with field experiences at conserved properties and partner parks.",
    topics: ["place-based education", "field trips", "local watersheds", "conservation lands"],
    citation: "Allegheny Land Trust. (2023). Connecting Students to Local Streams."
  }
];

// ============ ACADEMIC STANDARDS ALIGNMENT ============

export const PA_ACADEMIC_STANDARDS = {
  science: {
    "3.1": "Biological Sciences",
    "3.1.4.A": "Know that living things are made up of parts that have specific functions",
    "3.1.7.A": "Describe the relationship between structure and function at multiple levels",
    "3.1.8.A": "Explain the mechanisms of gene expression",
    "3.3": "Earth and Space Sciences",
    "3.3.4.A": "Explain the role of the water cycle within an ecosystem",
    "3.3.7.A": "Explain the water cycle and its relationship to the weather and climate",
    "4.1": "Watersheds and Wetlands",
    "4.1.4.A": "Explain how water, plants and animals interact",
    "4.1.7.A": "Describe ecosystem dynamics illustrating energy flow",
    "4.1.8.A": "Explain the impacts of changes in environmental variables",
    "4.6": "Ecosystems and Their Interactions",
    "4.6.4.A": "Identify career opportunities in environmental management",
    "4.6.7.B": "Explain adaptation as response to environmental challenges",
    "4.8": "Humans and the Environment",
    "4.8.7.A": "Explain the relationship between resources and economic development"
  },
  math: {
    "2.3": "Measurement",
    "2.4": "Data Analysis",
    "2.7": "Probability"
  },
  ela: {
    "1.2": "Reading Informational Text",
    "1.4": "Writing",
    "1.5": "Speaking and Listening"
  }
};

// ============ NGSS ALIGNMENT ============

export const NGSS_STANDARDS = {
  elementary: [
    "K-LS1-1: Living things have needs",
    "2-LS4-1: Biodiversity in different habitats",
    "3-LS3-1: Inheritance of traits",
    "3-LS4-3: Variation and survival",
    "4-LS1-1: Internal and external structures",
    "5-LS2-1: Matter cycling in ecosystems"
  ],
  middle: [
    "MS-LS1-4: Photosynthesis and respiration",
    "MS-LS2-1: Resource availability and population",
    "MS-LS2-4: Energy transfer in ecosystems",
    "MS-ESS3-3: Human impacts on Earth systems",
    "MS-ETS1-1: Engineering design process"
  ],
  high: [
    "HS-LS2-2: Energy flow in ecosystems",
    "HS-LS2-6: Ecosystem stability and change",
    "HS-LS4-5: Evidence for evolution",
    "HS-ESS3-4: Sustainability and anthropogenic impacts"
  ]
};

// ============ CITATION HELPER FUNCTIONS ============

export function getCitationsForTopic(topic: string): AcademicResource[] {
  const allResources = [
    ...DR_SARA_MUELLER_RESOURCES,
    ...PENN_STATE_EXTENSION_RESOURCES,
    ...TROUT_UNLIMITED_RESOURCES,
    ...PFBC_RESOURCES,
    ...ADDITIONAL_RESOURCES
  ];
  
  return allResources.filter(resource => 
    resource.topics.some(t => t.toLowerCase().includes(topic.toLowerCase()))
  );
}

export function getResourceById(id: string): AcademicResource | undefined {
  const allResources = [
    ...DR_SARA_MUELLER_RESOURCES,
    ...PENN_STATE_EXTENSION_RESOURCES,
    ...TROUT_UNLIMITED_RESOURCES,
    ...PFBC_RESOURCES,
    ...ADDITIONAL_RESOURCES
  ];
  
  return allResources.find(resource => resource.id === id);
}

export function formatCitation(resource: AcademicResource): string {
  if (resource.citation) return resource.citation;
  
  let citation = "";
  if (resource.authors && resource.authors.length > 0) {
    citation += resource.authors.join(", ") + ". ";
  }
  if (resource.year) {
    citation += `(${resource.year}). `;
  }
  citation += resource.title + ". ";
  citation += resource.organization + ".";
  if (resource.url) {
    citation += ` ${resource.url}`;
  }
  
  return citation;
}

// ============ EXPERT CONTACTS ============

export const EXPERT_CONTACTS = {
  mueller: {
    name: "Dr. Sara Grisé Mueller",
    title: "Extension Educator - Environmental Education",
    organization: "Penn State Extension",
    email: "sgm17@psu.edu",
    phone: "814-865-6448",
    expertise: ["Stream ecology", "Macroinvertebrates", "Watershed education", "Citizen science"],
    availability: "Available for virtual presentations to classrooms (schedule 4-6 weeks ahead)",
    bio: "Dr. Mueller is an Extension Educator specializing in aquatic ecology and watershed education. She develops research-based educational programs connecting youth and communities to Pennsylvania's water resources. Her work focuses on benthic macroinvertebrates, stream monitoring, and hands-on conservation education."
  },
  pfbcEducation: {
    name: "PFBC Education Division",
    organization: "PA Fish & Boat Commission",
    email: "ra-pfbceducation@pa.gov",
    phone: "717-705-7835",
    services: ["TIC program registration", "Egg delivery coordination", "Teacher training", "Release site permits"],
    responseTime: "2-3 business days"
  },
  troutUnlimited: {
    name: "PA Council of Trout Unlimited",
    organization: "Trout Unlimited",
    email: "pacounciltu@gmail.com",
    url: "https://www.patrout.org/",
    services: ["Local chapter connections", "Youth program info", "Volunteer opportunities", "Habitat restoration projects"],
    note: "Contact individual chapters for local support and field trip opportunities"
  }
};

export default {
  drMueller: DR_SARA_MUELLER_RESOURCES,
  pennState: PENN_STATE_EXTENSION_RESOURCES,
  troutUnlimited: TROUT_UNLIMITED_RESOURCES,
  pfbc: PFBC_RESOURCES,
  additional: ADDITIONAL_RESOURCES,
  standards: { pa: PA_ACADEMIC_STANDARDS, ngss: NGSS_STANDARDS },
  experts: EXPERT_CONTACTS,
  getCitationsForTopic,
  getResourceById,
  formatCitation
};

