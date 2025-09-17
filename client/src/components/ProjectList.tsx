import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter } from "lucide-react";
import ProjectCard from "./ProjectCard";

interface Project {
  id: string;
  name: string;
  location: string;
  startDate: string;
  currentStage: string;
  progress: number;
  totalPhotos: number;
  crewSize: number;
  status: "active" | "completed" | "pending";
}

interface ProjectListProps {
  projects: Project[];
  onViewProject: (id: string) => void;
  onCreateProject?: () => void;
  isAdmin?: boolean;
}

export default function ProjectList({ 
  projects, 
  onViewProject, 
  onCreateProject,
  isAdmin = false 
}: ProjectListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    const counts = {
      all: projects.length,
      active: projects.filter(p => p.status === "active").length,
      completed: projects.filter(p => p.status === "completed").length,
      pending: projects.filter(p => p.status === "pending").length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6" data-testid="project-list">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="page-title">Projects</h1>
          <p className="text-muted-foreground">Manage your marine service projects</p>
        </div>
        {isAdmin && onCreateProject && (
          <Button onClick={onCreateProject} data-testid="button-create-project">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all", label: "All", count: statusCounts.all },
              { key: "active", label: "Active", count: statusCounts.active },
              { key: "pending", label: "Pending", count: statusCounts.pending },
              { key: "completed", label: "Completed", count: statusCounts.completed },
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={statusFilter === filter.key ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(filter.key)}
                className="gap-2"
                data-testid={`filter-${filter.key}`}
              >
                {filter.label}
                <Badge variant="secondary" className="text-xs">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="projects-grid">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              onViewProject={onViewProject}
            />
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground" data-testid="no-projects-message">
                {searchTerm || statusFilter !== "all" 
                  ? "No projects match your filters." 
                  : "No projects yet. Create your first project to get started."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}