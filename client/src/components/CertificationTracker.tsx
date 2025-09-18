import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Award, 
  Search, 
  Plus,
  Calendar,
  AlertTriangle,
  FileText,
  Shield,
  Wrench,
  Heart,
  Building
} from "lucide-react";

interface PersonnelMember {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  certifications: Certification[];
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
  isExpiringSoon: boolean;
  documentUrl?: string;
  renewalRequired: boolean;
}

interface CertificationTrackerProps {
  personnel: PersonnelMember[];
}

export default function CertificationTracker({ personnel }: CertificationTrackerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Flatten all certifications with personnel info
  const allCertifications = personnel.flatMap(person => 
    person.certifications.map(cert => ({
      ...cert,
      personnelId: person.id,
      personnelName: `${person.firstName} ${person.lastName}`,
      personnelPosition: person.position,
      personnelDepartment: person.department
    }))
  );

  const certificationTypes = [
    { id: "all", label: "All Types", icon: Award },
    { id: "safety", label: "Safety", icon: Shield },
    { id: "technical", label: "Technical", icon: Wrench },
    { id: "medical", label: "Medical", icon: Heart },
    { id: "regulatory", label: "Regulatory", icon: Building }
  ];

  const statusFilters = [
    { id: "all", label: "All Certificates" },
    { id: "valid", label: "Valid" },
    { id: "expiring_soon", label: "Expiring Soon" },
    { id: "expired", label: "Expired" },
    { id: "needs_renewal", label: "Needs Renewal" }
  ];

  const filteredCertifications = allCertifications.filter(cert => {
    const matchesSearch = 
      cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.personnelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuingOrganization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || cert.type === selectedType;
    
    const matchesStatus = selectedStatus === "all" ||
      (selectedStatus === "valid" && !cert.isExpired && !cert.isExpiringSoon) ||
      (selectedStatus === "expiring_soon" && cert.isExpiringSoon && !cert.isExpired) ||
      (selectedStatus === "expired" && cert.isExpired) ||
      (selectedStatus === "needs_renewal" && cert.renewalRequired);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getCertificationStats = () => {
    const total = allCertifications.length;
    const valid = allCertifications.filter(cert => !cert.isExpired && !cert.isExpiringSoon).length;
    const expiringSoon = allCertifications.filter(cert => cert.isExpiringSoon && !cert.isExpired).length;
    const expired = allCertifications.filter(cert => cert.isExpired).length;
    const needsRenewal = allCertifications.filter(cert => cert.renewalRequired).length;
    
    return { total, valid, expiringSoon, expired, needsRenewal };
  };

  const getCertificationTypeIcon = (type: string) => {
    const typeConfig = certificationTypes.find(t => t.id === type);
    const Icon = typeConfig?.icon || Award;
    return <Icon className="w-4 h-4" />;
  };

  const getCertificationTypeColor = (type: string) => {
    switch (type) {
      case "safety": return "bg-chart-3 text-white";
      case "technical": return "bg-primary text-primary-foreground";
      case "medical": return "bg-chart-4 text-white";
      case "regulatory": return "bg-chart-2 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (cert: Certification) => {
    if (cert.isExpired) return "bg-destructive text-white";
    if (cert.isExpiringSoon) return "bg-chart-3 text-white";
    return "bg-chart-2 text-white";
  };

  const getStatusLabel = (cert: Certification) => {
    if (cert.isExpired) return "Expired";
    if (cert.isExpiringSoon) return "Expiring Soon";
    return "Valid";
  };

  const getDaysUntilExpiration = (expirationDate: string) => {
    const now = new Date();
    const expiry = new Date(expirationDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = getCertificationStats();

  return (
    <div className="space-y-6" data-testid="certification-tracker">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary" data-testid="stat-total-certs">
              {stats.total}
            </div>
            <div className="text-sm text-muted-foreground">Total Certificates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2" data-testid="stat-valid-certs">
              {stats.valid}
            </div>
            <div className="text-sm text-muted-foreground">Valid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3" data-testid="stat-expiring-certs">
              {stats.expiringSoon}
            </div>
            <div className="text-sm text-muted-foreground">Expiring Soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive" data-testid="stat-expired-certs">
              {stats.expired}
            </div>
            <div className="text-sm text-muted-foreground">Expired</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4" data-testid="stat-renewal-certs">
              {stats.needsRenewal}
            </div>
            <div className="text-sm text-muted-foreground">Need Renewal</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search certifications, personnel, or organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-certifications"
              />
            </div>

            {/* Type Filters */}
            <div>
              <label className="text-sm font-medium mb-2 block">Certification Type</label>
              <div className="flex flex-wrap gap-2">
                {certificationTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.id}
                      variant={selectedType === type.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type.id)}
                      data-testid={`button-filter-type-${type.id}`}
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {type.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Status Filters */}
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
        </CardContent>
      </Card>

      {/* Certifications List */}
      <div className="space-y-4">
        {filteredCertifications.map((cert) => (
          <Card 
            key={cert.id} 
            className={`hover-elevate transition-all ${
              cert.isExpired ? 'border-destructive' : 
              cert.isExpiringSoon ? 'border-chart-3' : ''
            }`}
            data-testid={`card-certification-${cert.id}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getCertificationTypeIcon(cert.type)}
                    <h3 className="font-semibold" data-testid={`cert-name-${cert.id}`}>
                      {cert.name}
                    </h3>
                    <Badge className={getCertificationTypeColor(cert.type)}>
                      {cert.type}
                    </Badge>
                    <Badge className={getStatusColor(cert)} data-testid={`cert-status-${cert.id}`}>
                      {getStatusLabel(cert)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-1">
                    {cert.issuingOrganization} • Certificate #{cert.certificateNumber}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      <strong>{cert.personnelName}</strong> - {cert.personnelPosition}
                    </span>
                    <Badge variant="outline">{cert.personnelDepartment}</Badge>
                  </div>
                </div>
                
                <div className="text-right text-sm">
                  <div className="mb-1">
                    <span className="text-muted-foreground">Expires:</span>
                    <div className="font-medium">
                      {new Date(cert.expirationDate).toLocaleDateString()}
                    </div>
                  </div>
                  {!cert.isExpired && (
                    <div className={`text-xs ${
                      cert.isExpiringSoon ? 'text-chart-3' : 'text-muted-foreground'
                    }`}>
                      {getDaysUntilExpiration(cert.expirationDate)} days remaining
                    </div>
                  )}
                </div>
              </div>

              {/* Compliance Alert */}
              {(cert.isExpired || cert.isExpiringSoon) && (
                <div className={`flex items-center gap-2 p-3 rounded-md mb-3 ${
                  cert.isExpired ? 'bg-destructive/10 text-destructive' : 'bg-chart-3/10 text-chart-3'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {cert.isExpired 
                      ? "EXPIRED - Immediate renewal required"
                      : `Expires in ${getDaysUntilExpiration(cert.expirationDate)} days - Schedule renewal`
                    }
                  </span>
                </div>
              )}

              {/* Certificate Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <label className="text-muted-foreground">Issue Date:</label>
                  <p className="font-medium">{new Date(cert.issueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">Expiration Date:</label>
                  <p className="font-medium">{new Date(cert.expirationDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">Certificate #:</label>
                  <p className="font-medium">{cert.certificateNumber}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" data-testid={`button-view-cert-${cert.id}`}>
                  <FileText className="w-3 h-3 mr-1" />
                  View Certificate
                </Button>
                {cert.renewalRequired && (
                  <Button size="sm" data-testid={`button-renew-cert-${cert.id}`}>
                    <Calendar className="w-3 h-3 mr-1" />
                    Schedule Renewal
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCertifications.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No certifications found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Add New Certification */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <Button data-testid="button-add-certification">
            <Plus className="w-4 h-4 mr-2" />
            Add New Certification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}