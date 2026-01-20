import { Injectable, Logger } from '@nestjs/common';
import { BaseProxy } from './base.proxy';

@Injectable()
export class ElectionManagmentProxy extends BaseProxy {
  protected readonly logger = new Logger(ElectionManagmentProxy.name);
  protected readonly serviceName = 'election-managment-service';
  protected readonly privateKeyVar = 'ELECTION_MANAGMENT_PRIVATE_KEY';
  protected readonly urlVar = 'ELECTION_MANAGMENT_SERVICE_URL';

  async getResults() {
    this.logger.log('--- [GATEWAY] Solicitando Resultados Reales ---');
    // Usamos el método GET para obtener datos
    return this.sendGet('/results/summary');
  }
}