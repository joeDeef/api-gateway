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
        this.baseUrl = this.configService.get<string>('ELECTION_SERVICE_URL') || 'http://localhost:3002';
    }

    /**
     * Registrar un voto
     */
    async castVote(dto: any, headers: any): Promise<any> {
        try {
            this.logger.log('📥 Proxy: Enviando voto a election-management-service');

            const response = await lastValueFrom(
                this.httpService.post(`${this.baseUrl}/voting/cast`, dto, {
                    headers: {
                        'x-api-key': this.configService.get('API_KEY'),
                        'x-internal-token': headers['x-internal-token'] || '',
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

            const response = await lastValueFrom(
                this.httpService.get(`${this.baseUrl}/voting/results/${electionId}`, {
                    headers: {
                        'x-api-key': this.configService.get('API_KEY'),
                        'x-internal-token': headers['x-internal-token'] || '',
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
            const response = await lastValueFrom(
                this.httpService.post(
                    `${this.baseUrl}/voting/check`,
                    { token, electionId },
                    {
                        headers: {
                            'x-api-key': this.configService.get('API_KEY'),
                            'x-internal-token': headers['x-internal-token'] || '',
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
