import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthProxy } from '../../common/proxies/auth.proxy';
import { SecurityHeadersGuard } from 'src/common/guards/security-headers.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthOrchestratorService } from './auth-orchestrator.service';
import { VotingProxy } from 'src/common/proxies/voting.proxy';
import { EnvelopePackerService } from 'src/common/security/envelopePacker.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import { InternalSecurityModule } from 'src/common/security/internal-security.module';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { VoterGuard } from 'src/common/guards/voter.guard';

@Module({
  imports: [
    HttpModule,
    // 2. Configuramos la conexión al microservicio de Auth
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            // El host y puerto donde corre el microservicio de AUTH 
            host: configService.get<string>('AUTH_SERVICE_HOST', '127.0.0.1'),
            port: configService.get<number>('AUTH_SERVICE_PORT', 3001),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    JwtModule.register({}),
    ConfigModule,
    InternalSecurityModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthProxy,
    VotingProxy,
    SecurityHeadersGuard,
    AuthOrchestratorService,
    EnvelopePackerService,
    JwtAuthGuard,
    VoterGuard,
  ],
  exports: [
    AuthProxy,
    EnvelopePackerService
  ],
})
export class AuthModule { }