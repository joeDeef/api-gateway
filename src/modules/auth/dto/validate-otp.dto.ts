import { IsNotEmpty, Length, IsString, Matches} from 'class-validator';

export class ValidateOtpDto {
  @IsNotEmpty({ message: 'El id es obligatorio' })
  @Matches(/^[0-9]$/, { 
    message: 'El id debe contener solo números' 
  })
  id: string;

  @IsString({message: 'El código OTP debe ser una cadena de texto' })
  @Length(6, 6,{ message: 'El código OTP debe tener exactamente 6 caracteres' })
  otpCode: string;
}