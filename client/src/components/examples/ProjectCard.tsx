import ProjectCard from '../ProjectCard';

export default function ProjectCardExample() {
  const handleViewProject = (id: string) => {
    console.log('View project triggered:', id);
  };

  return (
    <div className="p-4 space-y-4">
      <ProjectCard
        id="proj-001"
        name="Marina Dock Restoration"
        location="Harbor Bay Marina"
        startDate="Mar 15"
        currentStage="Blasting"
        progress={65}
        totalPhotos={23}
        crewSize={3}
        status="active"
        onViewProject={handleViewProject}
      />
      <ProjectCard
        id="proj-002"
        name="Vessel Hull Protection"
        location="Port Authority"
        startDate="Mar 10"
        currentStage="Completed"
        progress={100}
        totalPhotos={45}
        crewSize={2}
        status="completed"
        onViewProject={handleViewProject}
      />
    </div>
  );
}