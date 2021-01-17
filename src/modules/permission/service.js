import Permission from './entity';
import catchAwaitErr from '../../common/utils/catchAwaitErr';

export default class PermissionService {
  constructor(InjectModel = Permission) {
    this.permission = InjectModel;
  }

  /**
   * 查找所有Permission
   */
  async findAll() {
    const result = await catchAwaitErr(this.permission.findAll());
    return result;
  }

  /**
   * 创建权限
   * @param {*} permission 权限信息
   */
  async create(permission) {
    const result = await catchAwaitErr(this.permission.create(permission));
    return result;
  }
}
