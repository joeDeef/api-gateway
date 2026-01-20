import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthProxy } from '../../common/proxies/auth.proxy';
import { SecurityHeadersGuard } from 'src/common/guards/security-headers.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthOrchestratorService } from './auth-orchestrator.service';
import { VotingProxy } from 'src/common/proxies/voting.proxy';
import { HttpModule } from '@nestjs/axios';
import { InternalSecurityService } from 'src/common/security/internal-security.service';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule,
    HttpModule,

  ],
  controllers: [AuthController],
  providers: [
    AuthProxy,
    VotingProxy,
    SecurityHeadersGuard,
    AuthOrchestratorService,
    InternalSecurityService
  ], exports: [AuthProxy],
})
export class AuthModule { }