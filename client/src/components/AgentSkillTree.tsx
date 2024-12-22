import { useMemo } from "react";
import { useSpring, animated } from "react-spring";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Position {
  x: number;
  y: number;
}

interface Skill {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  dependencies: string[];
  icon: string;
  category: "research" | "analysis" | "collaboration" | "innovation";
  isUnlocked: boolean;
}

interface SkillNodeProps {
  skill: Skill;
  position: { x: number; y: number };
  onSelect: (skillId: string) => void;
  isSelected: boolean;
}

function SkillNode({
  skill,
  position,
  onSelect,
  isSelected,
}: SkillNodeProps) {
  const progressPercentage = useMemo(() => 
    (skill.level / skill.maxLevel) * 100
  , [skill.level, skill.maxLevel]);

  const spring = useSpring({
    to: {
      transform: `translate(${position.x}px, ${position.y}px)`,
      scale: isSelected ? 1.1 : 1,
      opacity: skill.isUnlocked ? 1 : 0.5,
    },
    from: {
      transform: `translate(${position.x}px, ${position.y}px)`,
      scale: 1,
      opacity: 0,
    },
    config: { 
      tension: 300, 
      friction: 20,
      clamp: true
    },
  });

  return (
    <animated.div
      style={{
        ...spring,
        position: "absolute",
      }}
      className={cn(
        "transition-colors duration-200",
        skill.isUnlocked ? "opacity-100" : "opacity-50"
      )}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onSelect(skill.id)}
              className={cn(
                "w-16 h-16 rounded-full border-2 flex items-center justify-center relative",
                "hover:border-primary/50 transition-colors duration-200",
                isSelected ? "border-primary" : "border-border",
                !skill.isUnlocked && "cursor-not-allowed"
              )}
              disabled={!skill.isUnlocked}
            >
              <div className="text-xl">{skill.icon}</div>
              <div
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-background/80 rounded-full px-2 py-0.5 text-xs font-medium border border-primary/20"
              >
                {skill.level}/{skill.maxLevel}
              </div>
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${progressPercentage} 100`}
                  className="text-primary transition-all duration-500 ease-in-out"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px]">
            <div className="space-y-1">
              <p className="font-medium">{skill.name}</p>
              <p className="text-sm text-muted-foreground">{skill.description}</p>
              {!skill.isUnlocked && (
                <p className="text-xs text-destructive">
                  Requires previous skills to be unlocked
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </animated.div>
  );
};

interface AgentSkillTreeProps {
  skills: Skill[];
  onSkillSelect: (skillId: string) => void;
  selectedSkillId?: string;
}

export function AgentSkillTree({
  skills,
  onSkillSelect,
  selectedSkillId,
}: AgentSkillTreeProps) {
  const skillLayout = useMemo(() => {
    // Safety check for empty skills array
    if (!skills || skills.length === 0) {
      return { levels: [], positions: new Map() };
    }

    // Organize skills into levels based on dependencies
    const levels: Skill[][] = [];
    const placed = new Set<string>();
    
    const getSkillLevel = (skill: Skill, visited = new Set<string>()): number => {
      if (visited.has(skill.id)) {
        console.warn('Circular dependency detected:', skill.id);
        return 0;
      }
      
      if (skill.dependencies.length === 0) return 0;
      
      visited.add(skill.id);
      const level = Math.max(...skill.dependencies.map(depId => {
        const dep = skills.find(s => s.id === depId);
        if (!dep) {
          console.warn(`Dependency ${depId} not found for skill ${skill.id}`);
          return 0;
        }
        return getSkillLevel(dep, new Set(visited)) + 1;
      }));
      visited.delete(skill.id);
      return level;
    };

    // Sort skills by their dependency level
    skills.forEach(skill => {
      const level = getSkillLevel(skill);
      if (!levels[level]) levels[level] = [];
      levels[level].push(skill);
      placed.add(skill.id);
    });

    // Calculate positions for each skill
    const positions = new Map<string, { x: number; y: number }>();
    const baseSpacing = 120;
    
    levels.forEach((levelSkills, levelIndex) => {
      const levelWidth = levelSkills.length * baseSpacing;
      const startX = -(levelWidth / 2) + baseSpacing / 2;
      
      levelSkills.forEach((skill, skillIndex) => {
        positions.set(skill.id, {
          x: startX + skillIndex * baseSpacing,
          y: levelIndex * baseSpacing,
        });
      });
    });

    return { levels, positions };
  }, [skills]);

  if (!skills || skills.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No skills available
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 relative overflow-hidden">
      <div className="w-full aspect-[2/1] relative min-h-[300px]">
        <div
          className="absolute inset-0"
          style={{
            transform: "translate(50%, 50%)",
          }}
        >
          {/* Draw connecting lines between skills */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "100%",
            }}
          >
            {skills.map(skill =>
              skill.dependencies.map(depId => {
                const fromPos = skillLayout.positions.get(depId);
                const toPos = skillLayout.positions.get(skill.id);
                if (!fromPos || !toPos) return null;

                return (
                  <line
                    key={`${skill.id}-${depId}`}
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeOpacity={0.2}
                    className={cn(
                      "transition-colors duration-200",
                      skill.isUnlocked ? "stroke-primary" : "stroke-muted-foreground"
                    )}
                  />
                );
              })
            )}
          </svg>

          {/* Render skill nodes */}
          {skills.map(skill => {
            const position = skillLayout.positions.get(skill.id);
            if (!position) return null;

            return (
              <SkillNode
                key={skill.id}
                skill={skill}
                position={position}
                onSelect={onSkillSelect}
                isSelected={selectedSkillId === skill.id}
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
}
