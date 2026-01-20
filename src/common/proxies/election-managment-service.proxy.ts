import { Injectable, Logger } from '@nestjs/common';
import { BaseProxy } from './base.proxy';
import { InternalSecurityService } from '../security/internal-security.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ElectionManagmentProxy extends BaseProxy {
  protected readonly logger = new Logger(ElectionManagmentProxy.name);
  protected readonly serviceName = 'election-mgmt-service';
  protected readonly privateKeyVar = 'ELECTION_MGMT_PRIVATE_KEY'; // O la que definas en el .env
  protected readonly urlVar = 'ELECTION_MGMT_URL';
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
    // Usamos el método GET para obtener datos
    return this.sendGet('/results/summary');
  }
}