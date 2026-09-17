export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  tech: string[];
  category: 'aiml' | 'web';
  role?: string;
  period?: string;
}

export interface Skill {
  name: string;
  level: number; // Percentage for progress bars
  category: 'languages' | 'web' | 'tools' | 'ai' | 'other';
}

export interface Education {
  institution: string;
  degree: string;
  duration: string;
  specialization: string;
  gpa?: string;
  location?: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  bullets: string[];
  techUsed?: string[];
}

export interface Certification {
  title: string;
  provider: string;
  date: string;
  link?: string;
  skillsAcquired?: string[];
}

export interface Achievement {
  title: string;
  award: string;
  event: string;
  year: string;
  description?: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  status?: string;
}

export const personalInfo = {
  name: "Darsh Ohri",
  title: "B.Tech Computer Science student specializing in Data Science",
  subTitle: "Aspiring Software Developer • ACM Cultural Coordinator • Hackathon Developer",
  university: "SVKM's NMIMS Chandigarh",
  duration: "2025–2029",
  location: "Chandigarh, India",
  email: "darshohri@gmail.com",
  github: "github.com/darshohri",
  linkedin: "linkedin.com/in/darsh-ohri",
  leetcode: "leetcode.com/u/darshohri",
  aboutShort: "I am a Computer Science & Engineering student specializing in Data Science. I am passionate about building clean, high-performance web applications and connecting them with intelligent backend systems.",
  aboutLong: [
    "I am a Computer Science & Engineering undergraduate at SVKM's NMIMS Chandigarh, specializing in Data Science. My academic focus areas include practical software engineering, web application development, and data analytics pipelines.",
    "I build functional web applications and interactive systems. For Hack-O-Mania 2.0, I co-developed Lumiere, a patient record-matching platform that connects a React frontend with identity resolution backend APIs, reducing manual record audits by 18 seconds per entry. I also design clean UI components and offline-first developer utilities.",
    "Beyond coding, I serve as the Cultural Coordinator for our ACM Student Chapter, organizing technical events and workshops for over 300 student members. I also enjoy creating short-form video content and managing social media campaigns."
  ]
};

export const skillsList: Skill[] = [
  // Programming Languages
  { name: "Python", level: 85, category: "languages" },
  { name: "Java", level: 80, category: "languages" },
  { name: "JavaScript", level: 78, category: "languages" },
  { name: "C", level: 75, category: "languages" },
  
  // Web Development
  { name: "HTML5 / CSS3", level: 90, category: "web" },
  { name: "Next.js", level: 65, category: "web" },

  // Tools & Software
  { name: "VS Code", level: 92, category: "tools" },
  { name: "Git & Version Control", level: 82, category: "tools" },
  { name: "GitHub", level: 85, category: "tools" },
  { name: "Adobe Premiere Pro", level: 88, category: "tools" },
  { name: "Canva", level: 90, category: "tools" },

  // AI Tools
  { name: "Prompt Engineering", level: 95, category: "ai" },
  { name: "Antigravity Dev-Flows", level: 90, category: "ai" },
  { name: "FastAPI integrations", level: 70, category: "ai" },

  // Other Skills
  { name: "Video Narrative & Editing", level: 88, category: "other" },
  { name: "Social Media Outreach", level: 85, category: "other" },
  { name: "Leadership Hubs", level: 92, category: "other" },
  { name: "Event Organizing", level: 90, category: "other" },
  { name: "Public Speaking", level: 85, category: "other" },
];

export const educationList: Education[] = [
  {
    institution: "SVKM's NMIMS Chandigarh",
    degree: "B.Tech – Computer Science & Engineering",
    specialization: "Data Science Specialization",
    duration: "2025 – 2029",
    location: "Punjab/Chandigarh, India",
    gpa: "Current Undergrad"
  }
];

export const projectsList: Project[] = [
  {
    id: "byok",
    title: "BYOK",
    subtitle: "Offline-First AI Assistant",
    description: "Engineered a local web interface for LLMs using the @google/genai SDK, supporting secure browser-side key management, offline markdown chat histories, and custom system prompt tuning.",
    period: "Independent Development",
    role: "Lead Systems Architect",
    details: [
      "Built an offline-first chat interface using React and Vite, storing conversations in local indexedDB to ensure data never leaves the device.",
      "Implemented client-side API key configuration utilizing the official @google/genai SDK, allowing users to safely connect their own credentials.",
      "Configured custom temperature controls and structured JSON output schemas to guarantee predictable text responses for data extraction tasks."
    ],
    tech: ["Gemini API", "@google/genai", "React", "TypeScript", "IndexedDB"],
    category: "aiml"
  },
  {
    id: "lumiere",
    title: "Lumiere",
    subtitle: "Healthcare Patient Identity Resolver",
    description: "Created a patient record matching system for Hack-O-Mania 2.0 that reconciles duplicate records across disparate health databases.",
    period: "Hack-O-Mania 2.0 | Team of 5",
    role: "Core Frontend Engineer",
    details: [
      "Co-designed the frontend interface in React to compare mismatched patient entries (e.g. name spellings, birthdates) with side-by-side visual diffs.",
      "Connected the client view state to a FastAPI backend that runs identity resolution algorithms, achieving an 18-second reduction in manual record audits.",
      "Built and pitched the interactive system demo to a panel of 4 healthcare industry judges at SVKM NMIMS Chandigarh."
    ],
    tech: ["Next.js", "FastAPI", "Python", "PostgreSQL", "Tailwind CSS"],
    category: "aiml"
  },
  {
    id: "campus-connect",
    title: "Campus Connect",
    subtitle: "Student Mentorship Platform",
    description: "Developed a responsive web application to match university students with alumni mentors for career coaching and networking.",
    period: "Independent Development",
    role: "Lead Frontend Engineer",
    details: [
      "Created high-fidelity search filters using React to match students with mentors based on 12 distinct skills and industry backgrounds.",
      "Implemented responsive layouts with pure Tailwind CSS, improving page load speeds by 25% by reducing unused style dependencies.",
      "Built interactive dashboard panels for students to schedule virtual sessions and track conversation milestones with mentors."
    ],
    tech: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS", "Flexbox/Grid"],
    category: "web"
  },
  {
    id: "nutridish",
    title: "NutriDish",
    subtitle: "Nutrition Tracker & Meal Planner",
    description: "Built an adaptive meal planning platform that helps users analyze ingredient nutrition and monitor daily calorie limits.",
    period: "Academic Project",
    role: "Full-Stack Developer",
    details: [
      "Constructed a recipe management dashboard in Java that calculates precise total calories and macro ratios (carbs, proteins, fats).",
      "Built automated meal schedule recommendations that format daily intake metrics onto interactive, high-contrast Tailwind cards.",
      "Connected third-party food database APIs to fetch real-time nutritional information for over 500 standard ingredients."
    ],
    tech: ["Java", "HTML5", "CSS3", "JavaScript", "Nutrition APIs"],
    category: "web"
  }
];

export const experienceList: Experience[] = [
  {
    company: "ACM Student Chapter",
    role: "Cultural Coordinator",
    duration: "September 2025 – Present",
    bullets: [
      "Lead cross-departmental teams to manage, orchestrate, and host community events, fostering strong technical and interpersonal bonds among 300+ chapter members.",
      "Liaise directly with SVKM directors, ACM chairs, and international advisors to coordinate speaker logistics, and execute weekly code circles."
    ],
    techUsed: ["Event Operations", "Public Speaking", "Community Operations"]
  },
  {
    company: "Management Analytics Gateway (MAG)",
    role: "Social Media Marketing Intern",
    duration: "January 2026 – March 2026",
    bullets: [
      "Produced and dynamically directed high-impact short-form video commercials, elevating visual storytelling frameworks.",
      "Co-managed social media content pipelines, resulting in organic community interaction gains via target-audience analytics."
    ],
    techUsed: ["Premiere Pro", "Canva", "Video Narratives", "Audience Targeting"]
  }
];

export const achievementsList: Achievement[] = [
  {
    title: "ANVIKSHA 2.0 Quiz Winner",
    award: "1st Position",
    event: "Array Pata Hai? Quiz Competition",
    year: "2025",
    description: "Won 1st place in a multi-round, fast-paced general knowledge and trivia-driven quiz competition featuring various categories and questions."
  },
  {
    title: "U-Genius 2.0 National Finalist",
    award: "1st Position",
    event: "Union Bank of India Quiz Competition",
    year: "2023",
    description: "Won regional qualifiers and advanced as key division representative for general intellect and strategic analytics."
  },
  {
    title: "Cultural Coordinator",
    award: "ACM Chapter Position Selection",
    event: "SVKM NMIMS Chandigarh ACM Club",
    year: "2025",
    description: "Voted Cultural Coordinator based on public speaking presence, academic compliance, and event management credentials."
  },
  {
    title: "Organizing Committee Key Member",
    award: "IICTDS Representative",
    event: "International Conference on Technological Data Systems",
    year: "2025",
    description: "Managed coordinate logistics, speaker portfolios, technology audio-visual setups, and guest director reception."
  }
];

export const certificationsList: Certification[] = [
  {
    title: "GenAI Powered Data Analytics",
    provider: "Tata",
    date: "2026",
    link: "https://www.theforage.com/completion-certificates/ifobHAoMjQs9s6bKS/gMTdCXwDdLYoXZ3wG_ifobHAoMjQs9s6bKS_6a1028614d281cf98fa77e1c_1779963275361_completion_certificate.pdf",
    skillsAcquired: ["Data Visualization", "AI Pipeline Construction", "Analytical Interpretation"]
  },
  {
    title: "Quantitative Research Simulation",
    provider: "J.P. Morgan Chase & Co.",
    date: "2026",
    link: "https://www.theforage.com/completion-certificates/Sj7temL583QAYpHXD/bWqaecPDbYAwSDqJy_Sj7temL583QAYpHXD_6a1028614d281cf98fa77e1c_1780073282252_completion_certificate.pdf",
    skillsAcquired: ["Algorithmic Evaluation", "Statistical Modeling", "Python Performance Testing"]
  },
  {
    title: "Technology Job Simulation",
    provider: "Deloitte Australia",
    date: "2026",
    link: "https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/udmxiyHeqYQLkTPvf_9PBTqmSxAf6zZTseP_6a1028614d281cf98fa77e1c_1780156970527_completion_certificate.pdf",
    skillsAcquired: ["Cloud Security Analysis", "System Blueprint Design", "Client Presentations"]
  }
];

export const timelineList: TimelineItem[] = [
  {
    year: "2023",
    title: "National Quiz Qualifier",
    description: "Won the Union Bank U-Genius 2.0 Quiz Competition. Solidified a love for core computer science data, trivia, and fast intellectual response."
  },
  {
    year: "2025",
    title: "Undergrad at NMIMS & ACM Cultural Lead",
    description: "Joined SVKM's NMIMS B.Tech CSE in Chandigarh. Voted Cultural Coordinator of the ACM Chapter. Appointed IICTDS Organizing Committee representative. Championed ANVIKSHA 2.0 Array Pata Hai? Quiz."
  },
  {
    year: "2026",
    title: "Fusing Media and Technical Internships",
    description: "Joined Management Analytics Gateway (MAG) as Social Media Intern. Gained industry simulator certifications from Tata (GenAI), Deloitte (Cloud), and J.P. Morgan (Quantitative Research) to cement Data Science and Dev workflows."
  }
];
