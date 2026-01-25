import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VotingController } from './voting.controller';
import { VotingProxy } from 'src/common/proxies/voting.proxy';
import { ElectionManagmentProxy } from 'src/common/proxies/election-managment-service.proxy';
import { BlockchainProxy } from 'src/common/proxies/blockchain.proxy';

@Module({
  imports: [HttpModule],
  controllers: [VotingController],
  providers: [
    VotingProxy,
    ElectionManagmentProxy,
    BlockchainProxy
  ],
})
export class VotingModule { }