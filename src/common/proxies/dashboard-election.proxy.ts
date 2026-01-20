import { Injectable, Logger } from '@nestjs/common';
import { BaseProxy } from './base.proxy';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InternalSecurityService } from '../security/internal-security.service';

@Injectable()
export class DashboardElectionProxy extends BaseProxy {
  protected readonly logger = new Logger(DashboardElectionProxy.name);
  protected readonly serviceName = 'dashboard-service';
  protected readonly privateKeyVar = 'DASHBOARD_PRIVATE_KEY';
  protected readonly urlVar = 'DASHBOARD_SERVICE_URL';
  protected readonly apiKeyVar = 'DASH_ELECT_INTERNAL_API_KEY';

  constructor(
    protected readonly securityService: InternalSecurityService,
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(securityService, httpService, configService);
  }

  async getResults() {
    this.logger.log('--- [GATEWAY] Solicitando Resultados Reales ---');
    return this.sendGet('/results/summary');
  }
}