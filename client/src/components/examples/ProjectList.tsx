import ProjectList from '../ProjectList';

export default function ProjectListExample() {
  const projects = [
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

  const handleViewProject = (id: string) => {
    console.log('View project:', id);
  };

  const handleCreateProject = () => {
    console.log('Create new project');
  };

  return (
    <div className="p-4">
      <ProjectList
        projects={projects}
        onViewProject={handleViewProject}
        onCreateProject={handleCreateProject}
        isAdmin={true}
      />
    </div>
  );
}