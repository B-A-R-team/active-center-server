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
   * 根据ID查找权限
   * @param {number} id 权限ID
   */
  async findById(id) {
    const result = await catchAwaitErr(
      this.permission.findOne({
        where: {
          id,
        },
      })
    );

    return result;
  }

  /**
   * 创建权限
   * @param {import('../../types').PermissionDto} permission 权限信息
   */
  async create(permission) {
    const result = await catchAwaitErr(this.permission.create(permission));
    return result;
  }

  /**
   * 更新权限
   * @param {number} id 权限ID
   * @param {import('../../types').PermissionDto} permission 权限信息
   */
  async update(id, permission) {
    const result = await catchAwaitErr(
      this.permission.update(
        {
          name: permission.name,
          desc: permission.desc,
          url: permission.url,
          type: permission.type,
        },
        { where: { id } }
      )
    );
    return result;
  }
}
