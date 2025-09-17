import { useState } from "react";
import ProjectList from "@/components/ProjectList";

// Mock data - TODO: Remove when implementing real data
const mockProjects = [
  {
    id: "proj-001",
    name: "Marina Dock Restoration",
    location: "Harbor Bay Marina",
    startDate: "Mar 15",
    currentStage: "Blasting",
    progress: 65,
    totalPhotos: 23,
    crewSize: 3,
    status: "active" as const,
  },
  {
    id: "proj-002", 
    name: "Vessel Hull Protection",
    location: "Port Authority",
    startDate: "Mar 10",
    currentStage: "Completed",
    progress: 100,
    totalPhotos: 45,
    crewSize: 2,
    status: "completed" as const,
  },
  {
    id: "proj-003",
    name: "Ship Bottom Cleaning", 
    location: "Maritime Shipyard",
    startDate: "Mar 20",
    currentStage: "Protection",
    progress: 25,
    totalPhotos: 8,
    crewSize: 4,
    status: "active" as const,
  },
  {
    id: "proj-004",
    name: "Pier Maintenance",
    location: "Commercial Port", 
    startDate: "Mar 25",
    currentStage: "Planning",
    progress: 0,
    totalPhotos: 0,
    crewSize: 3,
    status: "pending" as const,
  }
];

export default function Projects() {
  const handleViewProject = (id: string) => {
    console.log('Navigate to project:', id);
    // TODO: Implement navigation to project details
  };

  const handleCreateProject = () => {
    console.log('Create new project');
    // TODO: Implement project creation
  };

  return (
    <ProjectList
      projects={mockProjects}
      onViewProject={handleViewProject}
      onCreateProject={handleCreateProject}
      isAdmin={true}
    />
  );
}