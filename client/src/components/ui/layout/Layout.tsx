import { Link, useLocation } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Panel, PanelGroup } from "react-resizable-panels";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SIDEBAR_WIDTH = 256;
const SIDEBAR_COLLAPSED_WIDTH = 64;

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useLocalStorage('sidebar-collapsed', false);
  const [isMounted, setIsMounted] = useState(false);

  const navigationItems: NavigationItem[] = [
    { href: "/", label: "Overview", icon: LayoutIcon },
    { href: "/agents", label: "Agents", icon: Users },
    { href: "/collaborations", label: "Collaborations", icon: MessageSquare },
    { href: "/goals", label: "Goals", icon: KanbanSquare },
    { href: "/analytics", label: "Analytics", icon: BarChart },
    { href: "/history", label: "History", icon: Clock },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setIsMounted(true);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <div className="flex h-screen overflow-hidden bg-background">
        <aside 
          className="fixed top-0 left-0 h-screen border-r bg-muted/30 backdrop-blur-sm z-50"
          style={{
            width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
            transition: isMounted ? 'width 300ms ease-in-out' : 'none'
          }}
        >
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <div className="mb-8 flex items-center justify-between">
                {!isCollapsed && (
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">Research System</h2>
                    <p className="text-sm text-muted-foreground">Multi-agent platform</p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="shrink-0 transition-all duration-300"
                  >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  </Button>
                  {!isCollapsed && <ThemeToggle />}
                </div>
              </div>
              <nav className="space-y-1.5">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={`w-full justify-start gap-2.5 transition-all ${
                          isCollapsed ? 'px-2' : ''
                        }`}
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
          </ScrollArea>
        </aside>
        <main 
          className="flex-1 h-screen overflow-hidden bg-background"
          style={{
            marginLeft: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
            transition: isMounted ? 'margin-left 300ms ease-in-out' : 'none'
          }}
        >
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
