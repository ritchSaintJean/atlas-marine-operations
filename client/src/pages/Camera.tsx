import PhotoUpload from "@/components/PhotoUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Photo {
  id: string;
  url: string;
  name: string;
  timestamp: string;
}

export default function Camera() {
  const [photos, setPhotos] = useState<Photo[]>([
    // Mock data - TODO: Remove when implementing real data
    {
      id: "photo-1",
      url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJlZm9yZSBCbGFzdGluZzwvdGV4dD4KPC9zdmc+",
      name: "surface_prep_before.jpg",
      timestamp: "Mar 15, 2024 09:30 AM"
    },
    {
      id: "photo-2",
      url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjYmJiIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzc3NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNhZmV0eSBFcXVpcG1lbnQ8L3RleHQ+Cjwvc3ZnPg==",
      name: "safety_equipment.jpg",
      timestamp: "Mar 15, 2024 09:45 AM"
    }
  ]);

  const handlePhotosChange = (newPhotos: Photo[]) => {
    setPhotos(newPhotos);
    console.log('Photos updated:', newPhotos.length);
  };

  return (
    <div className="space-y-6" data-testid="camera-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="page-title">Camera & Photos</h1>
          <p className="text-muted-foreground">Capture documentation photos for current project</p>
        </div>
        <Badge variant="outline" data-testid="badge-photo-count">
          {photos.length} Photos
        </Badge>
      </div>

      {/* Current Project Context */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Marina Dock Restoration</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Current Stage:</span>
            <Badge variant="default">Blasting</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Photo Upload Component */}
      <Card>
        <CardHeader>
          <CardTitle>Document Your Work</CardTitle>
        </CardHeader>
        <CardContent>
          <PhotoUpload 
            photos={photos}
            maxPhotos={20}
            onPhotosChange={handlePhotosChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}