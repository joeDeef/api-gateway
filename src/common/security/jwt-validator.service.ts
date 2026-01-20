import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtValidatorService {
  private readonly logger = new Logger(JwtValidatorService.name);
  private readonly publicKey: string;

  constructor(private readonly jwtService: JwtService) {
    // Cargamos la llave una sola vez al iniciar el servicio para mayor eficiencia
    const base64Key = process.env.PUBLIC_KEY_SING_JWT;
    if (!base64Key) {
      this.logger.error('Falta la variable de entorno PUBLIC_KEY_SING_JWT');
    }
    this.publicKey = Buffer.from(base64Key || '', 'base64').toString('utf8');
  }

  /**
   * Valida un token y devuelve su payload. 
   * Lanza UnauthorizedException si la firma es inválida o el token expiró.
   */
  validateToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        publicKey: this.publicKey,
        algorithms: ['RS256'],
      });
    } catch (error) {
      this.logger.error(`Fallo en validación de JWT: ${error.message}`);
      throw new UnauthorizedException('Token inválido o alterado');
    }
  }
}