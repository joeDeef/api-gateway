import { ClientProxy } from '@nestjs/microservices';
import { InternalSecurityService } from 'src/common/security/internal-security.service';
import { lastValueFrom } from 'rxjs';
import { InternalServerErrorException, Logger } from '@nestjs/common';

// src/common/proxies/base-message.proxy.ts
export abstract class BaseMessageProxy {
  protected abstract readonly logger: Logger;
  protected abstract readonly serviceName: string;
  protected abstract readonly privateKeyVar: string;
  protected abstract readonly apiKeyVar: string;

  constructor(
    protected readonly client: ClientProxy,
    protected readonly securityService: InternalSecurityService,
  ) { }

  protected async sendRequest<T>(pattern: string, data: any): Promise<T> {
    const { headers, payload: securePayload } = await this.securityService.getSecurityHeaders(
      this.serviceName,
      this.privateKeyVar,
      this.apiKeyVar, 
      data 
    );

    try {
      return await lastValueFrom(
        this.client.send(pattern, { data: securePayload, headers })
      );
    } catch (error) {
      this.logger.error(`Error en ${pattern}: ${error.message}`);
      throw new InternalServerErrorException(error.message || `Fallo en comunicación`);
    }
  }
}