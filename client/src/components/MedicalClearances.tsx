import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  Search, 
  Plus,
  Calendar,
  AlertTriangle,
  FileText,
  Activity,
  Eye,
  Ear,
  Brain,
  User
} from "lucide-react";

interface PersonnelMember {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  medicalClearances: MedicalClearance[];
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

interface MedicalClearancesProps {
  personnel: PersonnelMember[];
}

export default function MedicalClearances({ personnel }: MedicalClearancesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedResult, setSelectedResult] = useState<string>("all");

  // Flatten all medical clearances with personnel info
  const allClearances = personnel.flatMap(person => 
    person.medicalClearances.map(clearance => ({
      ...clearance,
      personnelId: person.id,
      personnelName: `${person.firstName} ${person.lastName}`,
      personnelPosition: person.position,
      personnelDepartment: person.department
    }))
  );

  const clearanceTypes = [
    { id: "all", label: "All Types", icon: Heart },
    { id: "physical", label: "Physical", icon: Activity },
    { id: "respiratory", label: "Respiratory", icon: Heart },
    { id: "vision", label: "Vision", icon: Eye },
    { id: "hearing", label: "Hearing", icon: Ear },
    { id: "psychological", label: "Psychological", icon: Brain }
  ];

  const resultFilters = [
    { id: "all", label: "All Results" },
    { id: "cleared", label: "Cleared" },
    { id: "restricted", label: "Restricted" },
    { id: "not_cleared", label: "Not Cleared" },
    { id: "expiring_soon", label: "Expiring Soon" },
    { id: "expired", label: "Expired" }
  ];

  const filteredClearances = allClearances.filter(clearance => {
    const matchesSearch = 
      clearance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clearance.personnelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clearance.provider.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || clearance.type === selectedType;
    
    const matchesResult = selectedResult === "all" ||
      (selectedResult === "cleared" && clearance.result === "cleared") ||
      (selectedResult === "restricted" && clearance.result === "restricted") ||
      (selectedResult === "not_cleared" && clearance.result === "not_cleared") ||
      (selectedResult === "expiring_soon" && clearance.isExpiringSoon && !clearance.isExpired) ||
      (selectedResult === "expired" && clearance.isExpired);
    
    return matchesSearch && matchesType && matchesResult;
  });

  const getClearanceStats = () => {
    const total = allClearances.length;
    const cleared = allClearances.filter(c => c.result === "cleared" && !c.isExpired).length;
    const restricted = allClearances.filter(c => c.result === "restricted").length;
    const notCleared = allClearances.filter(c => c.result === "not_cleared").length;
    const expiringSoon = allClearances.filter(c => c.isExpiringSoon && !c.isExpired).length;
    const expired = allClearances.filter(c => c.isExpired).length;
    
    return { total, cleared, restricted, notCleared, expiringSoon, expired };
  };

  const getClearanceTypeIcon = (type: string) => {
    const typeConfig = clearanceTypes.find(t => t.id === type);
    const Icon = typeConfig?.icon || Heart;
    return <Icon className="w-4 h-4" />;
  };

  const getClearanceTypeColor = (type: string) => {
    switch (type) {
      case "physical": return "bg-chart-2 text-white";
      case "respiratory": return "bg-chart-3 text-white";
      case "vision": return "bg-primary text-primary-foreground";
      case "hearing": return "bg-chart-4 text-white";
      case "psychological": return "bg-chart-1 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getResultColor = (result: string, isExpired: boolean, isExpiringSoon: boolean) => {
    if (isExpired) return "bg-destructive text-white";
    if (isExpiringSoon) return "bg-chart-3 text-white";
    
    switch (result) {
      case "cleared": return "bg-chart-2 text-white";
      case "restricted": return "bg-chart-4 text-white";
      case "not_cleared": return "bg-destructive text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getResultLabel = (result: string, isExpired: boolean, isExpiringSoon: boolean) => {
    if (isExpired) return "Expired";
    if (isExpiringSoon) return "Expiring Soon";
    
    switch (result) {
      case "cleared": return "Cleared";
      case "restricted": return "Restricted";
      case "not_cleared": return "Not Cleared";
      default: return "Unknown";
    }
  };

  const getDaysUntilExpiration = (expirationDate: string) => {
    const now = new Date();
    const expiry = new Date(expirationDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = getClearanceStats();

  return (
    <div className="space-y-6" data-testid="medical-clearances">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary" data-testid="stat-total-medical">
              {stats.total}
            </div>
            <div className="text-sm text-muted-foreground">Total Tests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2" data-testid="stat-cleared-medical">
              {stats.cleared}
            </div>
            <div className="text-sm text-muted-foreground">Cleared</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4" data-testid="stat-restricted-medical">
              {stats.restricted}
            </div>
            <div className="text-sm text-muted-foreground">Restricted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive" data-testid="stat-not-cleared-medical">
              {stats.notCleared}
            </div>
            <div className="text-sm text-muted-foreground">Not Cleared</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3" data-testid="stat-expiring-medical">
              {stats.expiringSoon}
            </div>
            <div className="text-sm text-muted-foreground">Expiring Soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive" data-testid="stat-expired-medical">
              {stats.expired}
            </div>
            <div className="text-sm text-muted-foreground">Expired</div>
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
                placeholder="Search medical clearances, personnel, or providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-medical"
              />
            </div>

            {/* Type Filters */}
            <div>
              <label className="text-sm font-medium mb-2 block">Medical Test Type</label>
              <div className="flex flex-wrap gap-2">
                {clearanceTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.id}
                      variant={selectedType === type.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type.id)}
                      data-testid={`button-filter-medical-type-${type.id}`}
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {type.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Result Filters */}
            <div>
              <label className="text-sm font-medium mb-2 block">Result Status</label>
              <div className="flex flex-wrap gap-2">
                {resultFilters.map((result) => (
                  <Button
                    key={result.id}
                    variant={selectedResult === result.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedResult(result.id)}
                    data-testid={`button-filter-result-${result.id}`}
                  >
                    {result.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Clearances List */}
      <div className="space-y-4">
        {filteredClearances.map((clearance) => (
          <Card 
            key={clearance.id} 
            className={`hover-elevate transition-all ${
              clearance.isExpired || clearance.result === "not_cleared" ? 'border-destructive' : 
              clearance.isExpiringSoon || clearance.result === "restricted" ? 'border-chart-3' : ''
            }`}
            data-testid={`card-medical-clearance-${clearance.id}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getClearanceTypeIcon(clearance.type)}
                    <h3 className="font-semibold" data-testid={`medical-desc-${clearance.id}`}>
                      {clearance.description}
                    </h3>
                    <Badge className={getClearanceTypeColor(clearance.type)}>
                      {clearance.type}
                    </Badge>
                    <Badge 
                      className={getResultColor(clearance.result, clearance.isExpired, clearance.isExpiringSoon)}
                      data-testid={`medical-result-${clearance.id}`}
                    >
                      {getResultLabel(clearance.result, clearance.isExpired, clearance.isExpiringSoon)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-1">
                    Provider: {clearance.provider}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      <strong>{clearance.personnelName}</strong> - {clearance.personnelPosition}
                    </span>
                    <Badge variant="outline">{clearance.personnelDepartment}</Badge>
                  </div>
                </div>
                
                <div className="text-right text-sm">
                  <div className="mb-1">
                    <span className="text-muted-foreground">Expires:</span>
                    <div className="font-medium">
                      {new Date(clearance.expirationDate).toLocaleDateString()}
                    </div>
                  </div>
                  {!clearance.isExpired && (
                    <div className={`text-xs ${
                      clearance.isExpiringSoon ? 'text-chart-3' : 'text-muted-foreground'
                    }`}>
                      {getDaysUntilExpiration(clearance.expirationDate)} days remaining
                    </div>
                  )}
                </div>
              </div>

              {/* Restrictions */}
              {clearance.restrictions && clearance.restrictions.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-chart-4 mb-1">Restrictions:</p>
                  <div className="flex flex-wrap gap-1">
                    {clearance.restrictions.map((restriction, index) => (
                      <Badge key={index} variant="outline" className="text-chart-4 border-chart-4">
                        {restriction}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Compliance Alert */}
              {(clearance.isExpired || clearance.isExpiringSoon || clearance.result === "not_cleared") && (
                <div className={`flex items-center gap-2 p-3 rounded-md mb-3 ${
                  clearance.isExpired || clearance.result === "not_cleared" 
                    ? 'bg-destructive/10 text-destructive' 
                    : 'bg-chart-3/10 text-chart-3'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {clearance.isExpired 
                      ? "EXPIRED - Immediate retest required"
                      : clearance.result === "not_cleared"
                      ? "NOT CLEARED - Employee cannot perform restricted duties"
                      : `Expires in ${getDaysUntilExpiration(clearance.expirationDate)} days - Schedule retest`
                    }
                  </span>
                </div>
              )}

              {/* Clearance Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <label className="text-muted-foreground">Test Date:</label>
                  <p className="font-medium">{new Date(clearance.testDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">Expiration Date:</label>
                  <p className="font-medium">{new Date(clearance.expirationDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">Provider:</label>
                  <p className="font-medium">{clearance.provider}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" data-testid={`button-view-medical-${clearance.id}`}>
                  <FileText className="w-3 h-3 mr-1" />
                  View Results
                </Button>
                {(clearance.isExpiringSoon || clearance.isExpired) && (
                  <Button size="sm" data-testid={`button-schedule-medical-${clearance.id}`}>
                    <Calendar className="w-3 h-3 mr-1" />
                    Schedule Retest
                  </Button>
                )}
                {clearance.result === "not_cleared" && (
                  <Button variant="outline" size="sm" className="text-destructive border-destructive">
                    <User className="w-3 h-3 mr-1" />
                    Update Work Status
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClearances.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No medical clearances found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Add New Medical Test */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <Button data-testid="button-add-medical-test">
            <Plus className="w-4 h-4 mr-2" />
            Schedule New Medical Test
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}