export interface Topic {
  id: string
  name: string
  description: string
  questionCount: number
  icon: string
}

export interface Subject {
  id: string
  name: string
  slug: string
  description: string
  paper: 'GS-I' | 'CSAT'
  color: string        // Tailwind gradient classes
  bgColor: string      // card background
  icon: string         // emoji
  topics: Topic[]
  totalQuestions: number
}

// Official UPSC Civil Services Preliminary Examination Syllabus
// Source: UPSC.gov.in — Civil Services (Preliminary) Examination Rules
export const SUBJECTS: Subject[] = [
  {
    id: 'history',
    name: 'History & Indian National Movement',
    slug: 'history',
    description: 'Ancient, Medieval & Modern India with the Freedom Struggle',
    paper: 'GS-I',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-950/40',
    icon: '🏛️',
    totalQuestions: 180,
    topics: [
      { id: 'ancient-india', name: 'Ancient India', description: 'Prehistoric to Gupta period — Indus Valley, Vedic Age, Mauryas, Guptas', questionCount: 30, icon: '🪨' },
      { id: 'medieval-india', name: 'Medieval India', description: 'Sultanate, Mughal Empire, Bhakti & Sufi movements, Vijayanagara', questionCount: 30, icon: '🕌' },
      { id: 'modern-india', name: 'Modern India', description: 'British colonialism, economic & administrative impact, social reforms', questionCount: 30, icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
      { id: 'freedom-struggle', name: 'Freedom Struggle', description: 'From 1857 to 1947 — major movements, leaders, events', questionCount: 40, icon: '🇮🇳' },
      { id: 'post-independence', name: 'Post-Independence India', description: 'Integration of states, Five-Year Plans, major milestones 1947–1991', questionCount: 20, icon: '🗳️' },
      { id: 'world-history', name: 'World History', description: 'Industrial Revolution, World Wars, colonialism, decolonisation', questionCount: 30, icon: '🌍' },
    ],
  },
  {
    id: 'geography',
    name: 'Indian & World Geography',
    slug: 'geography',
    description: 'Physical, Social and Economic Geography of India and the World',
    paper: 'GS-I',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-950/40',
    icon: '🌏',
    totalQuestions: 200,
    topics: [
      { id: 'physical-geography', name: 'Physical Geography', description: 'Geomorphology, climatology, oceanography, biogeography', questionCount: 40, icon: '⛰️' },
      { id: 'india-geography', name: 'Indian Geography', description: 'Physiographic divisions, drainage, soils, climate of India', questionCount: 50, icon: '🗺️' },
      { id: 'world-geography', name: 'World Geography', description: 'Continents, oceans, tectonic plates, major landforms worldwide', questionCount: 35, icon: '🌐' },
      { id: 'economic-geography', name: 'Economic Geography', description: 'Agriculture, minerals, energy resources, industries and trade', questionCount: 35, icon: '🌾' },
      { id: 'human-geography', name: 'Human & Social Geography', description: 'Population, migration, urbanisation, settlements', questionCount: 25, icon: '👥' },
      { id: 'cartography', name: 'Maps & Cartography', description: 'Map reading, latitudes & longitudes, time zones', questionCount: 15, icon: '🧭' },
    ],
  },
  {
    id: 'polity',
    name: 'Indian Polity & Governance',
    slug: 'polity',
    description: 'Constitution, Political System, Panchayati Raj, Rights & Policies',
    paper: 'GS-I',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-950/40',
    icon: '⚖️',
    totalQuestions: 220,
    topics: [
      { id: 'constitution', name: 'Indian Constitution', description: 'Making of Constitution, Preamble, Features, Schedules & Amendments', questionCount: 45, icon: '📜' },
      { id: 'parliament', name: 'Parliament & Legislature', description: 'Lok Sabha, Rajya Sabha, legislative procedures, committees', questionCount: 40, icon: '🏛️' },
      { id: 'executive', name: 'Executive & Judiciary', description: 'President, PM, Cabinet, Supreme Court, High Courts', questionCount: 40, icon: '👨‍⚖️' },
      { id: 'federalism', name: 'Federalism & Local Governance', description: 'Centre-State relations, Panchayati Raj, Urban Local Bodies', questionCount: 35, icon: '🏘️' },
      { id: 'fundamental-rights', name: 'Fundamental Rights & DPSP', description: 'Rights, duties, Directive Principles, their interplay', questionCount: 35, icon: '🤝' },
      { id: 'governance', name: 'Governance & Public Policy', description: 'E-governance, government schemes, regulatory bodies', questionCount: 25, icon: '🏢' },
    ],
  },
  {
    id: 'economy',
    name: 'Economic & Social Development',
    slug: 'economy',
    description: 'Sustainable Development, Poverty, Inclusion, Demographics, Social Sector',
    paper: 'GS-I',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-950/40',
    icon: '📊',
    totalQuestions: 190,
    topics: [
      { id: 'basic-economics', name: 'Basic Economic Concepts', description: 'Demand-supply, GDP, GNP, fiscal & monetary theory', questionCount: 35, icon: '💹' },
      { id: 'indian-economy', name: 'Indian Economy', description: 'Planning, economic reforms 1991, sectors of economy', questionCount: 40, icon: '🇮🇳' },
      { id: 'fiscal-monetary', name: 'Fiscal & Monetary Policy', description: 'Budget, taxation, RBI, inflation, interest rates', questionCount: 35, icon: '🏦' },
      { id: 'agriculture', name: 'Agriculture & Rural Development', description: 'Green Revolution, food security, land reforms, rural schemes', questionCount: 30, icon: '🌱' },
      { id: 'social-development', name: 'Social Development & Poverty', description: 'Poverty, inequality, human development, social sector initiatives', questionCount: 30, icon: '🧑‍🤝‍🧑' },
      { id: 'external-sector', name: 'External Sector & Trade', description: 'BoP, forex, WTO, international trade, FDI', questionCount: 20, icon: '🌐' },
    ],
  },
  {
    id: 'environment',
    name: 'Environment & Ecology',
    slug: 'environment',
    description: 'Ecology, Biodiversity, Climate Change, Environmental Laws & Conservation',
    paper: 'GS-I',
    color: 'from-green-500 to-lime-600',
    bgColor: 'bg-green-950/40',
    icon: '🌿',
    totalQuestions: 160,
    topics: [
      { id: 'ecology-basics', name: 'Ecology & Ecosystems', description: 'Food chains, trophic levels, ecosystem types, biomes', questionCount: 30, icon: '🌳' },
      { id: 'biodiversity', name: 'Biodiversity & Conservation', description: 'Hotspots, endemic species, protected areas, IUCN categories', questionCount: 35, icon: '🐯' },
      { id: 'climate-change', name: 'Climate Change', description: 'Greenhouse gases, IPCC, Paris Agreement, impacts & mitigation', questionCount: 30, icon: '🌡️' },
      { id: 'env-laws', name: 'Environmental Laws & Bodies', description: 'EPA, Wildlife Protection Act, international conventions, NGTT', questionCount: 30, icon: '📋' },
      { id: 'pollution', name: 'Pollution & Waste Management', description: 'Air, water, soil & noise pollution; solid waste management', questionCount: 25, icon: '♻️' },
      { id: 'natural-resources', name: 'Natural Resources', description: 'Forest, water, land, mineral resources and their sustainable use', questionCount: 10, icon: '💎' },
    ],
  },
  {
    id: 'science-tech',
    name: 'General Science & Technology',
    slug: 'science-tech',
    description: 'Physics, Chemistry, Biology, Space, Defence and Emerging Technologies',
    paper: 'GS-I',
    color: 'from-cyan-500 to-sky-600',
    bgColor: 'bg-cyan-950/40',
    icon: '🔬',
    totalQuestions: 170,
    topics: [
      { id: 'physics', name: 'Physics', description: 'Laws of motion, thermodynamics, optics, electricity & magnetism', questionCount: 25, icon: '⚡' },
      { id: 'chemistry', name: 'Chemistry', description: 'Atomic structure, periodic table, chemical reactions, everyday chemistry', questionCount: 25, icon: '🧪' },
      { id: 'biology', name: 'Biology & Life Sciences', description: 'Cell biology, genetics, human body systems, diseases', questionCount: 35, icon: '🧬' },
      { id: 'space-isro', name: 'Space & ISRO', description: 'Indian space missions, satellite technology, recent launches', questionCount: 30, icon: '🚀' },
      { id: 'defence-tech', name: 'Defence & Nuclear Technology', description: 'Missiles, DRDO, nuclear policy, defence acquisitions', questionCount: 20, icon: '🛡️' },
      { id: 'emerging-tech', name: 'Emerging Technologies', description: 'AI, Blockchain, Biotechnology, Nano-tech, 5G, Cybersecurity', questionCount: 35, icon: '🤖' },
    ],
  },
  {
    id: 'current-affairs',
    name: 'Current Affairs',
    slug: 'current-affairs',
    description: 'National & International events, Government Schemes, Awards & Sports',
    paper: 'GS-I',
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-950/40',
    icon: '📰',
    totalQuestions: 150,
    topics: [
      { id: 'national-affairs', name: 'National Affairs', description: 'Domestic politics, laws passed, major government decisions', questionCount: 30, icon: '🏛️' },
      { id: 'international', name: 'International Relations', description: 'India\'s foreign policy, bilateral relations, global events', questionCount: 30, icon: '🌍' },
      { id: 'govt-schemes', name: 'Government Schemes', description: 'Flagship schemes, welfare programmes, PM initiatives', questionCount: 30, icon: '📋' },
      { id: 'economy-news', name: 'Economy in News', description: 'Budget announcements, RBI policy, major economic events', questionCount: 25, icon: '💰' },
      { id: 'science-news', name: 'Science & Environment in News', description: 'Recent discoveries, environmental summits, tech milestones', questionCount: 20, icon: '🔭' },
      { id: 'awards-sports', name: 'Awards, Sports & Culture', description: 'National awards, Olympics, cultural achievements', questionCount: 15, icon: '🏆' },
    ],
  },
  {
    id: 'art-culture',
    name: 'Indian Art & Culture',
    slug: 'art-culture',
    description: 'Classical Arts, Architecture, Literature, UNESCO Heritage & Traditions',
    paper: 'GS-I',
    color: 'from-yellow-500 to-amber-600',
    bgColor: 'bg-yellow-950/40',
    icon: '🎭',
    totalQuestions: 140,
    topics: [
      { id: 'classical-arts', name: 'Classical Dance & Music', description: 'Eight classical dance forms, Hindustani & Carnatic music traditions', questionCount: 25, icon: '💃' },
      { id: 'architecture', name: 'Architecture & Sculpture', description: 'Rock-cut, temple styles, Mughal & Buddhist architecture', questionCount: 30, icon: '🕌' },
      { id: 'literature', name: 'Literature & Languages', description: 'Sanskrit literature, classical languages, modern Indian literature', questionCount: 25, icon: '📚' },
      { id: 'festivals', name: 'Festivals & Traditions', description: 'Major festivals, folk traditions, tribal culture', questionCount: 20, icon: '🎉' },
      { id: 'philosophy', name: 'Indian Philosophy & Religion', description: 'Vedanta, Buddhism, Jainism, Sikhism, Bhakti & Sufi traditions', questionCount: 20, icon: '🕉️' },
      { id: 'heritage', name: 'UNESCO Heritage Sites', description: 'India\'s World Heritage Sites — natural and cultural', questionCount: 20, icon: '🏺' },
    ],
  },
  // CSAT Paper II
  {
    id: 'csat',
    name: 'CSAT — Civil Services Aptitude Test',
    slug: 'csat',
    description: 'Paper II: Comprehension, Reasoning, Mental Ability, Numeracy (Qualifying)',
    paper: 'CSAT',
    color: 'from-slate-500 to-gray-600',
    bgColor: 'bg-slate-950/40',
    icon: '🧠',
    totalQuestions: 200,
    topics: [
      { id: 'comprehension', name: 'Reading Comprehension', description: 'Passage-based questions testing understanding and inference', questionCount: 40, icon: '📖' },
      { id: 'logical-reasoning', name: 'Logical Reasoning', description: 'Syllogisms, analogies, coding-decoding, series, blood relations', questionCount: 40, icon: '🔍' },
      { id: 'analytical-ability', name: 'Analytical Ability', description: 'Data sufficiency, critical reasoning, assumptions, conclusions', questionCount: 35, icon: '🧩' },
      { id: 'mental-ability', name: 'General Mental Ability', description: 'Direction sense, ranking, puzzles, Venn diagrams', questionCount: 30, icon: '🧠' },
      { id: 'basic-numeracy', name: 'Basic Numeracy', description: 'Number systems, percentages, averages, ratios — Class X level', questionCount: 30, icon: '🔢' },
      { id: 'data-interpretation', name: 'Data Interpretation', description: 'Bar charts, pie charts, line graphs, tables, DI sets', questionCount: 25, icon: '📊' },
    ],
  },
]

export function getSubjectById(id: string): Subject | undefined {
  return SUBJECTS.find(s => s.id === id)
}

export function getSubjectBySlug(slug: string): Subject | undefined {
  return SUBJECTS.find(s => s.slug === slug)
}

export function getTopicById(subjectId: string, topicId: string): Topic | undefined {
  const subject = getSubjectById(subjectId)
  return subject?.topics.find(t => t.id === topicId)
}

export const GS_SUBJECTS = SUBJECTS.filter(s => s.paper === 'GS-I')
export const CSAT_SUBJECT = SUBJECTS.filter(s => s.paper === 'CSAT')
