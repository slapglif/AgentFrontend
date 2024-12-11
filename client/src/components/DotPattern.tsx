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
        className={cn("absolute inset-0 w-full h-full opacity-50", svgClassName)}
        style={{ 
          minHeight: '100vh',
          maskImage: 'radial-gradient(ellipse at center, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent)'
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
              className="fill-primary/30" 
            />
          </pattern>
        </defs>
        <rect 
          width="100%" 
          height="100%" 
          fill={`url(#${patternId})`}
          className="[mask-image:radial-gradient(ellipse_at_center,black,transparent)]"
        />
      </svg>
    </div>
  );
};
