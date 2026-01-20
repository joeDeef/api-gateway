import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardElectionModule } from './modules/dashboard-election/dashboard-election.module';
import { VotingnModule } from './modules/voting/voting.module';
import { InternalSecurityService } from './common/security/internal-security.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AuthOrchestratorService } from './modules/auth/auth-orchestrator.service';

@Module({
  imports: [
    // Configuración de límites (Rate Limiting)
    ThrottlerModule.forRoot([{
      ttl: 60000, // Tiempo de observación (1 minuto)
      limit: 20,   // Máximo de peticiones permitidas por minuto por IP
    }]),

    AuthModule,
    DashboardElectionModule,
    VotingnModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({}),
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