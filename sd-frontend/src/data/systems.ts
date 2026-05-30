import { 
  Cpu, 
  Database, 
  Layers, 
  CloudLightning, 
  ShieldAlert,
  GitBranch,
  Terminal,
  Globe,
  Activity
} from 'lucide-react';

export interface SystemNode {
  id: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  title: string;
  subtitle: string;
  desc: string;
  flow: string;
  x: number;
  y: number;
}

export const nodes: Record<string, SystemNode> = {
  api: {
    id: 'api',
    icon: Cpu,
    color: 'text-[#4D7CFE]',
    bgColor: 'bg-[#4D7CFE]/10',
    borderColor: 'border-[#4D7CFE]/30',
    glowColor: 'rgba(77, 124, 254, 0.4)',
    title: 'Node.js & Express API Gateway',
    subtitle: 'Headless Routing Core',
    desc: 'An asynchronous MVC controller layer managing cross-origin security rules, sanitizing incoming request bodies, issuing state JWTs, and organizing pool queries.',
    flow: 'Coordinates JSON exchanges between 3 Frontend clients, Neon database pools, and static asset CDNs.',
    x: 50,
    y: 50
  },
  db: {
    id: 'db',
    icon: Database,
    color: 'text-[#00F5B4]',
    bgColor: 'bg-[#00F5B4]/10',
    borderColor: 'border-[#00F5B4]/30',
    glowColor: 'rgba(0, 245, 180, 0.4)',
    title: 'Neon Serverless PostgreSQL',
    subtitle: 'Relational Schema Cluster',
    desc: 'Serverless PostgreSQL pool holding highly-normalized tables for profile states, skill weights, project records, and active visitor geolocation tags.',
    flow: 'Maintains active transaction pools for real-time reads & secure write mutations via Prisma schema boundaries.',
    x: 18,
    y: 75
  },
  admin: {
    id: 'admin',
    icon: ShieldAlert,
    color: 'text-[#8B5CF6]',
    bgColor: 'bg-[#8B5CF6]/10',
    borderColor: 'border-[#8B5CF6]/30',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    title: 'CMS Management Panel',
    subtitle: 'Administrative Controller',
    desc: 'Secure CMS allowing immediate workspace config adjustments, custom dynamic styles toggling, skill parameters slide-bars, and real-time visitor diagnostic logs.',
    flow: 'Dispatches authenticated headers to trigger DB write operations.',
    x: 18,
    y: 25
  },
  frontends: {
    id: 'frontends',
    icon: Layers,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    title: 'Decoupled Client Frontends',
    subtitle: 'Dynamic Theme Frontends',
    desc: 'Three isolated React environments executing independent portfolios, fetching styled values, dynamic skill meters, and active build showcases on mount.',
    flow: 'Receives cached theme payloads over SSL API channels.',
    x: 82,
    y: 35
  },
  cloudinary: {
    id: 'cloudinary',
    icon: CloudLightning,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    glowColor: 'rgba(96, 165, 250, 0.4)',
    title: 'Cloudinary Stateless Storage',
    subtitle: 'Media Optimization Node',
    desc: 'Image & document storage buffer. Incoming multipart payloads are captured in RAM buffers via Multer and streamed to the cloud without local disk writes.',
    flow: 'Provides optimized, responsive image delivery pipelines.',
    x: 82,
    y: 65
  }
};

export interface StackTech {
  name: string;
  icon: any;
  role: string;
  why: string;
  projects: string[];
  color: string;
  borderColor: string;
  hoverBorder: string;
  glowShadow: string;
}

export const stackTechs: StackTech[] = [
  {
    name: 'Node.js / Express',
    icon: Cpu,
    role: 'Asynchronous API Kernel',
    why: 'Delivers modular router scaling with strict CORS interceptors and non-blocking Event Loop architecture optimized for dynamic JSON payloads.',
    projects: ['Central API Orchestrator', 'Systems Registry Gateway', 'Real-Time Logging Socket'],
    color: '#4D7CFE',
    borderColor: 'border-[#4D7CFE]/20',
    hoverBorder: 'hover:border-[#4D7CFE]/50',
    glowShadow: 'hover:shadow-[0_0_30px_rgba(77,124,254,0.15)]'
  },
  {
    name: 'PostgreSQL / Prisma',
    icon: Database,
    role: 'Rigid Data Relational Layer',
    why: 'Maintains transaction safety and pool-managed query routines using Neon serverless clusters, utilizing highly normalized profiles and metric collections.',
    projects: ['Diagnostics Tracker', 'Bento Project Inventory', 'Telemetry Registry'],
    color: '#00F5B4',
    borderColor: 'border-[#00F5B4]/20',
    hoverBorder: 'hover:border-[#00F5B4]/50',
    glowShadow: 'hover:shadow-[0_0_30px_rgba(0,245,180,0.15)]'
  },
  {
    name: 'TypeScript Core',
    icon: ShieldAlert,
    role: 'Full-Stack Type Safety',
    why: 'Prevents interface drift across client-server pipelines by using shared schema models, strict compiler rules, and self-documenting parameters.',
    projects: ['Master App Controller', 'Admin Management Panel', 'Data Flow Components'],
    color: '#8B5CF6',
    borderColor: 'border-[#8B5CF6]/20',
    hoverBorder: 'hover:border-[#8B5CF6]/50',
    glowShadow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]'
  },
  {
    name: 'Tailwind CSS v4 & Framer Motion',
    icon: Layers,
    role: 'Cinematic Layout & Motion Engine',
    why: 'Establishes complex visual layouts using HSL gradients, backdrop filters, and fluid spring physics, creating a cohesive, immersive workstation experience.',
    projects: ['Floating Glass Workstation', 'Cinematic Project Detail Page', 'Command Palette Overlay'],
    color: '#FB923C',
    borderColor: 'border-orange-500/20',
    hoverBorder: 'hover:border-orange-500/50',
    glowShadow: 'hover:shadow-[0_0_30px_rgba(251,146,60,0.15)]'
  }
];

export interface PipelineStep {
  id: number;
  name: string;
  icon: any;
  subtitle: string;
  status: string;
  desc: string;
  logs: string[];
}

export const pipelineSteps: PipelineStep[] = [
  {
    id: 0,
    name: 'Git Version Release',
    icon: GitBranch,
    subtitle: 'git push origin main',
    status: 'SUCCESS',
    desc: 'Fires dynamic Webhook triggers to initiate the automated virtualization flow.',
    logs: [
      'COMMIT: "refactor: optimize database connection pooling" (hash: d7a14e9)',
      'AUTHOR: Shashwat <shashwat@core.systems>',
      'STATUS: Webhook event parsed • Payload validation complete'
    ]
  },
  {
    id: 1,
    name: 'Automated CI/CD Validation',
    icon: Terminal,
    subtitle: 'GitHub Actions Runner',
    status: 'SUCCESS',
    desc: 'Executes static compilers, style checks, and regression tests within stateless virtual containers.',
    logs: [
      'RUNNING: tsc --noEmit && eslint src/ --ext .ts,.tsx',
      'COMPILER: Verified zero typescript syntax boundary violations',
      'TESTS: Passed 28 integration test matrices [coverage: 98.6%]'
    ]
  },
  {
    id: 2,
    name: 'Immutable Build Compilation',
    icon: Cpu,
    subtitle: 'Docker multi-stage assembly',
    status: 'SUCCESS',
    desc: 'Packages the node bundle and UI assets into highly compressed, static Alpine Linux container images.',
    logs: [
      'Vite Production bundler: Optimized 1,913 dynamic modules',
      'Docker Layer 1: Node:20-Alpine base compiled successfully',
      'Docker Layer 2: Asset size compressed to 42.6MB [SHA: 832fca2]'
    ]
  },
  {
    id: 3,
    name: 'Edge Nodes Synchronization',
    icon: Globe,
    subtitle: 'Global Cloud Deployments',
    status: 'SUCCESS',
    desc: 'Distributes production assets across global content delivery networks, warming cached routing engines.',
    logs: [
      'API DEPLOYMENT: Vercel serverless functions updated (12 regions)',
      'SSL BINDING: Handshake validated successfully for portfolio domains',
      'ROUTING: Edge proxy routes flushed. Status: 100% warm'
    ]
  },
  {
    id: 4,
    name: 'Real-time Telemetry Auditing',
    icon: Activity,
    subtitle: 'Continuous Monitoring Engine',
    status: 'ACTIVE',
    desc: 'Triggers live server diagnostics, recording request loads, latency spikes, and system integrity indicators.',
    logs: [
      'TELEMETRY: Handshake succeeded with centralized metrics agent',
      'DIAGNOSTICS: Network Latency: 4ms • DB Pool: Stable',
      'HEALTH CHECK: Mem: 84% free • Disk: OK • System status: ONLINE'
    ]
  }
];
