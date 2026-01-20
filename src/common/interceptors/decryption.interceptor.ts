import { Injectable, NestInterceptor, ExecutionContext, CallHandler, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class DecryptionInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['x-signature'];

    if (request.body && request.body.payload) {
      try {
        // 1. Cargar Llave Privada del Microservicio para descifrar
        const base64PrivKey = this.configService.get<string>('DECRYPT_FRONTEND_PRIVATE_KEY_BASE64');

        if (!base64PrivKey) {
          throw new InternalServerErrorException('Error de configuración: Llave privada no encontrada.');
        }

        const privateKey = Buffer.from(base64PrivKey, 'base64').toString('utf-8');
        // 2. Descifrar el Body (Capa de Confidencialidad)
        const decryptedBuffer = crypto.privateDecrypt(
          {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          },
          Buffer.from(request.body.payload, 'base64'),
        );

        const decryptedBody = JSON.parse(decryptedBuffer.toString());

        // 3. Verificar Integridad
        // Estandarizamos el body descifrado para comparar contra la firma
        const bodyString = JSON.stringify(decryptedBody).replace(/\s+/g, '');
        const hash = crypto.createHash('sha256').update(bodyString).digest('hex');

        // Necesitamos la llave pública del Gateway para verificar la firma
        const base64GatewayKey = this.configService.get<string>('FRONTEND_PUBLIC_KEY_BASE64');

        if (!base64GatewayKey) {
          throw new InternalServerErrorException('Error de configuración: FRONTEND_PUBLIC_KEY_BASE64 no encontrada');
        }

        // Ahora TypeScript sabe que es un string y no dará error
        const gatewayPublicKey = Buffer.from(base64GatewayKey, 'base64').toString('utf-8');
        const isIntegrityValid = crypto.verify(
          "sha256",
          Buffer.from(hash),
          {
            key: gatewayPublicKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
          },
          Buffer.from(signature, 'base64')
        );

        if (!isIntegrityValid) {
          throw new Error('La firma de integridad no coincide con el contenido descifrado');
        }

        // 4. Reemplazamos el body cifrado por el real para que lo usen los DTOs
        request.body = decryptedBody;

      } catch (error) {
        throw new InternalServerErrorException(`Fallo en el protocolo de descifrado o integridad: ${error.message}`);
      }
    }

    return next.handle();
  }
}