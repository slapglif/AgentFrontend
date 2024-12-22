import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trophy } from "lucide-react";
import type { UserProgress as UserProgressType } from "@/lib/gamification";
import { calculateLevel, calculateProgress, LEVELS } from "@/lib/gamification";

interface UserProgressProps {
  progress: UserProgressType;
}

export function UserProgress({ progress }: UserProgressProps) {
  const currentLevel = calculateLevel(progress.currentXP);
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
  const progressToNext = calculateProgress(progress.currentXP);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{currentLevel.title}</h3>
            <p className="text-sm text-muted-foreground">Level {currentLevel.level}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{progress.currentXP} XP</p>
            {nextLevel && (
              <p className="text-xs text-muted-foreground">
                Next level at {nextLevel.requiredXP} XP
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {nextLevel?.level ?? "Max"}</span>
            <span>{progressToNext}%</span>
          </div>
          <Progress
            value={progressToNext}
            className="h-2 animate-progress"
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Recent Achievements</h4>
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-3">
              {progress.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg animate-fadeIn"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-sm">{achievement.title}</h5>
                      <Badge variant="secondary" className="shrink-0">
                        +{achievement.points} XP
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {achievement.description}
                    </p>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="text-2xl">{achievement.icon}</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Unlocked: {achievement.unlockedAt?.toLocaleDateString()}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {currentLevel.rewards.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Current Level Rewards</h4>
            <div className="flex flex-wrap gap-2">
              {currentLevel.rewards.map((reward, index) => (
                <Badge key={index} variant="outline">
                  {reward}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
