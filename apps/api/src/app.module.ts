import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ProductsModule } from './products/products.module';
import { BatchesModule } from './batches/batches.module';
import { VerificationModule } from './verification/verification.module';
import { ProfileModule } from './profile/profile.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    BatchesModule,
    VerificationModule,
    ProfileModule,
    ManufacturerModule,
    AdminDashboardModule,
    AuditLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
