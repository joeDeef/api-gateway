import { IsNotEmpty, Length, IsString, Matches } from 'class-validator';

export class ValidateBiometricDto {

  @IsNotEmpty({ message: 'El ID es obligatorio' })
  @Matches(/^[0-9]$/, {
    message: 'El id debe contener solo números'
  })
  id: string;

  @IsNotEmpty({ message: 'Se necesito una imagen' })
  image: string;
}