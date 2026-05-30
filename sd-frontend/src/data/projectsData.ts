import credviaPreview from '../assets/credvia_preview.png';
import orinotesPreview from '../assets/orinotes_preview.png';
import shoplensPreview from '../assets/shoplens_preview.png';
import trinovexPreview from '../assets/trinovex_preview.png';

export interface SystemNode {
  id: string;
  label: string;
  type: 'client' | 'api' | 'db' | 'cdn' | 'worker';
  details: string;
}

export interface SystemConnection {
  from: string;
  to: string;
  dash?: boolean;
}

export interface ProjectCaseStudy {
  id: string;
  title: string;
  tagline: string;
  description: string;
  imageSrc: string;
  status: 'Live' | 'In Development' | 'Prototype' | 'Experimental';
  year: string;
  role: string;
  metrics: string[];
  team: string[];
  techStack: string[];
  features: string[];
  challenges: string;
  solution: string;
  githubUrl?: string;
  liveUrl?: string;
  systemNodes: SystemNode[];
  systemConnections: SystemConnection[];
  accentColor: string; // Tailored glow colors
  stats: {
    latency: string;
    throughput: string;
    health: string;
  };
}

export const projectsCaseStudies: ProjectCaseStudy[] = [
  {
    id: "credvia",
    title: "Credvia",
    tagline: "A professional verification platform for developer proof-of-work and skills.",
    description: "Credvia completely changes how developer skills and portfolios are verified. By designing a developer verification system, Credvia aggregates open-source contributions, proof-of-work visual cards, and verified badges into a single profile. It helps teams easily review engineering credentials while providing high-agency developers with clean, visually stunning proof-of-work portfolios.",
    imageSrc: credviaPreview,
    status: "Live",
    year: "2026",
    role: "Lead Product Engineer",
    metrics: ["500+ Dev Badges Issued", "100% Verified Profiles", "15ms Verification Speed"],
    team: ["Shashwat Dixit", "Parth Parmar"],
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS", "Cryptographic Badges"],
    features: [
      "Dynamic developer portfolio card builder and profile exporter",
      "High-speed GitHub API integration for real-time contribution auditing",
      "Contribution analyzer rating developer activity based on real contributions",
      "Verifiable skills badges with cryptographic proof of work validation"
    ],
    challenges: "Achieving real-time verification and sync speeds without rate-limiting issues, while managing high loads during peak user synchronization bursts.",
    solution: "Architected a decoupled query engine running cached Redis state maps. Offloaded heavy computation tasks to lightweight stateless serverless functions, reducing overall database queries by 82% and ensuring page loading speeds under 150ms.",
    githubUrl: "https://github.com/shashwat/credvia",
    liveUrl: "https://credvia.live",
    accentColor: "rgba(249, 115, 22, 0.4)", // Vivid Orange Glow
    stats: {
      latency: "12ms avg",
      throughput: "24k ops/sec",
      health: "99.99% Uptime"
    },
    systemNodes: [
      { id: "client", label: "Web Client", type: "client", details: "Responsive Next.js UI" },
      { id: "api", label: "Verification Engine", type: "api", details: "Vercel Serverless Gateway" },
      { id: "db", label: "Neon Postgres", type: "db", details: "Prisma Database Layer" },
      { id: "zk", label: "Auth Validator", type: "worker", details: "Verification Worker Node" }
    ],
    systemConnections: [
      { from: "client", to: "api" },
      { from: "api", to: "db" },
      { from: "api", to: "zk", dash: true }
    ]
  },
  {
    id: "orinotes",
    title: "OriNotes",
    tagline: "Academic content platform and note-sharing system for university students.",
    description: "OriNotes is a collaborative learning database designed specifically for university students. It consolidates scattered lecture scripts, handwritten notebook scans, and study guides into a lightning-fast, searchable knowledge bank. Engineered with instant categorization and fast caching, OriNotes makes high-quality study notes easily accessible with peer-verified accuracy.",
    imageSrc: orinotesPreview,
    status: "Live",
    year: "2025",
    role: "Lead Product Engineer",
    metrics: ["300+ Active Students", "5,000+ Notes Shared", "4.9/5 Student Rating"],
    team: ["Shashwat Dixit", "Aashish Jangid"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase", "PostgreSQL", "Cloudinary CDN"],
    features: [
      "Dynamic academic notebook compiler with live markdown rendering",
      "Crowdsourced review engine for student-curated accuracy scores",
      "Intuitive course categorization and unified global textbook search",
      "Stateless high-performance note preview viewer and builder"
    ],
    challenges: "Scaling note upload buffers and image compression pipelines to accommodate high-res document uploads without incurring premium database indexing fees or latency lag during finals week.",
    solution: "Implemented pre-signed direct upload buffers to a headless storage CDN, completely bypassing the web app server. Configured an asynchronous node background queue to auto-compress and tag notes in under 1.2s.",
    githubUrl: "https://github.com/shashwat/orinotes",
    liveUrl: "https://orinotes.academic",
    accentColor: "rgba(59, 130, 246, 0.4)", // Ocean Blue Glow
    stats: {
      latency: "18ms avg",
      throughput: "12.8k files/hr",
      health: "99.98% Online"
    },
    systemNodes: [
      { id: "client", label: "React Client", type: "client", details: "Vite + Tailwind Frontend" },
      { id: "api", label: "Notes API", type: "api", details: "Express Serverless Gateway" },
      { id: "db", label: "Firebase Metadata", type: "db", details: "Realtime Sync Layer" },
      { id: "cdn", label: "Cloudinary CDN", type: "cdn", details: "Pre-signed Upload Buffer" }
    ],
    systemConnections: [
      { from: "client", to: "api" },
      { from: "api", to: "db" },
      { from: "client", to: "cdn", dash: true }
    ]
  },
  {
    id: "shoplens",
    title: "ShopLens",
    tagline: "AI-powered price comparison and marketplace research tool.",
    description: "ShopLens simplifies the ecommerce selection pipeline. By deploying smart web-scraping scripts and lightweight NLP classification models, ShopLens inspects inventory sheets, active discount tables, and real-time user reviews across retail stores. It outputs a clean, consolidated comparison dashboard, enabling smart purchasing choices in seconds.",
    imageSrc: shoplensPreview,
    status: "Prototype",
    year: "2025",
    role: "Software Engineer",
    metrics: ["40+ Stores Scraped", "0.4s NLP Analysis", "94% Match Accuracy"],
    team: ["Shashwat Dixit", "Parth Parmar"],
    techStack: ["React", "FastAPI", "Tailwind CSS", "PostgreSQL", "Python NLP", "BeautifulSoup"],
    features: [
      "Interactive multi-platform product price matching timeline",
      "Semantic feedback classifier filtering organic reviews from fake scripts",
      "Dynamic comparison grid with custom spec highlighting",
      "Automated stock-change webhooks triggering instant client alerts"
    ],
    challenges: "Evading modern bot-detection scripts during parallel market scrapings while maintaining rapid NLP sentiment extractions in under half a second on low-tier hosting.",
    solution: "Crafted an asynchronous scraping rotation framework mimicking real human scrolls. Coupled it with a pre-trained, cached HuggingFace pipeline which loads instantly into shared RAM instances, shrinking execution from 3.2s to 420ms.",
    githubUrl: "https://github.com/shashwat/shoplens",
    accentColor: "rgba(139, 92, 246, 0.4)", // Electric Purple Glow
    stats: {
      latency: "420ms nlp",
      throughput: "3.5k scrapes/min",
      health: "Prototype Active"
    },
    systemNodes: [
      { id: "client", label: "ShopLens UI", type: "client", details: "React Dashboard Panel" },
      { id: "api", label: "FastAPI Gateway", type: "api", details: "Python Scraping Core" },
      { id: "db", label: "Scrape Cache", type: "db", details: "PostgreSQL Database" },
      { id: "nlp", label: "NLP Classifier", type: "worker", details: "HuggingFace Sentiment Pipeline" }
    ],
    systemConnections: [
      { from: "client", to: "api" },
      { from: "api", to: "db" },
      { from: "api", to: "nlp" }
    ]
  },
  {
    id: "trinovex",
    title: "TrinoVex",
    tagline: "Interactive workflow builder and visual canvas for modern teams.",
    description: "TrinoVex is a smooth, interactive canvas designed for teams to map out workflows, visual systems, and dependencies. Built with absolute performance in mind, it provides a gorgeous drag-and-drop workspace that bridges the gap between database layouts and visual developer workspaces.",
    imageSrc: trinovexPreview,
    status: "In Development",
    year: "2026",
    role: "Founder & Developer",
    metrics: ["Frame-accurate Rendering", "High Performance Layouts", "Infinite Canvas Grid"],
    team: ["Shashwat Dixit"],
    techStack: ["React", "TypeScript", "Framer Motion", "Tailwind CSS", "Zustand State", "HTML5 Canvas"],
    features: [
      "Infinite dynamic panning & zooming vector design canvas",
      "Interactive node linker drawing custom bezier connections on the fly",
      "Local state coordination via Zustand preventing visual micro-stuttering",
      "JSON schema importer and exporter mapping design trees instantly"
    ],
    challenges: "Preventing laggy screen re-renders during high-volume node drags (over 100 concurrent nodes) while maintaining layout filters across the workspace canvas.",
    solution: "Offloaded drag-state coordinate tracking to standard mutable refs and rendered connection lines on an optimized HTML5 Canvas layer. Combined with Zustand's atomic state selectors to achieve a smooth 60fps experience.",
    githubUrl: "https://github.com/shashwat/trinovex",
    accentColor: "rgba(236, 72, 153, 0.4)", // Hot Pink Glow
    stats: {
      latency: "0.2ms state",
      throughput: "60fps locked",
      health: "Development Active"
    },
    systemNodes: [
      { id: "client", label: "Infinite Canvas", type: "client", details: "React + HTML5 Canvas Workspace" },
      { id: "api", label: "Node State", type: "api", details: "Atomic Zustand Stores" },
      { id: "worker", label: "Physics Engine", type: "worker", details: "Bezier Collision Processor" }
    ],
    systemConnections: [
      { from: "client", to: "api" },
      { from: "api", to: "worker", dash: true }
    ]
  }
];
