import { IsNotEmpty, Length, IsString} from 'class-validator';

export class ValidateOtpDto {
  @IsString({message: 'El código OTP debe ser una cadena de texto' })
  @Length(6, 6,{ message: 'El código OTP debe tener exactamente 6 caracteres' })
  otpCode: string;
}