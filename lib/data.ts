export type ProjectState = "live" | "building" | "shipped";

export type Project = {
  id: string;
  name: string;
  meta: string;
  state: ProjectState;
  body: string[];
  learned: string;
  tags: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    id: "job-tracker",
    name: "Job Application Tracker",
    meta: "Spring Boot · PostgreSQL · React",
    state: "live",
    body: [
      "A tracker for job applications where a status change isn't an overwrite. Every move — applied, screening, interview, offer, rejected — is written as its own event, so the app keeps the entire history and renders it as a timeline instead of showing you one word and forgetting the rest.",
      "Java and Spring Boot behind a REST API, JWT for auth, PostgreSQL for storage, React and Vite on the front. The API runs in Docker on Render, the database sits on Neon.",
    ],
    learned:
      "Designing for history up front is cheaper than reconstructing it later. Also that \"it works locally\" and \"it works in a container in Singapore\" are two different claims.",
    tags: ["Java", "Spring Boot", "PostgreSQL", "React", "Vite", "JWT", "Docker", "Render", "Neon"],
    links: [
      { label: "Repository", href: "https://github.com/Jidxesh/job-application-tracker" },
      { label: "Live API", href: "https://job-application-tracker-wbky.onrender.com" },
    ],
  },
  {
    id: "workflow-engine",
    name: "Workflow Engine",
    meta: "Node.js · Express · PostgreSQL",
    state: "building",
    body: [
      "An approval engine for businesses that don't all approve things the same way. A team defines its own chain — who signs off on an invoice, how a leave request escalates, which purchases need a second pair of eyes — and the engine routes each request through it.",
      "Express on Node with PostgreSQL underneath. The interesting part is modelling a workflow as data rather than code, so adding a new approval type doesn't mean a deploy.",
    ],
    learned:
      "How much of \"enterprise software\" is really a state machine plus permissions, and how quickly that gets hard once real orgs are involved.",
    tags: ["Node.js", "Express", "PostgreSQL", "REST", "State machines"],
    links: [{ label: "GitHub profile", href: "https://github.com/Jidxesh" }],
  },
  {
    id: "resume-analyzer",
    name: "Resume Analyzer",
    meta: "Flask · Claude API · pdfplumber",
    state: "shipped",
    body: [
      "Upload a resume as a PDF, get back structured feedback instead of a score out of ten. pdfplumber pulls the text out page by page, and the Claude API turns it into specific, readable notes on what's missing and what's vague.",
    ],
    learned:
      "The model was the easy half. Validating that a file really is a PDF, handling the ones that are just scanned images, and keeping an API key out of the repo took longer than the prompt ever did.",
    tags: ["Python", "Flask", "Anthropic API", "pdfplumber"],
    links: [{ label: "GitHub profile", href: "https://github.com/Jidxesh" }],
  },
  {
    id: "chat",
    name: "Real-time Chat",
    meta: "Kotlin · Compose · Firestore",
    state: "shipped",
    body: [
      "A one-to-one Android messenger built in Compose on top of Firestore. Typing indicators, paginated message history so a long thread doesn't load itself into oblivion, and image messaging. Dependencies wired by hand rather than through a framework, to actually understand what injection is doing.",
    ],
    learned:
      "Real-time is mostly listener lifecycles. Getting the messages to arrive was easy; getting them to stop arriving when the screen is gone was not.",
    tags: ["Kotlin", "Jetpack Compose", "Firebase", "Firestore", "Manual DI"],
    links: [{ label: "GitHub profile", href: "https://github.com/Jidxesh" }],
  },
  {
    id: "phonepe",
    name: "PhonePe Transaction Insights",
    meta: "Python · scikit-learn · Streamlit",
    state: "shipped",
    body: [
      "An end-to-end look at digital payment data: exploratory analysis first, then a Random Forest model, then a Streamlit dashboard so the findings could be clicked through instead of read off a notebook.",
    ],
    learned:
      "The analysis is worth roughly nothing until someone who isn't you can navigate it. Half the work was the dashboard.",
    tags: ["Python", "pandas", "scikit-learn", "Random Forest", "Streamlit"],
    links: [{ label: "GitHub profile", href: "https://github.com/Jidxesh" }],
  },
];

export const stackGroups = [
  {
    title: "Strongest",
    note: "App development — where I've built the most.",
    items: ["Kotlin", "Jetpack Compose", "Android SDK", "Firebase", "Firestore", "Java", "Git"],
  },
  {
    title: "Learning: full-stack",
    note: "Currently building with these, docs open.",
    items: ["React", "TypeScript", "Next.js", "Node.js", "Express", "Spring Boot", "PostgreSQL", "REST APIs", "JWT"],
  },
  {
    title: "Learning: AI/ML",
    note: "From my internship and data projects.",
    items: ["Python", "pandas", "NumPy", "scikit-learn", "Flask", "Streamlit", "EDA"],
  },
  {
    title: "Around the work",
    note: "Where things get written, stored and deployed.",
    items: ["VS Code", "Cursor", "Android Studio", "pgAdmin", "Postman", "Docker", "Render", "Neon", "Vercel"],
  },
];

export const timeline = [
  {
    when: "2021 — 2024",
    title: "Diploma in Computer Engineering, MSBTE",
    body: "Three years of fundamentals and the first code I wrote that other people had to run.",
  },
  {
    when: "2023",
    title: "Python Developer Intern, Servify",
    body: "First time writing code inside someone else's codebase, with someone else's conventions.",
  },
  {
    when: "2024 — 2025",
    title: "App Lead, Google Developer Groups On Campus ACE",
    body: "Ran app development for the campus chapter — sessions, project guidance, and a lot of debugging other people's Gradle files.",
  },
  {
    when: "2024 — 2027",
    title: "B.E. Computer Engineering, University of Mumbai",
    body: "In progress, with most of the real learning happening in side projects.",
  },
  {
    when: "2026",
    title: "AI/ML Intern, Labmentix",
    body: "Applied machine learning on real data — the work that led to the PhonePe analysis.",
  },
  {
    when: "Now",
    title: "App developer, learning full-stack and AI/ML",
    body: "Android is where I'm strongest. Alongside it I'm building web projects to get properly good at full-stack, and carrying the ML work forward from my internship.",
    now: true,
  },
];

export const pipeline = [
  { title: "Diploma", note: "MSBTE, 2021—2024" },
  { title: "Internships", note: "Servify, Labmentix" },
  { title: "Degree", note: "Mumbai University, 2027" },
  { title: "App dev, learning more", note: "Current state", live: true },
];

export const rotatorPhrases = [
  "AI and ML",
  "how systems fit together",
  "what breaks in production",
  "by shipping things",
];

export const marqueeTech = [
  "Kotlin", "Jetpack Compose", "Java", "Spring Boot", "React", "TypeScript", "Next.js",
  "Node.js", "Express", "PostgreSQL", "Firebase", "Python", "scikit-learn", "Streamlit",
  "Docker", "MongoDB", "JWT", "Git",
];

export const marqueeHabits = [
  "ships on weekends", "reads the stack trace twice", "breaks it on purpose",
  "keeps the migration files", "learns in public", "answers emails",
  "prefers running code", "argues about schemas",
];

export const terminalLines: { kind: "q" | "o" | "k"; text: string }[] = [
  { kind: "q", text: "jidnesh --whoami" },
  { kind: "o", text: "App developer · Full-stack · Learning AI/ML · Mumbai" },
  { kind: "q", text: "jidnesh --stack" },
  { kind: "o", text: "kotlin · java · spring boot · react · node · postgres · python" },
  { kind: "q", text: "jidnesh --status" },
  { kind: "k", text: "open to internships — building a workflow engine right now" },
];

export const links = {
  github: "https://github.com/Jidxesh",
  linkedin: "https://linkedin.com/in/jidnesh-chavan-7b9b85293",
  instagram: "https://instagram.com/jidxesh",
  email: "Jidneshchavan7@gmail.com",
  discord: ".111yooo",
  discordName: "Jidxesh",
  liveApi: "https://job-application-tracker-wbky.onrender.com",
  resume: "/resume.pdf",
};

export const sections = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "case", label: "Case" },
  { id: "stack", label: "Stack" },
  { id: "path", label: "Path" },
  { id: "play", label: "Play" },
  { id: "contact", label: "Contact" },
];
