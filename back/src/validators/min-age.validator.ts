import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import moment from 'moment';

@ValidatorConstraint({ name: 'MinAge', async: false })
export class MinAge implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [minAge] = args.constraints;
    const birthdate = moment(value, 'YYYY-MM-DD', true);
    if (!birthdate.isValid()) return false;

    const today = moment();
    const age = today.diff(birthdate, 'years');
    return age >= minAge;
  }

  defaultMessage(args: ValidationArguments) {
    return `El usuario debe tener al menos ${args.constraints[0]} años`;
  }
}
