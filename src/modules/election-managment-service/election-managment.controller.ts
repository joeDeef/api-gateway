import { Controller, Get, Body, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ElectionManagmentProxy } from 'src/common/proxies/election-managment-service.proxy';
import { CreateElectionDataDto } from './data-election.dto';

@Controller('election')
export class ElectionManagmentController {
  constructor(private readonly electionManagmentProxy: ElectionManagmentProxy) { }

  @Get('candidates')
  @HttpCode(HttpStatus.OK)
  async getCandidatos() {
    return await this.electionManagmentProxy.getCandidatos();
  }

  @Post('create')
  @HttpCode(HttpStatus.OK)
  async createElection(@Body() data: CreateElectionDataDto) {
    return await this.electionManagmentProxy.createElection(data);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.electionManagmentProxy.findAll();
  }

  @Get('test')
  @HttpCode(HttpStatus.OK)
  async test() {
    return await this.electionManagmentProxy.test();
  }
}