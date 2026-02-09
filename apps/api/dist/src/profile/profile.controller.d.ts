import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getUserSettings(req: {
        user: {
            id: string;
        };
    }): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
    }>;
    updateProfile(req: {
        user: {
            id: string;
        };
    }, dto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
    }>;
    changePassword(req: {
        user: {
            id: string;
        };
    }, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    logoutAllSessions(req: {
        user: {
            id: string;
        };
    }): Promise<{
        message: string;
    }>;
}
