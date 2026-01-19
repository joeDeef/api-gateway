import { IsNotEmpty, Length, IsString} from 'class-validator';

export class ValidateBiometricDto {
  @IsNotEmpty({ message: 'Se necesito una imagen' })
  @Length(6, 6)
  otpCode: string;
}