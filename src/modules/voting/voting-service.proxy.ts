import { Injectable, Logger, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class VotingServiceProxy {
    private readonly logger = new Logger(VotingServiceProxy.name);
    private readonly baseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.get<string>('ELECTION_MGMT_URL') || 'http://localhost:3002';
    }

    /**
     * Registrar un voto
     */
    async castVote(dto: any, headers: any): Promise<any> {
        try {
            this.logger.log('📥 Proxy: Enviando voto a election-management-service');

            // Extraer token de Authorization si no viene en x-internal-token
            let internalToken = headers['x-internal-token'];
            if (!internalToken && headers['authorization']) {
                const parts = headers['authorization'].split(' ');
                if (parts.length === 2 && parts[0] === 'Bearer') {
                    internalToken = parts[1];
                }
            }

            const response = await lastValueFrom(
                this.httpService.post(`${this.baseUrl}/api/voting/cast`, dto, {
                    headers: {
                        'x-api-key': this.configService.get('ELECTION_MNGT_INTERNAL_API_KEY'),
                        'x-internal-token': internalToken || '',
                        'Content-Type': 'application/json',
                    },
                }),
            );

            return response.data;
        } catch (error) {
            this.logger.error(`❌ Error en castVote proxy: ${error.message}`);
            throw new HttpException(
                error.response?.data || 'Error al registrar voto',
                error.response?.status || 500,
            );
        }
    }

    /**
     * Obtener resultados de una elección
     */
    async getResults(electionId: string, headers: any): Promise<any> {
        try {
            this.logger.log(`📊 Proxy: Obteniendo resultados de elección ${electionId}`);

            // Extraer token
            let internalToken = headers['x-internal-token'];
            if (!internalToken && headers['authorization']) {
                const parts = headers['authorization'].split(' ');
                if (parts.length === 2 && parts[0] === 'Bearer') {
                    internalToken = parts[1];
                }
            }

            const response = await lastValueFrom(
                this.httpService.get(`${this.baseUrl}/api/voting/results/${electionId}`, {
                    headers: {
                        'x-api-key': this.configService.get('ELECTION_MNGT_INTERNAL_API_KEY'),
                        'x-internal-token': internalToken || '',
                    },
                }),
            );

            return response.data;
        } catch (error) {
            this.logger.error(`❌ Error en getResults proxy: ${error.message}`);
            throw new HttpException(
                error.response?.data || 'Error al obtener resultados',
                error.response?.status || 500,
            );
        }
    }

    /**
     * Verificar si un token ya votó
     */
    async checkVote(token: string, electionId: string, headers: any): Promise<any> {
        try {
            // Extraer token
            let internalToken = headers['x-internal-token'];
            if (!internalToken && headers['authorization']) {
                const parts = headers['authorization'].split(' ');
                if (parts.length === 2 && parts[0] === 'Bearer') {
                    internalToken = parts[1];
                }
            }

            const response = await lastValueFrom(
                this.httpService.post(
                    `${this.baseUrl}/api/voting/check`,
                    { token, electionId },
                    {
                        headers: {
                            'x-api-key': this.configService.get('ELECTION_MNGT_INTERNAL_API_KEY'),
                            'x-internal-token': internalToken || '',
                            'Content-Type': 'application/json',
                        },
                    },
                ),
            );

            return response.data;
        } catch (error) {
            this.logger.error(`❌ Error en checkVote proxy: ${error.message}`);
            throw new HttpException(
                error.response?.data || 'Error al verificar voto',
                error.response?.status || 500,
            );
        }
    }
}
