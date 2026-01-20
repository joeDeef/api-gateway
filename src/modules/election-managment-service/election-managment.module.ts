import { Module } from '@nestjs/common';
import { VotingProxy } from '../../common/proxies/voting.proxy';
import { HttpModule } from '@nestjs/axios';
import { InternalSecurityService } from 'src/common/security/internal-security.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { SecurityHeadersGuard } from 'src/common/guards/security-headers.guard';
import { ElectionManagmentController } from './election-managment.controller';

@Module({
  imports: [HttpModule, // Necesario para las peticiones HTTP
      JwtModule.register({}),
      ConfigModule,
  ],
  controllers: [ElectionManagmentController],
  providers: [
    VotingProxy,
    InternalSecurityService, // <--- Agrégalo aquí
    JwtService, // <--- También es necesario porque el servicio lo usa
    SecurityHeadersGuard
  ],
  exports: [VotingProxy],
})
export class VotingnModule { }