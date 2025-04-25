import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    bodyParser: false, // Disable built-in body parser
  });
  
  // IMPROVED: Custom static file serving with comprehensive CORS headers
  const staticPath = join(process.cwd(), 'public');
  console.log('Serving static files from:', staticPath);
  
  // Keep the built-in static assets option as a fallback mechanism
  // but with CORS headers already defined above
  app.useStaticAssets(staticPath, {
    prefix: '/',
  });
  
  // Custom middleware to handle Stripe webhooks differently
  app.use((req, res, next) => {
    console.log('Request URL:', req.originalUrl); // Log the request URL for debugging
    if (req.originalUrl === '/payments/webhook') {
      // For Stripe webhooks, preserve the raw body for signature verification
      json({ 
        verify: (req :any, res, buf) => { 
          req.rawBody = buf.toString(); 
        }
      })(req, res, next);
    } else {
      // For all other routes, increase the limit
      json({ limit: '50mb' })(req, res, next);
    }
  });
  
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://drawbrand.art',
      'https://www.drawbrand.art',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  await app.listen(5000);
}
bootstrap();
