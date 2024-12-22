import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "button";
  animation?: "pulse" | "wave";
  width?: string | number;
  height?: string | number;
}

function Skeleton({
  className,
  variant = "rectangular",
  animation = "pulse",
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted",
        {
          "skeleton": animation === "wave",
          "animate-pulse": animation === "pulse",
          "skeleton-text": variant === "text",
          "skeleton-circle": variant === "circular",
          "skeleton-button": variant === "button",
        },
        className
      )}
      style={{
        width: width,
        height: height,
        ...style,
      }}
      {...props}
    />
  )
}

export { Skeleton }
