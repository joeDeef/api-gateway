// api-gateway/src/common/guards/double-voting.guard.ts

import { 
  CanActivate, 
  ExecutionContext, 
  Injectable, 
  ForbiddenException, 
  Inject, 
  Logger 
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class DoubleVotingGuard implements CanActivate {
  private readonly logger = new Logger(DoubleVotingGuard.name);

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Obtenemos el usuario del JWT (que ya fue validado por un Guard previo)
    const user = request.user; 
    
    if (!user || !user.sub) {
      return true; // Si no hay usuario, el problema es de autenticación, no de doble voto
    }

    const userId = user.sub; // La cédula extraída del token
    const blacklistKey = `voted:${userId}`;

    // LECTURA EN REDIS
    const alreadyVoted = await this.redis.get(blacklistKey);

    if (alreadyVoted) {
      this.logger.warn(`Bloqueando intento de doble voto: ${userId}`);
      throw new ForbiddenException('Usted ya ha registrado su voto en este proceso electoral.');
    }

    // Si no existe la llave, permitimos que la petición siga su curso
    return true;
  }
}