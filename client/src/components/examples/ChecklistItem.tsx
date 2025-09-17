import { useState } from "react";
import ChecklistItem from '../ChecklistItem';

export default function ChecklistItemExample() {
  const [items, setItems] = useState([
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
      photoCount: 0,
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
    }
  ]);

  const handleToggle = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
    console.log('Checklist item toggled:', id);
  };

  const handlePhotoUpload = (id: string) => {
    console.log('Photo upload triggered for:', id);
  };

  return (
    <div className="p-4 space-y-3">
      {items.map(item => (
        <ChecklistItem
          key={item.id}
          {...item}
          onToggle={handleToggle}
          onPhotoUpload={handlePhotoUpload}
        />
      ))}
    </div>
  );
}