import { Module } from '@nestjs/common';
import { DashboardElectionController } from './dashboard-election.controller';
import { DashboardElectionProxy } from '../../common/proxies/dashboard-election.proxy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { SecurityHeadersGuard } from 'src/common/guards/security-headers.guard';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule,
  ],
  controllers: [DashboardElectionController],
  providers: [
    DashboardElectionProxy, 
    SecurityHeadersGuard],
  exports: [DashboardElectionProxy],
})
export class DashboardElectionModule { }