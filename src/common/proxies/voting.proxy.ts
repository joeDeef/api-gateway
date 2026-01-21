import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InternalSecurityService } from 'src/common/security/internal-security.service';
import { BaseProxy } from './base.proxy';

@Injectable()
export class VotingProxy extends BaseProxy {
  protected readonly logger = new Logger(VotingProxy.name);
  protected readonly serviceName = 'voting-service';
  protected readonly privateKeyVar = 'VOTING_PRIVATE_KEY_BASE64';
  protected readonly urlVar = 'VOTING_SERVICE_URL';
  protected readonly apiKeyVar = 'VOTING_INTERNAL_API_KEY';

  constructor(
    protected readonly securityService: InternalSecurityService,
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(securityService, httpService, configService);
  }

  async setVoterSession(data: { userId: string; role: string, expirationTime: number }) {
    return this.sendPost('/voting/setTime', data);
  }

  async castVote(data: { userId: string; candidateId: string; electionId: string }) {
    return this.sendPost('/cast', data);
  }

  async confirmVote(data: { userId: string; electionId: string }) {
    return this.sendPost('/confirm', data);
  } 
  
  async test() {
    return this.sendGet('/test');
  }
}