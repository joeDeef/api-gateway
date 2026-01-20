import { Controller, Get, Body, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { VotingProxy } from '../../common/proxies/voting.proxy';
import { DecryptionInterceptor } from 'src/common/interceptors/decryption.interceptor';
import { DoubleVotingGuard } from 'src/common/guards/double-voting.guard';

@Controller('voting')
//@UseGuards(DoubleVotingGuard)
@UseInterceptors(DecryptionInterceptor)
export class VotingController {
  constructor(private readonly votingProxy: VotingProxy) { }

  @Post('cast')
  @UseGuards(DoubleVotingGuard)
  async castVote(@Body() data: { userId: string; candidateId: string; electionId: string }) {
    return this.votingProxy.castVote(data);
  }

  @Post('confirm')
  @UseGuards(DoubleVotingGuard)
  async confirmVote(@Body() data: { userId: string; electionId: string }) {
    return this.votingProxy.confirmVote(data);
  }

  @Get('test')
  @HttpCode(HttpStatus.OK)
  async test() {
    return await this.votingProxy.test();
  }
}