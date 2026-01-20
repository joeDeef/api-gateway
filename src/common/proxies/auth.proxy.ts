import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseMessageProxy } from 'src/common/proxies/base-message.proxy';
import { InternalSecurityService } from 'src/common/security/internal-security.service';

@Injectable()
export class AuthProxy extends BaseMessageProxy {
  protected readonly logger = new Logger(AuthProxy.name);
  protected readonly serviceName = 'auth-service';
  protected readonly privateKeyVar = 'AUTH_PRIVATE_KEY_BASE64'; // Usada para firmar
  protected readonly apiKeyVar = 'AUTH_INTERNAL_API_KEY';        // Usada para validación rápida
  
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    securityService: InternalSecurityService,
  ) {
    super(authClient, securityService);
  }

  async verifyIdentity(credentialUser: any) {
    return this.sendRequest('auth.validate-credentials', credentialUser);
  }

  async verifyOtp(credentialUser: any) {
    return this.sendRequest('auth.verify-otp', credentialUser);
  }

  async verifyBiometric(credentialUser: any) {
    return this.sendRequest('auth.biometric', credentialUser);
  }

  async verifyAdmin(credentialUser: any) {
    return this.sendRequest('auth.admin-login', credentialUser);
  }

  async autorize() {
    return this.sendRequest('auth.admin-autorizate', {});
  }
}