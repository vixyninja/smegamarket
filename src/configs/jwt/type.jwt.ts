import {RoleEnum} from '@/core';
import {Environment} from '../environments';

export type JWTPayload = {
  uuid: string;
  role: RoleEnum;
  email: string;
  [key: string]: any;
};

export type TokenType = 'accessToken' | 'refreshToken';

export const RecordType: Record<TokenType, Record<string, string>> = {
  accessToken: {
    secret: Environment.ACCESS_TOKEN_SECRET,
    expiration: Environment.ACCESS_TOKEN_EXPIRATION_TIME,
    audience: 'access-token',
    issuer: 'This is a access token',
  },
  refreshToken: {
    secret: Environment.REFRESH_TOKEN_SECRET,
    expiration: Environment.REFRESH_TOKEN_EXPIRATION_TIME,
    audience: 'refresh-token',
    issuer: 'This is a refresh token',
  },
};
