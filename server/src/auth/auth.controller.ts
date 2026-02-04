import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

import { UsersService } from '../users/users.service';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private jwt: JwtService,
    private readonly users: UsersService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password, dto.full_name);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Get('me')
  me(@Req() req: Request) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    const payload = this.jwt.verify(token);
    return { sub: payload.sub, email: payload.email, roles: payload.roles };
  }
@UseGuards(RolesGuard)
@Roles('admin')
  @Get('users')
  async listUsers() {
    return this.users.findAll();
  }
}
