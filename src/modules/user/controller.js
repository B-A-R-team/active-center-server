import { errorResponse, successResponse } from '../../common/utils/response';
import UserService from './service';

export default class UserController {
  // 注入service
  constructor(InjectService = UserService) {
    this.userService = new InjectService();
  }

  /**
   * 查询所有用户
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async findAll(ctx) {
    const [err, users] = await this.userService.findAll();
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }
    ctx.body = successResponse(users);
  }

  /**
   * 创建用户
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async createUser(ctx) {
    const [err, result] = await this.userService.createUser(ctx.request.body);
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }
    ctx.body = successResponse(result);
  }

  /**
   * 删除用户
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async deleteUser(ctx) {
    const [err, result] = await this.userService.deleteUser(
      Number(ctx.params.id)
    );
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }
    ctx.body = successResponse(result);
  }
}
