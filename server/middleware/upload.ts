import multer from 'multer';
import { Request } from 'express';

// File upload validation middleware
const storage = multer.memoryStorage();

// File filter to restrict file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow images and PDFs only
  const allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only images (JPEG, PNG, GIF, WebP) and PDFs are allowed. Received: ${file.mimetype}`));
  }
};

// Configure multer with security constraints
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 5, // Max 5 files per request
    fields: 10, // Max 10 non-file fields
    fieldSize: 1024 * 1024, // 1MB max field size
  },
  fileFilter,
});

// Error handling middleware for multer
export const handleUploadError = (error: any, req: Request, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large', 
        message: 'File size must be less than 10MB' 
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: 'Too many files', 
        message: 'Maximum 5 files allowed per request' 
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        error: 'Unexpected file field', 
        message: 'Invalid file field name' 
      });
    }
    return res.status(400).json({ 
      error: 'Upload error', 
      message: error.message 
    });
  }
  
  // Handle custom file type errors
  if (error.message && error.message.includes('Invalid file type')) {
    return res.status(400).json({ 
      error: 'Invalid file type', 
      message: error.message 
    });
  }
  
  next(error);
};