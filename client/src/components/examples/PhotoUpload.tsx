import { useState } from "react";
import PhotoUpload from '../PhotoUpload';

interface Photo {
  id: string;
  url: string;
  name: string;
  timestamp: string;
}

export default function PhotoUploadExample() {
  const [photos, setPhotos] = useState<Photo[]>([
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
  };

  return (
    <div className="p-4">
      <PhotoUpload 
        photos={photos}
        maxPhotos={8}
        onPhotosChange={handlePhotosChange}
      />
    </div>
  );
}