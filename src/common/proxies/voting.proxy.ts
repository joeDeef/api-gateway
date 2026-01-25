import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { EnvelopePackerService } from 'src/common/security/envelopePacker.service';
import { BaseProxy } from './http-base.proxy';

@Injectable()
export class VotingProxy extends BaseProxy {
  protected readonly logger = new Logger(VotingProxy.name);
  protected readonly targetService = 'voting-service';
  protected readonly privateKeyVar = 'VOTING_PRIVATE_KEY_BASE64';
  protected readonly urlVar = 'VOTING_SERVICE_URL';
  protected readonly apiKeyVar = 'VOTING_INTERNAL_API_KEY';
  protected readonly publicKeyVar = 'VOTING_ENCRYPT_PUBLIC_KEY_BASE64';

  constructor(
    protected readonly securityService: EnvelopePackerService,
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(securityService, httpService, configService);
  }

  async setVoterSession(data: { userId: string; role: string, expirationTime: number }) {
    return this.sendPost('/setTime', JSON.stringify(data));
  }

  async castVote(data: { userId: string; candidateId: string; electionId: string }) {
    return this.sendPost('/cast', JSON.stringify(data));
  }

  async confirmVote(data: { userId: string; candidateId: string; electionId: string }) {
    return this.sendPost('/confirm', data);
  } 
  
  async test() {
    return this.sendGet('/test');
  }
}