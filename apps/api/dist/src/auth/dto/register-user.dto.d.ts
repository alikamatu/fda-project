import { UserRole } from '@prisma/client';
export declare class RegisterUserDto {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    role?: UserRole;
}
