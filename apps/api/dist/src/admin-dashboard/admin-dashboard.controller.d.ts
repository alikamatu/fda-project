import { AdminDashboardService } from './admin-dashboard.service';
export declare class AdminDashboardController {
    private readonly adminDashboardService;
    constructor(adminDashboardService: AdminDashboardService);
    getStats(): Promise<{
        totalVerifications: number;
        validVerifications: number;
        fakeVerifications: number;
        expiredVerifications: number;
        registeredManufacturers: number;
        totalProducts: number;
        activeUsers: number;
    }>;
}
