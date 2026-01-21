import { Module } from '@nestjs/common';
import { VotingController } from './voting.controller';
import { VotingProxy } from '../../common/proxies/voting.proxy';
import { HttpModule } from '@nestjs/axios';
import { InternalSecurityService } from 'src/common/security/internal-security.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { SecurityHeadersGuard } from 'src/common/guards/security-headers.guard';
import { InternalSecurityModule } from 'src/common/security/internal-security.module';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RedisModule } from '@nestjs-modules/ioredis';
import { JwtValidatorService } from 'src/common/security/jwt-validator.service';

@Module({
  imports: [
    HttpModule, // Necesario para las peticiones HTTP
    JwtModule.register({}),
    ConfigModule,
    InternalSecurityModule,
    RedisModule.forRootAsync({
      useFactory: () => ({
        type: 'single',
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      }),
    })
  ],
  controllers: [VotingController],
  providers: [
    VotingProxy,
    InternalSecurityService,
    JwtService,
    SecurityHeadersGuard,
    JwtAuthGuard,
    JwtValidatorService
  ],
  exports: [VotingProxy],
})
export class VotingModule { }