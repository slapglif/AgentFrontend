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
  ChevronRight,
  Menu
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
      <div className="relative flex min-h-screen bg-background/50 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
        <aside 
          className={cn(
            "fixed top-0 h-screen shrink-0 border-r bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            "transition-[width,transform] duration-300 ease-in-out will-change-transform",
            "shadow-lg z-50",
            isCollapsed ? 
              "w-16 md:hover:w-64 group hover:shadow-xl" : 
              "w-64",
            "max-sm:w-[280px]",
            isCollapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0",
            "max-sm:z-[100] md:z-30"
          )}
          aria-label="Sidebar"
        >
          <div className="flex h-full flex-col">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className={cn(
                  "space-y-1.5",
                  "transition-all duration-300 ease-in-out transform overflow-hidden",
                  isCollapsed ? 
                    "w-0 opacity-0 md:group-hover:w-auto md:group-hover:opacity-100" : 
                    "w-auto opacity-100"
                )}>
                  <h2 className="text-lg font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                    Research System
                  </h2>
                  <p className="text-sm font-medium text-muted-foreground/90">
                    Multi-agent platform
                  </p>
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
                        "w-full justify-start gap-2",
                        "transition-[transform,background-color,color] duration-200 ease-out",
                        "hover:translate-x-1",
                        isCollapsed ? "px-2 md:px-3" : "px-3",
                        "relative overflow-hidden",
                        isActive ? 
                          "bg-secondary hover:bg-secondary/90 font-medium shadow-sm after:absolute after:inset-y-0 after:left-0 after:w-[2px] after:bg-primary" : 
                          "hover:bg-accent/80 hover:text-accent-foreground active:scale-[0.98]"
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
          "flex-1 min-h-screen",
          "transition-all duration-300 ease-in-out",
          "bg-background/50 backdrop-blur-sm",
          isCollapsed ? "md:ml-16" : "md:ml-64",
          "max-sm:ml-0 relative z-10"
        )}>
          <div className="sticky top-0 z-20 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
              >
                <span className="sr-only">Toggle sidebar</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
              
              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>
            
            {/* Mobile overlay */}
            {!isCollapsed && (
              <div 
                className="fixed inset-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-opacity z-40 md:hidden"
                onClick={() => setIsCollapsed(true)}
                aria-hidden="true"
              />
            )}
          </div>
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 h-[calc(100vh-4rem)] animate-staggered-fade-in">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
