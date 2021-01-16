import User from './entity';
import catchAwaitErr from '../../common/utils/catchAwaitErr';

export default class UserService {
  // 注入model
  constructor(InjectModel = User) {
    this.user = InjectModel;
  }

  /**
   * 查找所有用户
   */
  async findAll() {
    const result = await catchAwaitErr(this.user.findAll());
    return result;
  }

  /**
   * 根据ID获取用户
   * @param {number} id 用户ID
   */
  async findById(id) {
    const result = await catchAwaitErr(this.user.findOne({ where: id }));
    return result;
  }
}
