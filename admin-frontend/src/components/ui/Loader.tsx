import React from 'react';

export default function Loader({ label = 'TRANSMITTING...' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono">
      <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="tracking-wider uppercase">{label}</span>
    </div>
  );
}
