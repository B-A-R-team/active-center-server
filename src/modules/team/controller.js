import { errorResponse, successResponse } from '../../common/utils/response';
import TeamService from './service';

export default class TeamController {
  constructor(InjectService = TeamService) {
    this.teamService = new InjectService();
  }

  /**
   * 获取所有团队信息
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async findAll(ctx) {
    const [err, teams] = await this.teamService.findAll();
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }
    ctx.body = successResponse(teams);
  }

  /**
   * 创建团队
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async create(ctx) {
    const [err, data] = await this.teamService.create(ctx.request.body);
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }
    ctx.body = successResponse(data);
  }
}
