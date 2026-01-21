import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VotingController } from './voting.controller';
import { VotingServiceProxy } from './voting-service.proxy';

@Module({
  imports: [HttpModule],
  controllers: [VotingController],
  providers: [VotingServiceProxy],
})
export class VotingModule { }