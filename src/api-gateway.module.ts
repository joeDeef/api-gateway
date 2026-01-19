import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // 1. Importación necesaria
import { ConfigModule } from '@nestjs/config';
import { TimerMiddleware } from './common/middlewares/timer.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardElectionModule } from './modules/dashboard-election/dashboard-election.module';
import { VotingnModule } from './modules/voting/voting.module';
import { InternalSecurityService } from './security/internal-security.service';

@Module({
  imports: [
    AuthModule, 
    DashboardElectionModule,
    VotingnModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 2. Registramos el JwtModule para habilitar el JwtService
    // Lo dejamos vacío porque las llaves RSA se cargan dinámicamente en el Service
    JwtModule.register({}), 
  ],
  providers: [InternalSecurityService],
  exports: [InternalSecurityService], // Permite que AuthModule y otros usen el servicio
  controllers: [],
})
export class ApiGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TimerMiddleware).forRoutes('*');
  }
}