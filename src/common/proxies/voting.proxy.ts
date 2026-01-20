import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InternalSecurityService } from 'src/common/security/internal-security.service';  // Asegura la ruta correctaimport { BaseProxy } from './base.proxy';
import { BaseProxy } from './base.proxy';

@Injectable()
export class VotingProxy extends BaseProxy {
  protected readonly logger = new Logger(VotingProxy.name);
  protected readonly serviceName = 'voting-service';
  protected readonly privateKeyVar = 'VOTING_PRIVATE_KEY_BASE64';
  protected readonly urlVar = 'VOTING_SERVICE_URL';
  private readonly votingInteranalApiKey = 'VOTING_INTERNAL_API_KEY';
  
  constructor(
    protected readonly securityService: InternalSecurityService,
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    // Esta línea pasa los servicios a BaseProxy para que funcionen sendGet y sendPost
    super(securityService, httpService, configService);
  }

  /**
   * Obtiene la lista oficial de candidatos.
   */
  async getCandidatos() {
    return this.sendGet('/candidates/all');
  }

  /**
   * Notifica al microservicio de votación para inicializar una sesión de votante.
   */
  async setVoterSession(data: { userId: string; expirationTime: number }) {
    // Usamos el método heredado de BaseProxy que ya firma y envía la petición
    return this.sendPost('/voting/setTime', data);
  }

  /**
   * Método de prueba
   */
  async test() {
    return this.sendGet('/test');
  }
}