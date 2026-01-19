import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (token === 'Bearer token-secreto-123') {
      // Simulamos que decodificamos el usuario
      request.user = { id: 'voter_001', role: 'citizen' };
      return true; // Deja pasar la petición
    }
    
    throw new UnauthorizedException('No tienes permiso para votar');
  }
}