import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { DashboardElectionProxy } from '../../common/proxies/dashboard-election.proxy';
import { SecurityHeadersGuard } from 'src/common/guards/security-headers.guard';

@Controller('results')
@UseGuards(SecurityHeadersGuard)
export class DashboardElectionController {
  constructor(private readonly dashboardElectionProxy: DashboardElectionProxy) {}

  // Endpoint para consultar los resultados de la elección
  @Get()
  @HttpCode(HttpStatus.OK)
  async getResults() {
    return await this.dashboardElectionProxy.getResults();
  }
}