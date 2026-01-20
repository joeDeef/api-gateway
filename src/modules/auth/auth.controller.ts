import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, UseInterceptors, Logger } from '@nestjs/common';
import { AuthProxy } from '../../common/proxies/auth.proxy';
import { ValidateIdentityDto, ValidateOtpDto, ValidateBiometricDto, ValidateAdminDto } from './dto/main';
import { SecurityHeadersGuard } from 'src/common/guards/security-headers.guard';
import { DecryptionInterceptor } from 'src/common/interceptors/decryption.interceptor';
import { AuthOrchestratorService, AuthResponse } from './auth-orchestrator.service';
import { DoubleVotingGuard } from 'src/common/guards/double-voting.guard';

@Controller('auth')
@UseGuards(DoubleVotingGuard)
@UseInterceptors(DecryptionInterceptor)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authProxy: AuthProxy,
    private readonly authOrchestrator: AuthOrchestratorService) { }

  // Verificación de Identidad (Cédula, Código Dactilar)
  @Post('identity')
  @HttpCode(HttpStatus.OK)
  async verifyIdentity(@Body() data: ValidateIdentityDto) {
    this.logger.log(`Paso 1: Verificando identidad para cédula: ${data.cedula}`);
    return await this.authProxy.verifyIdentity(data);
  }

  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  async requestOtp(@Body() data: { cedula: string }) {
    this.logger.log(`Solicitando envío de OTP al microservicio para la cédula: ${data.cedula}`);
    return await this.authProxy.requestOtp(data.cedula);
  }

  @Post('otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() data: ValidateOtpDto) {
    this.logger.log(`Paso 2: Verificando OTP para cédula: ${data.cedula}`);
    return await this.authProxy.verifyOtp(data);
  }

  // Valicación Biométrica
  @Post('biometrics')
  async verifyBiometric(@Body() data: ValidateBiometricDto): Promise<AuthResponse> {
    return await this.authOrchestrator.completeBiometricVerification(data);
  }

  // Validación Credenciales Administrador
  @Post('admin/login')
  async verifyAdmin(@Body() data: ValidateAdminDto) {
    return await this.authProxy.verifyAdmin(data);
  }

  // Validación Credenciales Administrador
  @Post('admin/autorizate')
  @UseGuards(SecurityHeadersGuard)
  async autorizateAction() {
    return await this.authProxy.autorize();
  }
}