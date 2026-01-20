import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthProxy } from "src/common/proxies/auth.proxy";
import { VotingProxy } from "src/common/proxies/voting.proxy";
import { ValidateBiometricDto } from "./dto/validate-biometric.dto";
import { JwtValidatorService } from "src/common/security/jwt-validator.service";

// 1. Definimos la interfaz de respuesta
// Define la interfaz con todas las propiedades que devuelve tu Auth-Service
export interface AuthResponse {
  success: boolean;
  accessToken?: string;
  user?: any;
  message?: string;
  status?: string;
}

// src/modules/auth/auth-orchestrator.service.ts
@Injectable()
export class AuthOrchestratorService {
  private readonly logger = new Logger(AuthOrchestratorService.name)

  constructor(
    private readonly authProxy: AuthProxy,
    private readonly jwtValidator: JwtValidatorService,
    private readonly votingProxy: VotingProxy,

  ) { }

  async completeBiometricVerification(data: ValidateBiometricDto): Promise<AuthResponse> {
    const authResponse = await this.authProxy.verifyBiometric(data) as AuthResponse;

    if (authResponse?.success && authResponse?.accessToken) {
      try {
        // Usamos el validador centralizado
        const payload = this.jwtValidator.validateToken(authResponse.accessToken);

        const sessionData = {
          userId: payload.sub,
          role: payload.role,
          expirationTime: payload.exp
        };

        await this.votingProxy.setVoterSession(sessionData);
        this.logger.log(`Sincronización exitosa para usuario ${payload.sub}`);
      } catch (err) {
        this.logger.error(`Fallo crítico en integridad de token o sincronización: ${err.message}`);
      }
    }
    return authResponse;
  }
}