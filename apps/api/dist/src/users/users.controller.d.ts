import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAllManufacturers(page?: number, limit?: number, search?: string, isActive?: string, isApproved?: string): Promise<{
        data: {
            id: string;
            email: string;
            fullName: string;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
            manufacturer: {
                id: string;
                companyName: string;
                registrationNumber: string;
                contactEmail: string;
                contactPhone: string | null;
                address: string;
                isApproved: boolean;
            } | null;
        }[];
        meta: {
            total: number;
            skip: number | undefined;
            take: number | undefined;
        };
    }>;
    activateUser(id: string, req: any): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string | null;
        passwordHash: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deactivateUser(id: string, req: any): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string | null;
        passwordHash: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    approveManufacturer(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyName: string;
        registrationNumber: string;
        contactEmail: string;
        contactPhone: string | null;
        address: string;
        isApproved: boolean;
        userId: string;
    }>;
    rejectManufacturer(id: string, reason: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyName: string;
        registrationNumber: string;
        contactEmail: string;
        contactPhone: string | null;
        address: string;
        isApproved: boolean;
        userId: string;
    }>;
}
