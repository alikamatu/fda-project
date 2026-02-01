import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterManufacturerDto } from './dto/register-manufacturer.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    registerUser(dto: RegisterUserDto): unknown;
    registerManufacturer(dto: RegisterManufacturerDto): unknown;
    login(dto: LoginDto): unknown;
}
export declare class AdminController {
    private authService;
    constructor(authService: AuthService);
    activateUser(userId: string): unknown;
    deactivateUser(userId: string): unknown;
}
