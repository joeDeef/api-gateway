import { Injectable, Logger } from '@nestjs/common';
import { ElectionManagmentProxy } from 'src/common/proxies/election-managment-service.proxy';
import { BlockchainProxy } from 'src/common/proxies/blockchain.proxy';

@Injectable()
export class VotingService {
    private readonly logger = new Logger(VotingService.name);

    constructor(
        private readonly electionMgntProxy: ElectionManagmentProxy,
        private readonly blockchainProxy: BlockchainProxy
    ) { }

    /**
     * Obtiene los resultados de votación mapeados con nombres de candidatos
     * @param electionId - ID de la elección
     * @returns Resultados completos con nombres de candidatos
     */
    async getResultadosCompletos(electionId: string) {
        this.logger.log(`Obteniendo resultados completos para la elección: ${electionId}`);

        try {
            // Obtenemos los resultados crudos del blockchain
            const resultadosBlockchain = await this.blockchainProxy.getResultados(electionId);

            // Los mapeamos con los nombres de candidatos usando nuestro proxy
            const resultadosCompletos = await this.mapearVotosConNombres(resultadosBlockchain);

            this.logger.log(`Resultados mapeados exitosamente para elección: ${electionId}`);
            return resultadosCompletos;

        } catch (error) {
            this.logger.error(`Error al obtener resultados mapeados: ${error.message}`, error.stack);
            // Fallback: devolver resultados sin mapear si algo falla
            return this.blockchainProxy.getResultados(electionId);
        }
    }

    /**
     * Mapea los votos del blockchain con los nombres de candidatos
     * @param resultadosBlockchain - Resultados crudos del blockchain
     * @returns Resultados mapeados con información de candidatos
     */
    private async mapearVotosConNombres(resultadosBlockchain: any) {
        this.logger.log('Iniciando mapeo de resultados con información de Election Management');

        try {
            // 1. Obtener la información (Viene como Array según tu log)
            const rawData = await this.electionMgntProxy.getCandidatos();

            // Si no hay datos, lanzamos error o devolvemos estructura vacía
            if (!rawData || rawData.length === 0) {
                throw new Error('No se encontró información de la elección');
            }

            // Tomamos la primera elección del array
            const electionData = rawData[0];

            // 2. Mapear los candidatos inyectando los votos de la Blockchain
            const mappedCandidates = electionData.candidates.map(candidate => {
                // Buscamos el conteo en los resultados de la blockchain
                const votoEncontrado = resultadosBlockchain.votos.find(
                    (v: any) => v.idCandidato === candidate.id
                );

                return {
                    id: candidate.id,
                    name: candidate.name,
                    politicalGroup: candidate.political_group, // Mapeo de snake_case a camelCase
                    totalVotes: votoEncontrado ? votoEncontrado.votos : 0
                };
            });

            // 3. Construir respuesta final
            const finalResponse = {
                electionId: electionData.id,
                electionName: electionData.name,
                electionDate: electionData.election_date,
                candidates: mappedCandidates
            };

            return finalResponse;

        } catch (error) {
            this.logger.error(`Error crítico en mapeo: ${error.message}`);
            throw error;
        }
    }
}