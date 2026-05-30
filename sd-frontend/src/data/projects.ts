// Flagship Projects Catalog Registry (Phase 3 Decoupling)

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  averageLatency?: string;
  operationalHealth?: string;
  trafficPipeline?: string;
}

export const fallbackProjects: Project[] = [
  {
    id: "swarm-gateway-v4",
    title: "Decentralized AI Agent Swarm Gateway",
    description: "A high-performance API gateway coordinating real-time communication, low-latency routing, and context synchronization across multiple services.",
    techStack: ["Node.js", "Express", "FastAPI", "Redis", "OpenAI SDK"],
    featured: true,
    githubUrl: "https://github.com/shashwat/agent-swarm-gateway",
    liveUrl: "https://swarm.core.systems",
    averageLatency: "14ms",
    operationalHealth: "99.98%",
    trafficPipeline: "42k req/mo"
  },
  {
    id: "db-scale-engine",
    title: "Serverless Neon Postgres Transaction Coordinator",
    description: "A connection pooling layer and caching manager designed to coordinate database tables and optimize high-throughput Prisma mutations.",
    techStack: ["PostgreSQL", "Prisma", "TypeScript", "Redis"],
    featured: false,
    githubUrl: "https://github.com/shashwat/neon-postgres-coordinator",
    liveUrl: "https://postgres.core.systems",
    averageLatency: "6ms",
    operationalHealth: "99.99%",
    trafficPipeline: "120k req/mo"
  },
  {
    id: "stateless-upload-buffer",
    title: "Stateless Media & Real-Time Streaming Buffer",
    description: "An API gateway that coordinates real-time media streaming and secure pre-signed uploads directly to CDN storages with zero local file buffering.",
    techStack: ["Node.js", "Cloudinary", "Docker", "Express"],
    featured: false,
    githubUrl: "https://github.com/shashwat/stateless-upload-buffer",
    liveUrl: "https://cdn.core.systems",
    averageLatency: "18ms",
    operationalHealth: "99.95%",
    trafficPipeline: "65k req/mo"
  }
];
