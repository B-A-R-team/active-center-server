---
to: src/modules/<%= h.changeCase.lcFirst(name) %>/controller.js
---
import { errorResponse, successResponse } from '../../common/utils/response';
import <%= name %>Service from './service';

export default class <%= name %>Controller {
  constructor(InjectService = <%= name %>Service) {
    this.<%= h.changeCase.lcFirst(name) %>Service = new InjectService();
  }

  /**
   * 查询所有<%= name %>
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async findAll(ctx) {
    const [err, <%= h.changeCase.lcFirst(name) %>s] = await this.<%= h.changeCase.lcFirst(name) %>Service.findAll();
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }
    ctx.body = successResponse(<%= h.changeCase.lcFirst(name) %>s);
  }
}
