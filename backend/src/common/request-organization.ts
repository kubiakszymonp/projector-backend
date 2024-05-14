import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtAuthenticationData } from './jwt-payload';


export const AuthenticationData = createParamDecorator(
  (_data, context: ExecutionContext) => {
    return context.switchToHttp().getRequest()
      .authenticationData as JwtAuthenticationData;
  },
);
