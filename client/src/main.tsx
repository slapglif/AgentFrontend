import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/ui/layout/Layout";
import Home from "./pages/Home";
import Agents from "./pages/Agents";
import AgentDetails from "./pages/AgentDetails";
import Collaborations from "./pages/Collaborations";
import Analytics from "./pages/Analytics";
import Goals from "./pages/Goals";
import History from "./pages/History";
import Settings from "./pages/Settings";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/agents" component={Agents} />
        <Route path="/agents/:id" component={AgentDetails} />
        <Route path="/collaborations" component={Collaborations} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/goals" component={Goals} />
        <Route path="/history" component={History} />
        <Route path="/settings" component={Settings} />
        <Route>404 Page Not Found</Route>
      </Switch>
    </Layout>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
);
