import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { InternalSecurityService } from './internal-security.service';

@Global() // Esto hace que el servicio sea visible en TODA la aplicación
@Module({
  imports: [
    ConfigModule, // Permite usar ConfigService
    JwtModule.register({}), // Permite usar JwtService (se configura dinámicamente en el servicio)
  ],
  providers: [InternalSecurityService],
  exports: [InternalSecurityService], // Permite que otros módulos lo inyecten
})
export class InternalSecurityModule {}