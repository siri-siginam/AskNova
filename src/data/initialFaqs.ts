import { FAQItem } from '../types';

export const INITIAL_FAQS: FAQItem[] = [
  // --- 1. Geography ---
  {
    id: 'GEO-001',
    category: 'Geography',
    subcategory: 'Capitals',
    question: 'What is the capital of France?',
    answer: 'The capital of France is Paris. Known as the "City of Light," it is famous for iconic landmarks like the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral.',
    tags: ['france', 'paris', 'capital', 'europe', 'geography'],
    canonicalQuestions: ['What city is France\'s capital?', 'Which is the capital city of France?']
  },
  {
    id: 'GEO-002',
    category: 'Geography',
    subcategory: 'Capitals',
    question: 'What is the capital of Japan?',
    answer: 'The capital of Japan is Tokyo. Located on the island of Honshu, Tokyo is the world\'s most populous metropolitan area and a global hub for technology, culture, and finance.',
    tags: ['japan', 'tokyo', 'capital', 'asia', 'geography'],
    canonicalQuestions: ['Which city is Japan\'s capital?', 'What is Tokyo the capital of?']
  },
  {
    id: 'GEO-003',
    category: 'Geography',
    subcategory: 'Rivers & Oceans',
    question: 'What is the longest river in the world?',
    answer: 'The Nile River in Africa is traditionally recognized as the longest river in the world, spanning approximately 6,650 kilometers (4,132 miles). The Amazon River is the second longest but holds the largest water volume.',
    tags: ['nile', 'river', 'longest river', 'amazon', 'africa', 'geography'],
    canonicalQuestions: ['Which river is the longest on Earth?', 'Is Nile or Amazon longer?']
  },
  {
    id: 'GEO-004',
    category: 'Geography',
    subcategory: 'Mountains',
    question: 'What is the highest mountain peak in the world?',
    answer: 'Mount Everest, located in the Himalayas on the border between Nepal and Tibet (China), is the highest peak above sea level at 8,848.86 meters (29,031.7 feet).',
    tags: ['everest', 'mountain', 'highest peak', 'himalayas', 'nepal'],
    canonicalQuestions: ['Which peak is the tallest in the world?', 'How tall is Mount Everest?']
  },
  {
    id: 'GEO-005',
    category: 'Geography',
    subcategory: 'Continents & Deserts',
    question: 'What is the largest desert in the world?',
    answer: 'The Antarctic Desert is the largest desert on Earth, covering roughly 14 million square kilometers. The Sahara is the largest warm (hot) desert in the world.',
    tags: ['desert', 'antarctica', 'sahara', 'largest desert', 'geography']
  },

  // --- 2. Education ---
  {
    id: 'EDU-001',
    category: 'Education',
    subcategory: 'Competitive Exams',
    question: 'What is the JEE exam in India?',
    answer: 'JEE (Joint Entrance Examination) is an all-India engineering entrance examination conducted by the NTA for admission into premier technical institutes like IITs, NITs, and IIITs. It consists of JEE Main and JEE Advanced.',
    tags: ['jee', 'engineering', 'iit', 'exam', 'india', 'education']
  },
  {
    id: 'EDU-002',
    category: 'Education',
    subcategory: 'Competitive Exams',
    question: 'What is the GRE and who needs to take it?',
    answer: 'The GRE (Graduate Record Examination) is a standardized test administered by ETS, required for admission into many graduate and business school programs globally, measuring verbal reasoning, quantitative reasoning, and analytical writing.',
    tags: ['gre', 'grad school', 'ets', 'masters', 'education']
  },
  {
    id: 'EDU-003',
    category: 'Education',
    subcategory: 'Study Techniques',
    question: 'What is the Pomodoro Technique for studying?',
    answer: 'The Pomodoro Technique is a time-management method where you break study sessions into 25-minute focused blocks ("Pomodoros") followed by 5-minute short breaks, with a longer 15-30 minute break after four cycles.',
    tags: ['pomodoro', 'study tips', 'time management', 'productivity']
  },
  {
    id: 'EDU-004',
    category: 'Education',
    subcategory: 'Medical Entrance',
    question: 'What is NEET exam?',
    answer: 'NEET (National Eligibility cum Entrance Test) is a nationwide medical entrance examination in India for students wishing to pursue undergraduate medical (MBBS), dental (BDS), and allied healthcare courses in government and private institutes.',
    tags: ['neet', 'mbbs', 'medical entrance', 'doctor', 'india']
  },

  // --- 3. Programming & Coding ---
  {
    id: 'PRG-001',
    category: 'Programming & Coding',
    subcategory: 'JavaScript & Web',
    question: 'What is the difference between let, const, and var in JavaScript?',
    answer: 'In JS: "var" is function-scoped and hoists with undefined value. "let" is block-scoped and allows re-assignment. "const" is block-scoped and cannot be reassigned after declaration.',
    tags: ['javascript', 'js', 'let', 'const', 'var', 'variables', 'coding'],
    canonicalQuestions: ['Difference between const let and var in JS?', 'How do let and const differ from var?']
  },
  {
    id: 'PRG-002',
    category: 'Programming & Coding',
    subcategory: 'React',
    question: 'What is React and why is it used?',
    answer: 'React is an open-source front-end JavaScript library developed by Meta for building user interfaces based on UI components. It uses a Virtual DOM and declarative syntax to efficiently render dynamic web applications.',
    tags: ['react', 'virtual dom', 'frontend', 'javascript', 'framework']
  },
  {
    id: 'PRG-003',
    category: 'Programming & Coding',
    subcategory: 'Python',
    question: 'What is the difference between a list and a tuple in Python?',
    answer: 'In Python, lists are mutable (can be changed after creation, written with square brackets `[]`), whereas tuples are immutable (cannot be modified once created, written with parentheses `()`). Tuples are faster and consume less memory.',
    tags: ['python', 'list', 'tuple', 'data structure', 'programming']
  },
  {
    id: 'PRG-004',
    category: 'Programming & Coding',
    subcategory: 'Version Control',
    question: 'What is Git and what is the difference between Git and GitHub?',
    answer: 'Git is a local distributed version control system for tracking changes in source code. GitHub is a cloud-based hosting service that manages Git repositories, adding collaboration, pull requests, and web interfaces.',
    tags: ['git', 'github', 'version control', 'devops', 'coding']
  },
  {
    id: 'PRG-005',
    category: 'Programming & Coding',
    subcategory: 'Data Structures',
    question: 'What is the difference between a Stack and a Queue?',
    answer: 'A Stack follows LIFO (Last-In, First-Out) ordering, like a stack of plates. A Queue follows FIFO (First-In, First-Out) ordering, like a line of people waiting for a bus.',
    tags: ['stack', 'queue', 'data structures', 'lifo', 'fifo', 'algorithms']
  },

  // --- 4. Universities & Schools ---
  {
    id: 'UNI-001',
    category: 'Universities & Schools',
    subcategory: 'GPA System',
    question: 'How is GPA calculated on a 4.0 scale?',
    answer: 'GPA (Grade Point Average) maps letter grades to numerical points: A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0.0. To calculate, multiply each course grade point by its credit hours, sum them up, and divide by total credit hours.',
    tags: ['gpa', 'grades', '4.0 scale', 'university', 'college']
  },
  {
    id: 'UNI-002',
    category: 'Universities & Schools',
    subcategory: 'Ivy League',
    question: 'Which universities belong to the Ivy League?',
    answer: 'The Ivy League consists of eight private universities in the Northeastern United States: Harvard, Yale, Princeton, Columbia, University of Pennsylvania, Dartmouth College, Brown, and Cornell University.',
    tags: ['ivy league', 'harvard', 'yale', 'princeton', 'columbia', 'universities']
  },

  // --- 5. Technology ---
  {
    id: 'TEC-001',
    category: 'Technology',
    subcategory: 'Artificial Intelligence',
    question: 'What is Machine Learning and how does it differ from AI?',
    answer: 'Artificial Intelligence (AI) is the broad concept of creating machines smart enough to perform human-like tasks. Machine Learning (ML) is a subset of AI where systems learn from data patterns to improve predictions without explicit programming.',
    tags: ['ai', 'machine learning', 'ml', 'technology', 'deep learning']
  },
  {
    id: 'TEC-002',
    category: 'Technology',
    subcategory: 'Cloud Computing',
    question: 'What is Cloud Computing and what are AWS, Azure, and GCP?',
    answer: 'Cloud Computing provides on-demand computing services (servers, storage, databases, networking) over the internet. AWS (Amazon), Azure (Microsoft), and GCP (Google Cloud) are the top public cloud providers.',
    tags: ['cloud', 'aws', 'azure', 'gcp', 'servers', 'technology']
  },
  {
    id: 'TEC-003',
    category: 'Technology',
    subcategory: 'Cybersecurity',
    question: 'What is Phishing and how can you protect yourself?',
    answer: 'Phishing is a cyberattack where fraudulent messages (emails, SMS) impersonate legitimate entities to steal sensitive information like passwords or credit cards. Protect yourself by checking sender email addresses, enabling 2FA, and avoiding suspicious links.',
    tags: ['phishing', 'cybersecurity', 'security', 'scam', 'passwords']
  },

  // --- 6. Products & Shopping ---
  {
    id: 'PRD-001',
    category: 'Products & Shopping',
    subcategory: 'Consumer Rights',
    question: 'What is a warranty and how does it differ from a guarantee?',
    answer: 'A warranty is a legally binding written promise from a manufacturer to repair or replace a defective product within a specified period. A guarantee is often an assurance regarding quality or money-back satisfaction, sometimes without a written legal contract.',
    tags: ['warranty', 'guarantee', 'consumer', 'shopping', 'products']
  },
  {
    id: 'PRD-002',
    category: 'Products & Shopping',
    subcategory: 'E-commerce',
    question: 'How do price tracker tools work for online shopping?',
    answer: 'Price tracker browser extensions and websites (like Keepa or CamelCamelCamel) track historical prices of e-commerce items on sites like Amazon, sending alerts when prices drop below your set target.',
    tags: ['shopping', 'price tracker', 'amazon', 'discounts', 'deals']
  },

  // --- 7. Health & Fitness ---
  {
    id: 'HLT-001',
    category: 'Health & Fitness',
    subcategory: 'Nutrition & Metrics',
    question: 'What is BMI and how is it calculated?',
    answer: 'BMI (Body Mass Index) estimates body fat based on weight and height. Formula: BMI = weight (kg) / [height (m)]². Categories: Underweight (<18.5), Normal (18.5–24.9), Overweight (25–29.9), Obese (30+).',
    tags: ['bmi', 'health', 'weight', 'fitness', 'nutrition']
  },
  {
    id: 'HLT-002',
    category: 'Health & Fitness',
    subcategory: 'Exercise',
    question: 'What is the difference between Aerobic and Anaerobic exercise?',
    answer: 'Aerobic exercises (like jogging, cycling, swimming) rely on oxygen for sustained energy production over longer durations. Anaerobic exercises (like heavy weightlifting or sprinting) involve short, high-intensity bursts powered without immediate oxygen supply.',
    tags: ['aerobic', 'anaerobic', 'exercise', 'cardio', 'fitness', 'health']
  },
  {
    id: 'HLT-003',
    category: 'Health & Fitness',
    subcategory: 'Sleep Hygiene',
    question: 'How many hours of sleep should adults get each night?',
    answer: 'The National Sleep Foundation recommends 7 to 9 hours of quality sleep per night for adults aged 18–64 to support cognitive health, immune function, and physical recovery.',
    tags: ['sleep', 'health', 'wellness', 'recovery', 'sleep hygiene']
  },

  // --- 8. Banking & Finance ---
  {
    id: 'BNK-001',
    category: 'Banking & Finance',
    subcategory: 'Personal Banking',
    question: 'What is a Credit Score and why is it important?',
    answer: 'A credit score (e.g., CIBIL, FICO) is a 3-digit numerical rating (typically 300 to 850) measuring creditworthiness. High scores (750+) grant easier approval and lower interest rates on loans and credit cards.',
    tags: ['credit score', 'fico', 'cibil', 'banking', 'loans', 'finance']
  },
  {
    id: 'BNK-002',
    category: 'Banking & Finance',
    subcategory: 'Digital Banking',
    question: 'What is UPI in digital payments?',
    answer: 'UPI (Unified Payments Interface) is an instant real-time payment system developed by NPCI that enables money transfers directly between bank accounts instantly via mobile apps using Virtual Payment Addresses (VPA) or QR codes.',
    tags: ['upi', 'digital payments', 'banking', 'npci', 'finance']
  },
  {
    id: 'BNK-003',
    category: 'Banking & Finance',
    subcategory: 'Banking Terms',
    question: 'What is the difference between a Savings account and a Checking/Current account?',
    answer: 'Savings accounts earn interest on deposited funds and are meant for long-term growth with transaction limits. Checking/Current accounts are designed for frequent daily transactions with no interest and higher liquidity.',
    tags: ['savings', 'checking', 'current account', 'banking', 'interest']
  },

  // --- 9. Stock Market & Investments ---
  {
    id: 'STK-001',
    category: 'Stock Market & Investments',
    subcategory: 'Mutual Funds',
    question: 'What is a SIP in Mutual Funds?',
    answer: 'A SIP (Systematic Investment Plan) allows investors to invest a fixed amount of money at regular intervals (monthly/quarterly) into a mutual fund scheme, benefiting from rupee-cost averaging and compounding.',
    tags: ['sip', 'mutual funds', 'investing', 'stocks', 'finance'],
    canonicalQuestions: ['What is SIP investment?', 'How does SIP work?']
  },
  {
    id: 'STK-002',
    category: 'Stock Market & Investments',
    subcategory: 'Stock Fundamentals',
    question: 'What is the difference between Stocks and Bonds?',
    answer: 'Stocks represent equity ownership in a company with variable potential returns and higher risk. Bonds are debt instruments issued by corporations or governments where you lend money in exchange for fixed interest income.',
    tags: ['stocks', 'bonds', 'equity', 'debt', 'investing', 'stock market']
  },
  {
    id: 'STK-003',
    category: 'Stock Market & Investments',
    subcategory: 'Index Funds',
    question: 'What is an ETF and how does it differ from a Mutual Fund?',
    answer: 'An ETF (Exchange-Traded Fund) trades on stock exchanges like an individual stock throughout the trading day with fluctuating prices, while traditional Mutual Funds are priced once per day after market close (NAV).',
    tags: ['etf', 'mutual fund', 'index fund', 'trading', 'investments']
  },

  // --- 10. Astrology ---
  {
    id: 'AST-001',
    category: 'Astrology',
    subcategory: 'Zodiac Signs',
    question: 'What are the 12 signs of the Zodiac in western astrology?',
    answer: 'The 12 zodiac signs in chronological order are: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, and Pisces, corresponding to 4 elements (Fire, Earth, Air, Water).',
    tags: ['zodiac', 'astrology', 'horoscope', 'elements', 'astronomy']
  },
  {
    id: 'AST-002',
    category: 'Astrology',
    subcategory: 'Sun vs Moon Sign',
    question: 'What is the difference between a Sun sign and a Moon sign?',
    answer: 'In astrology, your Sun sign represents your core identity, ego, and basic personality based on the position of the Sun at birth. Your Moon sign reflects your inner emotional self, subconscious, and instinctual nature.',
    tags: ['sun sign', 'moon sign', 'astrology', 'horoscope', 'zodiac']
  },

  // --- 11. Agriculture ---
  {
    id: 'AGR-001',
    category: 'Agriculture',
    subcategory: 'Irrigation & Farming',
    question: 'What is Drip Irrigation and why is it efficient?',
    answer: 'Drip irrigation delivers water and nutrients directly to plant root zones through a network of valves and emitters. It minimizes water evaporation and runoff, saving up to 50–70% of water compared to flood irrigation.',
    tags: ['drip irrigation', 'farming', 'water conservation', 'agriculture']
  },
  {
    id: 'AGR-002',
    category: 'Agriculture',
    subcategory: 'Crop Science',
    question: 'What is Crop Rotation and why is it beneficial?',
    answer: 'Crop rotation is the practice of growing different crop species in the same area sequentially across seasons. It improves soil health, replenishes nutrients (e.g. nitrogen fixation via legumes), and reduces pest outbreaks.',
    tags: ['crop rotation', 'soil health', 'organic farming', 'agriculture']
  },

  // --- 12. Government Services ---
  {
    id: 'GOV-001',
    category: 'Government Services',
    subcategory: 'Documentation',
    question: 'What documents are required to apply for a Passport?',
    answer: 'Commonly required documents include Proof of Identity (Aadhaar, Voter ID, SSN), Proof of Birth Date (Birth Certificate, School Certificate), Proof of Address (Utility bill, Bank statement), and passport photos.',
    tags: ['passport', 'government', 'documents', 'identity', 'travel']
  },
  {
    id: 'GOV-002',
    category: 'Government Services',
    subcategory: 'Taxes',
    question: 'What is the purpose of a Tax Identification Number (PAN / SSN)?',
    answer: 'Tax identification numbers (e.g. PAN in India, SSN in the US) track financial transactions, tax liabilities, preventing tax evasion, and enabling official identification for banking and employment.',
    tags: ['pan card', 'ssn', 'tax', 'government', 'finance']
  },

  // --- 13. Transportation ---
  {
    id: 'TRN-001',
    category: 'Transportation',
    subcategory: 'Electric Vehicles',
    question: 'What are the main types of Electric Vehicle (EV) chargers?',
    answer: 'EV chargers are classified into Level 1 (standard AC 120V outlet, slow ~3-5 miles/hr), Level 2 (240V AC charger, 15-30 miles/hr), and Level 3 DC Fast Chargers (80% charge in 20-30 mins).',
    tags: ['ev', 'electric vehicle', 'charging', 'transportation', 'cars']
  },

  // --- 14. Tourism ---
  {
    id: 'TOU-001',
    category: 'Tourism',
    subcategory: 'Travel Hacks',
    question: 'What is the best time to book international flight tickets?',
    answer: 'Studies suggest booking international flights 2 to 6 months in advance yields the best prices. Mid-week departures (Tuesday/Wednesday) and using incognito/private browsing often reveal better deals.',
    tags: ['travel', 'flights', 'tourism', 'booking', 'vacation']
  },

  // --- 15. Food ---
  {
    id: 'FOD-001',
    category: 'Food',
    subcategory: 'Nutrition & Diets',
    question: 'What is the difference between Veganism and Vegetarianism?',
    answer: 'Vegetarians do not eat meat, poultry, or seafood, but may consume dairy and eggs. Vegans strictly exclude ALL animal products, including dairy, eggs, honey, and animal-derived ingredients.',
    tags: ['vegan', 'vegetarian', 'diet', 'food', 'nutrition']
  },

  // --- 16. History ---
  {
    id: 'HIS-001',
    category: 'History',
    subcategory: 'Ancient History',
    question: 'Where was the Indus Valley Civilization located?',
    answer: 'The Indus Valley Civilization (also known as the Harappan Civilization) flourished around 2500–1900 BCE in modern-day Pakistan and northwestern India, renowned for urban planning, drainage systems, and metallurgy.',
    tags: ['indus valley', 'harappa', 'history', 'ancient history', 'india', 'pakistan']
  },

  // --- 17. Culture ---
  {
    id: 'CUL-001',
    category: 'Culture',
    subcategory: 'World Languages',
    question: 'What is the most spoken language in the world by native speakers?',
    answer: 'Mandarin Chinese is the most spoken language by native speakers (~920 million native). English is the most spoken language overall when counting both native and second-language speakers.',
    tags: ['languages', 'mandarin', 'english', 'culture', 'world facts']
  },

  // --- 18. Sports ---
  {
    id: 'SPT-001',
    category: 'Sports',
    subcategory: 'Cricket',
    question: 'What are the main formats of international cricket?',
    answer: 'The three main international cricket formats are Test Cricket (5-day red ball), One Day International (ODI - 50 overs per side), and Twenty20 International (T20I - 20 overs per side).',
    tags: ['cricket', 'test cricket', 'odi', 't20', 'sports']
  },

  // --- 19. Business ---
  {
    id: 'BUS-001',
    category: 'Business',
    subcategory: 'Startups',
    question: 'What is an MVP in startup business?',
    answer: 'An MVP (Minimum Viable Product) is a basic version of a new product with just enough features to satisfy early adopters and gather feedback for future product development with minimal resource expenditure.',
    tags: ['mvp', 'startup', 'business', 'product management', 'entrepreneurship']
  },

  // --- 20. Science ---
  {
    id: 'SCI-001',
    category: 'Science',
    subcategory: 'Biology',
    question: 'What is Photosynthesis and how does it work?',
    answer: 'Photosynthesis is the biological process by which green plants, algae, and chlorophyll-containing bacteria convert sunlight, water, and carbon dioxide into glucose (energy) and release oxygen as a byproduct.',
    tags: ['photosynthesis', 'plants', 'biology', 'science', 'chlorophyll']
  },
  {
    id: 'SCI-002',
    category: 'Science',
    subcategory: 'Physics',
    question: 'What are Newton\'s Three Laws of Motion?',
    answer: '1st Law (Inertia): An object remains at rest or in uniform motion unless acted upon by a force. 2nd Law (F=ma): Force equals mass times acceleration. 3rd Law: For every action, there is an equal and opposite reaction.',
    tags: ['newton', 'laws of motion', 'physics', 'science', 'force']
  },

  // --- 21. General Knowledge ---
  {
    id: 'GK-001',
    category: 'General Knowledge',
    subcategory: 'Time & Calendar',
    question: 'Why do leap years happen every four years?',
    answer: 'Earth takes approximately 365.242 days to orbit the Sun. To account for the extra ~0.25 days per year, an additional leap day (Feb 29) is added every 4 years to keep our calendar aligned with astronomical seasons.',
    tags: ['leap year', 'february 29', 'calendar', 'general knowledge', 'earth']
  },
  {
    id: 'GK-002',
    category: 'General Knowledge',
    subcategory: 'Inventions',
    question: 'Who invented the light bulb?',
    answer: 'Thomas Edison is widely credited with inventing the first commercially practical incandescent light bulb in 1879, though earlier inventors like Joseph Swan also developed similar carbon-filament bulbs.',
    tags: ['light bulb', 'edison', 'inventions', 'history', 'general knowledge']
  }
];
