import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthProxy } from "src/common/proxies/auth.proxy";
import { VotingProxy } from "src/common/proxies/voting.proxy";
import { ValidateOtpDto } from "./dto/validate-otp.dto";
import { ValidateBiometricDto } from "./dto/validate-biometric.dto";

// 1. Definimos la interfaz de respuesta
// Define la interfaz con todas las propiedades que devuelve tu Auth-Service
export interface AuthResponse {
  success: boolean;
  accessToken?: string;
  user?: any;
  message?: string;
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

  async completeBiometricVerification(data: ValidateBiometricDto): Promise<AuthResponse> {
    this.logger.log(`Iniciando fase final: Validación biométrica para ${data.cedula}`);

    // 1. Llamamos al microservicio de Auth para la validación final y generación del JWT
    const authResponse = await this.authProxy.verifyBiometric(data) as AuthResponse;

    // 2. Si la biometría fue exitosa, el microservicio nos devuelve el accessToken
    if (authResponse?.success && authResponse?.accessToken) {
      try {
        // Decodificamos el JWT para extraer la identidad (ya confiamos en él porque viene de nuestra red interna)
        const payload = this.jwtService.decode(authResponse.accessToken) as any;
        
        const sessionData = {
          userId: payload.sub, // el usuarioID
          role: payload.role,
          expirationTime: payload.exp // Tiempo de expiración del JWT
        };

        // 3. SINCRONIZACIÓN PROACTIVA: 
        // Le avisamos al microservicio de VOTACIÓN que este usuario ya tiene permiso.
        await this.votingProxy.setVoterSession(sessionData);

        this.logger.log(`Sincronización exitosa. Usuario ${payload.sub} habilitado para votar.`);
      } catch (err) {
        // Logueamos el error pero no bloqueamos la respuesta al usuario, 
        // ya que el usuario ya está técnicamente autenticado.
        this.logger.error(`Error en la sincronización proactiva con Voting-Service: ${err.message}`);
      }
    }

    return authResponse;
  }
}