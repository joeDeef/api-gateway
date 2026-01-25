import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isEcuadorianId', async: false })
export class IsEcuadorianIdConstraint implements ValidatorConstraintInterface {

  validate(cedula: string) {
    // Validación manual para eliminar dependencia de 'ecuador-validator'
    if (typeof cedula !== 'string') return false;
    if (cedula.length !== 10) return false;

    const digits = cedula.split('').map(Number);

    // Verificar que solo contenga números
    if (digits.some((d) => isNaN(d))) return false;

    // Código de provincia (1-24)
    const provinceCode = digits[0] * 10 + digits[1];
    if (provinceCode < 1 || provinceCode > 24) return false;

    // Tercer dígito (menor a 6 para personas naturales)
    if (digits[2] >= 6) return false;

    // Algoritmo Módulo 10
    const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let total = 0;

    for (let i = 0; i < 9; i++) {
      let value = digits[i] * coefficients[i];
      if (value >= 10) {
        value -= 9;
      }
      total += value;
    }

    const verificationDigit = total % 10 === 0 ? 0 : 10 - (total % 10);

    return verificationDigit === digits[9];
  }

  defaultMessage() {
    return 'La cédula no es válida o el código de provincia es inexistente';
  }
}

export function IsEcuadorianId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEcuadorianIdConstraint,
    });
  };
}