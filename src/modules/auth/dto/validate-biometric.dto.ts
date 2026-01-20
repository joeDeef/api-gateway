import { IsNotEmpty, Length, IsString, Matches } from 'class-validator';

export class ValidateBiometricDto {

  @IsNotEmpty({ message: 'La cédula es obligatoria' })
  @Matches(/^[0-9]{10}$/, {
    message: 'La cédula debe contener solo números y tener exactamente 10 dígitos'
  })
  cedula: string;

  @IsNotEmpty({ message: 'Se necesito una imagen' })
  @Length(6, 6)
  image: string;
}