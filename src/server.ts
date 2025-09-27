import { buildApp } from './app';

async function start() {
  try {
    const app = await buildApp();
    const port = parseInt(process.env.PORT || '3000');
    const host = process.env.HOST || '0.0.0.0';
    
    await app.listen({ port, host });
    console.log(`Server running at http://${host}:${port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}