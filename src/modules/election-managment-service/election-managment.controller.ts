import { Controller, Get, Body, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors, Req } from '@nestjs/common';
import { ElectionManagmentProxy } from 'src/common/proxies/election-managment-service.proxy';
import { CreateElectionDataDto } from './data-election.dto';
import type { Request } from 'express';

@Controller('election')
export class ElectionManagmentController {
  constructor(private readonly electionManagmentProxy: ElectionManagmentProxy) { }

  @Get('candidates')
  @HttpCode(HttpStatus.OK)
  async getCandidatos(@Req() req: Request) {
    return await this.electionManagmentProxy.getCandidatos(req.headers);
  }

  @Post('create')
  @HttpCode(HttpStatus.OK)
  async createElection(@Body() data: CreateElectionDataDto, @Req() req: Request) {
    return await this.electionManagmentProxy.createElection(data, req.headers);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request) {
    return await this.electionManagmentProxy.findAll(req.headers);
  }

  @Get('test')
  @HttpCode(HttpStatus.OK)
  async test(@Req() req: Request) {
    return await this.electionManagmentProxy.test(req.headers);
  }
}