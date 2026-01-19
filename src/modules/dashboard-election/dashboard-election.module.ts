import { Module } from '@nestjs/common';
import { DashboardElectionController } from './dashboard-election.controller';
import { DashboardElectionProxy } from '../../proxies/dashboard-election.proxy';

@Module({
  imports: [],
  controllers: [DashboardElectionController],
  providers: [DashboardElectionProxy],
  exports: [DashboardElectionProxy],
})
export class DashboardElectionModule {}