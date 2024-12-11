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
  return (
    <div className={cn("absolute inset-0 -z-10", className)}>
      <svg
        className={cn("[mask-image:radial-gradient(ellipse_at_center,black,transparent)] absolute inset-0", svgClassName)}
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="dotPattern"
            x={x}
            y={y}
            width={width}
            height={height}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={cx} cy={cy} r={cr} className="fill-muted-foreground/20" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotPattern)" />
      </svg>
    </div>
  );
};
