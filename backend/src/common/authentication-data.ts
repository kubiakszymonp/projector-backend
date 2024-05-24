import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtAuthenticationData } from './jwt-payload';
import { AUTHENTICATION_DATA_REQUEST_KEY } from './consts';


export const AuthenticationData = createParamDecorator(
  (_data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request[AUTHENTICATION_DATA_REQUEST_KEY] as JwtAuthenticationData;
  },
);
