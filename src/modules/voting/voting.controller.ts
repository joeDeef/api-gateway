import { Controller, Get, Body, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors, Req } from '@nestjs/common';
import { VotingProxy } from '../../common/proxies/voting.proxy';
import { DecryptionInterceptor } from 'src/common/interceptors/decryption.interceptor';
import { DoubleVotingGuard } from 'src/common/guards/double-voting.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('voting')
@UseInterceptors(DecryptionInterceptor)
export class VotingController {
  constructor(private readonly votingProxy: VotingProxy) { }

  @UseGuards(JwtAuthGuard)
  @Post('cast')
  @UseGuards(DoubleVotingGuard)
  async castVote(
    @Req() req,
    @Body() data: { candidateId: string; electionId: string }
  ) {

    const userIdFromToken = req.user.cedula;
    const voteData = {
      ...data,
      userId: userIdFromToken
    };

    return this.votingProxy.castVote(voteData);
  }


  @UseGuards(JwtAuthGuard)
  @Post('confirm')
  @UseGuards(DoubleVotingGuard)
  async confirmVote(
    @Req() req,
    @Body() data: { candidateId: string; electionId: string }) {
    const userIdFromToken = req.user.cedula;
    const voteData = {
      ...data,
      userId: userIdFromToken
    };
    return this.votingProxy.confirmVote(voteData);
  }

  @Get('test')
  @HttpCode(HttpStatus.OK)
  async test() {
    return await this.votingProxy.test();
  }
}