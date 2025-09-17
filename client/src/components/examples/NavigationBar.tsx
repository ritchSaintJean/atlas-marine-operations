import { useState } from "react";
import NavigationBar from '../NavigationBar';

export default function NavigationBarExample() {
  const [activeTab, setActiveTab] = useState("projects");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    console.log('Navigation tab changed:', tab);
  };

  return (
    <div className="relative h-screen bg-background">
      <div className="p-4 pb-20">
        <h2 className="text-xl font-semibold mb-4">Current Tab: {activeTab}</h2>
        <p className="text-muted-foreground">
          This demonstrates the mobile navigation bar with offline mode indicator.
        </p>
      </div>
      
      <NavigationBar 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        offlineMode={true}
        pendingSyncCount={3}
      />
    </div>
  );
}