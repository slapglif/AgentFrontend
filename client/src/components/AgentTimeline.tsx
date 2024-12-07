import { useQuery } from "@tanstack/react-query";
import { MemoryCard } from "./MemoryCard";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AgentTimeline() {
  const { data: memories } = useQuery({
    queryKey: ["memories"],
    queryFn: async () => {
      const res = await fetch("/api/memories");
      if (!res.ok) throw new Error("Failed to load memories");
      return res.json();
    },
    refetchInterval: 1000,
  });

  return (
    <div className="h-full">
      <h2 className="text-xl font-semibold mb-4">Memory Timeline</h2>
      <ScrollArea className="h-[calc(100%-2rem)]">
        <div className="space-y-4 p-4">
          {memories?.map((memory: any) => (
            <div 
              key={memory.id} 
              className="relative animate-fadeIn transition-all duration-300 hover:translate-x-1"
            >
              <div className="absolute left-0 w-0.5 h-full bg-gradient-to-b from-primary via-primary/50 to-transparent animate-pulse" 
                style={{
                  boxShadow: '0 0 8px var(--primary), 0 0 12px var(--primary)',
                  animation: 'gradient-flow 3s linear infinite'
                }}
              />
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
      </ScrollArea>
    </div>
  );
}
