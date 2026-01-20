import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';

@Global() // <--- Esta es la clave
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        // En Railway usamos REDIS_URL o REDISURL
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

        const client = new Redis(redisUrl, {
          maxRetriesPerRequest: null,
        });

        client.on('error', (err) => {
          console.error('Error conectando a Redis en Railway:', err);
        });

        client.on('connect', () => {
          console.log('Conectado a Redis exitosamente');
        });

        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule { }