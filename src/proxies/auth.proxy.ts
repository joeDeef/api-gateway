// src/modules/auth/auth.proxy.ts
import { Injectable, Logger } from '@nestjs/common';
import { BaseProxy } from './base.proxy';

@Injectable()
export class AuthProxy extends BaseProxy {
  protected readonly logger = new Logger(AuthProxy.name);
  protected readonly serviceName = 'auth-service';
  protected readonly privateKeyVar = 'AUTH_PRIVATE_KEY';
  protected readonly urlVar = 'AUTH_SERVICE_URL';

  async verifyIdentity(credentialUser: any) {
    return this.sendPost('/auth/identity', credentialUser);
  }

  async verifyOtp(credentialUser: any) {
    return this.sendPost('/auth/verify-otp', credentialUser);
  }

  async verifyBiometric(credentialUser: any) {
    return this.sendPost('/auth/biometric', credentialUser);
  }

  async verifyAdmin(credentialUser: any) {
    return this.sendPost('/auth/admin/login', credentialUser);
  }
}