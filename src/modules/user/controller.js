import {
  errorResponse,
  responseWithToken,
  successResponse,
} from '../../common/utils/response';
import { generateToken } from '../../common/utils/tokenHelper';
import UserService from './service';

export default class UserController {
  // 注入service
  constructor(InjectService = UserService) {
    this.userService = new InjectService();
  }

  /**
   * 查询所有用户
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async findAll(ctx) {
    const [err, users] = await this.userService.findAll();
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }
    ctx.body = successResponse(users);
  }

  /**
   * 根据ID获取用户
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async findById(ctx) {
    const [err, user] = await this.userService.findById(Number(ctx.params.id));
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }
    ctx.body = successResponse(user);
  }

  /**
   * 按照条件查询
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async findWhere(ctx) {
    const { id, card_id, stu_id } = ctx.query;
    if (!id && !card_id && !stu_id) {
      this.findAll(ctx);
      return;
    }

    /**
     * 查询策略
     * @param {*} findBy 查询方法
     * @param {number} value 传入值
     */
    const findStrategy = async (findBy, value) => {
      const [err, user] = await findBy(Number(value));
      if (err) {
        ctx.body = errorResponse(err.message);
        return;
      }
      ctx.body = successResponse(user);
    };

    if (id) {
      await findStrategy(this.userService.findById, id);
      return;
    }
    if (stu_id) {
      await findStrategy(this.userService.findByStuId, stu_id);
      return;
    }
    if (card_id) {
      await findStrategy(this.userService.findByCardId, card_id);
    }
  }

  /**
   * 注册
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async register(ctx) {
    const [err] = await this.userService.register(ctx.request.body);
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }
    ctx.body = successResponse({ result: true });
  }

  /**
   * 登录
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async login(ctx) {
    const [err, user] = await this.userService.login(
      ctx.request.body.stu_id,
      ctx.request.body.password
    );
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }
    ctx.body = responseWithToken(
      {
        id: user.id,
        stu_id: user.stu_id,
        avatar_url: user.avatar_url,
        name: user.name,
        role_id: user.role.id,
        team_id: user.team_id,
      },
      generateToken(user.id, user.role.id)
    );
  }
}
