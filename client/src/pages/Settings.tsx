import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function Settings() {
  const [autoSave, setAutoSave] = useLocalStorage('settings-autosave', true);
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage('settings-notifications', true);
  const [updateFrequency, setUpdateFrequency] = useLocalStorage('settings-update-frequency', '30');
  const [errorLogging, setErrorLogging] = useLocalStorage('settings-error-logging', true);
  const [agentVerbosity, setAgentVerbosity] = useLocalStorage('settings-agent-verbosity', 'normal');
  const [darkMode, setDarkMode] = useLocalStorage('settings-dark-mode', false);
  const [agentCollaboration, setAgentCollaboration] = useLocalStorage('settings-agent-collaboration', true);
  const [resourceMonitoring, setResourceMonitoring] = useLocalStorage('settings-resource-monitoring', true);
  const [learningRate, setLearningRate] = useLocalStorage('settings-learning-rate', 'adaptive');
  const [memoryRetention, setMemoryRetention] = useLocalStorage('settings-memory-retention', '7');

  const handleReset = () => {
    setAutoSave(true);
    setNotificationsEnabled(true);
    setUpdateFrequency('30');
    setErrorLogging(true);
    setAgentVerbosity('normal');
    setDarkMode(false);
    setAgentCollaboration(true);
    setResourceMonitoring(true);
    setLearningRate('adaptive');
    setMemoryRetention('7');
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to their default values.",
    });
  };

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <div className="container py-6 space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold">Settings</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your research system preferences</p>
            </div>
            <Button variant="outline" onClick={handleReset} className="hover:bg-destructive/10">
              Reset to Defaults
            </Button>
          </div>
          
          <div className="grid gap-6">
            <Card className="p-6 transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:bg-card/50">
              <h3 className="text-xl font-medium mb-2">Interface Preferences</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Customize your research environment appearance and behavior
              </p>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable dark theme for the interface
                    </p>
                  </div>
                  <Switch 
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-save Changes</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save changes to agent configurations
                    </p>
                  </div>
                  <Switch 
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Desktop Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about important agent activities
                    </p>
                  </div>
                  <Switch 
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:bg-card/50">
              <h3 className="text-xl font-medium mb-2">Agent Behavior</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Configure how agents operate, learn, and collaborate
              </p>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Agent Collaboration</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable multi-agent collaboration features
                    </p>
                  </div>
                  <Switch 
                    checked={agentCollaboration}
                    onCheckedChange={setAgentCollaboration}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Learning Rate</Label>
                    <p className="text-sm text-muted-foreground">
                      Control how quickly agents adapt to new information
                    </p>
                  </div>
                  <Select value={learningRate} onValueChange={setLearningRate}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                      <SelectItem value="adaptive">Adaptive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Memory Retention</Label>
                    <p className="text-sm text-muted-foreground">
                      How long to retain agent memory (in days)
                    </p>
                  </div>
                  <Select value={memoryRetention} onValueChange={setMemoryRetention}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-6 transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:bg-card/50">
              <h3 className="text-xl font-medium mb-2">System Performance</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Manage system resources and monitoring
              </p>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Resource Monitoring</Label>
                    <p className="text-sm text-muted-foreground">
                      Track system resource usage in real-time
                    </p>
                  </div>
                  <Switch 
                    checked={resourceMonitoring}
                    onCheckedChange={setResourceMonitoring}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Update Frequency</Label>
                    <p className="text-sm text-muted-foreground">
                      How often to refresh agent states (in seconds)
                    </p>
                  </div>
                  <Select value={updateFrequency} onValueChange={setUpdateFrequency}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                      <SelectItem value="300">5 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Verbosity Level</Label>
                    <p className="text-sm text-muted-foreground">
                      Set the detail level of system logs
                    </p>
                  </div>
                  <Select value={agentVerbosity} onValueChange={setAgentVerbosity}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="debug">Debug</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-6 transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:bg-card/50">
              <h3 className="text-xl font-medium mb-2">Error Handling</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Configure error logging and debugging options
              </p>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Detailed Error Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable comprehensive error tracking and debugging
                    </p>
                  </div>
                  <Switch 
                    checked={errorLogging}
                    onCheckedChange={setErrorLogging}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </TooltipProvider>
    </ErrorBoundary>
  );
}
