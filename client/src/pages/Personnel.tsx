import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Search, 
  Plus, 
  AlertTriangle,
  Shield,
  Calendar,
  FileText,
  Award,
  Clock
} from "lucide-react";
import PersonnelCard from "@/components/PersonnelCard";
import CertificationTracker from "@/components/CertificationTracker";
import MedicalClearances from "@/components/MedicalClearances";

interface PersonnelMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: "operations" | "safety" | "maintenance" | "administration";
  hireDate: string;
  isActive: boolean;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  certifications: Certification[];
  medicalClearances: MedicalClearance[];
  equipmentAssignments: EquipmentAssignment[];
}

interface Certification {
  id: string;
  type: "safety" | "technical" | "medical" | "regulatory";
  name: string;
  issuingOrganization: string;
  certificateNumber: string;
  issueDate: string;
  expirationDate: string;
  isExpired: boolean;
  isExpiringSoon: boolean; // Within 30 days
  documentUrl?: string;
  renewalRequired: boolean;
}

interface MedicalClearance {
  id: string;
  type: "physical" | "respiratory" | "vision" | "hearing" | "psychological";
  description: string;
  provider: string;
  testDate: string;
  expirationDate: string;
  result: "cleared" | "restricted" | "not_cleared";
  restrictions?: string[];
  isExpired: boolean;
  isExpiringSoon: boolean;
}

interface EquipmentAssignment {
  id: string;
  equipmentId: string;
  projectId?: string;
  assignedDate: string;
  purpose: string;
  notes?: string;
  status: string;
}

export default function Personnel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Fetch personnel data from API
  const { data: personnelData, isLoading, error } = useQuery({
    queryKey: ['/api/personnel'],
    select: (data: any[]) => data.map((item: any) => ({
      id: item.user.id,
      firstName: item.user.firstName,
      lastName: item.user.lastName,
      email: item.user.email || "",
      phone: item.user.phone || "",
      position: item.user.position || "",
      department: item.user.department || "operations",
      hireDate: item.user.hireDate || new Date().toISOString(),
      isActive: item.user.isActive,
      emergencyContact: item.user.emergencyContact || {
        name: "",
        relationship: "",
        phone: ""
      },
      certifications: item.certifications.map((cert: any) => ({
        id: cert.id,
        type: cert.type,
        name: cert.name,
        issuingOrganization: cert.issuingOrganization,
        certificateNumber: cert.certificateNumber,
        issueDate: cert.issueDate,
        expirationDate: cert.expirationDate,
        isExpired: cert.status === "expired" || (cert.expirationDate && new Date(cert.expirationDate) < new Date()),
        isExpiringSoon: cert.expirationDate && 
          new Date(cert.expirationDate) > new Date() && 
          new Date(cert.expirationDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        renewalRequired: cert.renewalRequired
      })),
      medicalClearances: item.medicalClearances.map((clearance: any) => ({
        id: clearance.id,
        type: clearance.type,
        description: clearance.description,
        provider: clearance.provider,
        testDate: clearance.testDate,
        expirationDate: clearance.expirationDate,
        result: clearance.result,
        restrictions: clearance.restrictions || [],
        isExpired: clearance.expirationDate && new Date(clearance.expirationDate) < new Date(),
        isExpiringSoon: clearance.expirationDate && 
          new Date(clearance.expirationDate) > new Date() && 
          new Date(clearance.expirationDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      })),
      equipmentAssignments: item.equipmentAssignments.map((assignment: any) => ({
        id: assignment.id,
        equipmentId: assignment.equipmentId,
        projectId: assignment.projectId,
        assignedDate: assignment.assignedDate,
        purpose: assignment.purpose,
        notes: assignment.notes,
        status: assignment.status
      }))
    }))
  });

  const personnel: PersonnelMember[] = personnelData || [];

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="personnel-page">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading personnel data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6" data-testid="personnel-page">
        <Card className="border-destructive">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">Error loading personnel data</h3>
            <p className="text-muted-foreground">Unable to load personnel information. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Remove mock data - using real API data above
  /*
  const personnel: PersonnelMember[] = [
    {
      id: "emp-001",
      firstName: "Mike",
      lastName: "Rodriguez",
      email: "mike.rodriguez@atlasmarinegroup.com",
      phone: "(555) 123-4567",
      position: "Lead Blast Technician",
      department: "operations",
      hireDate: "2022-03-15",
      isActive: true,
      emergencyContact: {
        name: "Maria Rodriguez",
        relationship: "Spouse",
        phone: "(555) 987-6543"
      },
      certifications: [
        {
          id: "cert-001",
          type: "safety",
          name: "Confined Space Entry",
          issuingOrganization: "OSHA",
          certificateNumber: "CSE-2024-001",
          issueDate: "2024-01-15",
          expirationDate: "2025-01-15",
          isExpired: false,
          isExpiringSoon: false,
          renewalRequired: false
        },
        {
          id: "cert-002", 
          type: "technical",
          name: "Abrasive Blasting Certification",
          issuingOrganization: "NACE International",
          certificateNumber: "ABC-2023-789",
          issueDate: "2023-06-20",
          expirationDate: "2024-06-20",
          isExpired: true,
          isExpiringSoon: false,
          renewalRequired: true
        }
      ],
      medicalClearances: [
        {
          id: "med-001",
          type: "respiratory",
          description: "Respirator Fit Test - Full Face",
          provider: "OccuHealth Medical",
          testDate: "2024-02-10",
          expirationDate: "2025-02-10",
          result: "cleared",
          isExpired: false,
          isExpiringSoon: false
        },
        {
          id: "med-002",
          type: "physical",
          description: "Annual Physical Examination",
          provider: "Atlantic Medical Center",
          testDate: "2024-01-08",
          expirationDate: "2025-01-08", 
          result: "cleared",
          isExpired: false,
          isExpiringSoon: false
        }
      ]
    },
    {
      id: "emp-002",
      firstName: "Sarah",
      lastName: "Chen",
      email: "sarah.chen@atlasmarinegroup.com",
      phone: "(555) 234-5678",
      position: "Safety Officer",
      department: "safety",
      hireDate: "2021-11-08",
      isActive: true,
      emergencyContact: {
        name: "David Chen",
        relationship: "Brother",
        phone: "(555) 876-5432"
      },
      certifications: [
        {
          id: "cert-003",
          type: "safety",
          name: "OSHA 30-Hour Construction",
          issuingOrganization: "OSHA",
          certificateNumber: "OSHA30-2023-456",
          issueDate: "2023-09-12",
          expirationDate: "2026-09-12",
          isExpired: false,
          isExpiringSoon: false,
          renewalRequired: false
        },
        {
          id: "cert-004",
          type: "regulatory",
          name: "Hazmat Transportation",
          issuingOrganization: "DOT",
          certificateNumber: "HMT-2024-123",
          issueDate: "2024-02-28",
          expirationDate: "2024-04-15",
          isExpired: false,
          isExpiringSoon: true,
          renewalRequired: true
        }
      ],
      medicalClearances: [
        {
          id: "med-003",
          type: "vision",
          description: "Vision Screening - Safety Glasses",
          provider: "VisionCare Associates",
          testDate: "2024-01-22",
          expirationDate: "2025-01-22",
          result: "cleared",
          isExpired: false,
          isExpiringSoon: false
        }
      ]
    },
    {
      id: "emp-003",
      firstName: "Carlos",
      lastName: "Torres",
      email: "carlos.torres@atlasmarinegroup.com",
      phone: "(555) 345-6789",
      position: "Equipment Operator",
      department: "operations",
      hireDate: "2023-07-20",
      isActive: true,
      emergencyContact: {
        name: "Isabella Torres",
        relationship: "Spouse",
        phone: "(555) 765-4321"
      },
      certifications: [
        {
          id: "cert-005",
          type: "technical",
          name: "Crane Operator License",
          issuingOrganization: "NCCCO",
          certificateNumber: "COL-2023-987",
          issueDate: "2023-08-15",
          expirationDate: "2025-08-15",
          isExpired: false,
          isExpiringSoon: false,
          renewalRequired: false
        }
      ],
      medicalClearances: [
        {
          id: "med-004",
          type: "physical",
          description: "DOT Physical Examination",
          provider: "Maritime Health Services",
          testDate: "2023-12-05",
          expirationDate: "2024-04-10", 
          result: "cleared",
          isExpired: false,
          isExpiringSoon: true
        }
      ]
    }
  ];
  */

  const departments = [
    { id: "all", label: "All Departments" },
    { id: "operations", label: "Operations" },
    { id: "safety", label: "Safety" },
    { id: "maintenance", label: "Maintenance" },
    { id: "administration", label: "Administration" }
  ];

  const statusFilters = [
    { id: "all", label: "All Personnel" },
    { id: "active", label: "Active Only" },
    { id: "needs_attention", label: "Needs Attention" }
  ];

  const filteredPersonnel = personnel.filter(person => {
    const matchesSearch = 
      person.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === "all" || person.department === selectedDepartment;
    
    const matchesStatus = selectedStatus === "all" || 
      (selectedStatus === "active" && person.isActive) ||
      (selectedStatus === "needs_attention" && (
        person.certifications.some(cert => cert.isExpired || cert.isExpiringSoon) ||
        person.medicalClearances.some(med => med.isExpired || med.isExpiringSoon)
      ));
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getPersonnelStats = () => {
    const totalActive = personnel.filter(p => p.isActive).length;
    const expiredCerts = personnel.reduce((count, person) => 
      count + person.certifications.filter(cert => cert.isExpired).length, 0
    );
    const expiringSoonCerts = personnel.reduce((count, person) => 
      count + person.certifications.filter(cert => cert.isExpiringSoon).length, 0
    );
    const expiredMedical = personnel.reduce((count, person) => 
      count + person.medicalClearances.filter(med => med.isExpired).length, 0
    );
    const expiringSoonMedical = personnel.reduce((count, person) => 
      count + person.medicalClearances.filter(med => med.isExpiringSoon).length, 0
    );
    
    return {
      totalActive,
      expiredCerts,
      expiringSoonCerts,
      expiredMedical,
      expiringSoonMedical,
      needsAttention: expiredCerts + expiringSoonCerts + expiredMedical + expiringSoonMedical
    };
  };

  const stats = getPersonnelStats();

  return (
    <div className="space-y-6" data-testid="personnel-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="page-title">Personnel Management</h1>
          <p className="text-muted-foreground">Track certifications, medical clearances, and training records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-reports">
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </Button>
          <Button data-testid="button-add-personnel">
            <Plus className="w-4 h-4 mr-2" />
            Add Personnel
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary" data-testid="stat-total-personnel">
              {stats.totalActive}
            </div>
            <div className="text-sm text-muted-foreground">Active Personnel</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive" data-testid="stat-needs-attention">
              {stats.needsAttention}
            </div>
            <div className="text-sm text-muted-foreground">Needs Attention</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3" data-testid="stat-expired-certs">
              {stats.expiredCerts + stats.expiringSoonCerts}
            </div>
            <div className="text-sm text-muted-foreground">Cert Issues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4" data-testid="stat-medical-issues">
              {stats.expiredMedical + stats.expiringSoonMedical}
            </div>
            <div className="text-sm text-muted-foreground">Medical Issues</div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Alerts */}
      {stats.needsAttention > 0 && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <div>
                  <p className="font-medium text-destructive">Compliance Alert</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.needsAttention} items require immediate attention
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" data-testid="button-view-alerts">
                <Clock className="w-3 h-3 mr-1" />
                Review Items
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="personnel" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personnel" data-testid="tab-personnel">Personnel</TabsTrigger>
          <TabsTrigger value="certifications" data-testid="tab-certifications">Certifications</TabsTrigger>
          <TabsTrigger value="medical" data-testid="tab-medical">Medical</TabsTrigger>
        </TabsList>

        <TabsContent value="personnel" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search personnel by name, position, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-personnel"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Department</label>
                    <div className="flex flex-wrap gap-2">
                      {departments.map((dept) => (
                        <Button
                          key={dept.id}
                          variant={selectedDepartment === dept.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedDepartment(dept.id)}
                          data-testid={`button-filter-dept-${dept.id}`}
                        >
                          {dept.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <div className="flex flex-wrap gap-2">
                      {statusFilters.map((status) => (
                        <Button
                          key={status.id}
                          variant={selectedStatus === status.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedStatus(status.id)}
                          data-testid={`button-filter-status-${status.id}`}
                        >
                          {status.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personnel List */}
          <div className="grid gap-4">
            {filteredPersonnel.map((person) => (
              <PersonnelCard key={person.id} person={person} />
            ))}
          </div>

          {filteredPersonnel.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No personnel found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <CertificationTracker personnel={personnel} />
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          <MedicalClearances personnel={personnel} />
        </TabsContent>
      </Tabs>
    </div>
  );
}