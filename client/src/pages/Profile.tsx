import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { User, Settings, LogOut, Wifi, WifiOff, FolderSync } from "lucide-react";

export default function Profile() {
  // Mock data - TODO: Remove when implementing real data
  const user = {
    name: "Mike Rodriguez",
    role: "Field Worker",
    crew: "Team A",
    totalProjects: 24,
    completedTasks: 156,
    photosTaken: 432
  };

  const isOnline = true; // TODO: Replace with real connectivity status
  const pendingSyncCount = 3; // TODO: Replace with real sync status

  return (
    <div className="space-y-6" data-testid="profile-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" data-testid="page-title">Profile</h1>
        <ThemeToggle />
      </div>

      {/* User Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16" data-testid="user-avatar">
              <AvatarImage src="" />
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold" data-testid="text-user-name">{user.name}</h2>
              <p className="text-muted-foreground" data-testid="text-user-role">{user.role}</p>
              <Badge variant="outline" className="mt-1" data-testid="badge-crew">
                {user.crew}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Stats</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary" data-testid="stat-projects">{user.totalProjects}</div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-chart-2" data-testid="stat-tasks">{user.completedTasks}</div>
            <div className="text-sm text-muted-foreground">Tasks Done</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-chart-3" data-testid="stat-photos">{user.photosTaken}</div>
            <div className="text-sm text-muted-foreground">Photos</div>
          </div>
        </CardContent>
      </Card>

      {/* FolderSync Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isOnline ? <Wifi className="w-5 h-5 text-chart-2" /> : <WifiOff className="w-5 h-5 text-destructive" />}
            FolderSync Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium" data-testid="text-connection-status">
                {isOnline ? "Connected" : "Offline Mode"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isOnline ? "Data synced in real-time" : "Changes saved locally"}
              </p>
            </div>
            <Badge variant={isOnline ? "default" : "destructive"} data-testid="badge-connection">
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
          
          {pendingSyncCount > 0 && (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Pending FolderSync</p>
                <p className="text-sm text-muted-foreground">
                  {pendingSyncCount} items waiting to sync
                </p>
              </div>
              <Button variant="outline" size="sm" data-testid="button-sync">
                <FolderSync className="w-4 h-4 mr-2" />
                FolderSync Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" data-testid="button-settings">
            <Settings className="w-4 h-4 mr-2" />
            App Settings
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-account">
            <User className="w-4 h-4 mr-2" />
            Account Settings
          </Button>
          <Button variant="outline" className="w-full justify-start text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground" data-testid="button-logout">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}