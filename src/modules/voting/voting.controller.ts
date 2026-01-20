import { Controller, Get, Body, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { VotingProxy } from '../../common/proxies/voting.proxy';
import { DecryptionInterceptor } from 'src/common/interceptors/decryption.interceptor';
import { DoubleVotingGuard } from 'src/common/guards/double-voting.guard';

@Controller('voting')
//@UseGuards(DoubleVotingGuard)
@UseInterceptors(DecryptionInterceptor)
export class VotingController {
  constructor(private readonly votingProxy: VotingProxy) { }

  @Post('confirm')
  @UseGuards(DoubleVotingGuard)
  async confirmVote(@Body() data: any) {
    //return this.votingProxy.finalizeVote(data);
  }

  @Get('test')
  @HttpCode(HttpStatus.OK)
  async test() {
    return await this.votingProxy.test();
  }
}