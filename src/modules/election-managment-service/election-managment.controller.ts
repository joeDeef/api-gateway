import { Controller, Get, Body, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { VotingProxy } from '../../common/proxies/voting.proxy';
import { ElectionManagmentProxy } from 'src/common/proxies/election-managment-service.proxy';

@Controller('voting')
export class ElectionManagmentController {
  constructor(private readonly electionManagmentProxy: ElectionManagmentProxy) {}

  /* TODO: Pasarlo a election-managment-service
  @Get('candidates')
  @HttpCode(HttpStatus.OK)
  async verifyIdentity() {
    return await this.votingProxy.getCandidatos();
  }*/

}