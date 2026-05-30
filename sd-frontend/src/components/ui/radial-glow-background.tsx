import { cn } from "@/lib/utils";
import { useState } from "react";

export const RadialGlowBackground = ({ 
  children, 
  className 
}: { 
  children?: React.ReactNode; 
  className?: string;
}) => {
  const [count, setCount] = useState(0);

  return (
    <div className={cn("w-full bg-[#020617] relative", className)}>
      {/* Dark Radial Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle 500px at 50% 200px, #3e3e3e, transparent)`,
        }}
      />
      {/* Your Content/Components */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
