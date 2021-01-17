import User from './entity';
import catchAwaitErr from '../../common/utils/catchAwaitErr';
import encryption from '../../common/utils/encryption';
import { RoleEntity } from '../role';

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

  /**
   * 根据学号获取
   * @param {string} stu_id 学号
   */
  async findByStuId(stu_id) {
    const result = await catchAwaitErr(this.user.findOne({ where: stu_id }));
    return result;
  }

  /**
   * 根据卡号获取
   * @param {string} card_id 卡号
   */
  async findByCardId(card_id) {
    const result = await catchAwaitErr(this.user.findOne({ where: card_id }));
    return result;
  }

  /**
   * 创建用户
   * @param {import('../../types').CreateUserDto} user  用户
   */
  async register(user) {
    const { stu_id, class_name, name, team_id } = user;
    let { password } = user;

    password = encryption(password);

    const result = await catchAwaitErr(
      this.user.create({ stu_id, password, class_name, name, team_id })
    );

    return result;
  }

  /**
   * 登录
   * @param {string} stu_id 学号
   * @param {string} password 密码
   */
  async login(stu_id, password) {
    const result = await catchAwaitErr(
      this.user.findOne({ include: RoleEntity, where: { stu_id, password } })
    );

    return result;
  }
}
