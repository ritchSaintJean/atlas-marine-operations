import ChecklistView from '../ChecklistView';

export default function ChecklistViewExample() {
  const sampleChecklist = [
    {
      id: "check-001",
      title: "Surface Preparation",
      description: "Clean and prepare surface area for blasting operations",
      isCompleted: true,
      requiresPhoto: true,
      photoCount: 3,
      requiredPhotos: 2,
    },
    {
      id: "check-002",
      title: "Safety Equipment Check", 
      description: "Verify all safety equipment is in place and functioning",
      isCompleted: false,
      requiresPhoto: true,
      photoCount: 1,
      requiredPhotos: 2,
    },
    {
      id: "check-003",
      title: "Weather Conditions",
      description: "Check weather conditions are suitable for work",
      isCompleted: false,
      requiresPhoto: false,
      photoCount: 0,
      requiredPhotos: 0,
    },
    {
      id: "check-004",
      title: "Area Isolation",
      description: "Isolate work area and secure perimeter",
      isCompleted: false,
      requiresPhoto: true,
      photoCount: 0,
      requiredPhotos: 3,
    }
  ];

  const handleBack = () => {
    console.log('Navigate back triggered');
  };

  const handleComplete = () => {
    console.log('Complete stage triggered');
  };

  return (
    <div className="p-4">
      <ChecklistView
        projectName="Marina Dock Restoration"
        stageName="Blasting"
        checklist={sampleChecklist}
        onBack={handleBack}
        onComplete={handleComplete}
      />
    </div>
  );
}