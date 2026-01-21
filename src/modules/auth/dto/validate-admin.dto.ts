import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class ValidateAdminDto {
    @IsNotEmpty({ message: 'El correo es obligatorio' })
    @IsString()
    email: string;

    @IsNotEmpty({ message: 'Se necesita una contraseña' })
    @MinLength(8)
    @MaxLength(64)
    password: string;
}