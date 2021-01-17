import { errorResponse, successResponse } from '../../common/utils/response';
import PermissionService from './service';

export default class PermissionController {
  constructor(InjectService = PermissionService) {
    this.permissionService = new InjectService();
  }

  /**
   * 查询所有Permission
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async findAll(ctx) {
    const [err, permissions] = await this.permissionService.findAll();
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }
    ctx.body = successResponse(permissions);
  }

  /**
   * 创建权限
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async create(ctx) {
    const [err] = await this.permissionService.create(ctx.request.body);
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }
    ctx.body = successResponse({ result: true });
  }
}
