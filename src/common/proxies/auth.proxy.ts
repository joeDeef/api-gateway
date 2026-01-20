import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseMessageProxy } from 'src/common/proxies/base-message.proxy';
import { InternalSecurityService } from 'src/common/security/internal-security.service';
import { ValidateAdminDto } from 'src/modules/auth/dto/validate-admin.dto';
import { ValidateBiometricDto } from 'src/modules/auth/dto/validate-biometric.dto';
import { ValidateIdentityDto } from 'src/modules/auth/dto/validate-identity.dto';
import { ValidateOtpDto } from 'src/modules/auth/dto/validate-otp.dto';

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

  // 1. Iniciar el flujo
  async verifyIdentity(credentialUser: ValidateIdentityDto) {
    return this.sendRequest('auth.validate-credentials', credentialUser);
  }

  // 2. Solicitar el envío del código (después de validar identidad)
  async requestOtp(cedula: string) {
    return this.sendRequest('auth.send-otp', { cedula });
  }

  // 3. Validar el código que el usuario recibió en el correo
  async verifyOtp(data: ValidateOtpDto) {
    return this.sendRequest('auth.verify-otp', data);
  }

  // 4. Paso final: Verificación de rostro
  async verifyBiometric(data: ValidateBiometricDto) {
    return this.sendRequest('auth.biometric', data);
  }

  // 5. Acceso administrativo
  async verifyAdmin(data: ValidateAdminDto) {
    return this.sendRequest('auth.admin-login', data);
  }

  async autorize() {
    return this.sendRequest('auth.admin-autorizate', {});
  }
}