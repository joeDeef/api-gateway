import { IsNotEmpty, IsString, IsEmail, IsHash, Length } from 'class-validator';

export class ValidateAdminDto {
    @IsNotEmpty({ message: 'El correo es obligatorio' })
    @IsString()
    @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
    email: string;

    @IsNotEmpty({ message: 'Se necesita una contraseña' })
    @IsString()
    @IsHash('sha256', { message: 'La contraseña no tiene el formato de seguridad esperado' })
    @Length(64, 64, { message: 'El hash de seguridad debe tener exactamente 64 caracteres' })
    password: string;
}