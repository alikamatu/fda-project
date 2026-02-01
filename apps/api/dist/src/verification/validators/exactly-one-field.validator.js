"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExactlyOneField = exports.ExactlyOneFieldConstraint = void 0;
const class_validator_1 = require("class-validator");
let ExactlyOneFieldConstraint = class ExactlyOneFieldConstraint {
    validate(value, args) {
        const object = args.object;
        const fields = args.constraints;
        let count = 0;
        for (const field of fields) {
            if (object[field] !== undefined && object[field] !== null && object[field] !== '') {
                count++;
            }
        }
        return count === 1;
    }
    defaultMessage(args) {
        return `Exactly one of ${args.constraints.join(' or ')} must be provided`;
    }
};
exports.ExactlyOneFieldConstraint = ExactlyOneFieldConstraint;
exports.ExactlyOneFieldConstraint = ExactlyOneFieldConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'exactlyOneField', async: false })
], ExactlyOneFieldConstraint);
const ExactlyOneField = (fields) => {
    return (0, class_validator_1.Validate)(ExactlyOneFieldConstraint, fields);
};
exports.ExactlyOneField = ExactlyOneField;
//# sourceMappingURL=exactly-one-field.validator.js.map