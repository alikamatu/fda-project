import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
    } | null>;
    findAllManufacturers(params: {
        skip?: number;
        take?: number;
        search?: string;
        isActive?: boolean;
        isApproved?: boolean;
    }): Promise<{
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
    activateUser(userId: string, adminId: string): Promise<{
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
    deactivateUser(userId: string, adminId: string): Promise<{
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
    approveManufacturer(userId: string, adminId: string): Promise<{
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
    rejectManufacturer(userId: string, reason: string, adminId: string): Promise<{
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
