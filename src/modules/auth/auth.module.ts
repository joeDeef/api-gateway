import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthProxy } from '../../proxies/auth.proxy';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthProxy],
  exports: [AuthProxy],
})
export class AuthModule {}