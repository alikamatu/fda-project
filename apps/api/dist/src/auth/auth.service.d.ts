import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterManufacturerDto } from './dto/register-manufacturer.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    registerUser(dto: RegisterUserDto): unknown;
    registerManufacturer(dto: RegisterManufacturerDto): unknown;
    login(dto: LoginDto): unknown;
    validateUser(userId: string): unknown;
}
