import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

// Extend Request interface to include user session data
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: 'tech' | 'supervisor' | 'admin';
        firstName: string;
        lastName: string;
        isActive: boolean;
      };
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
    role: 'tech' | 'supervisor' | 'admin';
    firstName: string;
    lastName: string;
    isActive: boolean;
  };
}

// Authentication middleware - checks if user is logged in
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

// Load user from session and attach to request
export async function loadUser(req: Request, res: Response, next: NextFunction) {
  if (req.session?.userId) {
    try {
      const user = await storage.getUser(req.session.userId);
      if (user && user.isActive) {
        req.user = {
          id: user.id,
          username: user.username,
          role: user.role as 'tech' | 'supervisor' | 'admin',
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
        };
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }
  next();
}

// Role-based authorization middleware
export function requireRole(roles: ('tech' | 'supervisor' | 'admin')[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied', 
        required: roles,
        current: req.user.role 
      });
    }

    next();
  };
}

// Check if user can update a specific checklist item
export async function canUpdateChecklistItem(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const itemId = req.params.id;

  try {
    // Supervisor and admin can update any item
    if (req.user.role === 'supervisor' || req.user.role === 'admin') {
      return next();
    }

    // Tech can only update items assigned to them
    if (req.user.role === 'tech') {
      const item = await storage.getChecklistItem(itemId);
      if (!item) {
        return res.status(404).json({ error: 'Checklist item not found' });
      }

      // Allow if item is assigned to the user or unassigned
      if (!item.assigneeId || item.assigneeId === req.user.id) {
        return next();
      }

      return res.status(403).json({ 
        error: 'Access denied - item not assigned to you' 
      });
    }

    return res.status(403).json({ error: 'Access denied' });
  } catch (error) {
    console.error('Error checking checklist item permissions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Check if user can approve stages
export function canApproveStage(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Only supervisor and admin can approve stages
  if (req.user.role !== 'supervisor' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Access denied - only supervisors and administrators can approve stages' 
    });
  }

  next();
}