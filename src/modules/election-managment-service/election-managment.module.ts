import { Module } from '@nestjs/common';
import { VotingProxy } from '../../common/proxies/voting.proxy';
import { HttpModule } from '@nestjs/axios';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { SecurityHeadersGuard } from 'src/common/guards/security-headers.guard';
import { ElectionManagmentController } from './election-managment.controller';
import { InternalSecurityModule } from 'src/common/security/internal-security.module';
import { ElectionManagmentProxy } from 'src/common/proxies/election-managment-service.proxy';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({}),
    ConfigModule,
    InternalSecurityModule
  ],
  controllers: [
    ElectionManagmentController
  ],
  providers: [
    VotingProxy,
    JwtService,
    SecurityHeadersGuard,
    ElectionManagmentProxy
  ],
  exports: [],
})
export class ElectionManagmentModule { }