// src/common/proxies/base.proxy.ts
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InternalSecurityService } from 'src/common/security/internal-security.service';
import { lastValueFrom } from 'rxjs';
import { InternalServerErrorException, Logger } from '@nestjs/common';

export abstract class BaseProxy {
  protected abstract readonly logger: Logger;
  protected abstract readonly serviceName: string;
  protected abstract readonly privateKeyVar: string;
  protected abstract readonly apiKeyVar: string;
  protected abstract readonly urlVar: string;

  constructor(
    protected readonly securityService: InternalSecurityService,
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) { }

  protected get baseUrl() {
    return this.configService.get<string>(this.urlVar);
  }

  protected async sendPost(endpoint: string, data: any) {
    // LLAMADA CORREGIDA (4 parámetros):
    const { headers, payload: securePayload } = await this.securityService.getSecurityHeaders(
      this.serviceName,
      this.privateKeyVar,
      this.apiKeyVar,
      data 
    );

    const fullUrl = `${this.baseUrl}${endpoint}`;
    this.logger.log(`Conectando con: ${fullUrl}`);

    try {
      // Importante: Enviamos el securePayload si el servicio espera el cuerpo cifrado
      const response = await lastValueFrom(
        this.httpService.post(fullUrl, securePayload, { headers })
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error en ${this.serviceName}: ${error.message}`);
      throw error.response?.data || new InternalServerErrorException(`Fallo en ${this.serviceName}`);
    }
  }

  protected async sendGet(endpoint: string) {
    // LLAMADA CORREGIDA (4 parámetros):
    const { headers } = await this.securityService.getSecurityHeaders(
      this.serviceName,
      this.privateKeyVar,
      this.apiKeyVar,
      {} 
    );
    
    const fullUrl = `${this.baseUrl}${endpoint}`;

    try {
      const response = await lastValueFrom(this.httpService.get(fullUrl, { headers }));
      return response.data;
    } catch (error) {
      const errorMessage = error.code === 'ECONNREFUSED'
        ? `CONEXIÓN RECHAZADA en ${this.baseUrl}`
        : error.message;

      this.logger.error(`Error GET en ${this.serviceName}: ${errorMessage}`);
      throw error.response?.data || new InternalServerErrorException(`Fallo en ${this.serviceName}`);
    }
  }
}