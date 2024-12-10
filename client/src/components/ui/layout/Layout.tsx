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
    { href: "/", label: "Overview", icon: LayoutIcon },
    { href: "/agents", label: "Agents", icon: Users },
    { href: "/collaborations", label: "Collaborations", icon: MessageSquare },
    { href: "/goals", label: "Goals", icon: KanbanSquare },
    { href: "/analytics", label: "Analytics", icon: BarChart },
    { href: "/history", label: "History", icon: Clock },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <div className="flex min-h-screen">
        <aside 
          className={cn(
            "fixed top-0 h-screen shrink-0 border-r bg-background/95 backdrop-blur-sm transition-[width] duration-300 z-30",
            isCollapsed ? "w-16" : "w-64"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="p-4">
              <div className="flex items-center justify-between">
                {!isCollapsed && (
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold">Research System</h2>
                    <p className="text-sm text-muted-foreground">Multi-agent platform</p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="shrink-0"
                  >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  </Button>
                  {!isCollapsed && <ThemeToggle />}
                </div>
              </div>
            </div>
            <nav className="flex-1 space-y-1 p-4 pt-0">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-2",
                        isCollapsed && "px-2"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!isCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        <main className={cn(
          "flex-1 min-h-screen transition-[margin] duration-300",
          isCollapsed ? "ml-16" : "ml-64"
        )}>
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
