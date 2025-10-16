// Teacher Lesson Plans
// Detailed day-by-day lesson plans with timing, materials, procedures

export interface LessonPlan {
  id: string;
  title: string;
  topic: string;
  duration: string;
  gradeLevel: string[];
  objectives: string[];
  materials: {
    required: string[];
    optional: string[];
    handouts: string[];
  };
  preparation: string[];
  standards: {
    ngss: string[];
    paAcademic: string[];
  };
  vocabulary: string[];
  procedure: {
    engagement: ProcedureStep[];
    exploration: ProcedureStep[];
    explanation: ProcedureStep[];
    elaboration: ProcedureStep[];
    evaluation: ProcedureStep[];
  };
  differentiation: {
    supports: string[];
    extensions: string[];
    ell: string[];
    specialNeeds: string[];
  };
  assessment: {
    formative: string[];
    summative: string[];
    rubric?: string;
  };
  homework: string[];
  crossCurricular: {
    math: string[];
    ela: string[];
    socialStudies: string[];
  };
  resources: string[];
  notes: string[];
}

export interface ProcedureStep {
  time: string;
  activity: string;
  teacherActions: string[];
  studentActions: string[];
  materials: string[];
  tips: string[];
}

export const TEACHER_LESSON_PLANS: LessonPlan[] = [
  {
    id: 'lesson-plan-1',
    title: 'Introduction to PA Trout in the Classroom',
    topic: 'About and Background',
    duration: '2 class periods (90 minutes total)',
    gradeLevel: ['3-5', '6-8', '9-12'],
    objectives: [
      'Students will understand the history and purpose of the TIC program',
      'Students will identify Pennsylvania trout species and their characteristics',
      'Students will explain the importance of coldwater conservation',
      'Students will connect trout habitat to local watersheds',
    ],
    materials: {
      required: [
        'Computer/projector for video',
        'PA map showing trout streams',
        'Trout identification cards (3 species)',
        'Student notebooks',
        'KWL chart (poster or digital)',
      ],
      optional: [
        'Live trout eggs (if available)',
        'Aquarium setup',
        'Water quality test kit',
        'Guest speaker from PFBC',
      ],
      handouts: [
        'Trout Species Comparison Chart',
        'PA Watershed Map',
        'TIC Program Overview Sheet',
        'Career Exploration: Fisheries Biologist',
      ],
    },
    preparation: [
      'Set up projector and test video links',
      'Print handouts (1 per student)',
      'Create KWL chart on board or poster',
      'Prepare trout species cards (laminate if possible)',
      'Test aquarium if present',
      'Review PA trout regulations',
      'Bookmark PFBC website for demo',
    ],
    standards: {
      ngss: [
        '3-LS4-3 (Biological Evolution)',
        '5-LS2-1 (Ecosystems: Interactions, Energy)',
        'MS-LS2-1 (Interdependent Relationships)',
        'HS-LS2-7 (Ecosystem Stability)',
      ],
      paAcademic: [
        'Science: 3.1.5.A (Organisms and Cells)',
        'Science: 3.3.5.A (Ecosystems)',
        'Environment & Ecology: 4.6.5.A (Ecosystems and Interactions)',
        'Geography: 7.3.5.A (Basic Geographic Literacy)',
      ],
    },
    vocabulary: [
      'Coldwater species',
      'Native vs. introduced',
      'Watershed',
      'Conservation',
      'Brook trout',
      'Brown trout',
      'Rainbow trout',
      'Habitat',
      'Alevin',
      'Fry',
    ],
    procedure: {
      engagement: [
        {
          time: '10 min',
          activity: 'Opening Hook: Mystery Animal',
          teacherActions: [
            'Show close-up image of trout scales/fins without revealing what it is',
            'Ask: "What animal do you think this is?"',
            'Record student guesses on board',
            'Reveal full image of trout',
            'Ask: "Who has seen a trout before? Where?"',
          ],
          studentActions: [
            'Make predictions about mystery animal',
            'Share prior knowledge about fish/trout',
            'Connect to personal experiences (fishing, streams)',
          ],
          materials: ['Projector', 'Mystery trout images'],
          tips: [
            'Use enthusiasm to build excitement',
            'Validate all guesses, even incorrect ones',
            'Connect to students who fish or hike',
          ],
        },
        {
          time: '10 min',
          activity: 'KWL Chart: What We Know About Trout',
          teacherActions: [
            'Display KWL chart (Know, Want to know, Learned)',
            'Ask: "What do you already KNOW about trout?"',
            'Record responses in K column',
            'Ask: "What do you WANT to learn?"',
            'Record questions in W column',
            'Explain that L column will be filled at end of unit',
          ],
          studentActions: [
            'Share prior knowledge',
            'Ask questions about trout',
            'Record KWL chart in notebooks',
          ],
          materials: ['KWL chart', 'Markers'],
          tips: [
            'Accept all responses without judgment',
            'Use think-pair-share for shy students',
            'Keep W column questions for later reference',
          ],
        },
      ],
      exploration: [
        {
          time: '15 min',
          activity: 'Trout Species Jigsaw',
          teacherActions: [
            'Divide class into 3 groups (Brook, Brown, Rainbow)',
            'Give each group a species card with facts',
            'Set timer for 7 minutes to become "experts"',
            'Facilitate group discussions',
            'Create new mixed groups (1 expert from each species)',
            'Each expert teaches others about their trout',
          ],
          studentActions: [
            'Read species information carefully',
            'Identify key characteristics',
            'Prepare to teach peers',
            'Listen actively to other experts',
            'Take notes on all 3 species',
          ],
          materials: [
            'Trout Species Cards (3 types)',
            'Student notebooks',
            'Timer',
          ],
          tips: [
            'Pre-assign groups to balance abilities',
            'Use visual aids for each species',
            'Encourage students to use compare/contrast language',
          ],
        },
        {
          time: '15 min',
          activity: 'Video: PA Trout Streams',
          teacherActions: [
            'Show 5-minute video of PA trout habitat',
            'Pause at key points to ask questions',
            'Point out coldwater requirements',
            'Highlight threats to trout',
            'Connect to local streams if possible',
          ],
          studentActions: [
            'Watch video actively',
            'Identify trout habitat features',
            'Take notes on key vocabulary',
            'Ask clarifying questions',
          ],
          materials: [
            'Video: "Pennsylvania Trout Streams" (PFBC)',
            'Projector/speakers',
            'Note-taking guide',
          ],
          tips: [
            'Test video beforehand',
            'Have subtitles on for accessibility',
            'Connect to student watershed',
          ],
        },
      ],
      explanation: [
        {
          time: '15 min',
          activity: 'Direct Instruction: TIC Program',
          teacherActions: [
            'Explain history of TIC (since 1992)',
            'Show PA map with participating schools',
            'Describe program goals and timeline',
            'Explain student responsibilities',
            'Show photos of trout growth stages',
            'Discuss release day and conservation impact',
          ],
          studentActions: [
            'Listen actively',
            'Mark timeline in notebooks',
            'Ask questions about program',
            'Visualize trout growth',
          ],
          materials: [
            'PA map',
            'TIC timeline poster',
            'Growth stage photos',
            'Program overview handout',
          ],
          tips: [
            'Use visual timeline for clarity',
            'Show enthusiasm for upcoming stages',
            'Address student concerns about fish care',
          ],
        },
      ],
      elaboration: [
        {
          time: '15 min',
          activity: 'Watershed Connection Activity',
          teacherActions: [
            'Display local watershed map',
            'Ask: "Where does our water come from?"',
            'Trace water path from school to streams',
            'Discuss how our actions affect trout',
            'Introduce concept of "interconnectedness"',
            'Show PFBC stocking locations',
          ],
          studentActions: [
            'Locate school on map',
            'Identify local waterways',
            'Trace watershed connections',
            'Brainstorm human impacts',
            'Connect to release day',
          ],
          materials: [
            'Local watershed map',
            'Markers for tracing',
            'PFBC stocking map',
          ],
          tips: [
            'Make it personal - use local examples',
            'Show nearby streams students might know',
            'Connect to field trip opportunities',
          ],
        },
        {
          time: '10 min',
          activity: 'Career Connection: Fisheries Biologist',
          teacherActions: [
            'Show career card for fisheries biologist',
            'Play 2-minute interview clip (if available)',
            'Discuss education requirements',
            'Highlight daily tasks and fieldwork',
            'Connect TIC to real-world careers',
          ],
          studentActions: [
            'Learn about career pathway',
            'Ask questions about job',
            'Consider STEM connections',
          ],
          materials: [
            'Career card handout',
            'Video clip (optional)',
          ],
          tips: [
            'Invite guest speaker if possible',
            'Show diverse role models',
            'Connect to student interests',
          ],
        },
      ],
      evaluation: [
        {
          time: '10 min',
          activity: 'Exit Ticket: 3-2-1',
          teacherActions: [
            'Display exit ticket prompt on board',
            '3 facts you learned',
            '2 questions you still have',
            '1 way trout connect to your life',
            'Collect and review for next lesson',
          ],
          studentActions: [
            'Write 3 facts',
            'Formulate 2 questions',
            'Make 1 personal connection',
            'Submit before leaving',
          ],
          materials: [
            'Exit ticket slips',
            'Collection box',
          ],
          tips: [
            'Use for next lesson planning',
            'Address common questions next time',
            'Praise thoughtful connections',
          ],
        },
      ],
    },
    differentiation: {
      supports: [
        'Provide trout species cards with simpler text',
        'Use visual aids extensively (photos, diagrams)',
        'Allow audio recording of notes instead of writing',
        'Pre-teach vocabulary with picture cards',
        'Provide sentence frames for discussions',
        'Use smaller groups for jigsaw activity',
      ],
      extensions: [
        'Research PA native trout decline and write report',
        'Create infographic comparing 3 trout species',
        'Interview local angler or biologist',
        'Design ideal trout habitat model',
        'Calculate watershed area using GIS tools',
        'Start citizen science project on iNaturalist',
      ],
      ell: [
        'Provide bilingual vocabulary cards',
        'Use visuals for every concept',
        'Pair with bilingual buddy',
        'Allow native language note-taking',
        'Provide translated handouts (Spanish)',
        'Use gestures and demonstrations',
      ],
      specialNeeds: [
        'Provide preferential seating near teacher/board',
        'Allow movement breaks',
        'Offer fidget tools during videos',
        'Provide printed notes/outline',
        'Allow extra time for writing',
        'Use assistive technology as needed',
      ],
    },
    assessment: {
      formative: [
        'KWL chart participation',
        'Jigsaw activity engagement and teaching quality',
        'Video viewing questions',
        'Class discussion contributions',
        'Exit ticket responses',
      ],
      summative: [
        'Trout species identification quiz (next lesson)',
        'Watershed map labeling',
        'Program timeline completion',
        'Written reflection on conservation',
      ],
      rubric: 'Trout Species Expert Rubric: Knowledge (25%), Teaching (25%), Listening (25%), Collaboration (25%)',
    },
    homework: [
      'Complete Species Comparison Chart',
      'Interview family member: "Have you seen trout in PA?"',
      'Find 3 PA streams on map',
      'Write 1 paragraph: "Why I\'m excited about TIC"',
      'Optional: Visit local stream and take photos',
    ],
    crossCurricular: {
      math: [
        'Calculate trout growth rate (length over time)',
        'Graph temperature data',
        'Measure aquarium dimensions and volume',
        'Convert Fahrenheit/Celsius',
      ],
      ela: [
        'Read "Trout Are Made of Trees" by April Pulley Sayre',
        'Write persuasive letter about stream conservation',
        'Create trout fact book',
        'Research report on brook trout history',
      ],
      socialStudies: [
        'PA geography and watersheds',
        'History of fishing in Pennsylvania',
        'Native American use of trout as food',
        'Economic impact of recreational fishing',
      ],
    },
    resources: [
      'PFBC TIC Curriculum Guide',
      'Dr. Sara Grisé Mueller - Penn State Extension',
      'Trout Unlimited Education Resources',
      'PA DEP Watershed Maps',
      'WLA Badges System',
      'iNaturalist PA Trout Project',
    ],
    notes: [
      'Adjust timing based on student engagement',
      'Have backup activities if technology fails',
      'Take photos for classroom updates to parents',
      'Document student questions for future lessons',
      'Consider inviting PFBC volunteer for next lesson',
    ],
  },

  // Add more lesson plans for other topics
  {
    id: 'lesson-plan-2',
    title: 'Aquarium Setup and Water Chemistry',
    topic: 'Aquarium Setup, Cycling & Salt Treatment',
    duration: '3 class periods (135 minutes total)',
    gradeLevel: ['3-5', '6-8', '9-12'],
    objectives: [
      'Students will set up and cycle a trout aquarium safely',
      'Students will explain the nitrogen cycle',
      'Students will perform water quality tests accurately',
      'Students will calculate appropriate salt treatment dosage',
    ],
    materials: {
      required: [
        '55-gallon aquarium tank',
        'Aquarium stand',
        'Chiller unit (set to 50°F)',
        'Air pump and tubing',
        'Air stones (2-3)',
        'Heater (backup)',
        'Thermometer',
        'Water conditioner (dechlorinator)',
        'Non-iodized salt',
        'Test kit (ammonia, nitrite, nitrate, pH)',
        'Bucket for water changes',
        'Safety goggles',
        'Gloves',
      ],
      optional: [
        'Gravel (optional for trout)',
        'Aquarium light',
        'Timer for feeding',
        'Backup battery air pump',
      ],
      handouts: [
        'Aquarium Setup Checklist',
        'Nitrogen Cycle Diagram',
        'Water Quality Log Sheet',
        'Salt Treatment Calculator',
        'Emergency Procedures Card',
      ],
    },
    preparation: [
      'Inspect all equipment before class',
      'Test electrical outlets',
      'Fill bucket with aged tap water',
      'Set up chiller 24 hours in advance',
      'Prepare cleaning station with towels',
      'Review MSDS for water conditioner',
      'Create safety demonstration area',
      'Print 1 set of logs per student group',
    ],
    standards: {
      ngss: [
        '5-PS1-3 (Matter and Energy)',
        'MS-PS1-2 (Chemical Reactions)',
        'MS-LS2-3 (Cycling of Matter)',
        'HS-LS2-3 (Biogeochemical Cycles)',
      ],
      paAcademic: [
        'Science: 3.2.5.A (Chemistry)',
        'Science: 3.3.5.A (Ecology)',
        'Mathematics: 2.1.5.A (Numbers and Operations)',
      ],
    },
    vocabulary: [
      'Nitrogen cycle',
      'Ammonia',
      'Nitrite',
      'Nitrate',
      'Beneficial bacteria',
      'Cycling',
      'ppm (parts per million)',
      'Chlorine/Chloramine',
      'Osmoregulation',
      'Salinity',
    ],
    procedure: {
      engagement: [
        {
          time: '10 min',
          activity: 'Safety First: Aquarium Lab Rules',
          teacherActions: [
            'Demonstrate proper lifting technique for buckets',
            'Show how to use test kits safely',
            'Model reading instructions on chemicals',
            'Demonstrate wearing goggles and gloves',
            'Explain electrical safety near water',
            'Designate spill cleanup station',
          ],
          studentActions: [
            'Practice safe lifting',
            'Try on safety equipment',
            'Identify hazards in room',
            'Sign safety contract',
          ],
          materials: ['Safety goggles', 'Gloves', 'Safety contract'],
          tips: ['Emphasize safety repeatedly', 'Practice before starting'],
        },
      ],
      exploration: [
        {
          time: '30 min',
          activity: 'Hands-On: Tank Setup',
          teacherActions: [
            'Divide class into 4 stations',
            'Station 1: Tank placement and stand',
            'Station 2: Chiller and air pump setup',
            'Station 3: Water addition and conditioning',
            'Station 4: Testing equipment',
            'Rotate groups every 7 minutes',
            'Supervise closely, especially electrical',
          ],
          studentActions: [
            'Follow setup checklist step-by-step',
            'Work collaboratively',
            'Ask questions before acting',
            'Document each step with photos',
          ],
          materials: ['All aquarium equipment', 'Setup checklists', 'Cameras'],
          tips: ['Have backup equipment ready', 'Assign roles within groups'],
        },
      ],
      explanation: [
        {
          time: '20 min',
          activity: 'Direct Instruction: Nitrogen Cycle',
          teacherActions: [
            'Draw nitrogen cycle on board step-by-step',
            'Explain: Waste → Ammonia (toxic)',
            'Explain: Bacteria convert Ammonia → Nitrite (toxic)',
            'Explain: Different bacteria convert Nitrite → Nitrate (less toxic)',
            'Discuss cycling timeline (4-6 weeks)',
            'Show real water test results from cycled tank',
          ],
          studentActions: [
            'Draw cycle in notebooks',
            'Label each stage',
            'Identify which compounds are toxic',
            'Predict what happens without cycling',
          ],
          materials: ['Nitrogen cycle poster', 'Colored markers', 'Sample test results'],
          tips: ['Use analogy: recycling center processing waste'],
        },
      ],
      elaboration: [
        {
          time: '25 min',
          activity: 'Lab: Water Quality Testing',
          teacherActions: [
            'Demonstrate proper use of each test kit',
            'Show how to read color charts',
            'Explain ppm measurements',
            'Model recording data in log sheet',
            'Have students test tap water vs. conditioned water',
            'Discuss results as class',
          ],
          studentActions: [
            'Perform ammonia test',
            'Perform nitrite test',
            'Perform pH test',
            'Record all results',
            'Compare readings with partners',
          ],
          materials: ['Test kits', 'Water samples', 'Log sheets', 'Stopwatch'],
          tips: ['Do tests in small groups', 'Compare results to discuss accuracy'],
        },
      ],
      evaluation: [
        {
          time: '15 min',
          activity: 'Nitrogen Cycle Simulation Game',
          teacherActions: [
            'Assign students roles: Waste, Ammonia, Bacteria 1, Bacteria 2, Nitrite, Nitrate',
            'Have students physically move through cycle',
            'Call out "Day 1! What happens?"',
            'Students act out transformations',
            'Repeat for Day 7, Day 14, Day 28',
            'Debrief: What did you notice?',
          ],
          studentActions: [
            'Embody assigned role',
            'Move to correct position in cycle',
            'Explain transformation',
          ],
          materials: ['Role cards', 'Open space'],
          tips: ['Make it fun and active', 'Take photos for documentation'],
        },
      ],
    },
    differentiation: {
      supports: [
        'Provide pre-filled log sheets with some data',
        'Use color-coded test kits',
        'Provide step-by-step photo instructions',
        'Allow verbal responses instead of written',
        'Pair struggling students with strong readers',
      ],
      extensions: [
        'Research and report on alternative biofilter systems',
        'Calculate water volume and cycling capacity mathematically',
        'Design experiment comparing cycling with/without water conditioner',
        'Create animated video explaining nitrogen cycle',
      ],
      ell: [
        'Provide vocabulary cards with images',
        'Use physical gestures for each cycle stage',
        'Pre-teach science terms with native language support',
      ],
      specialNeeds: [
        'Provide seated testing station',
        'Allow use of pipette instead of pouring',
        'Offer larger print on log sheets',
        'Reduce number of tests required',
      ],
    },
    assessment: {
      formative: [
        'Setup checklist completion',
        'Safety quiz',
        'Water test accuracy',
        'Nitrogen cycle drawing',
      ],
      summative: [
        'Written quiz: Nitrogen cycle stages',
        'Practical test: Perform water quality tests',
        'Log sheet analysis over 4 weeks',
      ],
    },
    homework: [
      'Complete nitrogen cycle diagram with labels',
      'Calculate salt dosage for your home aquarium (if you have one)',
      'Research one beneficial bacteria species',
    ],
    crossCurricular: {
      math: [
        'Calculate ppm from test results',
        'Determine salt dosage (grams per gallon)',
        'Convert units: Fahrenheit ↔ Celsius',
        'Graph nitrogen compound changes over time',
      ],
      ela: [
        'Write procedure for water testing',
        'Create safety manual for aquarium',
        'Read articles on aquaponics',
      ],
      socialStudies: [
        'Research water treatment plants',
        'Study PA water quality regulations',
      ],
    },
    resources: [
      'PFBC TIC Manual Chapter 3',
      'Penn State Extension: Water Quality for Trout',
      'API Test Kit Instructions',
      'Seachem Prime Dosage Guide',
    ],
    notes: [
      'Never leave students unsupervised around aquarium',
      'Keep spill kit accessible',
      'Document baseline water parameters',
      'Invite maintenance staff to discuss plumbing',
    ],
  },
];

