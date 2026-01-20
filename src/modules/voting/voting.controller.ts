import { Controller, Get, Body, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { VotingProxy } from '../../common/proxies/voting.proxy';
import { SecurityHeadersGuard } from 'src/common/guards/security-headers.guard';
import { DecryptionInterceptor } from 'src/common/interceptors/decryption.interceptor';

@Controller('voting')
@UseGuards(SecurityHeadersGuard)
@UseInterceptors(DecryptionInterceptor)
export class VotingController {
  constructor(private readonly votingProxy: VotingProxy) {}

  /* TODO: Pasarlo a election-managment-service
  @Get('candidates')
  @HttpCode(HttpStatus.OK)
  async verifyIdentity() {
    return await this.votingProxy.getCandidatos();
  }*/

  @Get('test')
  @HttpCode(HttpStatus.OK)
  async test() {
    return await this.votingProxy.test();
  }

}