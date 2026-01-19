import { IsNotEmpty, Length, IsString } from 'class-validator';

export class ValidateVoteDto {
    @IsNotEmpty({ message: 'Se necesito el ID del candidato' })
    @Length(6, 6)
    candidateId : string;

    @IsNotEmpty({ message: 'Se necesita el ID del votante' })
    @Length(8, 20)
    citizienID: string;
}