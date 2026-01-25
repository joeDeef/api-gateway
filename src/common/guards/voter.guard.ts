import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class VoterGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    if (user?.role !== 'VOTER') {
      throw new ForbiddenException('Se requiere rol de VOTANTE');
    }
    console.log(`Acceso concedido al votante: ${user.sub}`);
    return true;
  }
}