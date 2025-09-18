import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  AlertTriangle,
  Shield,
  FileText,
  Award,
  Eye,
  Edit,
  Settings
} from "lucide-react";

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
  certifications: Array<{
    id: string;
    type: "safety" | "technical" | "medical" | "regulatory";
    name: string;
    issuingOrganization: string;
    certificateNumber: string;
    issueDate: string;
    expirationDate: string;
    isExpired: boolean;
    isExpiringSoon: boolean;
    renewalRequired: boolean;
  }>;
  medicalClearances: Array<{
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
  }>;
  equipmentAssignments?: Array<{
    id: string;
    equipmentId: string;
    projectId?: string;
    assignedDate: string;
    purpose: string;
    notes?: string;
    status: string;
  }>;
}

interface PersonnelCardProps {
  person: PersonnelMember;
  onEdit?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export default function PersonnelCard({ person, onEdit, onViewDetails }: PersonnelCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "operations": return "bg-primary text-primary-foreground";
      case "safety": return "bg-chart-3 text-white";
      case "maintenance": return "bg-chart-4 text-white";
      case "administration": return "bg-chart-2 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getComplianceStatus = () => {
    const expiredCerts = person.certifications.filter(cert => cert.isExpired).length;
    const expiringSoonCerts = person.certifications.filter(cert => cert.isExpiringSoon).length;
    const expiredMedical = person.medicalClearances.filter(med => med.isExpired).length;
    const expiringSoonMedical = person.medicalClearances.filter(med => med.isExpiringSoon).length;
    
    const totalIssues = expiredCerts + expiringSoonCerts + expiredMedical + expiringSoonMedical;
    
    if (totalIssues === 0) return { status: "compliant", color: "text-chart-2", label: "Compliant" };
    if (expiredCerts > 0 || expiredMedical > 0) return { status: "non_compliant", color: "text-destructive", label: "Non-Compliant" };
    return { status: "attention", color: "text-chart-3", label: "Needs Attention" };
  };

  const complianceStatus = getComplianceStatus();
  const fullName = `${person.firstName} ${person.lastName}`;

  return (
    <Card 
      className={`hover-elevate transition-all ${
        complianceStatus.status === "non_compliant" ? 'border-destructive' : 
        complianceStatus.status === "attention" ? 'border-chart-3' : ''
      }`}
      data-testid={`card-personnel-${person.id}`}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" alt={fullName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(person.firstName, person.lastName)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg" data-testid={`text-name-${person.id}`}>
                    {fullName}
                  </h3>
                  <Badge className={getDepartmentColor(person.department)} data-testid={`badge-dept-${person.id}`}>
                    {person.department}
                  </Badge>
                  {!person.isActive && (
                    <Badge variant="outline" className="text-muted-foreground">
                      Inactive
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-2" data-testid={`text-position-${person.id}`}>
                  {person.position}
                </p>

                <div className="flex items-center gap-1 mb-2">
                  <span className={`text-sm font-medium ${complianceStatus.color}`}>
                    {complianceStatus.label}
                  </span>
                  {complianceStatus.status !== "compliant" && (
                    <AlertTriangle className="w-4 h-4 text-current" />
                  )}
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              data-testid={`button-expand-${person.id}`}
            >
              {isExpanded ? "Less" : "More"}
            </Button>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span data-testid={`text-email-${person.id}`}>{person.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span data-testid={`text-phone-${person.id}`}>{person.phone}</span>
            </div>
          </div>

          {/* Compliance Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm font-medium text-chart-2" data-testid={`cert-valid-${person.id}`}>
                {person.certifications.filter(cert => !cert.isExpired && !cert.isExpiringSoon).length}
              </div>
              <div className="text-xs text-muted-foreground">Valid Certs</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-chart-3" data-testid={`cert-expiring-${person.id}`}>
                {person.certifications.filter(cert => cert.isExpiringSoon).length}
              </div>
              <div className="text-xs text-muted-foreground">Expiring Soon</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-destructive" data-testid={`cert-expired-${person.id}`}>
                {person.certifications.filter(cert => cert.isExpired).length}
              </div>
              <div className="text-xs text-muted-foreground">Expired</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-chart-4" data-testid={`medical-total-${person.id}`}>
                {person.medicalClearances.length}
              </div>
              <div className="text-xs text-muted-foreground">Medical</div>
            </div>
          </div>

          {/* Compliance Issues Alert */}
          {complianceStatus.status !== "compliant" && (
            <div className={`flex items-center gap-2 p-3 rounded-md ${
              complianceStatus.status === "non_compliant" ? 'bg-destructive/10 text-destructive' : 'bg-chart-3/10 text-chart-3'
            }`}>
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {complianceStatus.status === "non_compliant" 
                  ? "Immediate attention required - expired certifications/medical"
                  : "Items expiring soon - schedule renewals"
                }
              </span>
            </div>
          )}

          {/* Expanded Details */}
          {isExpanded && (
            <div className="space-y-4 pt-2 border-t">
              {/* Employment Details */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Employment Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-muted-foreground">Hire Date:</label>
                    <p className="font-medium" data-testid={`text-hire-date-${person.id}`}>
                      {new Date(person.hireDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Years of Service:</label>
                    <p className="font-medium">
                      {Math.floor((Date.now() - new Date(person.hireDate).getTime()) / (365 * 24 * 60 * 60 * 1000))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Emergency Contact
                </h4>
                <div className="bg-muted rounded-md p-3 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <span className="font-medium" data-testid={`emergency-name-${person.id}`}>
                        {person.emergencyContact.name}
                      </span>
                    </div>
                    <div>
                      <span data-testid={`emergency-relationship-${person.id}`}>
                        {person.emergencyContact.relationship}
                      </span>
                    </div>
                    <div>
                      <span data-testid={`emergency-phone-${person.id}`}>
                        {person.emergencyContact.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Certifications */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Recent Certifications
                </h4>
                <div className="space-y-2">
                  {person.certifications.slice(0, 3).map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex-1">
                        <p className="text-sm font-medium" data-testid={`cert-name-${cert.id}`}>{cert.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Expires: {new Date(cert.expirationDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        className={
                          cert.isExpired ? "bg-destructive text-white" :
                          cert.isExpiringSoon ? "bg-chart-3 text-white" :
                          "bg-chart-2 text-white"
                        }
                        data-testid={`cert-status-${cert.id}`}
                      >
                        {cert.isExpired ? "Expired" : cert.isExpiringSoon ? "Expiring" : "Valid"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment Assignments */}
              {person.equipmentAssignments && person.equipmentAssignments.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-1">
                    <Settings className="w-4 h-4" />
                    Current Equipment Assignments
                  </h4>
                  <div className="space-y-2">
                    {person.equipmentAssignments.slice(0, 3).map((assignment) => (
                      <div key={assignment.id} className="p-2 bg-muted rounded-md" data-testid={`assignment-item-${assignment.id}`}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium" data-testid={`text-equipment-${assignment.equipmentId}`}>
                            {assignment.equipmentId.replace('eq-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <Badge variant="outline" data-testid={`badge-purpose-${assignment.id}`}>
                            {assignment.purpose.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground" data-testid={`text-assigned-date-${assignment.id}`}>
                          Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}
                        </p>
                        {assignment.notes && (
                          <p className="text-xs text-muted-foreground mt-1" data-testid={`text-notes-${assignment.id}`}>
                            {assignment.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails?.(person.id)}
                  data-testid={`button-details-${person.id}`}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(person.id)}
                  data-testid={`button-edit-${person.id}`}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit Personnel
                </Button>
                <Button
                  variant={complianceStatus.status === "compliant" ? "outline" : "default"}
                  size="sm"
                  data-testid={`button-compliance-${person.id}`}
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Manage Compliance
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}