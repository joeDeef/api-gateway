import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { BaseProxy } from './http-base.proxy';
import { EnvelopePackerService } from '../security/envelopePacker.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CreateElectionDataDto } from 'src/modules/election-managment-service/data-election.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ElectionManagmentProxy extends BaseProxy {
  protected readonly logger = new Logger(ElectionManagmentProxy.name);
  protected readonly targetService = 'election-mgmt-service';
  protected readonly originService = 'api-gateway';
  protected readonly privateKeyVar = 'ELECTION_MGMT_PRIVATE_KEY';
  protected readonly urlVar = 'ELECTION_MGMT_URL';
  protected readonly apiKeyVar = 'ELECTION_MNGT_INTERNAL_API_KEY';
  protected readonly publicKeyVar = 'ELECTION_MGMT_PUBLIC_KEY';
  protected readonly urlElectionMgmtService = "/api/v1/election"

  constructor(
    protected readonly securityService: EnvelopePackerService,
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(securityService, httpService, configService);
  }

  async getCandidatos() {
    this.logger.log('Solicitando Candidatos a Election Management Service');
    // Usamos el método GET para obtener datos
    return this.sendGet(`${this.urlElectionMgmtService}/today`);
  }

  async createElection(data: CreateElectionDataDto) {
    this.logger.log('Creando elección en Election Management Service');
    // Usamos el método POST sin cifrado
    return this.sendPost(`${this.urlElectionMgmtService}/create`, data);
  }

  async findAll() {
    return this.sendGet(`${this.urlElectionMgmtService}/findAll`);
  }

  async findElectionIdToday() {
    return this.sendGet(`${this.urlElectionMgmtService}/electionId`);
  }
}