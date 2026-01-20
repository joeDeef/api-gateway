import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtValidatorService } from '../security/jwt-validator.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtValidator: JwtValidatorService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // 1. Verificar que el header exista y tenga el formato correcto
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Formato de autorización inválido (Bearer token requerido)');
    }

    // 2. Extraer solo el string del JWT
    const token = authHeader.split(' ')[1];

    try {
      // 3. Validar integridad y firma con la Llave Pública
      // Si el token fue alterado, este método lanza una excepción automáticamente
      const payload = this.jwtValidator.validateToken(token);

      // 4. Adjuntar la identidad validada al objeto request
      // Esto permite que tus controladores sepan quién está votando sin volver a decodificar
      request.user = {
        cedula: payload.sub,
        role: payload.role,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido, expirado o alterado');
    }
  }
}