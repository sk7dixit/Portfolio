import React from 'react';
import { motion } from 'framer-motion';
import { motionPresets } from '../../styles/tokens';

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function GlowButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  type = 'button',
  disabled = false
}: GlowButtonProps) {
  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: 'bg-[#00F5B4] text-neutral-950 hover:bg-[#00F5B4]/90',
          border: 'border-transparent',
          shadow: 'shadow-[0_0_20px_rgba(0,245,180,0.15)] hover:shadow-[0_0_30px_rgba(0,245,180,0.3)]'
        };
      case 'danger':
        return {
          bg: 'bg-[#FF5D73] text-white hover:bg-[#FF5D73]/90',
          border: 'border-transparent',
          shadow: 'shadow-[0_0_20px_rgba(255,93,115,0.15)] hover:shadow-[0_0_30px_rgba(255,93,115,0.3)]'
        };
      case 'secondary':
      default:
        return {
          bg: 'bg-white/[0.02] hover:bg-white/[0.08] text-neutral-300 hover:text-white',
          border: 'border-white/10 hover:border-white/20',
          shadow: 'shadow-none'
        };
    }
  };

  const currentStyles = getStyles();

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex items-center justify-center gap-2 border px-8 py-3.5 rounded-full font-bold text-xs tracking-wider uppercase cursor-pointer select-none transition-all duration-300 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${currentStyles.bg} ${currentStyles.border} ${currentStyles.shadow} ${className}`}
      whileHover={disabled ? undefined : {
        scale: 1.03,
        y: -1,
        transition: motionPresets.springBouncy
      }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}
