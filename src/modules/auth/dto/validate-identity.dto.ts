import { IsNotEmpty, Matches } from 'class-validator';

export class ValidateIdentityDto {
  @IsNotEmpty({ message: 'La cédula es obligatoria' })
  @Matches(/^[0-9]{10}$/, { 
    message: 'La cédula debe contener solo números y tener exactamente 10 dígitos' 
  })
  cedula: string;

  @IsNotEmpty({ message: 'El código dactilar es obligatorio' })
  @Matches(/^[A-Z0-9]{10}$/, { 
    message: 'El código dactilar debe tener 10 caracteres (solo números y letras mayúsculas)' 
  })
  codigoDactilar: string;
}