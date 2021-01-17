import { errorResponse, successResponse } from '../../common/utils/response';
import RoleService from './service';

export default class RoleController {
  constructor(InjectService = RoleService) {
    this.roleService = new InjectService();
  }

  /**
   * 查询所有Role
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async findAll(ctx) {
    const [err, roles] = await this.roleService.findAll();
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }
    ctx.body = successResponse(roles);
  }

  /**
   * 创建角色
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async create(ctx) {
    const [err] = await this.roleService.create(ctx.request.body);
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }
    ctx.body = successResponse({ result: true });
  }
}
