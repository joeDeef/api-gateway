import { Controller, Post, Get, Body, Param, Req, HttpCode, HttpStatus, UseGuards, Logger, OnModuleInit } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { VoterGuard } from 'src/common/guards/voter.guard';
import { ElectionManagmentProxy } from 'src/common/proxies/election-managment-service.proxy';
import { VotingProxy } from 'src/common/proxies/voting.proxy';
import { VotingService } from './voting.service';

/**
 * Controlador para operaciones de votación
 * Maneja el envío y confirmación de votos con autenticación JWT
 */
@Controller('voting')
export class VotingController implements OnModuleInit {
  private readonly logger = new Logger(VotingController.name);
  private electionId: string;
  constructor(
    private readonly votingProxy: VotingProxy,
    private readonly electionMgntProxy: ElectionManagmentProxy,
    private readonly votingService: VotingService
  ) { }


  async onModuleInit() {
    try {
      this.logger.log('Sincronizando ID de elección desde ElectionManagement...');

      // Si el proxy retorna directamente el string del UUID
      const response = await this.electionMgntProxy.findElectionIdToday();

      if (response) {
        this.electionId = response.id;
        this.logger.log(`ID de elección cargado: ${this.electionId}`);
      } else {
        this.logger.warn('La respuesta no es un UUID válido o no hay elecciones hoy.');
      }
    } catch (error) {
      this.logger.error(`Error al inicializar: ${error.message}`);
    }
  }

  /**
   * Envía la intención de voto de un ciudadano
   * @param body - Datos del voto con ID del candidato
   * @param req - Request object con información del usuario autenticado
   * @returns Confirmación de envío de intención de voto
   */
  @UseGuards(JwtAuthGuard, VoterGuard)
  @Post('cast')
  @HttpCode(HttpStatus.OK)
  async castVote(@Body() body: { candidateId: string }, @Req() req: any) {

    this.logger.log(`Procesando intención de voto - Usuario: ${req.user.sub}, Candidato: ${body.candidateId}`);

    const payload = {
      userId: req.user.sub,
      candidateId: body.candidateId,
      electionId: this.electionId
    };

    const result = await this.votingProxy.castVote(payload);
    this.logger.log(`Intención de voto enviada exitosamente para usuario: ${req.user.sub}`);
    return result;
  }

  /**
   * Confirma definitivamente el voto emitido por el ciudadano
   * @param body - Datos del voto con ID del candidato a confirmar
   * @param req - Request object con información del usuario autenticado
   * @returns Confirmación de voto registrado exitosamente
   */
  @UseGuards(JwtAuthGuard, VoterGuard)
  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  async confirmVote(@Body() body: { candidateId: string }, @Req() req: any) {
    this.logger.log(`Procesando confirmación de voto - Usuario: ${req.user.sub}, Candidato: ${body.candidateId}`);

    const payload = {
      userId: req.user.sub,
      candidateId: body.candidateId,
      electionId: this.electionId
    };

    const result = await this.votingProxy.confirmVote(payload);
    this.logger.log(`Voto confirmado exitosamente para usuario: ${req.user.sub}`);

    return result;
  }

  @Get('results')
  @HttpCode(HttpStatus.OK)
  async getResultados() {
    this.logger.log(`Obteniendo resultados para la elección: ${this.electionId}`);
    
    return this.votingService.getResultadosCompletos(this.electionId);
  }

  /**
   * Valida si la sesión del votante sigue activa y válida
   * @param req - Request object con información del usuario autenticado
   * @returns Estado de la sesión del votante
   */
  @UseGuards(JwtAuthGuard, VoterGuard)
  @Get('validate-session')
  @HttpCode(HttpStatus.OK)
  async validateSession(@Req() req: any) {
    this.logger.log(`Validando sesión para usuario: ${req.user.sub}`);
    
    return {
      valid: true,
      message: 'Sesión válida'
    };
  }
}