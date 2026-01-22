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
  protected readonly encryptionKeyVar?: string;

  constructor(
    protected readonly securityService: InternalSecurityService,
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) { }

  protected get baseUrl() {
    return this.configService.get<string>(this.urlVar);
  }

  protected async sendPost(endpoint: string, data: any, incomingHeaders: any = {}) {
    // LLAMADA CORREGIDA (5 parámetros con cifrado):
    const { headers: securityHeaders, payload: securePayload } = await this.securityService.getSecurityHeaders(
      this.serviceName,
      this.privateKeyVar,
      this.apiKeyVar,
      data,
      this.encryptionKeyVar
    );

    // Merge headers (user headers take precedence for things like Authorization, but we might want to be careful)
    // Actually, we usually want to forward Authorization but keep security headers.
    // Let's mix them.
    const headers = { ...incomingHeaders, ...securityHeaders };

    const fullUrl = `${this.baseUrl}${endpoint}`;
    this.logger.log(`Conectando con: ${fullUrl}`);

    try {
      // Importante: Enviamos la estructura completa que espera el interceptor
      const requestBody = { data: securePayload, headers };
      const response = await lastValueFrom(
        this.httpService.post(fullUrl, requestBody, { headers })
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error en ${this.serviceName}: ${error.message}`);
      throw error.response?.data || new InternalServerErrorException(`Fallo en ${this.serviceName}`);
    }
  }

  protected async sendGet(endpoint: string, incomingHeaders: any = {}) {
    // Para GET: headers de seguridad van en HTTP headers
    const { headers: securityHeaders } = await this.securityService.getSecurityHeaders(
      this.serviceName,
      this.privateKeyVar,
      this.apiKeyVar,
      {}
    );

    // Merge headers
    // Logic to extract Bearer token if present in incomingHeaders (Authorization) and map to x-internal-token if needed
    // similar to VotingProxy logic, but BaseProxy is generic.
    // For now, let's just merge. If 'x-internal-token' is in incomingHeaders, it might override securityHeaders?
    // securityHeaders generates a fresh x-internal-token signed by Gateway.
    // But we WANT the User's token if available.

    let finalHeaders = { ...securityHeaders };

    if (incomingHeaders['authorization']) {
      const parts = incomingHeaders['authorization'].split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        // Replace x-internal-token with the User's token
        finalHeaders['x-internal-token'] = parts[1];
      }
    } else if (incomingHeaders['x-internal-token']) {
      finalHeaders['x-internal-token'] = incomingHeaders['x-internal-token'];
    }

    // Also merge other headers but avoid duplicating content-type if already set
    finalHeaders = { ...incomingHeaders, ...finalHeaders };
    // Wait, spread order matters. If I want User Token to win:
    // User token is in 'x-internal-token' now.

    // Specific logic for token forwarding:
    let userToken = incomingHeaders['x-internal-token'];
    if (!userToken && incomingHeaders['authorization']) {
      const parts = incomingHeaders['authorization'].split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        userToken = parts[1];
      }
    }

    if (userToken) {
      finalHeaders['x-internal-token'] = userToken;
    }

    const fullUrl = `${this.baseUrl}${endpoint}`;

    try {
      const response = await lastValueFrom(this.httpService.get(fullUrl, { headers: finalHeaders }));
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