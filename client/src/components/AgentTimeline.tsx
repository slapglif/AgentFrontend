import { useQuery } from "@tanstack/react-query";
import { mockMemoryData } from "@/lib/mockData";
import { MemoryCard } from "./MemoryCard";
import type { MemoryEntry } from "@/types/memory";

export function AgentTimeline() {
  const { data: memories } = useQuery<MemoryEntry[]>({
    queryKey: ["memories"],
    queryFn: () => Promise.resolve(mockMemoryData),
    refetchInterval: 5000,
  });

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 flex-shrink-0">Memory Timeline</h2>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 px-4 pb-6">
          {memories?.map((memory, idx) => (
            <div 
              key={`${memory.id}-${idx}`} 
              className="relative animate-staggered-fade-in transition-all duration-500 hover:translate-x-2"
              style={{
                animationDelay: `${idx * 150}ms`,
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <div 
                className="absolute left-0 w-0.5 h-full bg-gradient-to-b from-primary via-primary/50 to-transparent"
                style={{
                  animation: 'gradientShift 3s ease infinite',
                  boxShadow: '0 0 8px var(--primary), 0 0 12px var(--primary)',
                }}
              >
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                  style={{
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 3s linear infinite',
                  }}
                />
              </div>
              <div 
                className="absolute left-0 w-2 h-2 -translate-x-[3px] rounded-full bg-primary"
                style={{
                  boxShadow: '0 0 0 2px var(--background), 0 0 0 4px var(--primary), 0 0 12px var(--primary)',
                  animation: 'ping 1.5s ease-in-out infinite'
                }}
              />
              <div className="ml-6">
                <MemoryCard memory={memory} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
