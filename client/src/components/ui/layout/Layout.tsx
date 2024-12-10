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
import { Panel, PanelGroup, PanelResizeHandle, ImperativePanelHandle } from "react-resizable-panels";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useRef } from "react";

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
  const [sidebarSize, setSidebarSize] = useLocalStorage('sidebar-size', 20);
  const panelRef = useRef<ImperativePanelHandle>(null);

  const navigationItems: NavigationItem[] = [
    { href: "/", label: "Overview", icon: LayoutIcon },
    { href: "/agents", label: "Agents", icon: Users },
    { href: "/collaborations", label: "Collaborations", icon: MessageSquare },
    { href: "/goals", label: "Goals", icon: KanbanSquare },
    { href: "/analytics", label: "Analytics", icon: BarChart },
    { href: "/history", label: "History", icon: Clock },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const handlePanelResize = (size: number) => {
    setSidebarSize(size);
  };

  const handleCollapse = () => {
    if (panelRef.current) {
      const newCollapsed = !isCollapsed;
      setIsCollapsed(newCollapsed);
      if (newCollapsed) {
        panelRef.current.collapse();
      } else {
        panelRef.current.expand();
      }
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <div className="flex h-screen bg-background">
        <PanelGroup direction="horizontal" className="w-full">
          <Panel 
            ref={panelRef}
            defaultSize={sidebarSize}
            minSize={5}
            maxSize={30}
            collapsible
            collapsedSize={0}
            onResize={handlePanelResize}
            className="transition-all duration-300"
          >
            <aside className="h-full border-r bg-muted/30 backdrop-blur-sm">
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
                        onClick={handleCollapse}
                        className="shrink-0"
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
          </Panel>
          <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />
          <Panel minSize={70}>
            <main className="h-screen overflow-y-auto bg-background">
              <div className="container mx-auto py-6 px-4">
                {children}
              </div>
            </main>
          </Panel>
        </PanelGroup>
      </div>
    </ThemeProvider>
  );
}
