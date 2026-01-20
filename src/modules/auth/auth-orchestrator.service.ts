import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthProxy } from "src/common/proxies/auth.proxy";
import { VotingProxy } from "src/common/proxies/voting.proxy";
import { ValidateOtpDto } from "./dto/validate-otp.dto";

// 1. Definimos la interfaz de respuesta
export interface AuthResponse {
  accessToken?: string;
  user?: any;
  status?: string;
}

@Injectable()
export class AuthOrchestratorService {
  private readonly logger = new Logger(AuthOrchestratorService.name);

  constructor(
    private readonly authProxy: AuthProxy,
    private readonly jwtService: JwtService,
    private readonly votingProxy: VotingProxy,
  ) {}

  async completeOtpVerification(data: ValidateOtpDto) {
    // 2. Casteamos la respuesta con 'as AuthResponse'
    const authResponse = await this.authProxy.verifyOtp(data) as AuthResponse;

    if (authResponse?.accessToken) {
      try {
        // decode() puede devolver string o objeto, por eso usamos <any>
        const payload = this.jwtService.decode(authResponse.accessToken) as any;
        
        const sessionData = {
          userId: payload.sub,
          expirationTime: payload.exp
        };

        await this.votingProxy.setVoterSession(sessionData);

        this.logger.log(`Sincronización de sesión exitosa para el usuario: ${payload.sub}`);
      } catch (err) {
        this.logger.error(`Error en la sincronización proactiva: ${err.message}`);
      }
    }

    return authResponse;
  }
}