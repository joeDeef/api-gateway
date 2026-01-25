import { Controller, Get, Body, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors, Req } from '@nestjs/common';
import { ElectionManagmentProxy } from 'src/common/proxies/election-managment-service.proxy';
import { CreateElectionDataDto } from './data-election.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('election')
export class ElectionManagmentController {
  constructor(private readonly electionManagmentProxy: ElectionManagmentProxy) { }

  @Get('candidates')
  @HttpCode(HttpStatus.OK)
  async getCandidatos() {
    return await this.electionManagmentProxy.getCandidatos();
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  async createElection(@Body() data: CreateElectionDataDto) {
    return await this.electionManagmentProxy.createElection(data);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.electionManagmentProxy.findAll();
  }
}