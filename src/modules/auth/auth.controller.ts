import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, UseInterceptors, Logger, Res, UseFilters } from '@nestjs/common';
import { AuthProxy } from '../../common/proxies/auth.proxy';
import { ValidateIdentityDto, ValidateOtpDto, ValidateBiometricDto, ValidateAdminDto } from './dto/main';
import { SecurityHeadersGuard } from 'src/common/guards/security-headers.guard';
import { DecryptionInterceptor } from 'src/common/interceptors/decryption.interceptor';
import { AuthOrchestratorService, AuthResponse } from './auth-orchestrator.service';
import { DoubleVotingGuard } from 'src/common/guards/double-voting.guard';
import type { Response } from 'express';

/**
 * @class AuthController
 * @description Este controlador maneja las rutas relacionadas con el proceso de autenticación.
 * Aplica guardias e interceptores para garantizar la seguridad y la integridad de los datos.
 */
@Controller('auth')
@UseGuards(DoubleVotingGuard) // Previene que un usuario que ya votó inicie sesión nuevamente.
@UseInterceptors(DecryptionInterceptor) // Desencripta el cuerpo de las solicitudes entrantes.
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authProxy: AuthProxy,
    private readonly authOrchestrator: AuthOrchestratorService,
  ) { }

  /**
   * @method verifyIdentity
   * @description Endpoint para el primer paso de la autenticación: verificación de identidad del ciudadano.
   * @param {ValidateIdentityDto} data - DTO con los datos de identidad.
   * @returns {Promise<any>} El resultado de la verificación de identidad.
   */
  @Post('identity')
  @HttpCode(HttpStatus.OK)
  async verifyIdentity(@Body() data: ValidateIdentityDto) {
    this.logger.log(`[Step 1] Verificando identidad para la cédula: ${data.cedula}`);
    return await this.authProxy.verifyIdentity(data);
  }

  /**
   * @method requestOtp
   * @description Solicita el envío de un código OTP (One-Time Password) al usuario.
   * @param {object} data - Objeto que contiene la cédula del usuario.
   * @returns {Promise<any>} El resultado de la solicitud de OTP.
   */
  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  async requestOtp(@Body() data: { id: string }) {
    this.logger.log(`Solicitando envío de OTP para la cédula: ${data.id}`);
    return await this.authProxy.requestOtp(data.id);
  }

  /**
   * @method verifyOtp
   * @description Endpoint para el segundo paso: verificación del código OTP.
   * @param {ValidateOtpDto} data - DTO con la cédula y el código OTP.
   * @returns {Promise<any>} El resultado de la verificación del OTP.
   */
  @Post('otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() data: ValidateOtpDto) {
    this.logger.log(`[Step 2] Verificando OTP para la cédula: ${data.id}`);
    return await this.authProxy.verifyOtp(data);
  }

  /**
   * @method verifyBiometric
   * @description Endpoint para el tercer y último paso: verificación biométrica.
   * Si la verificación es exitosa, se genera un token de acceso y se establece en una cookie segura.
   * @param {ValidateBiometricDto} data - DTO con los datos biométricos.
   * @param {Response} response - Objeto de respuesta de Express para configurar la cookie.
   * @returns {Promise<Partial<AuthResponse>>} Un objeto con el resultado de la autenticación.
   */
  @Post('biometrics')
  async verifyBiometric(
    @Body() data: ValidateBiometricDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.logger.log(`[Step 3] Verificando biometría para la sesión: ${data.id}`);

    const { safeResponse, token } = await this.authOrchestrator.completeBiometricVerification(data);

    if (safeResponse.success && token) {
      this.logger.log(`Autenticación exitosa. Configurando cookie.`);

      response.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 15 * 60 * 1000,
      });
    }

    return safeResponse;
  }

  /**
   * @method verifyAdmin
   * @description Endpoint para la autenticación de administradores.
   * @param {ValidateAdminDto} data - DTO con las credenciales del administrador.
   * @returns {Promise<any>} El resultado de la verificación.
   */
  @Post('admin/login')
  async verifyAdmin(
    @Body() data: ValidateAdminDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.logger.log(`Intento de inicio de sesión de administrador: ${data.email}`);

    // 1. Llamada al microservicio
    const responseAdmin = await this.authProxy.verifyAdmin(data) as AuthResponse;

    // 2. Lógica de la Cookie (solo si fue exitoso)
    if (responseAdmin.success && responseAdmin.accessToken) {
      this.logger.log(`Autenticación exitosa. Configurando cookie.`);

      response.cookie('access_token', responseAdmin.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 15 * 60 * 1000, // 15 minutos
      });

      // Retorno personalizado de éxito
      return {
        success: true,
        message: 'Bienvenido al sistema administrativo'
      };
    }

    // 3. Retorno personalizado de fallo
    // Nota: Si el proxy ya lanza una RpcException/HttpException, 
    // es posible que el código no llegue aquí y debas manejarlo en un Filter.
    return {
      success: false,
      message: 'Fallo en la autenticación'
    };
  }

  /**
   * @method autorizateAction
   * @description Endpoint para autorizar acciones de administrador, protegido por cabeceras de seguridad.
   * @returns {Promise<any>} El resultado de la autorización.
   */
  @Post('admin/autorizate')
  @UseGuards(SecurityHeadersGuard) // Valida cabeceras de seguridad específicas para acciones de admin.
  async autorizateAction() {
    this.logger.log('Autorizando acción de administrador.');
    return await this.authProxy.autorize();
  }
}