import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
      passReqToCallback: false,
    });
  }

async validate(payload: any) {
  console.log('[JwtStrategy] Validating JWT:', {
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
  });

  if (!payload.sub) {
    console.error('[JwtStrategy] No sub in payload');
    return null;
  }

  try {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      console.error('[JwtStrategy] User not found:', payload.sub);
      return null;
    }

    if (!user.isActive) {
      console.error('[JwtStrategy] User inactive:', user.email);
      return null;
    }

    console.log('[JwtStrategy] Validation successful:', {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      userId: user.id,
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  } catch (error) {
    console.error('[JwtStrategy] Error:', error);
    return null;
  }
}
}