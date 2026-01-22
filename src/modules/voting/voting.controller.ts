import { Controller, Post, Get, Body, Param, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { VotingServiceProxy } from './voting-service.proxy';
import type { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';

@Public()
@Controller('voting')
export class VotingController {
  constructor(private readonly votingProxy: VotingServiceProxy) { }

  /**
   * POST /voting/cast - Registrar un voto
   */
  @Post('cast')
  @HttpCode(HttpStatus.OK)
  async castVote(@Body() dto: any, @Req() req: Request) {
    return this.votingProxy.castVote(dto, req.headers);
  }

  /**
   * GET /voting/results/:electionId - Obtener resultados
   */
  @Get('results/:electionId')
  async getResults(@Param('electionId') electionId: string, @Req() req: Request) {
    return this.votingProxy.getResults(electionId, req.headers);
  }

  /**
   * POST /voting/check - Verificar si ya votó
   */
  @Post('check')
  @HttpCode(HttpStatus.OK)
  async checkVote(@Body() body: { token: string; electionId: string }, @Req() req: Request) {
    return this.votingProxy.checkVote(body.token, body.electionId, req.headers);
  }
}