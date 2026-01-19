import { Controller, Get, Body, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { VotingProxy } from '../../proxies/voting.proxy';

@Controller('voting')
export class VotingController {
  constructor(private readonly votingProxy: VotingProxy) {}

  
  @Get('candidates')
  @HttpCode(HttpStatus.OK)
  async verifyIdentity() {
    return await this.votingProxy.getCandidatos();
  }

  @Get('test')
  @HttpCode(HttpStatus.OK)
  async test() {
    return await this.votingProxy.test();
  }

}