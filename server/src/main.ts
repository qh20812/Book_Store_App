import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors();
  
  await app.listen(PORT ?? 3226);
  console.log(`🚀 Server is running on: http://localhost:${PORT}`);
  console.log(`📚 Book Store API is ready!`);
}
bootstrap();
