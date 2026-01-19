import { IsNotEmpty, Length, IsString } from 'class-validator';

export class ValidateAdminDto {
    @IsNotEmpty({ message: 'Se necesito un nombre de usuario' })
    @Length(6, 6)
    username: string;

    @IsNotEmpty({ message: 'Se necesito una contraseña' })
    @Length(8, 20)
    password: string;
}