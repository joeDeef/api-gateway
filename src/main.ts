import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway.module';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(ApiGatewayModule);

  // --- 1. SEGURIDAD DE CABECERAS (HELMET) ---
  // Configuramos Helmet con un ajuste para que no rompa SPAs en Vercel
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));

  // --- 2. MIDDLEWARES GLOBALES ---
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // --- 3. VALIDACIÓN Y TRANSFORMACIÓN ---
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true, // Convierte tipos automáticamente (ej: string a number en params)
  }));

  // --- 4. CONFIGURACIÓN DE CORS ---
  setupCors(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  logger.log(`API Gateway running on port ${port}`);
}

/**
 * Configuración de CORS
 */
function setupCors(app: any) {
  const allowedOrigins = [
    'http://localhost:4200',
    'https://voto-seguro.vercel.app',
    'https://voto-seguro-nine.vercel.app',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  });
}

bootstrap();