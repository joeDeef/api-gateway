import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InternalSecurityService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getSecurityHeaders(targetService: string, envVarName: string) {
    // 1. Obtenemos la llave en formato Base64 (una sola línea)
    const base64Key = this.configService.get<string>(envVarName);

    if (!base64Key) {
      throw new InternalServerErrorException(
        `La variable de entorno ${envVarName} no está configurada en el sistema.`,
      );
    }

    try {
      // 2. DECODIFICACIÓN: Convertimos la cadena Base64 de vuelta al formato PEM original
      // Esto es vital para que la librería pueda leer los encabezados -----BEGIN RSA...
      const privateKey = Buffer.from(base64Key, 'base64').toString('utf-8');

      const payload = { 
        iss: 'sevotec-gateway', 
        aud: targetService,
        iat: Math.floor(Date.now() / 1000) 
      };

      // 3. FIRMADO: Usamos la llave ya decodificada
      const token = await this.jwtService.signAsync(payload, {
        privateKey: privateKey,
        algorithm: 'RS256',
        expiresIn: '15s',
      });

      return {
        'x-internal-token': token,
        'Content-Type': 'application/json',
      };
    } catch (error) {
      // Si la decodificación falla, lanzamos un error de integridad
      throw new InternalServerErrorException(
        `Error al procesar la firma de seguridad para ${targetService}. Verifique el formato de la llave.`,
      );
    }
  }
}