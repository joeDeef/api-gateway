import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InternalSecurityService } from 'src/security/internal-security.service';  // Asegura la ruta correctaimport { BaseProxy } from './base.proxy';
import { BaseProxy } from './base.proxy';

@Injectable()
export class VotingProxy extends BaseProxy {
  protected readonly logger = new Logger(VotingProxy.name);
  protected readonly serviceName = 'voting-service';
  protected readonly privateKeyVar = 'VOTING_PRIVATE_KEY_BASE64';
  protected readonly urlVar = 'VOTING_SERVICE_URL';

  // --- AÑADE ESTE CONSTRUCTOR ---
  constructor(
    protected readonly securityService: InternalSecurityService,
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    // Esta línea pasa los servicios a BaseProxy para que funcionen sendGet y sendPost
    super(securityService, httpService, configService);
  }
  // ------------------------------

  /**
   * Obtiene la lista oficial de candidatos.
   */
  async getCandidatos() {
    this.logger.log('--- [GATEWAY] Obteniendo Lista de Candidatos ---');
    return this.sendGet('/candidates/all');
  }

  /**
   * Envía el voto cifrado al microservicio.
   */
  async castVote(voteData: any) {
    this.logger.log('--- [GATEWAY] Firmando y Enviando Voto ---');
    return this.sendPost('/votes/cast', voteData);
  }

  /**
   * Método de prueba
   */
  async test() {
    this.logger.log('--- [GATEWAY] Ejecutando Test de Conexión ---');
    return this.sendGet('/test');
  }
}