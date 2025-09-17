import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Clipboard, Camera, Settings, User } from "lucide-react";

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  offlineMode?: boolean;
  pendingSyncCount?: number;
}

export default function NavigationBar({ 
  activeTab, 
  onTabChange, 
  offlineMode = false,
  pendingSyncCount = 0 
}: NavigationBarProps) {
  const tabs = [
    { id: "projects", label: "Projects", icon: Home },
    { id: "checklists", label: "Tasks", icon: Clipboard },
    { id: "camera", label: "Camera", icon: Camera },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50" data-testid="navigation-bar">
      {/* Offline indicator */}
      {offlineMode && (
        <div className="bg-chart-3 text-white px-4 py-2 text-center text-sm">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Offline Mode
            {pendingSyncCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                {pendingSyncCount} pending
              </Badge>
            )}
          </div>
        </div>
      )}
      
      {/* Navigation tabs */}
      <div className="grid grid-cols-4 p-2 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              className={`flex flex-col gap-1 h-auto py-2 px-1 ${isActive ? '' : 'text-muted-foreground'}`}
              onClick={() => onTabChange(tab.id)}
              data-testid={`nav-${tab.id}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}