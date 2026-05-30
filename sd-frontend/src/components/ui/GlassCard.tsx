import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { glass, motionPresets } from '../../styles/tokens';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  spotlightGlow?: boolean;
  spotlightColor?: string;
  onClick?: () => void;
  whileHover?: any;
  style?: React.CSSProperties;
}

export function GlassCard({
  children,
  className = '',
  hoverEffect = true,
  spotlightGlow = false,
  spotlightColor = 'rgba(0, 245, 180, 0.07)',
  onClick,
  whileHover,
  style
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !spotlightGlow) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const hoverAnimations = whileHover || (hoverEffect ? {
    y: -6,
    scale: 1.02,
    transition: motionPresets.springGentle
  } : undefined);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`glass-card relative overflow-hidden ${glass.primary} ${
        hoverEffect ? glass.primaryHover : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      whileHover={hoverAnimations}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      style={style}
    >
      {/* Dynamic Cursor Spotlight Glow */}
      {spotlightGlow && isHovered && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] transition-opacity duration-300"
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            width: '240px',
            height: '240px',
            background: spotlightColor
          }}
        />
      )}
      
      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}
