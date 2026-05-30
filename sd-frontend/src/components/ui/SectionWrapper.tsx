import React from 'react';
import { motion } from 'framer-motion';
import { animations } from '../../styles/tokens';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}

export function SectionWrapper({
  children,
  className = '',
  id,
  delay = 0
}: SectionWrapperProps) {
  const hasPaddingY = className.includes('py-') || className.includes('pt-') || className.includes('pb-');
  const defaultPadding = hasPaddingY ? '' : 'py-16 md:py-24';

  return (
    <motion.section
      id={id}
      className={`relative w-full max-w-6xl mx-auto px-6 select-none ${defaultPadding} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={animations.staggerContainer}
    >
      {children}
    </motion.section>
  );
}
