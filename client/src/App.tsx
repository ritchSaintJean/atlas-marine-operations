import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import NavigationBar from "@/components/NavigationBar";
import Projects from "@/pages/Projects";
import Checklists from "@/pages/Checklists";
import Camera from "@/pages/Camera";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Projects} />
      <Route path="/projects" component={Projects} />
      <Route path="/checklists" component={Checklists} />
      <Route path="/camera" component={Camera} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("projects");
  const [isOffline] = useState(false); // TODO: Implement real offline detection
  const [pendingSyncCount] = useState(0); // TODO: Implement real sync tracking

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Navigate to the corresponding route
    window.history.pushState({}, '', tab === "projects" ? "/" : `/${tab}`);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="atlas-marine-theme">
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            {/* Main Content */}
            <main className="container mx-auto px-4 py-6 pb-24 max-w-4xl">
              <Router />
            </main>
            
            {/* Mobile Navigation */}
            <NavigationBar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              offlineMode={isOffline}
              pendingSyncCount={pendingSyncCount}
            />
            
            <Toaster />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
