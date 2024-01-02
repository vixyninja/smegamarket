import * as bycryptjs from 'bcryptjs';

/**
 * generate random salt
 * @returns {string}
 */
export function generateSalt(): string {
  return bycryptjs.genSaltSync(Math.floor(Math.random() * 10) + 1);
}

/**
 * generate hash from password or string
 * @param {string} password
 * @param {string} salt
 * @returns {string}
 */
export function hashPassword(password: string, salt: string): string {
  return bycryptjs.hashSync(password, salt);
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
