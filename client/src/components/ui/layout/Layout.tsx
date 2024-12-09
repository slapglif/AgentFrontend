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
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useLocalStorage('sidebar-collapsed', false);
  const [sidebarSize, setSidebarSize] = useLocalStorage('sidebar-size', 20); // 20% of viewport

  const navigationItems = [
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
      <div className="flex h-screen bg-background overflow-hidden">
        <PanelGroup direction="horizontal">
          <Panel 
            defaultSize={sidebarSize}
            minSize={5}
            maxSize={30}
            onCollapse={(collapsed) => setIsCollapsed(collapsed)}
            collapsible
            className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[50px]' : ''}`}
          >
            <aside className="h-full border-r bg-muted/30 backdrop-blur-sm">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  <div className="mb-8 flex items-center justify-between">
                    {!isCollapsed && (
                      <div>
                        <h2 className="text-lg font-semibold px-2">Research System</h2>
                        <p className="text-sm text-muted-foreground px-2">Multi-agent platform</p>
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
                  <nav className="space-y-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location === item.href;
                      return (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className={`w-full justify-start gap-2 hover:bg-primary/10 ${
                              isCollapsed ? 'px-2' : ''
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {!isCollapsed && item.label}
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
          <Panel minSize={30}>
            <main className="flex-1 flex flex-col overflow-hidden">
              {children}
            </main>
          </Panel>
        </PanelGroup>
      </div>
    </ThemeProvider>
  );
}
