import { Injectable, Logger } from '@nestjs/common';
import { BaseProxy } from './http-base.proxy';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { EnvelopePackerService } from '../security/envelopePacker.service';

@Injectable()
export class BlockchainProxy extends BaseProxy {
  protected readonly logger = new Logger(BlockchainProxy.name);
  protected readonly targetService = 'blockchain-service';
  protected readonly privateKeyVar = 'BLOCKCHAIN_PRIVATE_KEY';
  protected readonly apiKeyVar = 'BLOCKCHAIN_INTERNAL_API_KEY';
  protected readonly publicKeyVar = 'BLOCKCHAIN_PUBLIC_KEY';
  protected readonly urlVar = 'BLOCKCHAIN_SERVICE_URL';

  constructor(
    protected readonly securityService: EnvelopePackerService,
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(securityService, httpService, configService);
  }

  async getResultados(electionID : string) {
    this.logger.log('--- [GATEWAY] Solicitando Resultados Reales ---');
    return this.sendGet(`/voting/all/${electionID}`);
    //return this.sendGet(`/voting/all/ELEC-2024`);

  }
}