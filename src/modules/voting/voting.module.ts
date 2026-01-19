import { Module } from '@nestjs/common';
import { VotingController } from './voting.controller';
import { VotingProxy } from '../../proxies/voting.proxy';
import { HttpModule } from '@nestjs/axios';
import { InternalSecurityService } from 'src/security/internal-security.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [HttpModule, // Necesario para las peticiones HTTP
  ],
  controllers: [VotingController],
  providers: [
    VotingProxy,
    InternalSecurityService, // <--- Agrégalo aquí
    JwtService, // <--- También es necesario porque el servicio lo usa
  ],
  exports: [VotingProxy],
})
export class VotingnModule { }