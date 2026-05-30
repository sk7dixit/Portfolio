import { Brain, Cpu, Zap } from 'lucide-react';

export interface Experiment {
  title: string;
  category: string;
  desc: string;
  status: string;
  metricLabel: string;
  metricValue: string;
  color: string;
  icon: any;
  stack: string[];
}

export const experiments: Experiment[] = [
  {
    title: 'Decentralized Multi-Agent Swarm Framework',
    category: 'Artificial Intelligence',
    desc: 'An experimental node-driven orchestration framework for executing synchronized multi-agent AI execution pools with dynamic telemetry consensus logs.',
    status: 'STABLE PROTOTYPE',
    metricLabel: 'Swarm Consensus',
    metricValue: '99.8% Accuracy',
    color: 'from-purple-500/10 via-indigo-500/5 to-transparent border-purple-500/20 text-purple-400 bg-purple-500/10',
    icon: Brain,
    stack: ['Node.js', 'FastAPI', 'Redis', 'OpenAI SDK']
  },
  {
    title: 'Low-Latency Vector Indexing Stream',
    category: 'Data Infrastructure',
    desc: 'A streaming telemetry vector lookup engine utilizing localized memory indexing matrices to return cosine-similarity metrics in sub-10ms intervals.',
    status: 'ACTIVE EXPERIMENT',
    metricLabel: 'Cosine Lookup',
    metricValue: '8.4ms Latency',
    color: 'from-blue-500/10 via-teal-500/5 to-transparent border-blue-500/20 text-blue-400 bg-blue-500/10',
    icon: Cpu,
    stack: ['Rust', 'WebAssembly', 'PostgreSQL Vector', 'HNSW']
  },
  {
    title: 'Autonomous System Recovery Controller',
    category: 'DevOps / Automation',
    desc: 'An automated watch-dog script checking server telemetry streams and executing localized Docker rollbacks and memory-flush scripts on error detection.',
    status: 'INTEGRATED ENGINE',
    metricLabel: 'Failure Recovery',
    metricValue: '2.4s Rollback',
    color: 'from-emerald-500/10 via-green-500/5 to-transparent border-emerald-500/20 text-emerald-400 bg-emerald-500/10',
    icon: Zap,
    stack: ['Docker SDK', 'Express API', 'Bash API', 'PM2']
  }
];
