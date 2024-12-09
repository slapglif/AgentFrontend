import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import { registerLicense } from '@syncfusion/ej2-base';
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-react-gantt/styles/material.css";
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

// Register Syncfusion license
registerLicense('Mgo+DSMBaFt+QHJqVk1hXk5Hd0BLVGpAblJ3T2ZQdVt5ZDU7a15RRnVfR1xjSXdTc0VnWHteeQ==;Mgo+DSMBPh8sVXJ1S0R+X1pFdEBBXHxAd1p/VWJYdVt5flBPcDwsT3RfQF5jS39Td0VmW3pfeXNVRw==;ORg4AjUWIQA/Gnt2VFhiQlJPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXtScURmWXtadHFdRWg=;MjU4NzEyNUAzMjMyMmUzMDJlMzBRU3M0YkxnUk9RdEtVQ2tYcmt0ZWpyODM3K0VDSlZaZ2N6SndQSHpvTEk4PQ==;MjU4NzEyNkAzMjMyMmUzMDJlMzBkT3FrWlRTb3U4M3F0ZlBhWVhRaFREenZKcFl2R2J6NzdNWGdWV1RsQkVnPQ==;NRAiBiAaIQQuGjN/V0d+Xk9HfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5WdkRiX3xccXBTR2NY;MjU4NzEyOEAzMjMyMmUzMDJlMzBEY0Y0clVTbDJSblpUZllYcEVhZGRnUGpYNEo4cGo0RFRKaElaZURVTnU0PQ==;MjU4NzEyOUAzMjMyMmUzMDJlMzBhNEVnQnhFM1BSNDNGbE5HV1ZHUUpRc3NTVEJMa0dDZG9XYmVjeGZqNWJFPQ==;Mgo+DSMBMAY9C3t2VFhiQlJPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXtScURmWXtadHFWR2g=;MjU4NzEzMUAzMjMyMmUzMDJlMzBJOE80NHBJbWdMcnQ0V3VUbmhyQUUxYzlZNlJnL2FXcmJSVUxXTVlrMFpvPQ==;MjU4NzEzMkAzMjMyMmUzMDJlMzBjQmhOMVc2M3BYQnJoNkJjVHRJM1Y1VkN3YnFJUDJDRFhRMUJ0NDhRNWxnPQ==;MjU4NzEzM0AzMjMyMmUzMDJlMzBEY0Y0clVTbDJSblpUZllYcEVhZGRnUGpYNEo4cGo0RFRKaElaZURVTnU0PQ==');

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

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

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
