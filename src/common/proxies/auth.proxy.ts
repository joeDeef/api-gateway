import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseMessageProxy } from 'src/common/proxies/tcp-base.proxy';
import { EnvelopePackerService } from 'src/common/security/envelopePacker.service';
import { ValidateAdminDto } from 'src/modules/auth/dto/validate-admin.dto';
import { ValidateBiometricDto } from 'src/modules/auth/dto/validate-biometric.dto';
import { ValidateIdentityDto } from 'src/modules/auth/dto/validate-identity.dto';
import { ValidateOtpDto } from 'src/modules/auth/dto/validate-otp.dto';

/**
 * @class AuthProxy
 * @description Proxy que maneja la comunicación segura con el microservicio de autenticación.
 * Implementa el flujo completo de autenticación multifactor para ciudadanos y administradores.
 */
@Injectable()
export class AuthProxy extends BaseMessageProxy {
  protected readonly logger = new Logger(AuthProxy.name);
  protected readonly serviceName = 'auth-service';
  protected readonly privateKeyVar = 'AUTH_PRIVATE_KEY_BASE64'; // Clave para firmar mensajes
  protected readonly apiKeyVar = 'AUTH_INTERNAL_API_KEY';        // Clave para validación rápida
  protected readonly publicKeyVar = 'AUTH_PUBLIC_KEY_BASE64';   // Clave pública del microservicio
  
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    securityService: EnvelopePackerService,
  ) {
    super(authClient, securityService);
  }

  /**
   * @method verifyIdentity
   * @description Primer paso del flujo: verifica las credenciales básicas del ciudadano.
   * @param {ValidateIdentityDto} credentialUser - Datos de identidad del usuario.
   * @returns {Promise<any>} Resultado de la validación de identidad.
   */
  async verifyIdentity(credentialUser: ValidateIdentityDto) {
    this.logger.log(`Enviando solicitud de verificación de identidad para cédula: ${credentialUser.cedula}`);
    return this.sendRequest('auth.validate-credentials', credentialUser);
  }

  /**
   * @method requestOtp
   * @description Solicita el envío de un código OTP al email del ciudadano.
   * @param {string} cedula - Cédula del ciudadano.
   * @returns {Promise<any>} Confirmación del envío del OTP.
   */
  async requestOtp(cedula: string) {
    this.logger.log(`Solicitando envío de OTP para cédula: ${cedula}`);
    return this.sendRequest('auth.send-otp', { cedula });
  }

  /**
   * @method verifyOtp
   * @description Valida el código OTP proporcionado por el usuario.
   * @param {ValidateOtpDto} data - Datos con cédula y código OTP.
   * @returns {Promise<any>} Resultado de la verificación del OTP.
   */
  async verifyOtp(data: ValidateOtpDto) {
    this.logger.log(`Verificando OTP para cédula: ${data.id}`);
    return this.sendRequest('auth.verify-otp', data);
  }

  /**
   * @method verifyBiometric
   * @description Paso final: verificación biométrica del rostro del usuario.
   * @param {ValidateBiometricDto} data - Datos biométricos del usuario.
   * @returns {Promise<any>} Resultado de la verificación biométrica.
   */
  async verifyBiometric(data: ValidateBiometricDto) {
    this.logger.log(`Procesando verificación biométrica para cédula: ${data.id}`);
    return this.sendRequest('auth.biometric', data);
  }

  /**
   * @method verifyAdmin
   * @description Autentica las credenciales de un administrador.
   * @param {ValidateAdminDto} data - Credenciales del administrador.
   * @returns {Promise<any>} Resultado de la autenticación administrativa.
   */
  async verifyAdmin(data: ValidateAdminDto) {
    this.logger.log(`Procesando login de administrador: ${data.email}`);
    return this.sendRequest('auth.admin-login', data);
  }

  /**
   * @method autorize
   * @description Autoriza acciones específicas de administrador.
   * @returns {Promise<any>} Resultado de la autorización.
   */
  async autorize() {
    this.logger.log('Procesando autorización de acción administrativa');
    return this.sendRequest('auth.admin-autorizate', {});
  }
}
