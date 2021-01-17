import crypto from 'crypto';

/**
 * 加密
 * @param {string} plaintext 明文
 */
export default function encryption(plaintext) {
  return crypto.createHash('md5').update(plaintext, 'utf-8').digest('hex');
}
