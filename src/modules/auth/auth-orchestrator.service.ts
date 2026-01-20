import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthProxy } from "src/common/proxies/auth.proxy";
import { VotingProxy } from "src/common/proxies/voting.proxy";
import { ValidateOtpDto } from "./dto/validate-otp.dto";

@Injectable()
export class AuthOrchestratorService {
  private readonly logger = new Logger(AuthOrchestratorService.name);

  constructor(
    private readonly authProxy: AuthProxy,
    private readonly jwtService: JwtService,
    private readonly votingProxy: VotingProxy,
  ) {}

  async completeOtpVerification(data: ValidateOtpDto) {
    // 1. Llamar al microservicio de Auth a través del proxy
    const authResponse = await this.authProxy.verifyOtp(data);

    // 2. Si el OTP es válido y recibimos el token de acceso
    if (authResponse?.accessToken) {
      try {
        const payload: any = this.jwtService.decode(authResponse.accessToken);
        
        const sessionData = {
          userId: payload.sub,
          expirationTime: payload.exp
        };

        // 3. Delegamos la notificación al VotingProxy
        // No necesitamos manejar los headers aquí, el Proxy lo hace internamente
        await this.votingProxy.setVoterSession(sessionData);

        this.logger.log(`Sincronización de sesión exitosa para el usuario: ${payload.sub}`);
      } catch (err) {
        // Logueamos el error pero no bloqueamos el login del usuario
        this.logger.error(`Error en la sincronización proactiva: ${err.message}`);
      }
    }

    return authResponse;
  }
}