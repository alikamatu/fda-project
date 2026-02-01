"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    jwt: {
        secret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
    bcrypt: {
        saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10),
    },
});
//# sourceMappingURL=configuration.js.map