import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { VotingnModule } from './modules/voting/voting.module';
import { InternalSecurityService } from './common/security/internal-security.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AuthOrchestratorService } from './modules/auth/auth-orchestrator.service';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from './common/redis/redis.module';
import { ElectionManagmentModule } from './modules/election-managment-service/election-managment.module';

@Module({
  imports: [
    // Configuración de límites (Rate Limiting)
    ThrottlerModule.forRoot([{
      ttl: 60000, // Tiempo de observación (1 minuto)
      limit: 20,   // Máximo de peticiones permitidas por minuto por IP
    }]),
    RedisModule,
    AuthModule,
    VotingnModule,
    ElectionManagmentModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({}),
    HttpModule.register({
      global: true, // <--- Esto lo hace disponible en TODA la app
    }),
  ],
  providers: [
    InternalSecurityService,
    // Registrar el Guard Globalmente -> asegura que todas las rutas del Gateway tengan limitación de peticiones
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // REGISTRO GLOBAL DEL INTERCEPTOR
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    AuthOrchestratorService,
  ],
  exports: [InternalSecurityService],
  controllers: [],
})
export class ApiGatewayModule {
}