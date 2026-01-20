import { IsNotEmpty, Length, IsString, Matches} from 'class-validator';

export class ValidateOtpDto {
  @IsNotEmpty({ message: 'La cédula es obligatoria' })
  @Matches(/^[0-9]{10}$/, { 
    message: 'La cédula debe contener solo números y tener exactamente 10 dígitos' 
  })
  cedula: string;

  @IsString({message: 'El código OTP debe ser una cadena de texto' })
  @Length(6, 6,{ message: 'El código OTP debe tener exactamente 6 caracteres' })
  otpCode: string;
}