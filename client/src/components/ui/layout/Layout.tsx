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
  MessageSquare
} from "lucide-react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navigationItems = [
    { href: "/", label: "Overview", icon: LayoutIcon },
    { href: "/agents", label: "Agents", icon: Users },
    { href: "/goals", label: "Goals", icon: KanbanSquare },
    { href: "/analytics", label: "Analytics", icon: BarChart },
    { href: "/history", label: "History", icon: Clock },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <div className="flex h-screen bg-background">
        <aside className="w-64 border-r bg-muted/30 backdrop-blur-sm">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold px-2">Research System</h2>
                  <p className="text-sm text-muted-foreground px-2">Multi-agent platform</p>
                </div>
                <ThemeToggle />
              </div>
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2 hover:bg-primary/10"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        </ScrollArea>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
    </ThemeProvider>
  );
}
