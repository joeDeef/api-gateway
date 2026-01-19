import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthProxy } from '../../proxies/auth.proxy';
import { ValidateIdentityDto, ValidateOtpDto, ValidateBiometricDto, ValidateAdminDto } from './dto/main';

@Controller('auth')
export class AuthController {
  constructor(private readonly authProxy: AuthProxy) {}

  // Verificación de Identidad (Cédula)
  @Post('identity')
  @HttpCode(HttpStatus.OK)
  async verifyIdentity(@Body() data: ValidateIdentityDto) {
    return await this.authProxy.verifyIdentity(data);
  }

  // Validacion de OTP
  @Post('otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() data: ValidateOtpDto) {
    return await this.authProxy.verifyOtp(data);
  }

  // Valicación Biométrica
  @Post('biometrics')
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
}