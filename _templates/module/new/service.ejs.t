---
to: src/modules/<%= h.changeCase.lcFirst(name) %>/service.js
---
import <%= name %> from './entity';
import catchAwaitErr from '../../common/utils/catchAwaitErr';

export default class <%= name %>Service {
  constructor(InjectModel = <%= name %>) {
    this.<%= h.changeCase.lcFirst(name) %> = InjectModel;
  }

  /**
   * 查找所有<%= name %>
   */
  async findAll() {
    const result = await catchAwaitErr(this.<%= h.changeCase.lcFirst(name) %>.findAll());
    return result;
  }
}
