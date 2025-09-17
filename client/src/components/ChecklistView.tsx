import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Clock } from "lucide-react";
import ChecklistItem from "./ChecklistItem";
import PhotoUpload from "./PhotoUpload";

interface ChecklistData {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  requiresPhoto: boolean;
  photoCount: number;
  requiredPhotos: number;
}

interface Photo {
  id: string;
  url: string;
  name: string;
  timestamp: string;
}

interface ChecklistViewProps {
  projectName: string;
  stageName: string;
  checklist: ChecklistData[];
  onBack: () => void;
  onComplete: () => void;
}

export default function ChecklistView({
  projectName,
  stageName,
  checklist,
  onBack,
  onComplete
}: ChecklistViewProps) {
  const [items, setItems] = useState(checklist);
  const [selectedItemPhotos, setSelectedItemPhotos] = useState<Record<string, Photo[]>>({});
  const [showPhotoUpload, setShowPhotoUpload] = useState<string | null>(null);

  const completedItems = items.filter(item => item.isCompleted).length;
  const totalItems = items.length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const allCompleted = completedItems === totalItems;

  const handleToggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
    console.log('Checklist item toggled:', id);
  };

  const handlePhotoUpload = (itemId: string) => {
    setShowPhotoUpload(itemId);
    console.log('Photo upload for item:', itemId);
  };

  const handlePhotosChange = (itemId: string, photos: Photo[]) => {
    setSelectedItemPhotos(prev => ({
      ...prev,
      [itemId]: photos
    }));
    
    // Update item photo count
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, photoCount: photos.length } : item
    ));
  };

  return (
    <div className="space-y-6 pb-20" data-testid="checklist-view">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold" data-testid="text-project-name">{projectName}</h1>
          <p className="text-muted-foreground" data-testid="text-stage-name">{stageName} Stage</p>
        </div>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Stage Progress</CardTitle>
            <Badge variant={allCompleted ? "default" : "secondary"} data-testid="badge-progress">
              {completedItems}/{totalItems} Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="h-3 bg-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
                data-testid="progress-bar"
              />
            </div>
            <div className="text-sm text-muted-foreground text-right">
              {Math.round(progress)}% Complete
            </div>
          </div>
          
          {allCompleted && (
            <Button 
              className="w-full mt-4" 
              onClick={onComplete}
              data-testid="button-complete-stage"
            >
              <Check className="w-4 h-4 mr-2" />
              Complete Stage
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Checklist Items */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Checklist Items</h2>
        {items.map(item => (
          <ChecklistItem
            key={item.id}
            {...item}
            photoCount={selectedItemPhotos[item.id]?.length || item.photoCount}
            onToggle={handleToggleItem}
            onPhotoUpload={handlePhotoUpload}
          />
        ))}
      </div>

      {/* Photo Upload Modal/View */}
      {showPhotoUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upload Photos</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowPhotoUpload(null)}
                  data-testid="button-close-upload"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <PhotoUpload
                photos={selectedItemPhotos[showPhotoUpload] || []}
                maxPhotos={6}
                onPhotosChange={(photos) => handlePhotosChange(showPhotoUpload, photos)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}