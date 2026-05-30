import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Cpu, Database, Wrench } from 'lucide-react';
import { SectionWrapper } from '../ui/SectionWrapper';
import { GlassCard } from '../ui/GlassCard';
import { typography } from '../../styles/tokens';
import RadialGlowDemo from '../ui/radial-glow-demo';

interface AboutTabProps {
  user: any;
  profile: any;
  skills: any[];
}

export default function AboutTab({ user, profile, skills }: AboutTabProps) {
  // Group skills by category
  const groupedSkills = skills.reduce((acc: any, skill: any) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <SectionWrapper delay={0.05} className="space-y-16">
      {/* Editorial Header */}
      <div className="space-y-4 text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full text-xs text-neutral-400">
          <Layers className="w-3.5 h-3.5" />
          <span className="font-mono text-[9px] uppercase tracking-widest font-black">Narrative & Philosophy</span>
        </div>
        
        <h2 className={typography.heading}>
          ENGINEERING IDENTITY
        </h2>
        
        <p className={`${typography.body} text-[#A1A1AA] max-w-3xl font-light`}>
          {profile.bio}
        </p>
      </div>

      <motion.div variants={itemVariants} className="space-y-6">
        <RadialGlowDemo className="min-h-0 bg-transparent p-8 rounded-[32px] border border-white/5">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full text-xs text-neutral-400 w-max mb-6">
            <Wrench className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-mono text-[9px] uppercase tracking-widest font-black text-purple-300">Technical Arsenal</span>
          </div>

          <div className="space-y-12">
            {Object.keys(groupedSkills).length === 0 ? (
              <p className="text-[#A1A1AA] text-xs font-mono">No skills synchronized.</p>
            ) : (
              Object.entries(groupedSkills).map(([cat, list]: any) => (
                <GlassCard key={cat} hoverEffect={false} spotlightGlow={false} className="p-8 rounded-3xl border border-white/5">
                  <h4 className="text-sm font-heading font-black text-white uppercase tracking-widest border-b border-white/[0.05] pb-3 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                    {cat} Layers
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list.map((skill: any) => (
                      <GlassCard 
                        key={skill.id} 
                        hoverEffect={true}
                        spotlightGlow={true}
                        spotlightColor="rgba(168, 85, 247, 0.05)"
                        className="p-5 rounded-2xl flex flex-col justify-between min-h-[140px] space-y-4 group cursor-default"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                             <span className="text-xs font-black text-white font-heading uppercase">{skill.skillName}</span>
                             <span className="text-[8px] font-mono text-purple-400 font-bold bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                               LVL {skill.skillLevel}/10
                             </span>
                          </div>
                          <p className="text-[9px] text-[#A1A1AA] font-light font-sans leading-relaxed">
                            {skill.category === 'Backend' ? 'Orchestrates concurrent headless queries, JSON body validation, and REST API controller pipelines.' :
                             skill.category === 'Frontend' ? 'Maps state-driven reactive client components, Framer Motion transitions, and fluid desktop viewports.' :
                             skill.category === 'Database' ? 'Manages complex relational schemas, high-efficiency indexing parameters, and robust transactional pools.' :
                             'Powers core systems integration, server automation scripts, and deployment pipeline protocols.'}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-white/[0.03] text-[7.5px] font-mono text-neutral-500 uppercase tracking-widest">
                          <span>ROLE: {skill.category === 'Backend' ? 'API ENGINE' : skill.category === 'Frontend' ? 'CLIENT CORE' : 'DATA SHEETS'}</span>
                          <span className="text-[#00F5B4]">SECURED ✓</span>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </RadialGlowDemo>
      </motion.div>
    </SectionWrapper>
  );
}
