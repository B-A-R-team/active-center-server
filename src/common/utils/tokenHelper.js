import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/sensitive';

/**
 * 生成token
 * @param {number} id 用户ID
 * @param {number} roleId 角色ID
 */
export function generateToken(id, roleId) {
  return jwt.sign({ id, roleId }, JWT_SECRET, { expiresIn: '3 days' });
}

/**
 * 解析token
 * @param {string} token token
 * @returns {{id: number, roleId: number}}
 */
export function verifyToken(token) {
  const { id, roleId } = jwt.verify(token, JWT_SECRET);
  return { id, roleId };
}
