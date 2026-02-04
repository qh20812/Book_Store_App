import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwt: JwtService,
  ) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', ctx.getHandler());
    if (!roles?.length) return true;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const header = req.headers.authorization || '';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = this.jwt.verify(token);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const ok = payload.roles?.some((r: string) => roles.includes(r));
    if (!ok) throw new ForbiddenException('Insufficient role');
    return true;
  }
}

