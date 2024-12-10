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

  const handleReset = () => {
    setAutoSave(true);
    setNotificationsEnabled(true);
    setUpdateFrequency('30');
    setErrorLogging(true);
    setAgentVerbosity('normal');
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to their default values.",
    });
  };

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <Button variant="outline" onClick={handleReset}>Reset to Defaults</Button>
          </div>
          
          <Card className="p-6 transition-all duration-300 hover:shadow-md">
            <h3 className="text-lg font-medium mb-2">System Preferences</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Configure how the system behaves and interacts
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-save Changes</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save changes made to agent configurations
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
                    Receive notifications about important agent activities
                  </p>
                </div>
                <Switch 
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium">Agent Settings</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Control how agents operate and communicate
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Update Frequency</Label>
                  <p className="text-sm text-muted-foreground">
                    How often agents should check for updates (in seconds)
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
                  <Label>Agent Verbosity</Label>
                  <p className="text-sm text-muted-foreground">
                    Control the detail level of agent logs and outputs
                  </p>
                </div>
                <Select value={agentVerbosity} onValueChange={setAgentVerbosity}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select verbosity" />
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

          <Card className="p-6">
            <h3 className="text-lg font-medium">Error Handling</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Configure how errors are handled and logged
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Detailed Error Logging</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable detailed logging for debugging purposes
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
      </TooltipProvider>
    </ErrorBoundary>
  );
}
