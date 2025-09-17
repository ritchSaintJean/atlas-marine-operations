import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, X, Eye } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  name: string;
  timestamp: string;
}

interface PhotoUploadProps {
  photos: Photo[];
  maxPhotos?: number;
  onPhotosChange: (photos: Photo[]) => void;
  disabled?: boolean;
}

export default function PhotoUpload({ 
  photos, 
  maxPhotos = 10, 
  onPhotosChange, 
  disabled = false 
}: PhotoUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || disabled) return;
    
    const newPhotos: Photo[] = [];
    const remainingSlots = maxPhotos - photos.length;
    const filesToProcess = Math.min(files.length, remainingSlots);
    
    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const photo: Photo = {
          id: `photo-${Date.now()}-${i}`,
          url: URL.createObjectURL(file),
          name: file.name,
          timestamp: new Date().toLocaleString()
        };
        newPhotos.push(photo);
      }
    }
    
    onPhotosChange([...photos, ...newPhotos]);
    console.log('Photos uploaded:', newPhotos.length);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter(p => p.id !== photoId);
    onPhotosChange(updatedPhotos);
    console.log('Photo removed:', photoId);
  };

  const viewPhoto = (photo: Photo) => {
    console.log('View photo:', photo.name);
  };

  return (
    <div className="space-y-4" data-testid="photo-upload-container">
      {/* Upload Area */}
      <Card 
        className={`transition-colors ${dragActive ? 'border-primary bg-primary/5' : ''} ${disabled ? 'opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Add Photos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Take photos or upload from device ({photos.length}/{maxPhotos})
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || photos.length >= maxPhotos}
                data-testid="button-upload-photos"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
              <Button
                variant="outline"
                onClick={() => console.log('Camera capture triggered')}
                disabled={disabled || photos.length >= maxPhotos}
                data-testid="button-take-photo"
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </CardContent>
      </Card>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4" data-testid="photo-grid">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden group" data-testid={`photo-card-${photo.id}`}>
              <CardContent className="p-0 relative">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => viewPhoto(photo)}
                    data-testid={`button-view-${photo.id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => removePhoto(photo.id)}
                    data-testid={`button-remove-${photo.id}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                  <p className="text-xs truncate" data-testid={`text-photo-name-${photo.id}`}>{photo.name}</p>
                  <p className="text-xs text-gray-300" data-testid={`text-photo-time-${photo.id}`}>{photo.timestamp}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}