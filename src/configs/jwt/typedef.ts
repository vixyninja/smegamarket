import {RoleEnum} from '@/core';
import {Environment} from '../environments';

export type JWTPayload = {
  uuid: string;
  role: RoleEnum;
  email: string;
  deviceToken: string;
  deviceType: string;
};

export type TokenType = 'accessToken' | 'refreshToken';

export const RecordType: Record<TokenType, Record<string, string>> = {
  accessToken: {
    secret: Environment.ACCESS_TOKEN_SECRET,
    expiration: Environment.ACCESS_TOKEN_EXPIRATION_TIME,
  },
  refreshToken: {
    secret: Environment.REFRESH_TOKEN_SECRET,
    expiration: Environment.REFRESH_TOKEN_EXPIRATION_TIME,
  },
};
