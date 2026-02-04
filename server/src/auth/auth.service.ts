import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JWT_EXPIRES } from '../constant';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) { }

  async register(email: string, password: string, full_name: string) {
    const exists = await this.users.findByEmail(email);
    if (exists) throw new ConflictException('Email already registered');
    const passwordHash = await bcrypt.hash(password, 10);
    const u = await this.users.create(email, full_name, passwordHash);
    return this.sign(u['_id'].toString(), email, [u['role']]);
  }

  async login(email: string, password: string) {
    const u = await this.users.findByEmail(email);
    if (!u) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, u.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.sign(u['_id'].toString(), u.email, [u.role]);
  }

  private sign(sub: string, email: string, roles: string[]) {
    const access_token = this.jwt.sign({ sub, email, roles });
    return { access_token, token_type: 'Bearer', expires_in: JWT_EXPIRES };
  }
}
