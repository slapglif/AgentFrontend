import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Layout as LayoutIcon, 
  Users, 
  Clock, 
  Settings,
  KanbanSquare,
  BarChart,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useLocalStorage('sidebar-collapsed', false);

  const navigationItems: NavigationItem[] = [
    { href: "/", label: "Dashboard", icon: LayoutIcon },
    { href: "/agents", label: "Agent Management", icon: Users },
    { href: "/collaborations", label: "Research Teams", icon: MessageSquare },
    { href: "/goals", label: "Research Goals", icon: KanbanSquare },
    { href: "/analytics", label: "Performance", icon: BarChart },
    { href: "/history", label: "Activity Log", icon: Clock },
    { href: "/settings", label: "System Settings", icon: Settings },
  ];

  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <div className="flex min-h-screen bg-background">
        <aside 
          className={cn(
            "fixed top-0 h-screen shrink-0 border-r bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 z-30 shadow-sm",
            isCollapsed ? "w-16 hover:w-64 group" : "w-64"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className={cn(
                  "space-y-1 transition-opacity duration-300",
                  isCollapsed ? "opacity-0 group-hover:opacity-100 hidden group-hover:block" : "opacity-100"
                )}>
                  <h2 className="text-lg font-semibold tracking-tight">Research System</h2>
                  <p className="text-sm text-muted-foreground">Multi-agent platform</p>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <div className={cn(
                    "transition-opacity duration-300",
                    isCollapsed ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                  )}>
                    <ThemeToggle />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="shrink-0"
                  >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <nav className="flex-1 space-y-1 p-4 pt-0 overflow-y-auto scrollbar-none">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-2 transition-colors",
                        isCollapsed && "px-2",
                        isActive ? "bg-secondary hover:bg-secondary/80" : "hover:bg-accent"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className={cn(
                        "truncate transition-opacity",
                        isCollapsed ? "opacity-0 group-hover:opacity-100 duration-300" : "opacity-100"
                      )}>
                        {item.label}
                      </span>
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        <main className={cn(
          "flex-1 min-h-screen transition-all duration-300 ease-in-out",
          isCollapsed ? "ml-16" : "ml-64"
        )}>
          <div className="container mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
