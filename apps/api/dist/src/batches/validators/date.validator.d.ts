import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare class IsAfterConstraint implements ValidatorConstraintInterface {
    validate(propertyValue: string, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
