import Role from './entity';
import catchAwaitErr from '../../common/utils/catchAwaitErr';

export default class RoleService {
  constructor(InjectModel = Role) {
    this.role = InjectModel;
  }

  /**
   * 查找所有Role
   */
  async findAll() {
    const result = await catchAwaitErr(this.role.findAll());
    return result;
  }

  /**
   * 根据ID查找角色
   * @param {number} id 角色ID
   */
  async findById(id) {
    const result = await catchAwaitErr(this.role.findOne({ where: { id } }));
    return result;
  }

  /**
   * 创建角色
   * @param {*} role 角色
   */
  async create(role) {
    const result = await catchAwaitErr(this.role.create(role));
    return result;
  }
}
