import { Controller, Get, Body, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ElectionManagmentProxy } from 'src/common/proxies/election-managment-service.proxy';

@Controller('election')
export class ElectionManagmentController {
  constructor(private readonly electionManagmentProxy: ElectionManagmentProxy) {}

  @Get('candidates')
  @HttpCode(HttpStatus.OK)
  async verifyIdentity() {
    return await this.electionManagmentProxy.getCandidatos();
  }

  @Get('test')
  @HttpCode(HttpStatus.OK)
  async test() {
    return await this.electionManagmentProxy.test();
  }
}