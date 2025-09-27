import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const config = {
  server: {
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || '0.0.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
  },
  auth: {
    domain: process.env.AUTH0_BASE_URL,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    audience: process.env.AUTH0_AUDIENCE,
    granType: process.env.AUTH0_GRANT_TYPE,
  },
  rateLimit: {
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    timeWindow: Number(process.env.RATE_LIMIT_TIME_WINDOW) || 60000, // 1 minuto por defecto
  },
} as const;


export function validateConfig(): void {
  const requiredEnvs: Array<{ key: string; path: string[] }> = [
    { key: 'AUTH0_BASE_URL', path: ['auth', 'domain'] },
    { key: 'AUTH0_CLIENT_ID', path: ['auth', 'clientId'] },
    { key: 'AUTH0_CLIENT_SECRET', path: ['auth', 'clientSecret'] },
    { key: 'AUTH0_AUDIENCE', path: ['auth', 'audience'] },
  ];

  const missingEnvs = requiredEnvs.filter(
    ({ path }) => !getConfigValue(config, path)
  );

  if (missingEnvs.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvs
        .map(({ key }) => key)
        .join(', ')}`
    );
  }
}

function getConfigValue(obj: any, path: string[]): any {
  return path.reduce((curr, key) => curr?.[key], obj);
}