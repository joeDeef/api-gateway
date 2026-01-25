import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

// Módulos Internos
import { AuthModule } from './modules/auth/auth.module';
import { VotingModule } from './modules/voting/voting.module';
import { ElectionManagmentModule } from './modules/election-managment-service/election-managment.module';
import { RedisModule } from './common/redis/redis.module';

// Servicios y Common
import { EnvelopePackerService } from './common/security/envelopePacker.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { VoterGuard } from './common/guards/voter.guard';

@Module({
  imports: [
    // 1. Configuración Global de la App
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
    }),
    HttpModule.register({ global: true }),
    RedisModule,

    // 2. Seguridad: Rate Limiting (Throttling)
    // 20 peticiones por minuto
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 20,  
    }]),

    // 3. Microservicios / Orquestación
    AuthModule,
    VotingModule,
    ElectionManagmentModule,
  ],
  providers: [
    EnvelopePackerService,
    
    // Guard Global: Se ejecuta antes que cualquier controlador
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    // Interceptor Global: Registra tiempos y logs de cada petición
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    JwtAuthGuard,
    VoterGuard,
  ],
  exports: [EnvelopePackerService],
})
export class ApiGatewayModule {}