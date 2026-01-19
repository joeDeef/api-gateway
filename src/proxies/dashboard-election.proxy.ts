import { Injectable, Logger } from '@nestjs/common';
import { BaseProxy } from './base.proxy';

@Injectable()
export class DashboardElectionProxy extends BaseProxy {
  protected readonly logger = new Logger(DashboardElectionProxy.name);
  protected readonly serviceName = 'dashboard-service';
  protected readonly privateKeyVar = 'DASHBOARD_PRIVATE_KEY'; // Usa la llave del .txt
  protected readonly urlVar = 'DASHBOARD_SERVICE_URL';

  async getResults() {
    this.logger.log('--- [GATEWAY] Solicitando Resultados Reales ---');
    // Usamos el método GET para obtener datos
    return this.sendGet('/results/summary');
  }
}