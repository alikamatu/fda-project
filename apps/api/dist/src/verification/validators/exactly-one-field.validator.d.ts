import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare class ExactlyOneFieldConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare const ExactlyOneField: (fields: string[]) => any;
