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
      <div className="flex min-h-screen bg-background">
        <aside 
          className={cn(
            "fixed top-0 h-screen shrink-0 border-r bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            "transition-all duration-500 ease-in-out z-30",
            "shadow-lg hover:shadow-xl",
            isCollapsed ? 
              "w-16 hover:w-64 group md:hover:w-64 hover:translate-x-0" : 
              "w-64",
            "max-sm:w-[280px] max-sm:transform max-sm:translate-x-full max-sm:transition-transform",
            !isCollapsed && "max-sm:translate-x-0"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className={cn(
                  "space-y-1.5",
                  "transition-all duration-500 ease-in-out transform",
                  isCollapsed ? 
                    "opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 hidden group-hover:block" : 
                    "opacity-100 translate-x-0"
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
                        "transition-all duration-300 ease-in-out",
                        "hover:translate-x-1 hover:shadow-sm",
                        isCollapsed && "px-2",
                        isActive ? 
                          "bg-secondary hover:bg-secondary/80 font-medium" : 
                          "hover:bg-accent/80 hover:text-accent-foreground"
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
          "transition-all duration-500 ease-in-out",
          "bg-background/50 backdrop-blur-sm",
          isCollapsed ? "md:ml-16" : "md:ml-64",
          "max-sm:ml-0 relative"
        )}>
          <div className="sticky top-0 z-20 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container mx-auto flex h-16 items-center px-4">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 h-[calc(100vh-4rem)] animate-staggered-fade-in">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
