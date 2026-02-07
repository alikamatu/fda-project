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
    try {
      console.log('[JwtStrategy] Validating JWT payload:', { sub: payload.sub, email: payload.email, role: payload.role });
      
      if (!payload.sub) {
        console.error('[JwtStrategy] JWT payload missing sub (user ID)');
        throw new Error('JWT payload missing sub (user ID)');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
        },
      });

      if (!user) {
        console.error('[JwtStrategy] User not found for ID:', payload.sub);
        throw new Error('User not found');
      }

      if (!user.isActive) {
        console.error('[JwtStrategy] User account is inactive:', user.email);
        throw new Error('User account is inactive');
      }

      console.log('[JwtStrategy] JWT validation successful:', { userId: user.id, email: user.email, role: user.role });

      return {
        userId: user.id,
        id: user.id,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      console.error('[JwtStrategy] Validation error:', error.message);
      // Throw to let Passport handle the error properly
      throw error;
    }
  }
}