import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { DashboardElectionProxy } from '../../proxies/dashboard-election.proxy';

@Controller('results')
export class DashboardElectionController {
  constructor(private readonly dashboardElectionProxy: DashboardElectionProxy) {}

  // Endpoint para consultar los resultados de la elección
  @Get()
  @HttpCode(HttpStatus.OK)
  async getResults() {
    return await this.dashboardElectionProxy.getResults();
  }
}