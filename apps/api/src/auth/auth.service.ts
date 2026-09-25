import { Injectable, ConflictException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterManufacturerDto } from './dto/register-manufacturer.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerUser(dto: RegisterUserDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        passwordHash: hashedPassword,
        role: UserRole.CONSUMER,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user;
  }

  async registerManufacturer(dto: RegisterManufacturerDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Check if registration number already exists
    const existingManufacturer = await this.prisma.manufacturer.findUnique({
      where: { registrationNumber: dto.registrationNumber },
    });

    if (existingManufacturer) {
      throw new ConflictException('Registration number already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user and manufacturer in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName: dto.fullName,
          email: dto.email,
          phone: dto.phone,
          passwordHash: hashedPassword,
          role: UserRole.MANUFACTURER,
          isActive: false, // Awaiting admin approval
        },
      });

      const manufacturer = await tx.manufacturer.create({
        data: {
          companyName: dto.companyName,
          registrationNumber: dto.registrationNumber,
          contactEmail: dto.contactEmail,
          contactPhone: dto.contactPhone,
          address: dto.address,
          isApproved: false,
          userId: user.id,
        },
      });

      return { user, manufacturer };
    });

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
        role: result.user.role,
        isActive: result.user.isActive,
      },
      manufacturer: {
        companyName: result.manufacturer.companyName,
        registrationNumber: result.manufacturer.registrationNumber,
        isApproved: result.manufacturer.isApproved,
      },
    };
  }

  async login(dto: LoginDto) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    console.log('[AuthService] Login attempt for:', dto.email);
    console.log('[AuthService] User found:', !!user);

    if (!user) {
      console.warn('[AuthService] User not found in database');
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      console.warn('[AuthService] User account is inactive:', dto.email);
      throw new ForbiddenException('Account is inactive. Please contact administrator.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    console.log('[AuthService] Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.warn('[AuthService] Password validation failed');
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async validateUser(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }
}