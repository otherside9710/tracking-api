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
  security: {
    apiKey: process.env.API_KEY,
  },
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
  },
} as const;


export function validateConfig(): void {
  const requiredEnvs: Array<{ key: string; path: string[] }> = [
    { key: 'API_KEY', path: ['security', 'apiKey'] },
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