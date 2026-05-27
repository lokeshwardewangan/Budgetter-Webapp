import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),

  MONGO_URL: z.string().min(1, 'MONGO_URL is required'),

  ACCESS_TOKEN_SECRET_KEY: z.string().min(1),
  ACCESS_TOKEN_SECRET_EXPIRY: z.string().min(1),
  ACCOUNT_VERIFICATION_TOKEN_SECRET: z.string().min(1),
  ACCOUNT_VERIFICATION_TOKEN_SECRET_EXPIRY: z.string().min(1),
  RESET_PASSWORD_TOKEN_SECRET: z.string().min(1),
  RESET_PASSWORD_TOKEN_SECRET_EXPIRY: z.string().min(1),

  GOOGLE_CLIENT_ID: z.string().min(1),

  SERVER_URL: z.url(),
  FRONTEND_URL: z.url().optional(),

  ADMIN_GMAIL: z.email(),
  GMAIL_PASSKEY: z.string().min(1),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // 1 = nginx in docker-compose; bump for additional proxy hops (CDN/LB).
  TRUST_PROXY_HOPS: z.coerce.number().int().nonnegative().default(1),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('\n❌ Invalid environment variables:');
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  }
  console.error('\nFix .env (see .env.example) and restart.\n');
  process.exit(1);
}

export type Env = z.infer<typeof EnvSchema>;
export const env: Env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
