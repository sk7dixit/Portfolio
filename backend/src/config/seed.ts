import prisma from './db';
import bcrypt from 'bcryptjs';

export const seedDatabase = async () => {
  try {
    // 1. Check if themes exist
    const themeCount = await prisma.theme.count();
    let terminalTheme, glassTheme, brutalTheme;

    if (themeCount === 0) {
      console.log('🌱 Seeding default themes...');
      terminalTheme = await prisma.theme.create({
        data: {
          themeName: 'Terminal Cockpit',
          primaryColor: '#10b981', // Emerald green
          backgroundType: 'dark',
          fontFamily: 'JetBrains Mono',
          animationType: 'terminal',
        },
      });

      glassTheme = await prisma.theme.create({
        data: {
          themeName: 'Glassmorphic Velvet',
          primaryColor: '#a78bfa', // Violet
          backgroundType: 'glassmorphic',
          fontFamily: 'Inter',
          animationType: 'fade',
        },
      });

      brutalTheme = await prisma.theme.create({
        data: {
          themeName: 'Brutalist Retro',
          primaryColor: '#000000', // Black
          backgroundType: 'light',
          fontFamily: 'Space Mono',
          animationType: 'spring',
        },
      });
      console.log('✅ Default themes seeded.');
    } else {
      // Get existing themes
      const themes = await prisma.theme.findMany();
      terminalTheme = themes.find(t => t.themeName === 'Terminal Cockpit') || themes[0];
      glassTheme = themes.find(t => t.themeName === 'Glassmorphic Velvet') || themes[0];
      brutalTheme = themes.find(t => t.themeName === 'Brutalist Retro') || themes[0];
    }

    // 2. Check if users exist
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('🌱 Seeding demo developer user...');
      const hashedPassword = await bcrypt.hash('MSK@181911', 12);

      const user = await prisma.user.create({
        data: {
          name: 'Shashwat',
          email: 'trinovex@gmail.com',
          password: hashedPassword,
          role: 'PORTFOLIO_USER',
          portfolioSlug: 'shashwat',
          themeId: terminalTheme.id,
          profile: {
            create: {
              headline: 'Hi, I build high-agency backend systems & real AI agents',
              bio: 'A product-minded software developer specializing in scalable distributed architectures, LLM orchestration, and modern engineering design. Shipping velocity and execution are my core indicators.',
              github: 'https://github.com',
              linkedin: 'https://linkedin.com',
              twitter: 'https://twitter.com',
            },
          },
        },
      });

      // Seed Skills
      console.log('🌱 Seeding developer skills...');
      await prisma.skill.createMany({
        data: [
          { userId: user.id, skillName: 'Node.js & Express', skillLevel: 9, category: 'Backend' },
          { userId: user.id, skillName: 'PostgreSQL & Prisma', skillLevel: 9, category: 'Backend' },
          { userId: user.id, skillName: 'LLM Orchestration', skillLevel: 8, category: 'AI & Data' },
          { userId: user.id, skillName: 'React & Vite', skillLevel: 8, category: 'Frontend' },
          { userId: user.id, skillName: 'Tailwind CSS', skillLevel: 9, category: 'Frontend' },
          { userId: user.id, skillName: 'Docker & AWS', skillLevel: 7, category: 'DevOps' },
        ],
      });

      // Seed Projects
      console.log('🌱 Seeding developer projects...');
      await prisma.project.createMany({
        data: [
          {
            userId: user.id,
            title: 'TraveLoop Agency Platform',
            description: 'Cinematic multi-agent travel orchestration engine providing real-time scheduling, dynamic live map routing, and automated hotel/flight settlement.',
            techStack: ['React', 'Vite', 'Node.js', 'FastAPI', 'PostgreSQL'],
            githubUrl: 'https://github.com',
            liveUrl: 'https://traveloop.dev',
            thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            featured: true,
          },
          {
            userId: user.id,
            title: 'Credvia Core Ledger',
            description: 'A transactional double-entry ledger platform offering automatic risk scoring, instant verification, and direct digital token bank deposits.',
            techStack: ['TypeScript', 'Express', 'Neon Postgres', 'Redis'],
            githubUrl: 'https://github',
            liveUrl: 'https://credvia7.netlify.app',
            thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
            featured: true,
          },
        ],
      });

      // Seed visitors analytics
      console.log('🌱 Seeding visitors analytics mock logs...');
      const profile = await prisma.portfolioProfile.findUnique({
        where: { userId: user.id },
      });
      if (profile) {
        await prisma.analytics.createMany({
          data: [
            { portfolioId: profile.id, visitorIp: '184.22.4.99', country: 'United States', device: 'Desktop' },
            { portfolioId: profile.id, visitorIp: '103.5.150.12', country: 'India', device: 'Mobile' },
            { portfolioId: profile.id, visitorIp: '44.204.11.19', country: 'Canada', device: 'Desktop', clickedProject: 'TraveLoop Agency Platform' },
          ],
        });
      }

      console.log('✅ Demo developer and assets successfully seeded.');
      console.log('👉 Username: trinovex@gmail.com | Password: MSK@181911');
    }

    // Ensure 'mahi' user exists for the main portfolio frontend
    const mahiUser = await prisma.user.findUnique({
      where: { portfolioSlug: 'mahi' }
    });
    if (!mahiUser) {
      console.log('🌱 Seeding primary developer user (Mahi Singh)...');
      const hashedPassword = await bcrypt.hash('mahi123', 12);
      const user = await prisma.user.create({
        data: {
          name: 'Mahi Singh',
          email: 'mahimanoj1107@gmail.com',
          password: hashedPassword,
          role: 'PORTFOLIO_USER',
          portfolioSlug: 'mahi',
          themeId: terminalTheme.id,
          profile: {
            create: {
              headline: 'Hi, I build high-agency systems & real AI agents',
              bio: 'A product-minded software developer specializing in scalable distributed architectures, LLM orchestration, and modern engineering design.',
              github: 'https://github.com/mahi1107',
              linkedin: 'https://linkedin.com/in/mahi-singh-b772382b4',
              resumeUrl: 'https://res.cloudinary.com/dcicmdzja/raw/upload/v1779380819/resumes/de2rslfarmqs8zq2jpn0',
            },
          },
        },
      });

      // Seed Skills for Mahi
      await prisma.skill.createMany({
        data: [
          { userId: user.id, skillName: 'Node.js & Express', skillLevel: 9, category: 'Backend' },
          { userId: user.id, skillName: 'PostgreSQL & Prisma', skillLevel: 9, category: 'Backend' },
          { userId: user.id, skillName: 'LLM Orchestration', skillLevel: 8, category: 'AI & Data' },
          { userId: user.id, skillName: 'React & Vite', skillLevel: 8, category: 'Frontend' },
          { userId: user.id, skillName: 'Tailwind CSS', skillLevel: 9, category: 'Frontend' },
          { userId: user.id, skillName: 'Docker & AWS', skillLevel: 7, category: 'DevOps' },
        ],
      });

      // Seed Projects for Mahi
      await prisma.project.createMany({
        data: [
          {
            userId: user.id,
            title: 'Accident Hotspot Detection System',
            description: 'A smart map application that uses location clustering to find high-risk traffic zones and alert travelers in real time.',
            techStack: ['React', 'Python', 'Flask', 'PostgreSQL', 'Leaflet Maps'],
            githubUrl: 'https://github.com/mahi1107',
            liveUrl: '#',
            thumbnail: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80',
            featured: true,
          },
          {
            userId: user.id,
            title: 'Traveloop AI Travel Planner',
            description: 'An AI-powered travel planner that designs custom trip routes, suggests popular local spots, and sets up daily schedules automatically.',
            techStack: ['Next.js', 'Gemini LLM', 'MongoDB', 'Framer Motion'],
            githubUrl: 'https://github.com/mahi1107',
            liveUrl: '#',
            thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
            featured: true,
          },
        ],
      });
      console.log('✅ Mahi Singh successfully seeded.');
    }

    // Ensure 'khushaboo' user exists for the portfolio frontend
    const khushabooUser = await prisma.user.findUnique({
      where: { portfolioSlug: 'khushaboo' }
    });
    if (!khushabooUser) {
      console.log('🌱 Seeding khushaboo developer user (Khushaboo Saini)...');
      const hashedPassword = await bcrypt.hash('khushaboo123', 12);
      const user = await prisma.user.create({
        data: {
          name: 'Khushaboo Saini',
          email: 'khushboosaini066@gmail.com',
          password: hashedPassword,
          role: 'PORTFOLIO_USER',
          portfolioSlug: 'khushaboo',
          themeId: terminalTheme.id, // defaults to terminal theme
          profile: {
            create: {
              headline: 'Full Stack Developer & UI Specialist',
              bio: 'Building scalable web applications with modern frontend experiences, robust server architectures, clean route models, and persistent databases.',
              github: 'https://github.com/Khushboo-Saini',
              linkedin: 'https://www.linkedin.com/in/khushaboo-saini',
              resumeUrl: 'https://res.cloudinary.com/dcicmdzja/raw/upload/v1779380819/resumes/de2rslfarmqs8zq2jpn0',
            },
          },
        },
      });

      // Seed Skills for Khushaboo
      await prisma.skill.createMany({
        data: [
          { userId: user.id, skillName: 'React & Component Architecture', skillLevel: 9, category: 'Frontend' },
          { userId: user.id, skillName: 'Tailwind CSS & Responsive UI', skillLevel: 9, category: 'Frontend' },
          { userId: user.id, skillName: 'Node.js & Express.js', skillLevel: 8, category: 'Backend' },
          { userId: user.id, skillName: 'MongoDB & Schema Design', skillLevel: 8, category: 'Backend' },
          { userId: user.id, skillName: 'Java & OOPs Principles', skillLevel: 8, category: 'Backend' },
        ],
      });

      // Seed Projects for Khushaboo
      await prisma.project.createMany({
        data: [
          {
            userId: user.id,
            title: 'ShopLens Marketplace',
            description: 'A localized peer-to-peer marketplace system facilitating secure catalog listings, intelligent location routing, and seller database persistence.',
            techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
            githubUrl: 'https://github.com/Khushboo-Saini',
            liveUrl: '#',
            thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
            featured: true,
          },
        ],
      });
      console.log('✅ Khushaboo Saini successfully seeded.');
    }

    // Ensure all 3 portfolios have high-fidelity visual builder defaults populated if null
    const allUsers = await prisma.user.findMany({
      include: { profile: true }
    });

    for (const u of allUsers) {
      if (u.profile) {
        let needsUpdate = false;
        const updateData: any = {};

        if (!u.profile.heroSection) {
          needsUpdate = true;
          if (u.portfolioSlug === 'shashwat') {
            updateData.heroSection = {
              title: "Hi, I'm Shashwat Dixit",
              descOne: "I'm a full-stack developer and product builder focused on creating modern web applications, AI-powered tools, and scalable backend systems.",
              descTwo: "My work combines clean architecture, interactive frontend experiences, and performance-driven engineering to transform ideas into production-ready products.",
              image: "/uploads/portfolio/sd/hero-image.webp"
            };
          } else if (u.portfolioSlug === 'khushaboo') {
            updateData.heroSection = {
              title: "Hi, I'm Khushaboo Saini",
              descOne: "I'm a frontend developer and UI/UX specialist who crafts highly interactive, responsive, and robust web applications.",
              descTwo: "I enjoy structuring reusable components, clean layouts, and integrating them with solid Express and MongoDB backends.",
              image: "/uploads/portfolio/ks/hero-image.webp"
            };
          } else if (u.portfolioSlug === 'mahi') {
            updateData.heroSection = {
              title: "Hi, I'm Mahi Singh",
              descOne: "I'm a full-stack developer and AI systems developer focused on building smart applications, API orchestrators, and responsive user interfaces.",
              descTwo: "My goal is to construct efficient database engines, smooth microservices, and AI-enabled travel planners that deliver real value.",
              image: "/uploads/portfolio/ms/hero-image.webp"
            };
          }
        }

        if (!u.profile.techStack || u.profile.techStack.length === 0) {
          needsUpdate = true;
          if (u.portfolioSlug === 'shashwat') {
            updateData.techStack = ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Express", "Tailwind", "Cloudinary", "AI/ML"];
          } else if (u.portfolioSlug === 'khushaboo') {
            updateData.techStack = ["React", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Java", "OOPs"];
          } else if (u.portfolioSlug === 'mahi') {
            updateData.techStack = ["React", "Node.js", "Express", "Python", "Flask", "PostgreSQL", "MongoDB", "Framer Motion"];
          }
        }

        if (!u.profile.statsCards) {
          needsUpdate = true;
          if (u.portfolioSlug === 'shashwat') {
            updateData.statsCards = [
              { value: "01+", title: "Years Building", subtitle: "Modern web applications", icon: "Clock", color: "purple", visible: true },
              { value: "10+", title: "Projects Built", subtitle: "Full-stack & AI systems", icon: "Layers", color: "purple", visible: true },
              { value: "Full-Stack", title: "Specialization", subtitle: "Frontend + Backend Architecture", icon: "Cpu", color: "purple", visible: true },
              { value: "AI Products", title: "Current Focus", subtitle: "Automation & intelligent systems", icon: "Sparkles", color: "purple", visible: true }
            ];
          } else if (u.portfolioSlug === 'khushaboo') {
            updateData.statsCards = [
              { value: "01+", title: "Years Coding", subtitle: "Interactive web pages", icon: "Clock", color: "amber", visible: true },
              { value: "05+", title: "UI Components", subtitle: "High fidelity widgets", icon: "Layers", color: "amber", visible: true },
              { value: "Frontend", title: "Specialization", subtitle: "Tailwind & animations", icon: "Cpu", color: "amber", visible: true }
            ];
          } else if (u.portfolioSlug === 'mahi') {
            updateData.statsCards = [
              { value: "02+", title: "Years Engineering", subtitle: "High-agency software", icon: "Clock", color: "cyan", visible: true },
              { value: "08+", title: "Deployments", subtitle: "Production web services", icon: "Layers", color: "cyan", visible: true },
              { value: "AI Systems", title: "Core Focus", subtitle: "Machine learning integration", icon: "Cpu", color: "cyan", visible: true }
            ];
          }
        }

        if (!u.profile.expertiseCards) {
          needsUpdate = true;
          if (u.portfolioSlug === 'shashwat') {
            updateData.expertiseCards = [
              { label: "CORE STACK", title: "Full-Stack Engineering", description: "Building scalable applications using Next.js, Node.js, Express, PostgreSQL, TypeScript, and cloud-based infrastructure.", tags: ["API", "DATABASE", "AUTH", "CLOUD"], position: "center", opacity: 100, accentColor: "purple" },
              { label: "AI SYSTEMS", title: "AI & Automation", description: "Developing intelligent workflows, AI-powered tools, PDF-based systems, and automation platforms that improve productivity and user interaction.", tags: ["LLM", "AUTOMATION", "ML", "WORKFLOWS"], position: "center", opacity: 100, accentColor: "purple" },
              { label: "FRONTEND", title: "Modern UI Experiences", description: "Crafting immersive interfaces with smooth animations, responsive layouts, glassmorphism, and modern interaction design principles.", tags: ["MOTION", "RESPONSIVE", "DESIGN", "UX"], position: "center", opacity: 100, accentColor: "purple" },
              { label: "PRODUCT BUILDER", title: "Startup & Product Thinking", description: "Focused on solving real-world problems through fast execution, scalable systems, and user-first product development.", tags: ["STRATEGY", "EXECUTION", "SCALE", "USERS"], position: "center", opacity: 100, accentColor: "purple" }
            ];
          } else if (u.portfolioSlug === 'khushaboo') {
            updateData.expertiseCards = [
              { label: "FRONTEND SPECIALIST", title: "Responsive Interface Design", description: "Creating gorgeous Tailwind CSS frameworks and state-driven React component trees for peer-to-peer web marketplaces.", tags: ["TAILWIND", "REACT", "STATE", "UI"], position: "center", opacity: 100, accentColor: "amber" },
              { label: "CORE SYSTEMS", title: "Java & OOP Engineering", description: "Writing structured, object-oriented software logic for backends, with clean database persistence models.", tags: ["JAVA", "OOPS", "SCHEMA", "MONGO"], position: "center", opacity: 100, accentColor: "amber" }
            ];
          } else if (u.portfolioSlug === 'mahi') {
            updateData.expertiseCards = [
              { label: "AI SYSTEMS", title: "AI & Automation Planner", description: "Configuring intelligent AI travel planners and hotspot detection using Python, Flask, and leaflet mapping systems.", tags: ["AI", "PYTHON", "MAPS", "FLASK"], position: "center", opacity: 100, accentColor: "cyan" },
              { label: "FULL STACK", title: "Full-Stack Web Architectures", description: "Developing robust backends using Node.js, Express, and databases alongside beautiful modern Framer Motion fronts.", tags: ["EXPRESS", "MONGO", "REACT", "MOTION"], position: "center", opacity: 100, accentColor: "cyan" }
            ];
          }
        }

        if (!u.profile.skillsSection) {
          needsUpdate = true;
          if (u.portfolioSlug === 'shashwat') {
            updateData.skillsSection = {
              badge: "ENGINEERING CAPABILITIES",
              heading: "SYSTEM CAPABILITIES",
              description: "Production systems built on modular backend architecture, AI-native workflows, scalable frontend state, and automated cloud deployments.",
              philosophyVisible: true,
              philosophyTags: ["SCALABLE ARCHITECTURE", "AI-NATIVE DEVELOPMENT", "PERFORMANCE FIRST", "PRODUCT THINKING"],
              philosophyStrip: [
                { text: "SCALABLE ARCHITECTURE", color: "purple", visible: true, order: 1 },
                { text: "AI-NATIVE DEVELOPMENT", color: "cyan", visible: true, order: 2 },
                { text: "PERFORMANCE FIRST", color: "amber", visible: true, order: 3 },
                { text: "PRODUCT THINKING", color: "blue", visible: true, order: 4 }
              ],
              capabilityCards: [
                {
                  id: "backend",
                  title: "Backend Architecture",
                  icon: "Terminal",
                  accentColor: "purple",
                  experienceLevel: 9,
                  metricIndicator: "12+ Production Builds",
                  visible: true,
                  order: 1,
                  technologies: ["Node.js", "PostgreSQL", "Redis", "Express", "Prisma", "REST APIs"],
                  focusDetails: [
                    "High-throughput REST & GraphQL API microservices",
                    "Database connection pooling & complex query optimization",
                    "Double-entry ledgers & transactional consistency models"
                  ],
                  workflowDetails: [
                    "Automated migrations via Prisma schemas",
                    "Stateful Redis caching & intelligent invalidation policies",
                    "Robust OAuth2 & JWT-based authentication gateways"
                  ],
                  archDetails: [
                    "Modular monolith & clean architecture design patterns",
                    "Event-driven broker services (RabbitMQ, Redis streams)",
                    "High availability databases with master-replica setups"
                  ]
                },
                {
                  id: "frontend",
                  title: "Frontend Systems",
                  icon: "Code",
                  accentColor: "amber",
                  experienceLevel: 8,
                  metricIndicator: "Primary Engineering Stack",
                  visible: true,
                  order: 2,
                  technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"],
                  focusDetails: [
                    "Immersive, interactive web dashboards & SaaS workspaces",
                    "Cinematic micro-animations & state-bound layout transitions",
                    "Fluid responsive adapters for mobile/tablet layout consistency"
                  ],
                  workflowDetails: [
                    "Design systems based on highly reusable core layout blocks",
                    "Global state machines & context pipelines (Zustand, React Context)",
                    "Vite & Next.js production bundler size & asset optimizations"
                  ],
                  archDetails: [
                    "Atomic design structure & strict typing boundaries",
                    "Declarative UI flow representing deterministic app states",
                    "SEO best practices & semantic document layout trees"
                  ]
                },
                {
                  id: "ai",
                  title: "AI Engineering",
                  icon: "Cpu",
                  accentColor: "emerald",
                  experienceLevel: 8,
                  metricIndicator: "Focused Since 2024",
                  visible: true,
                  order: 3,
                  technologies: ["LangChain", "AI Agents", "Gemini / OpenAI", "Vector DBs", "LLM Chains", "Automation"],
                  focusDetails: [
                    "Multi-agent task routing & collaborative supervisor patterns",
                    "Retrieval-Augmented Generation (RAG) context inject strategies",
                    "LLM chain orchestration, fine-tuning, & model telemetry"
                  ],
                  workflowDetails: [
                    "Prompt parsing, telemetry logs & prompt version controllers",
                    "Strict structured JSON outputs via OpenAI/Gemini parser schemas",
                    "Automated system task loops with tool call integration"
                  ],
                  archDetails: [
                    "Semantic memory systems & long-term database storage",
                    "Vector search index structures (Pinecone, pgvector)",
                    "Failover orchestrations & request rate-limit mitigations"
                  ]
                },
                {
                  id: "devops",
                  title: "Cloud & DevOps",
                  icon: "Cloud",
                  accentColor: "blue",
                  experienceLevel: 7,
                  metricIndicator: "Modern Infrastructure",
                  visible: true,
                  order: 4,
                  technologies: ["Docker", "AWS", "CI/CD", "Vercel", "GitHub Actions", "Linux"],
                  focusDetails: [
                    "Containerized server setups & localized Docker environments",
                    "Automated Git-triggered pipeline integrations & build stages",
                    "Edge routing platforms, asset CDNs, & serverless setups"
                  ],
                  workflowDetails: [
                    "Multi-stage slim container builds with layer caching",
                    "Automatic branch preview deployments & release validation",
                    "Domain records, SSL certification, & reverse proxy maps"
                  ],
                  archDetails: [
                    "Infrastructure automation & declarative server definitions",
                    "High reliability zero-downtime rolling service releases",
                    "Secure production environment configuration & secret isolation"
                  ]
                }
              ]
            };
          } else if (u.portfolioSlug === 'khushaboo') {
            updateData.skillsSection = {
              badge: "ENGINEERING CAPABILITIES",
              heading: "SYSTEM CAPABILITIES",
              description: "Responsive interfaces built with React component libraries, Tailwind layouts, and robust backend database integration.",
              philosophyVisible: true,
              philosophyTags: ["RESPONSIVE INTERFACES", "COMPENSABLE DESIGN", "STABLE PERFORMANCE", "CLEAN PATTERNS"],
              philosophyStrip: [
                { text: "RESPONSIVE INTERFACES", color: "amber", visible: true, order: 1 },
                { text: "COMPENSABLE DESIGN", color: "blue", visible: true, order: 2 },
                { text: "STABLE PERFORMANCE", color: "purple", visible: true, order: 3 },
                { text: "CLEAN PATTERNS", color: "emerald", visible: true, order: 4 }
              ],
              capabilityCards: [
                {
                  id: "frontend",
                  title: "Frontend Development",
                  icon: "Code",
                  accentColor: "amber",
                  experienceLevel: 9,
                  metricIndicator: "Primary Engineering Stack",
                  visible: true,
                  order: 1,
                  technologies: ["React", "Tailwind CSS", "JavaScript", "HTML5", "CSS3", "Vite"],
                  focusDetails: ["Marketplace buyer/seller portal design", "Custom interactive widgets & sliders", "Responsive styling grids"],
                  workflowDetails: ["Component design pattern structures", "BEM naming & utility styling rules", "Git version branch flow control"],
                  archDetails: ["Single page React context routers", "Reusable layout grid scaffolds", "Asset size compression systems"]
                },
                {
                  id: "backend",
                  title: "Backend Core",
                  icon: "Terminal",
                  accentColor: "purple",
                  experienceLevel: 8,
                  metricIndicator: "5+ Custom Web APIS",
                  visible: true,
                  order: 2,
                  technologies: ["Node.js", "Express.js", "MongoDB", "Java", "OOPs principles"],
                  focusDetails: ["RESTful REST APIs & routes", "JSON schema validation & persistence", "Structured object classes"],
                  workflowDetails: ["Model-View-Controller design pattern sets", "Database connection maps & pooling", "Error middleware controls"],
                  archDetails: ["NoSQL catalog architecture designs", "Java core inheritance & data types", "Security middleware filters"]
                }
              ]
            };
          } else if (u.portfolioSlug === 'mahi') {
            updateData.skillsSection = {
              badge: "ENGINEERING CAPABILITIES",
              heading: "SYSTEM CAPABILITIES",
              description: "Automated routing engines, multi-agent trip planners, and responsive custom maps built with clean data structures.",
              philosophyVisible: true,
              philosophyTags: ["AI PLANNERS", "GEOSPATIAL ROUTING", "SYSTEM AUTOMATION", "EFFICIENT BACKENDS"],
              philosophyStrip: [
                { text: "AI PLANNERS", color: "cyan", visible: true, order: 1 },
                { text: "GEOSPATIAL ROUTING", color: "blue", visible: true, order: 2 },
                { text: "SYSTEM AUTOMATION", color: "emerald", visible: true, order: 3 },
                { text: "EFFICIENT BACKENDS", color: "purple", visible: true, order: 4 }
              ],
              capabilityCards: [
                {
                  id: "ai",
                  title: "AI Systems",
                  icon: "Cpu",
                  accentColor: "cyan",
                  experienceLevel: 8,
                  metricIndicator: "Focused Since 2024",
                  visible: true,
                  order: 1,
                  technologies: ["Python", "Flask", "Gemini LLM", "Leaflet Maps", "Geospatial APIs"],
                  focusDetails: ["AI travel itinerary generators", "Accident hotspot coordinates maps", "Flask route controller maps"],
                  workflowDetails: ["Semantic prompt structures", "Leaflet routing map layer additions", "Python data processing"],
                  archDetails: ["Location clustering algorithms", "LLM JSON schema parsing", "Multi-source map tiles overlay"]
                },
                {
                  id: "backend",
                  title: "Full-Stack Web Architectures",
                  icon: "Layers",
                  accentColor: "purple",
                  experienceLevel: 8,
                  metricIndicator: "8+ Live Deployments",
                  visible: true,
                  order: 2,
                  technologies: ["React", "Node.js", "Express", "MongoDB", "Framer Motion"],
                  focusDetails: ["Responsive React single-page wrappers", "Server controllers & API router handlers", "Data schema design"],
                  workflowDetails: ["Mongoose collection hooks & updates", "Express session handlers", "Framer tab transition setups"],
                  archDetails: ["Single repository multi-page router structures", "Session token storage", "Dynamic grid components"]
                }
              ]
            };
          }
        }

        if (!u.profile.projectsSection) {
          needsUpdate = true;
          // Fetch existing projects for this user to seed them initially in the projectsSection JSON
          const existingDBProjects = await prisma.project.findMany({
            where: { userId: u.id },
            orderBy: { createdAt: 'desc' }
          });

          const mappedProjects = existingDBProjects.map((p, idx) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            type: p.featured ? 'LIVE' : 'PROTOTYPE',
            featured: p.featured,
            image: p.thumbnail || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            technologies: p.techStack || [],
            metrics: [
              { label: 'UI/UX', value: 95, color: 'blue' },
              { label: 'Backend', value: 88, color: 'purple' }
            ],
            githubUrl: p.githubUrl || '',
            demoUrl: p.liveUrl || '',
            visible: true,
            order: idx + 1
          }));

          if (u.portfolioSlug === 'shashwat') {
            updateData.projectsSection = {
              badge: "FEATURED WORK • SELECTED PROJECTS",
              heading: "BUILDING DIGITAL PRODUCTS THAT MATTER",
              description: "A curated showcase of modern full-stack applications, AI systems, and cloud architectures built with precision.",
              statsCards: [
                { id: "stat-1", title: "10+ Live", subtitle: "Actively Maintained", color: "emerald", icon: "Server", visible: true },
                { id: "stat-2", title: "Modern Stack", subtitle: "Performance Focused", color: "blue", icon: "Workflow", visible: true },
                { id: "stat-3", title: "Production", subtitle: "Clean & Scalable", color: "purple", icon: "Radio", visible: true }
              ],
              projects: mappedProjects
            };
          } else if (u.portfolioSlug === 'khushaboo') {
            updateData.projectsSection = {
              badge: "PORTFOLIO • SELECTED WORKS",
              heading: "PROJECTS",
              description: "A professional showcase of web interfaces, frontend applications, and custom software systems built to spec.",
              statsCards: [
                { id: "stat-1", title: "5+ Live", subtitle: "Active Portals", color: "amber", icon: "Globe", visible: true },
                { id: "stat-2", title: "Client First", subtitle: "High Performance", color: "blue", icon: "Users", visible: true }
              ],
              projects: mappedProjects
            };
          } else if (u.portfolioSlug === 'mahi') {
            updateData.projectsSection = {
              badge: "FEATURED • GEOSPATIAL SYSTEMS",
              heading: "INTELLIGENT ROUTING & WEB PLATFORMS",
              description: "Explore the intersection of AI, geospatial engineering, and custom travel routing automation engines.",
              statsCards: [
                { id: "stat-1", title: "8+ Live", subtitle: "Production Deployments", color: "cyan", icon: "Cpu", visible: true },
                { id: "stat-2", title: "Spatial AI", subtitle: "Next-Gen Planners", color: "emerald", icon: "Zap", visible: true }
              ],
              projects: mappedProjects
            };
          }
        }

        if (!u.profile.certificatesSection) {
          needsUpdate = true;
          // We can fetch existing certificates for this user to seed them initially in the certificatesSection JSON
          const existingDBCerts = await prisma.certificate.findMany({
            where: { userId: u.id },
            orderBy: { createdAt: 'asc' }
          });

          const mappedCertificates = existingDBCerts.map((c, idx) => {
            let accentColor = 'purple';
            const org = c.organization.toLowerCase();
            if (org.includes('google')) accentColor = 'blue';
            else if (org.includes('aws') || org.includes('amazon')) accentColor = 'amber';
            else if (org.includes('cisco')) accentColor = 'emerald';
            else if (org.includes('microsoft')) accentColor = 'cyan';

            let certificateImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
            if (org.includes('google')) certificateImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop';
            else if (org.includes('aws') || org.includes('amazon')) certificateImage = 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop';
            else if (org.includes('cisco')) certificateImage = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600&auto=format&fit=crop';

            return {
              id: c.id,
              issuer: c.organization,
              title: c.title,
              description: org.includes('google')
                ? "Mastered prompt engineering strategies, neural network mechanics, and safe AI implementation principles using modern LLMs."
                : org.includes('aws')
                ? "Comprehensive validation of AWS Cloud fundamentals, core services, security compliance standards, and global infrastructure layers."
                : org.includes('cisco')
                ? "Hands-on expertise in TCP/IP addressing subnets, routing protocols, switches, virtual LAN network topologies, and network secure gateways."
                : "Professional certification validating core concepts and architecture design within major standard-setting environments.",
              issueDate: c.issueDate || '2026',
              tags: org.includes('google')
                ? ["AI", "Prompt Engineering", "LLMs"]
                : org.includes('aws')
                ? ["AWS", "Cloud Computing", "IAM Security"]
                : org.includes('cisco')
                ? ["Networking", "TCP/IP", "Gateways"]
                : ["Cloud Compute", "Software Engineering"],
              credentialUrl: c.credentialLink || 'https://google.com',
              certificateImage,
              featured: idx === 0,
              accentColor,
              visible: true,
              order: idx + 1
            };
          });

          const finalCertificates = mappedCertificates.length > 0 ? mappedCertificates : [
            {
              id: "cert-google-ai",
              issuer: "Google",
              title: "Google AI Essentials",
              description: "Mastered prompt engineering strategies, neural network mechanics, and safe AI implementation principles using modern LLMs.",
              issueDate: "April 2026",
              tags: ["AI", "Prompt Engineering", "LLMs"],
              credentialUrl: "https://coursera.org/verify/google-ai",
              certificateImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
              featured: true,
              accentColor: "blue",
              visible: true,
              order: 1
            },
            {
              id: "cert-aws-cloud",
              issuer: "AWS",
              title: "AWS Certified Cloud Practitioner",
              description: "Comprehensive validation of AWS Cloud fundamentals, core services, security compliance standards, and global infrastructure layers.",
              issueDate: "January 2026",
              tags: ["AWS", "Cloud Computing", "IAM Security"],
              credentialUrl: "https://aws.amazon.com/verification",
              certificateImage: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop",
              featured: false,
              accentColor: "amber",
              visible: true,
              order: 2
            },
            {
              id: "cert-cisco-net",
              issuer: "Cisco",
              title: "Cisco Networking Foundations",
              description: "Hands-on expertise in TCP/IP addressing subnets, routing protocols, switches, virtual LAN network topologies, and network secure gateways.",
              issueDate: "November 2025",
              tags: ["Networking", "TCP/IP", "Gateways"],
              credentialUrl: "https://cisco.com",
              certificateImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600&auto=format&fit=crop",
              featured: false,
              accentColor: "emerald",
              visible: true,
              order: 3
            },
            {
              id: "cert-ms-azure",
              issuer: "Microsoft",
              title: "Microsoft Azure Fundamentals",
              description: "Architectural mastery of Azure cloud compute pools, storage containers, virtual networking topologies, and core tenant security governance.",
              issueDate: "September 2025",
              tags: ["Azure", "Cloud Compute", "Governance"],
              credentialUrl: "https://microsoft.com",
              certificateImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
              featured: false,
              accentColor: "cyan",
              visible: true,
              order: 4
            }
          ];

          if (u.portfolioSlug === 'shashwat') {
            updateData.certificatesSection = {
              badge: "LEARNING JOURNEY",
              heading: "CERTIFICATIONS & ACHIEVEMENTS",
              description: "Continuous learning through certifications, workshops, and hands-on development experience.",
              radarTitle: "Currently Learning: AI/ML & Advanced Backend Systems",
              radarDescription: "Deepening skills in neural networks architectures, transformer modeling pipelines, and high-concurrency database horizontal scaling protocols.",
              exploringTracks: ["AI Systems", "Distributed Backend", "LLM Architecture", "DevOps Infrastructure"],
              certificationsCount: "12 Certifications",
              activeTracksCount: "4 Active Tracks",
              platformsCount: "3 Cloud Platforms",
              specialization: "AI/ML Specialization",
              certificates: finalCertificates
            };
          } else if (u.portfolioSlug === 'khushaboo') {
            updateData.certificatesSection = {
              badge: "ACCOLADES & CREDENTIALS",
              heading: "VERIFIED EXPERTISE & SKILLS",
              description: "Verified academic and technical milestones, emphasizing algorithm design and modular application building.",
              radarTitle: "Currently Learning: Next.js Server Components & SEO Architecture",
              radarDescription: "Mastering advanced rendering cycles, streaming strategies, edge runtimes, and optimal web page core vitals tracking.",
              exploringTracks: ["React Server Layers", "Edge Caching", "Tailwind Design Patterns", "Web Security"],
              certificationsCount: "6 Shipped Certs",
              activeTracksCount: "2 Active Tracks",
              platformsCount: "2 Cloud Environments",
              specialization: "Frontend Engineering Focus",
              certificates: finalCertificates
            };
          } else if (u.portfolioSlug === 'mahi') {
            updateData.certificatesSection = {
              badge: "ENGINEERING ACCREDITATIONS",
              heading: "ACCOMPLISHMENTS & CORE COMPETENCE",
              description: "Verified certifications spanning geospatial mechanics, server configurations, and Java system designs.",
              radarTitle: "Currently Learning: Geospatial Algorithms & Map Optimization",
              radarDescription: "Exploring graph routing theories, multi-layer vector calculations, and spatial indices database search trees.",
              exploringTracks: ["Geospatial Routing", "PostGIS Databases", "Advanced Java VM Setup", "Distributed Streams"],
              certificationsCount: "8 Validated Certs",
              activeTracksCount: "3 Active Tracks",
              platformsCount: "2 Spatial Systems",
              specialization: "Geospatial Development",
              certificates: finalCertificates
            };
          }
        }

        if (!u.profile.internshipsSection) {
          needsUpdate = true;
          // Fetch existing sql internships for this user to seed them initially in the internshipsSection JSON
          const existingDBInternships = await prisma.internship.findMany({
            where: { userId: u.id },
            orderBy: { createdAt: 'asc' }
          });

          const mappedInternships = existingDBInternships.map((intern, idx) => {
            let accentColor = 'cyan';
            const comp = intern.companyName.toLowerCase();
            if (comp.includes('google')) accentColor = 'blue';
            else if (comp.includes('microsoft')) accentColor = 'cyan';
            else if (comp.includes('amazon')) accentColor = 'amber';
            else if (comp.includes('ai')) accentColor = 'purple';
            else if (comp.includes('agency')) accentColor = 'green';

            return {
              id: intern.id,
              company: intern.companyName,
              role: intern.role,
              duration: intern.duration,
              location: "Remote",
              workMode: "Remote",
              summary: intern.responsibilities.join('. ') || "Worked as a software engineer intern developing core features.",
              metrics: ["High Quality", "On Time", "Verified"],
              technologies: intern.technologiesUsed.slice(0, 5) || [],
              bannerImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
              galleryImages: [],
              featured: idx === 0,
              accentColor,
              visible: true,
              offerLetterUrl: intern.internshipDocument || "",
              caseStudyUrl: "",
              order: idx + 1
            };
          });

          // Fallback default internships if none exist in sql table
          const finalInternships = mappedInternships.length > 0 ? mappedInternships : [
            {
              id: "google-frontend",
              company: "Google",
              role: "Frontend Systems Intern",
              duration: "May 2025 - July 2025",
              location: "Mountain View, CA",
              workMode: "Remote",
              summary: "Engineered next-generation interactive user interfaces and micro-frontend client ecosystems for experimental dashboard platforms.",
              metrics: ["40% Faster Rendering", "15+ Engineers", "Low Latency Systems"],
              technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "WebGL"],
              bannerImage: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800&auto=format&fit=crop",
              galleryImages: [
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop"
              ],
              featured: true,
              accentColor: "blue",
              visible: true,
              offerLetterUrl: "https://google.com",
              caseStudyUrl: "https://google.com",
              order: 1
            },
            {
              id: "startup-backend",
              company: "Tech-Scale AI",
              role: "Backend Architect Intern",
              duration: "November 2024 - March 2025",
              location: "Bangalore, India",
              workMode: "Hybrid",
              summary: "Designed and scaled high-throughput database connection adapters and event broker systems for real-time agent streams.",
              metrics: ["500k+ Event Streams", "99.9% Route Uptime", "Sub-15ms Syncs"],
              technologies: ["Node.js", "Express", "Prisma", "PostgreSQL", "Redis"],
              bannerImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
              galleryImages: [
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop"
              ],
              featured: false,
              accentColor: "cyan",
              visible: true,
              offerLetterUrl: "",
              caseStudyUrl: "",
              order: 2
            },
            {
              id: "agency-fullstack",
              company: "PixelCraft Agency",
              role: "Full-Stack Engineer Intern",
              duration: "July 2024 - October 2024",
              location: "Delhi, India",
              workMode: "On-site",
              summary: "Coordinated client-facing dashboard portals, automated secure email dispatch gateways, and optimized static asset delivery systems.",
              metrics: ["8+ Client Portals", "95+ Lighthouse Score", "30% Fast Loading"],
              technologies: ["React", "Tailwind CSS", "MongoDB", "Express", "Vercel"],
              bannerImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
              galleryImages: [],
              featured: false,
              accentColor: "green",
              visible: true,
              offerLetterUrl: "",
              caseStudyUrl: "",
              order: 3
            }
          ];

          if (u.portfolioSlug === 'shashwat') {
            updateData.internshipsSection = {
              badge: "PROFESSIONAL JOURNEY",
              heading: "INTERNSHIPS & EXPERIENCE",
              description: "Hands-on experience building modern applications, collaborating with high-performance engineering teams, and solving real-world scale problems.",
              radarTitle: "Current Focus: Scalable Systems & AI Tooling",
              exploringTracks: ["Scalable Systems", "AI Tooling", "Product Engineering", "Real-Time Architectures"],
              totalDuration: "1.5 Years Total",
              verifiedCount: "3+ Verified",
              performanceBoost: "40% Performance Boost",
              internships: finalInternships
            };
          } else if (u.portfolioSlug === 'khushaboo') {
            updateData.internshipsSection = {
              badge: "PROFESSIONAL TIMELINE",
              heading: "EXPERIENCE & INTERNSHIPS",
              description: "Practical frontend development and system building, crafting responsive and high-fidelity interface solutions.",
              radarTitle: "Current Focus: Tailwind Systems & Web Security",
              exploringTracks: ["Tailwind Systems", "Web Security", "Component Architect", "State Engines"],
              totalDuration: "1 Year Active",
              verifiedCount: "2+ Verified",
              performanceBoost: "30% Design Speed",
              internships: finalInternships.map(i => i.id === "google-frontend" ? { ...i, featured: false } : i.id === "startup-backend" ? { ...i, featured: true } : i)
            };
          } else if (u.portfolioSlug === 'mahi') {
            updateData.internshipsSection = {
              badge: "ENGINEERING MILESTONES",
              heading: "EXPERIENCE STORY",
              description: "Developing intelligent routing planners, map layers architectures, and full-stack software dashboards.",
              radarTitle: "Current Focus: Spatial AI & Map Optimization",
              exploringTracks: ["Spatial AI", "Map Optimization", "Distributed Pipelines", "Geospatial Nodes"],
              totalDuration: "2 Years Active",
              verifiedCount: "3+ Verified",
              performanceBoost: "50% Routing Velocity",
              internships: finalInternships
            };
          }
        }

        if (needsUpdate) {
          console.log(`🌱 Migrating visual editor fields for ${u.name}...`);
          await prisma.portfolioProfile.update({
            where: { id: u.profile.id },
            data: updateData
          });
        }
      }
    }

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};
