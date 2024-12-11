import { cn } from "@/lib/utils";

interface DotPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
  svgClassName?: string;
}

export const DotPattern = ({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  svgClassName,
}: DotPatternProps) => {
  const patternId = `dotPattern-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={cn("absolute inset-0 -z-10 pointer-events-none select-none", className)}>
      <svg
        className={cn("absolute inset-0 w-full h-full", svgClassName)}
        style={{ 
          minHeight: '100vh',
          opacity: 0.8,
          mixBlendMode: 'soft-light',
          filter: 'blur(0.5px)',
        }}
      >
        <defs>
          <pattern
            id={patternId}
            x={x}
            y={y}
            width={width}
            height={height}
            patternUnits="userSpaceOnUse"
          >
            <circle 
              cx={cx} 
              cy={cy} 
              r={cr} 
              fill="currentColor"
              className="text-primary"
            />
          </pattern>
        </defs>
        <rect 
          width="100%" 
          height="100%" 
          fill={`url(#${patternId})`}
          className="text-primary"
        />
      </svg>
    </div>
  );
};
