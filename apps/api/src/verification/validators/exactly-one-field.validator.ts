import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from 'class-validator';

@ValidatorConstraint({ name: 'exactlyOneField', async: false })
export class ExactlyOneFieldConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    const fields = args.constraints;
    
    let count = 0;
    for (const field of fields) {
      if (object[field] !== undefined && object[field] !== null && object[field] !== '') {
        count++;
      }
    }
    
    return count === 1;
  }

  defaultMessage(args: ValidationArguments) {
    return `Exactly one of ${args.constraints.join(' or ')} must be provided`;
  }
}

export const ExactlyOneField = (fields: string[]) => {
  return Validate(ExactlyOneFieldConstraint, fields);
};