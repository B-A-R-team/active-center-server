import User from './entity';
import catchAwaitErr from '../../common/utils/catchAwaitErr';
import encryption from '../../common/utils/encryption';
import { RoleEntity, RoleService } from '../role';
import transaction from '../../common/utils/transaction';
import { TeamEntity } from '../team';

export default class UserService {
  // 注入model
  constructor(InjectModel = User, InjectRoleService = RoleService) {
    this.user = InjectModel;
    this.roleService = new InjectRoleService();
  }

  /**
   * 适配用户数据
   * @param {import('../../types').UserDto} user 用户数据
   */
  adapterUserData(user) {
    const {
      id,
      name,
      stu_id,
      gender,
      phone,
      class_name,
      avatar_url,
      comment,
      createdAt,
      updatedAt,
      team_id,
      Team,
      card_id,
    } = user;
    return {
      id,
      name,
      stu_id,
      gender,
      phone,
      class_name,
      avatar_url,
      comment,
      createdAt,
      updatedAt,
      card_id,
      team_id,
      team: Team.name,
    };
  }

  /**
   * 查找所有用户
   */
  async findAll() {
    const result = await catchAwaitErr(
      this.user.findAll({
        attributes: { exclude: ['password', 'card_id', 'is_delete'] },
        where: { is_delete: false },
      })
    );
    return result;
  }

  /**
   * 根据ID获取用户
   * @param {number} id 用户ID
   */
  async findById(id) {
    const [err, user] = await catchAwaitErr(
      this.user.findOne({
        include: { model: TeamEntity, attributes: ['name'] },
        attributes: { exclude: ['password', 'is_delete'] },
        where: { id, is_delete: false },
      })
    );

    return [err, user ? this.adapterUserData(user) : user];
  }

  /**
   * 根据学号获取
   * @param {string} stu_id 学号
   */
  async findByStuId(stu_id) {
    const [err, user] = await catchAwaitErr(
      this.user.findOne({
        include: { model: TeamEntity, attributes: ['name'] },
        attributes: { exclude: ['password', 'card_id', 'is_delete'] },
        where: { stu_id, is_delete: false },
      })
    );
    return [err, user ? this.adapterUserData(user) : user];
  }

  /**
   * 根据卡号获取
   * @param {string} card_id 卡号
   */
  async findByCardId(card_id) {
    const [err, user] = await catchAwaitErr(
      this.user.findOne({
        include: { model: TeamEntity, attributes: ['name'] },
        attributes: { exclude: ['password', 'card_id', 'is_delete'] },
        where: { card_id, is_delete: false },
      })
    );
    return [err, user ? this.adapterUserData(user) : user];
  }

  /**
   * 创建用户
   * @param {import('../../types').CreateUserDto} user  用户
   */
  async register(user) {
    const { stu_id, class_name, name, team_id } = user;
    let { password } = user;

    password = encryption(password);

    const [findRoleErr, role] = await this.roleService.findById(1);
    if (findRoleErr) return [findRoleErr, null];

    // 事务提交
    // 创建用户并增加用户和默认角色的中间表数据
    const transactionErr = await transaction(async (t) => {
      const newUser = await this.user.create(
        { stu_id, password, class_name, name, team_id },
        { transaction: t }
      );
      await newUser.setRoles(role, { transaction: t });
    });
    if (transactionErr) return [transactionErr, null];

    return [null, { result: true }];
  }

  /**
   * 登录
   * @param {string} stu_id 学号
   * @param {string} password 密码
   * @returns {Promise<[err: Error|null, resultUser: import('../../types').LoginDto | null]>}
   */
  async login(stu_id, password) {
    const encrytionPassword = encryption(password);
    const [err, user] = await catchAwaitErr(
      this.user.findOne({
        include: { model: RoleEntity, attributes: ['id'] },
        where: { stu_id, password: encrytionPassword, is_delete: false },
      })
    );

    if (!user) return [err, null];

    const resultUser = {
      id: user.id,
      stu_id: user.stu_id,
      avatar_url: user.avatar_url,
      name: user.name,
      role_id: user.Roles.map((item) => item.id),
      team_id: user.team_id,
    };

    return [err, resultUser];
  }

  /**
   * 修改卡号
   * @param {number} id 用户ID
   * @param {string} card_id 卡号
   */
  async updateCardId(id, card_id) {
    const result = await catchAwaitErr(
      this.user.update({ card_id }, { where: { id } })
    );
    return result;
  }

  /**
   * 修改部分信息
   * @param {number} id 用户ID
   * @param {{gender:number,avatar_url:string,phone:string,comment:string}} param1
   * 性别，头像，电话，备注
   */
  async updatePartial(id, { gender, avatar_url, phone, comment }) {
    const result = await catchAwaitErr(
      this.user.update(
        { gender, avatar_url, phone, comment },
        { where: { id } }
      )
    );
    return result;
  }

  /**
   * 修改头像
   * @param {number} id 用户ID
   * @param {string} avatar_url 头像url
   */
  async updateAvatar(id, avatar_url) {
    const result = await catchAwaitErr(
      this.user.update({ avatar_url }, { where: { id } })
    );
    return result;
  }
}
