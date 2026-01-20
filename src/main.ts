import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  // USo de Pipes para validacion de datos
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // Elimina cualquier campo extra no definido.
    forbidNonWhitelisted: true, // Rechaza la petición si envían datos extra.
  }));

  const port = process.env.PORT ?? 3000;

  //Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:4200', // URL de tu frontend de Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(port);
  console.log(`API Gateway listening on port ${port}`);
}
bootstrap();
