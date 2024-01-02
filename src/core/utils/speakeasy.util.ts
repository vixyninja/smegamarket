import {Environment} from '@/configs';
import * as speakeasy from 'speakeasy';

export class SpeakeasyUtil {
  static generateSecret(): string {
    return speakeasy.generateSecret({
      length: 20,
      name: Environment.SPEAKEASY_SECRET,
      issuer: Environment.SPEAKEASY_SECRET,
    }).base32;
  }

  static verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      token,
      encoding: Environment.SPEAKEASY_ENCODING as any,
      algorithm: Environment.SPEAKEASY_ALGORITHM as any,
      digits: Environment.SPEAKEASY_LENGTH,
    });
  }

  static verifyTokenDelta(secret: string, token: string): speakeasy.Delta {
    return speakeasy.totp.verifyDelta({
      secret,
      token,
      encoding: Environment.SPEAKEASY_ENCODING as any,
      algorithm: Environment.SPEAKEASY_ALGORITHM as any,
      digits: Environment.SPEAKEASY_LENGTH,
    });
  }

  static generateToken(secret: string): string {
    return speakeasy.totp({
      secret,
      encoding: Environment.SPEAKEASY_ENCODING as any,
      algorithm: Environment.SPEAKEASY_ALGORITHM as any,
      digits: Environment.SPEAKEASY_LENGTH,
    });
  }
}
