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
    const [err, users] = await catchAwaitErr(this.user.findAll());

    return [err, users];
  }
}
