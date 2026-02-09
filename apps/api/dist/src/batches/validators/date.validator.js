"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsAfterConstraint = void 0;
const class_validator_1 = require("class-validator");
let IsAfterConstraint = class IsAfterConstraint {
    validate(propertyValue, args) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = args.object[relatedPropertyName];
        const propertyDate = new Date(propertyValue);
        const relatedDate = new Date(relatedValue);
        return propertyDate > relatedDate;
    }
    defaultMessage(args) {
        return `$property must be after ${args.constraints[0]}`;
    }
};
exports.IsAfterConstraint = IsAfterConstraint;
exports.IsAfterConstraint = IsAfterConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isAfter', async: false })
], IsAfterConstraint);
//# sourceMappingURL=date.validator.js.map