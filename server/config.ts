import { z } from 'zod';

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  SESSION_SECRET: z.string().min(1, 'SESSION_SECRET is required'),
  PORT: z.string().default('5000'),
  VITE_API_BASE: z.string().optional(),
});

// Parse and validate environment variables at startup
const parseConfig = () => {
  try {
    return configSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment configuration:');
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    process.exit(1);
  }
};

export const config = parseConfig();

export type Config = z.infer<typeof configSchema>;