import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthProxy } from '../../common/proxies/auth.proxy';
import { ValidateIdentityDto, ValidateOtpDto, ValidateBiometricDto, ValidateAdminDto } from './dto/main';
import { SecurityHeadersGuard } from 'src/common/guards/security-headers.guard';
import { DecryptionInterceptor } from 'src/common/interceptors/decryption.interceptor';
import { AuthOrchestratorService, AuthResponse } from './auth-orchestrator.service';

@Controller('auth')
@UseInterceptors(DecryptionInterceptor)
export class AuthController {
  constructor(
    private readonly authProxy: AuthProxy,
    private readonly authOrchestrator: AuthOrchestratorService) { }

  // Verificación de Identidad (Cédula, Código Dactilar)
  @Post('identity')
  @HttpCode(HttpStatus.OK)
  async verifyIdentity(@Body() data: ValidateIdentityDto) {
    return await this.authProxy.verifyIdentity(data);
  }

  // Validacion de OTP
  @Post('otp')
  async verifyOtp(@Body() data: ValidateOtpDto): Promise<AuthResponse> {
    return await this.authOrchestrator.completeOtpVerification(data);
  }

  // Valicación Biométrica
  @Post('biometrics')
  @UseGuards(SecurityHeadersGuard)
  @HttpCode(HttpStatus.OK)
  async verifyBiometric(@Body() data: ValidateBiometricDto) {
    return await this.authProxy.verifyBiometric(data);
  }

  // Validación Credenciales Administrador
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  async verifyAdmin(@Body() data: ValidateAdminDto) {
    return await this.authProxy.verifyAdmin(data);
  }

  // Validación Credenciales Administrador
  @Post('admin/autorizate')
  @UseGuards(SecurityHeadersGuard)
  @HttpCode(HttpStatus.OK)
  async autorizateAction() {
    return await this.authProxy.autorize();
  }
}