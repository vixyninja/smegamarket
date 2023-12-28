import * as bycryptjs from 'bcryptjs';

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export function hashPassword(password: string): string {
  return bycryptjs.hashSync(password, 10);
}

/**
 * compare password or string with hash
 * @param {string} password
 * @param {string} hash
 * @returns {boolean}
 */
export function compareHash(password: string, hash: string): boolean {
  return bycryptjs.compareSync(password, hash);
}
