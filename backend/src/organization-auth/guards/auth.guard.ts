import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Role } from '../enums/role.enum';
import { ROLE_KEY as ROLE_KEY } from '../../common/roles.decorator';
import { decode } from 'jsonwebtoken';
import { AUTHENTICATION_DATA_REQUEST_KEY } from 'src/common/consts';
import { ENVIRONMENT } from 'src/environment';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<Role>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);


    if (ENVIRONMENT.REQUIRE_JWT) {
      return this.jwtRequired(token, request, requiredRole);
    }
    else {
      return this.jwtNotRequired(request);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }


  private async jwtNotRequired(request: any) {
    request[AUTHENTICATION_DATA_REQUEST_KEY] = {
      organization: {
        id: ENVIRONMENT.JWT_ORGANIZATION_ID,
        role: Role.ADMIN,
      },
    }
    return true;
  }

  private async jwtRequired(token: string, request: any, requiredRole: Role) {
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const tokenPayload = decode(token) as any;
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request[AUTHENTICATION_DATA_REQUEST_KEY] = tokenPayload;

      if (requiredRole && requiredRole !== payload.role) {
        throw new UnauthorizedException("You don't have the required role to access this resource.");
      }

    } catch (error) {
      throw new UnauthorizedException(error);
    }
    return true;
  }
}
