import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { BaseProxy } from './base.proxy';
import { InternalSecurityService } from '../security/internal-security.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CreateElectionDataDto } from 'src/modules/election-managment-service/data-election.dto';
import { lastValueFrom } from 'rxjs';

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

  async test(headers: any = {}) {
    this.logger.log('Probando conexión con Election Management Service');
    // Usamos el método GET para obtener datos
    return this.sendGet(`${this.urlElectionMgmtService}/test`, headers);
  }

  async getCandidatos(headers: any = {}) {
    this.logger.log('Solicitando Candidatos a Election Management Service');
    // Usamos el método GET para obtener datos
    return this.sendGet(`${this.urlElectionMgmtService}/today`, headers);
  }

  async createElection(data: CreateElectionDataDto, headers: any = {}) {
    this.logger.log('Creando elección en Election Management Service');
    // Usamos el método POST sin cifrado
    return this.sendPostUnencrypted(`${this.urlElectionMgmtService}/create`, data, headers);
  }

  async findAll(headers: any = {}) {
    return this.sendGet(`${this.urlElectionMgmtService}/all`, headers);
  }

  // Método para enviar POST sin cifrado
  protected async sendPostUnencrypted(endpoint: string, data: any, incomingHeaders: any = {}) {
    // Solo obtenemos headers básicos de seguridad, sin cifrado
    const { headers } = await this.securityService.getSecurityHeaders(
      this.serviceName,
      this.privateKeyVar,
      this.apiKeyVar,
      {} // datos vacíos para que no cifre
    );

    const fullUrl = `${this.baseUrl}${endpoint}`;

    try {
      // Enviamos los datos directamente sin cifrar
      const response = await lastValueFrom(
        this.httpService.post(fullUrl, data, { headers })
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error en ${this.serviceName}: ${error.message}`);
      throw error.response?.data || new InternalServerErrorException(`Fallo en ${this.serviceName}`);
    }
  }
}