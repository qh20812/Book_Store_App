import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXPIRES, JWT_SECRET } from '../constant';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRES },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService
  ],
  exports: [JwtModule],
})
export class AuthModule { }
