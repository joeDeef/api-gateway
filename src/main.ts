import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  // Aumentar límite para imágenes Base64
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // Uso de Pipes para validacion de datos
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // Elimina cualquier campo extra no definido.
    forbidNonWhitelisted: true, // Rechaza la petición si envían datos extra.
  }));

  const port = process.env.PORT ?? 3000;

  // Habilitar CORS - Permitir frontend local y producción
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://voto-seguro.vercel.app',
      'https://voto-seguro-git-main-issacs-projects-609efade.vercel.app',
      /\.vercel\.app$/  // Cualquier subdominio de Vercel
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  await app.listen(port);
  console.log(`API Gateway listening on port ${port}`);
}
bootstrap();
