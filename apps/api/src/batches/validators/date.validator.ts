import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isAfter', async: false })
export class IsAfterConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    
    // Convert to dates for comparison
    const propertyDate = new Date(propertyValue);
    const relatedDate = new Date(relatedValue);
    
    return propertyDate > relatedDate;
  }

  defaultMessage(args: ValidationArguments) {
    return `$property must be after ${args.constraints[0]}`;
  }
}