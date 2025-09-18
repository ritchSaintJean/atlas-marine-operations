import { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { storage } from '../storage';
import { requireAuth } from '../middleware/auth';

const router = Router();

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const createUserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['tech', 'supervisor', 'admin']).default('tech'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
});

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = loginSchema.parse(req.body);
    
    // Find user by username (with password for authentication)
    const user = await storage.getUserWithPasswordForAuth(username);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Store session
    req.session.userId = user.id;
    req.session.role = user.role;
    
    // Return user info (without password)
    const { password: _, ...safeUser } = user;
    res.json({
      user: safeUser,
      message: 'Login successful'
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid input', 
        details: error.errors 
      });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint
router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Get current user info
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ user: req.user });
});

// Create user (admin only for production, but allow in dev)
router.post('/register', async (req: Request, res: Response) => {
  try {
    // In production, only allow admin users to create accounts
    if (process.env.NODE_ENV === 'production' && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({ error: 'Access denied - admin required to create users in production' });
    }
    
    const userData = createUserSchema.parse(req.body);
    
    // Check if username already exists
    const users = await storage.listUsers();
    if (users.some(u => u.username === userData.username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    // Create user (password already hashed above)
    const newUser = await storage.createUserWithHashedPassword({
      ...userData,
      password: hashedPassword,
      isActive: true,
      createdAt: new Date(),
    });
    
    // Return user info (without password)
    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ user: safeUser });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid input', 
        details: error.errors 
      });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as authRoutes };