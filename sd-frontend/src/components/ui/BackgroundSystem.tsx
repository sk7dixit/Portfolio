import React from 'react';
import Hero from './animated-shader-hero';

export function BackgroundSystem() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[1] overflow-hidden">
      {/* 1. Base Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-[#0a0a0b] to-[#121215]" />

      {/* 2. WebGL Cinematic Shader Background (opaque black canvas with animating clouds at opacity-60) */}
      <div className="absolute inset-0 opacity-20">
        <Hero />
      </div>

      {/* 3. Grid Overlay Overlay (renders on top of shader for an engineered bento grid layout feel) */}
      <div className="absolute inset-0 bg-grid opacity-25" 
           style={{ maskImage: 'radial-gradient(ellipse at center, transparent 20%, black)' }} />

      {/* 4. Noise Texture Overlay (gives that cinematic premium luxury grain structure) */}
      <div className="absolute inset-0 bg-noise" />

      {/* 5. Ambient Spots Spotlight glows (merges emerald, blue, and purple hues with the golden shader) */}
      <div className="absolute top-0 left-0 w-full h-full spotlight-top-left" />
      <div className="absolute top-0 right-0 w-full h-full spotlight-top-right" />
      <div className="absolute inset-0 spotlight-center-purple" />
    </div>
  );
}

