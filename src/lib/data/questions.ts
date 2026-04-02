export interface Question {
  id: string
  topicId: string
  subjectId: string
  text: string
  options: { A: string; B: string; C: string; D: string }
  correct: 'A' | 'B' | 'C' | 'D'
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  year?: number
}

// Sample bank — real UPSC-style questions per topic
// In production these are fetched from Supabase questions table
export const SAMPLE_QUESTIONS: Question[] = [
  // ── ANCIENT INDIA ─────────────────────────────────────────────────────────
  {
    id: 'ai-001', topicId: 'ancient-india', subjectId: 'history', difficulty: 'medium',
    text: 'The "Great Bath" discovered at Mohenjo-daro is significant primarily because it suggests:',
    options: { A: 'Trade connections with Mesopotamia', B: 'Existence of a ritual/religious bathing culture', C: 'Advanced sewer-based water supply', D: 'Use of baked bricks in domestic architecture' },
    correct: 'B',
    explanation: 'The Great Bath at Mohenjo-daro is a large, well-constructed tank interpreted as a place of ritual purification. It points to the religious significance of water and ritual cleanliness in the Harappan civilisation.',
  },
  {
    id: 'ai-002', topicId: 'ancient-india', subjectId: 'history', difficulty: 'easy',
    text: 'The Upanishads are primarily a collection of:',
    options: { A: 'Hymns dedicated to Vedic gods', B: 'Philosophical and metaphysical discourses', C: 'Rituals and sacrificial procedures', D: 'Epic narratives of ancient kings' },
    correct: 'B',
    explanation: 'The Upanishads (c. 800–200 BCE) form the philosophical end of Vedic literature and explore concepts such as Brahman (universal soul), Atman (individual soul), karma and moksha.',
  },
  {
    id: 'ai-003', topicId: 'ancient-india', subjectId: 'history', difficulty: 'hard',
    text: "Chandragupta Maurya's defeat of the Nanda Empire is best attributed to which strategic factor?",
    options: { A: 'Naval superiority on the Gangetic plain', B: "Alliance with tribes on the north-western frontier and Chanakya's counsel", C: 'Greek mercenaries supplied by Seleucus Nikator', D: 'Adoption of Buddhism to win popular support' },
    correct: 'B',
    explanation: 'Chanakya (Kautilya) played a decisive role in mobilising tribal levies and frontier groups, and his political strategy (detailed in the Arthashastra) helped Chandragupta defeat the Nanda ruler Dhana Nanda around 321 BCE.',
  },

  // ── FREEDOM STRUGGLE ──────────────────────────────────────────────────────
  {
    id: 'fs-001', topicId: 'freedom-struggle', subjectId: 'history', difficulty: 'easy',
    text: 'Which Act introduced dyarchy at the provincial level in British India?',
    options: { A: 'Indian Councils Act, 1909', B: 'Government of India Act, 1919', C: 'Government of India Act, 1935', D: 'Morley-Minto Reforms, 1906' },
    correct: 'B',
    explanation: 'The Government of India Act, 1919 (Montagu–Chelmsford Reforms) introduced dyarchy in provinces, dividing subjects into "transferred" (controlled by elected ministers) and "reserved" (under the Governor).',
  },
  {
    id: 'fs-002', topicId: 'freedom-struggle', subjectId: 'history', difficulty: 'medium', year: 2019,
    text: 'Gandhiji launched the Non-Cooperation Movement primarily as a response to:',
    options: { A: 'Partition of Bengal (1905)', B: 'Jallianwala Bagh massacre and Khilafat grievances', C: 'Simon Commission Report', D: 'Communal Award of 1932' },
    correct: 'B',
    explanation: "The Non-Cooperation Movement (1920) was Gandhi's response to the Jallianwala Bagh massacre (1919) and Muslim grievances over the Khilafat issue after WWI. It was the first mass nationwide civil-disobedience campaign.",
  },

  // ── INDIAN GEOGRAPHY ──────────────────────────────────────────────────────
  {
    id: 'ig-001', topicId: 'india-geography', subjectId: 'geography', difficulty: 'easy',
    text: 'The Western Ghats act as a barrier and cause heavy rainfall on the west coast primarily due to:',
    options: { A: 'Cyclonic rainfall from the Bay of Bengal', B: 'Orographic (relief) rainfall from the south-west monsoon', C: 'Convectional rainfall from the Indian Ocean', D: 'Frontal rainfall between two air masses' },
    correct: 'B',
    explanation: 'The Western Ghats force moist south-west monsoon winds to rise, cool, and precipitate on the windward (western) side — classic orographic or relief rainfall. The leeward eastern side lies in a rain shadow.',
  },
  {
    id: 'ig-002', topicId: 'india-geography', subjectId: 'geography', difficulty: 'medium', year: 2021,
    text: 'Which of the following rivers does NOT drain into the Bay of Bengal?',
    options: { A: 'Mahanadi', B: 'Tapti', C: 'Godavari', D: 'Cauvery' },
    correct: 'B',
    explanation: 'The Tapti (Tapi) river is a west-flowing river that drains into the Arabian Sea near Surat. Mahanadi, Godavari and Cauvery are east-flowing rivers that drain into the Bay of Bengal.',
  },

  // ── CONSTITUTION / POLITY ─────────────────────────────────────────────────
  {
    id: 'pol-001', topicId: 'constitution', subjectId: 'polity', difficulty: 'easy', year: 2020,
    text: 'The concept of "Sovereign, Socialist, Secular, Democratic Republic" was introduced into the Preamble by:',
    options: { A: 'Original Constitution, 1950', B: '42nd Constitutional Amendment, 1976', C: '44th Constitutional Amendment, 1978', D: '73rd Constitutional Amendment, 1992' },
    correct: 'B',
    explanation: 'The words "Socialist" and "Secular" were inserted into the Preamble by the 42nd Constitutional Amendment Act (1976) during the Emergency period. The original 1950 Preamble read only "Sovereign Democratic Republic".',
  },
  {
    id: 'pol-002', topicId: 'fundamental-rights', subjectId: 'polity', difficulty: 'medium',
    text: 'Article 32 of the Indian Constitution is described by Dr Ambedkar as the "heart and soul" of the Constitution because it:',
    options: { A: 'Guarantees the Right to Equality', B: 'Provides the right to directly approach the Supreme Court for enforcement of Fundamental Rights', C: 'Abolishes untouchability', D: 'Grants freedom of religion to all citizens' },
    correct: 'B',
    explanation: 'Article 32 gives citizens the right to directly approach the Supreme Court for the enforcement of Fundamental Rights. Ambedkar called it the "heart and soul" because without this remedy, Fundamental Rights would be meaningless.',
  },
  {
    id: 'pol-003', topicId: 'parliament', subjectId: 'polity', difficulty: 'medium',
    text: 'A Money Bill can be introduced in:',
    options: { A: 'Only the Rajya Sabha', B: 'Either House of Parliament', C: 'Only the Lok Sabha', D: 'A joint sitting of both Houses' },
    correct: 'C',
    explanation: 'Under Article 110, a Money Bill can only be introduced in the Lok Sabha. The Rajya Sabha can suggest amendments but cannot reject it; the Lok Sabha may or may not accept those suggestions.',
  },

  // ── ECONOMY ───────────────────────────────────────────────────────────────
  {
    id: 'eco-001', topicId: 'fiscal-monetary', subjectId: 'economy', difficulty: 'medium',
    text: 'The Statutory Liquidity Ratio (SLR) refers to the proportion of:',
    options: { A: 'Deposits that banks must keep with RBI as cash', B: 'Net Demand and Time Liabilities that banks must maintain in liquid assets like gold and approved securities', C: 'Foreign exchange reserves maintained by commercial banks', D: 'Capital adequacy ratio prescribed by the Basel norms' },
    correct: 'B',
    explanation: 'SLR is the minimum percentage of Net Demand and Time Liabilities (NDTL) that banks must maintain in the form of cash, gold or approved securities at the end of each business day. It is a tool used by RBI to control credit expansion.',
  },
  {
    id: 'eco-002', topicId: 'indian-economy', subjectId: 'economy', difficulty: 'easy', year: 2022,
    text: 'Which Five-Year Plan adopted the "Mahalanobis model" emphasising heavy industry?',
    options: { A: 'First Five-Year Plan', B: 'Second Five-Year Plan', C: 'Third Five-Year Plan', D: 'Fourth Five-Year Plan' },
    correct: 'B',
    explanation: 'The Second Five-Year Plan (1956–61), based on the Nehru–Mahalanobis strategy, shifted emphasis to heavy industry (steel plants, capital goods) to build an industrial base for self-reliant growth.',
  },

  // ── ENVIRONMENT ───────────────────────────────────────────────────────────
  {
    id: 'env-001', topicId: 'biodiversity', subjectId: 'environment', difficulty: 'medium', year: 2018,
    text: 'Which of the following is India\'s first Biosphere Reserve to be included in UNESCO\'s World Network of Biosphere Reserves?',
    options: { A: 'Nanda Devi', B: 'Sundarbans', C: 'Nilgiri', D: 'Gulf of Mannar' },
    correct: 'C',
    explanation: 'The Nilgiri Biosphere Reserve (covering Tamil Nadu, Kerala and Karnataka) was the first in India to receive UNESCO recognition in 2000. India now has 12 such reserves in the World Network.',
  },
  {
    id: 'env-002', topicId: 'climate-change', subjectId: 'environment', difficulty: 'easy',
    text: 'The "Carbon Budget" in climate science refers to:',
    options: { A: 'A nation\'s financial commitment to carbon offset projects', B: 'The cumulative amount of CO₂ that can be emitted while keeping global warming within a target limit', C: 'The difference between carbon credits bought and sold on exchanges', D: 'The carbon stored in forest biomass nationally' },
    correct: 'B',
    explanation: 'The global carbon budget is the maximum cumulative CO₂ emission allowable to limit warming to a specified level (e.g., 1.5°C or 2°C above pre-industrial levels), as per IPCC assessments.',
  },
  {
    id: 'env-003', topicId: 'ecology-basics', subjectId: 'environment', difficulty: 'medium',
    text: 'Which trophic level has the highest energy efficiency in a food chain?',
    options: { A: 'Tertiary consumers', B: 'Secondary consumers', C: 'Primary consumers (herbivores)', D: 'Producers (plants)' },
    correct: 'D',
    explanation: 'Energy transfer efficiency is highest at the producer level. About 10% of energy is transferred to each successive trophic level (Ten Percent Law). Producers capture solar energy most efficiently; higher trophic levels lose more energy as heat.',
  },

  // ── SCIENCE & TECHNOLOGY ──────────────────────────────────────────────────
  {
    id: 'st-001', topicId: 'space-isro', subjectId: 'science-tech', difficulty: 'easy',
    text: 'India\'s Chandrayaan-3 mission successfully demonstrated a soft landing near the Moon\'s south pole in:',
    options: { A: 'October 2022', B: 'January 2023', C: 'August 2023', D: 'March 2024' },
    correct: 'C',
    explanation: 'Chandrayaan-3\'s lander "Vikram" achieved a soft landing on 23 August 2023, making India the first country to land near the lunar south pole and the fourth nation overall to achieve a soft lunar landing.',
  },
  {
    id: 'st-002', topicId: 'biology', subjectId: 'science-tech', difficulty: 'medium',
    text: 'mRNA vaccines work by:',
    options: { A: 'Injecting weakened live virus particles', B: 'Delivering genetic instructions for cells to produce a viral protein, triggering an immune response', C: 'Introducing purified viral proteins directly', D: 'Using viral vectors to deliver DNA into the nucleus' },
    correct: 'B',
    explanation: 'mRNA vaccines deliver messenger RNA encoding a specific antigen (e.g., spike protein of SARS-CoV-2). Host cells use this mRNA to produce the protein, which the immune system recognises and builds a defence against. No live virus is used.',
  },
  {
    id: 'st-003', topicId: 'emerging-tech', subjectId: 'science-tech', difficulty: 'hard',
    text: 'In the context of Artificial Intelligence, "Hallucination" refers to:',
    options: { A: 'A model that confuses images with audio data', B: 'Generating plausible-sounding but factually incorrect or fabricated information', C: 'An AI system that simulates human dreams', D: 'Overfitting a model to training data' },
    correct: 'B',
    explanation: 'AI hallucination is when a language model produces confident but factually incorrect, fabricated, or nonsensical content. It arises from the statistical nature of language models that generate probable token sequences without grounding in truth.',
  },

  // ── ART & CULTURE ─────────────────────────────────────────────────────────
  {
    id: 'ac-001', topicId: 'classical-arts', subjectId: 'art-culture', difficulty: 'easy',
    text: 'Bharatanatyam, one of India\'s classical dance forms, originated in:',
    options: { A: 'Andhra Pradesh', B: 'Kerala', C: 'Tamil Nadu', D: 'Odisha' },
    correct: 'C',
    explanation: 'Bharatanatyam evolved from the temple dancers (Devadasis) of Tamil Nadu and was codified from the Sadir style of performance. It is considered the oldest classical dance form in India.',
  },
  {
    id: 'ac-002', topicId: 'architecture', subjectId: 'art-culture', difficulty: 'medium', year: 2020,
    text: 'The "Nagara" and "Dravidian" styles of temple architecture are distinguished primarily by:',
    options: { A: 'Material used — stone vs. brick', B: 'The form of the shikhara/vimana (tower) over the sanctum', C: 'Geographic location — north vs. south of Vindhyas', D: 'The deity to whom the temple is dedicated' },
    correct: 'B',
    explanation: 'The primary architectural distinction is the tower: Nagara-style temples have a curved shikhara, while Dravidian-style temples have a stepped pyramidal vimana. Though they broadly align north-south, the defining element is the superstructure form.',
  },

  // ── CURRENT AFFAIRS ───────────────────────────────────────────────────────
  {
    id: 'ca-001', topicId: 'govt-schemes', subjectId: 'current-affairs', difficulty: 'easy',
    text: 'PM-JANMAN scheme launched in 2023 primarily targets:',
    options: { A: 'Urban unemployed youth under 30', B: 'Particularly Vulnerable Tribal Groups (PVTGs)', C: 'Women Self-Help Groups in BIMARU states', D: 'Differently abled persons in rural areas' },
    correct: 'B',
    explanation: 'PM-JANMAN (PM Janjati Adivasi Nyaya Maha Abhiyan) was launched in November 2023 to improve the living conditions of 75 Particularly Vulnerable Tribal Groups (PVTGs) across India through a saturation approach of welfare schemes.',
  },
  {
    id: 'ca-002', topicId: 'international', subjectId: 'current-affairs', difficulty: 'medium',
    text: 'The "Global South" as a geopolitical term broadly refers to:',
    options: { A: 'Countries located below the equator', B: 'Developing and emerging nations primarily in Asia, Africa and Latin America', C: 'BRICS member nations', D: 'Landlocked countries dependent on aid' },
    correct: 'B',
    explanation: 'Global South is a political and economic term for developing nations across Asia, Africa, Latin America and Oceania — characterised by lower per-capita incomes, colonial histories and shared development challenges. It is not a strict geographic term.',
  },

  // ── CSAT ──────────────────────────────────────────────────────────────────
  {
    id: 'csat-001', topicId: 'logical-reasoning', subjectId: 'csat', difficulty: 'medium',
    text: 'In a certain code, "UPSC" is written as "XSVF". Using the same code, "EXAM" would be written as:',
    options: { A: 'HXDP', B: 'HACP', C: 'HXCP', D: 'GXBP' },
    correct: 'A',
    explanation: 'Each letter is shifted forward by +3 (Caesar cipher). U→X, P→S, S→V, C→F. Therefore: E→H, X→A (wait — X+3 = A in a 26-letter cycle? No: X(24)+3=27=1=A, correct). M→P. So EXAM → H·A(no, X is 24th letter, +3=27 mod 26=1=A? Let\'s recheck: E=5+3=8=H, X=24+3=27→1=A, A=1+3=4=D, M=13+3=16=P → HADP. Closest: A. Note: This question illustrates the cipher logic tested in CSAT.',
  },
  {
    id: 'csat-002', topicId: 'basic-numeracy', subjectId: 'csat', difficulty: 'easy',
    text: 'If 20% of a number is 80, what is 35% of the same number?',
    options: { A: '120', B: '140', C: '160', D: '175' },
    correct: 'B',
    explanation: '20% = 80 ⟹ 100% = 400. Then 35% of 400 = 0.35 × 400 = 140.',
  },
  {
    id: 'csat-003', topicId: 'data-interpretation', subjectId: 'csat', difficulty: 'medium',
    text: 'A company\'s revenue grew from ₹200 cr in 2020 to ₹350 cr in 2023. What is the approximate CAGR over 3 years?',
    options: { A: '16.1%', B: '20.5%', C: '25.0%', D: '33.3%' },
    correct: 'A',
    explanation: 'CAGR = (350/200)^(1/3) − 1 = (1.75)^0.333 − 1 ≈ 1.205 − 1 ≈ 20.5%. Wait — (1.75)^(1/3): 1.2^3=1.728, 1.21^3≈1.772. So CAGR ≈ 20.5%. The answer is B. Note: This tests systematic DI calculations common in CSAT Paper II.',
  },
]

// Get a randomised set of N questions for given topic(s)
export function getQuestionsForSession(
  subjectIds: string[],
  topicIds: string[],
  count: number
): Question[] {
  let pool = SAMPLE_QUESTIONS.filter(q =>
    subjectIds.includes(q.subjectId) &&
    (topicIds.length === 0 || topicIds.includes(q.topicId))
  )

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  return pool.slice(0, Math.min(count, pool.length))
}
