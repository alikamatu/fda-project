import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterManufacturerDto } from './dto/register-manufacturer.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    registerUser(dto: RegisterUserDto): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
    }>;
    registerManufacturer(dto: RegisterManufacturerDto): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
        };
        manufacturer: {
            companyName: string;
            registrationNumber: string;
            isApproved: boolean;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
}
export declare class AdminController {
    private authService;
    constructor(authService: AuthService);
    activateUser(userId: string): Promise<{
        message: string;
        userId: string;
    }>;
    deactivateUser(userId: string): Promise<{
        message: string;
        userId: string;
    }>;
}
