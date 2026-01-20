import { Injectable, Logger } from '@nestjs/common';
import { BaseProxy } from './base.proxy';
import { InternalSecurityService } from '../security/internal-security.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ElectionManagmentProxy extends BaseProxy {
  protected readonly logger = new Logger(ElectionManagmentProxy.name);
  protected readonly serviceName = 'election-mgmt-service';
  protected readonly privateKeyVar = 'ELECTION_MGMT_PRIVATE_KEY';
  protected readonly urlVar = 'ELECTION_MGMT_URL';
  protected readonly apiKeyVar = 'ELECTION_MNGT_INTERNAL_API_KEY';
  protected readonly urlElectionMgmtService = "/api/v1/election"
constructor(
    protected readonly securityService: InternalSecurityService,
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(securityService, httpService, configService);
  }
    async test() {
    this.logger.log('Probando conexión con Election Management Service');
    // Usamos el método GET para obtener datos
    return this.sendGet(`${this.urlElectionMgmtService}/test`);  
    }


    async getCandidatos() {
    this.logger.log('Solicitando Candidatos a Election Management Service');
    // Usamos el método GET para obtener datos
    return this.sendGet(`${this.urlElectionMgmtService}/candidates/today`);
  }
}