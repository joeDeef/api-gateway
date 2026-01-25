import { Injectable, Logger } from "@nestjs/common";
import { AuthProxy } from "src/common/proxies/auth.proxy";
import { VotingProxy } from "src/common/proxies/voting.proxy";
import { ValidateBiometricDto } from "./dto/validate-biometric.dto";
import { JwtValidatorService } from "src/common/security/jwt-validator.service";

// 1. Definimos la interfaz de respuesta
// Define la interfaz con todas las propiedades que devuelve tu Auth-Service
export interface AuthResponse {
  success: boolean;
  accessToken?: string;
  expirationTime: number,
  message?: string;
  status?: string;
}

// src/modules/auth/auth-orchestrator.service.ts
// src/modules/auth/auth-orchestrator.service.ts

@Injectable()
export class AuthOrchestratorService {
  private readonly logger = new Logger(AuthOrchestratorService.name);

  constructor(
    private readonly authProxy: AuthProxy,
    private readonly jwtValidator: JwtValidatorService,
    private readonly votingProxy: VotingProxy,
  ) { }

  async completeBiometricVerification(data: ValidateBiometricDto) {
    const authResponse = await this.authProxy.verifyBiometric(data) as AuthResponse;

    let tokenForCookie: string | null = null;

    if (authResponse?.success && authResponse?.accessToken) {
      try {
        tokenForCookie = authResponse.accessToken;
        const payload = this.jwtValidator.validateToken(authResponse.accessToken);

        const sessionData = {
          userId: payload.sub,
          role: payload.role,
          expirationTime: authResponse.expirationTime
        };

        // Sincronización con el microservicio de votación
        await this.votingProxy.setVoterSession(sessionData);
        this.logger.log(`Sincronización exitosa para usuario ${payload.sub}`);

        // ELIMINAMOS el token del objeto de respuesta original
        delete authResponse.accessToken;

      } catch (err) {
        this.logger.error(`Fallo crítico en sincronización: ${err.message}`);
        // Opcional: podrías invalidar el success si la sincronización falla
      }
    }

    // Retornamos ambos: la respuesta limpia y el token por separado
    return {
      safeResponse: authResponse,
      token: tokenForCookie
    };
  }
}