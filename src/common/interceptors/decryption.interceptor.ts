import { Injectable, NestInterceptor, ExecutionContext, CallHandler, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class DecryptionInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Validamos que el body contenga el campo 'payload'
    if (request.body && request.body.payload) {
      try {
        // 1. Cargar Llave Privada desde las variables de entorno
        const base64PrivKey = this.configService.get<string>('DECRYPT_FRONTEND_PRIVATE_KEY_BASE64');

        if (!base64PrivKey) {
          throw new InternalServerErrorException('Configuración incompleta: Llave privada no encontrada.');
        }

        const privateKey = Buffer.from(base64PrivKey, 'base64').toString('utf-8');

        // 2. Ejecutar el descifrado RSA-OAEP
        const decryptedBuffer = crypto.privateDecrypt(
          {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256', // 👈 Debe coincidir con el hashing de Angular (node-forge)
          },
          Buffer.from(request.body.payload, 'base64'),
        );

        // 3. Parsear el resultado y sobreescribir el body de la petición
        // Esto permite que el Controller y los DTOs vean los datos como si nunca hubieran sido cifrados
        request.body = JSON.parse(decryptedBuffer.toString());

      } catch (error) {
        throw new InternalServerErrorException(`Fallo al descifrar el paquete: ${error.message}`);
      }
    }

    return next.handle();
  }
}