import { errorResponse, successResponse } from '../../common/utils/response';
import TeamService from './service';

export default class TeamController {
  constructor(InjectService = TeamService) {
    this.teamService = new InjectService();
  }

  /**
   * 创建团队
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async create(ctx) {
    const [err] = await this.teamService.create(ctx.request.body);
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }
    ctx.body = successResponse({ result: true });
  }
}
