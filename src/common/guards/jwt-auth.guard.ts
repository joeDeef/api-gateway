import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtValidatorService } from '../security/jwt-validator.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtValidator: JwtValidatorService,
    @InjectRedis() private readonly redis: Redis,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Bypass authentication for voting routes - token is sent in body
    const url = request.url || request.path;
    if (url?.startsWith('/voting')) {
      return true;
    }

    // 1. EXTRAER TOKEN DESDE LA COOKIE 
    const token = request.cookies?.['access_token'];

    if (!token) {
      throw new UnauthorizedException('No se encontró una sesión activa (Cookie faltante)');
    }

    try {
      // BARRERA 1: Integridad y Expiración (Stateless)
      const payload = this.jwtValidator.validateToken(token);

      // BARRERA 2: Existencia en Redis (Stateful)
      const sessionKey = `session:${payload.sub}`;
      const sessionData = await this.redis.get(sessionKey);

      if (!sessionData) {
        throw new UnauthorizedException('La sesión de votación ha expirado o ya ha sido utilizada');
      }

      const session = JSON.parse(sessionData);

      // BARRERA 3: Validación de Huella Digital (Fingerprinting)
      // Comparamos el navegador actual contra el que guardamos en el login
      const currentAgent = request.headers['user-agent'];
      if (session.userAgent && session.userAgent !== currentAgent) {
        this.redis.del(sessionKey); // Borramos la sesión por sospecha de robo de cookie
        throw new UnauthorizedException('Intento de acceso desde un dispositivo no autorizado');
      }

      // 4. Inyección de Identidad
      request.user = {
        cedula: payload.sub,
        role: payload.role,
        voterToken: session.voterToken,
        sessionId: sessionKey
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Sesión inválida o alterada');
    }
  }
}