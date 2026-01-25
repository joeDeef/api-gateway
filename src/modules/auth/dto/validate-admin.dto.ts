import { IsNotEmpty, IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class ValidateAdminDto {
    @IsNotEmpty({ message: 'El correo es obligatorio' })
    @IsString()
    @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
    email: string;

    @IsNotEmpty({ message: 'Se necesita una contraseña' })
    @MinLength(12, { message: 'La contraseña debe tener al menos 12 caracteres' })
    @MaxLength(64)
    password: string;
}