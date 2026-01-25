import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private readonly publicKey: string;

  constructor(private readonly jwtService: JwtService) {
    // Leemos la llave pública desde las variables de entorno
    const base64Key = process.env.JWT_PUBLIC_KEY_BASE64;
    if (!base64Key) {
      this.logger.error('JWT_PUBLIC_KEY_BASE64 no configurada en el Gateway');
      throw new Error('Error de configuración de seguridad');
    }
    this.publicKey = Buffer.from(base64Key, 'base64').toString('utf8');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.['access_token'];

    if (!token) {
      throw new UnauthorizedException('Sesión no encontrada');
    }

    try {
      // VALIDACIÓN CRIPTOGRÁFICA DE LA FIRMA
      // Si el token fue manipulado, verify() lanzará una excepción inmediatamente
      const payload = this.jwtService.verify(token, {
        publicKey: this.publicKey,
        algorithms: ['RS256'],
      });

      // Inyectamos el payload validado en la request para los siguientes pasos
      request.user = payload;
      return true;
    } catch (error) {
      this.logger.warn(`Intento de acceso con token inválido: ${error.message}`);
      throw new UnauthorizedException('Token inválido, manipulado o expirado');
    }
  }
}