import axios from 'axios';
import response, {
  errorResponse,
  httpState,
  responseWithToken,
  successResponse,
} from '../../common/utils/response';
import {
  generateToken,
} from '../../common/utils/tokenHelper';
import UserService from './service';
import uploadConfig from '../../config/upload';

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
    const {
      id,
      card_id,
      stu_id,
    } = ctx.query;

    /**
     * 查询策略
     * @param {number} findBy 查询方法
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
      const result = await findStrategy(
        this.userService.findById.bind(this.userService),
        id
      );
      return result;
    }
    if (stu_id) {
      const result = await findStrategy(
        this.userService.findByStuId.bind(this.userService),
        stu_id
      );
      return result;
    }
    if (card_id) {
      const result = await findStrategy(
        this.userService.findByCardId.bind(this.userService),
        card_id
      );
      return result;
    }

    return this.findAll(ctx);
  }

  /**
   * 注册
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async register(ctx) {
    const [err, user_id] = await this.userService.register(ctx.request.body);
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }
    ctx.body = successResponse(user_id);
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

    if (!user) {
      ctx.body = response(
        httpState.INVALID_PARAMS,
        null,
        '登录失败，请检查学号和密码'
      );
      return;
    }

    // token内保存的数据包含`用户ID`和`权限ID拼成的字符串`
    // { id: 1, roleId: "1,2,3" }
    ctx.body = responseWithToken(
      user,
      generateToken(user.id, user.role_id.join(','))
    );
  }

  /**
   * 修改信息
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async update(ctx) {
    // 绑定卡号
    if (ctx.query.bind) {
      const [err] = await this.userService.updateCardId(
        Number(ctx.params.id),
        ctx.request.body.card_id
      );
      if (err) {
        ctx.body = errorResponse(err.message);
        return;
      }
      ctx.body = successResponse({
        result: true,
      });
      return;
    }

    // 修改 性别、电话、头像、备注
    const [err] = await this.userService.updatePartial(
      Number(ctx.params.id),
      ctx.request.body
    );
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }
    ctx.body = successResponse({
      result: true,
    });
  }

  /**
   * 上传头像
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async uploadAvatar(ctx) {
    const avatar_url = `${uploadConfig.avatarDir.replace('/public', '')}/${
      ctx.request.file.filename
    }`;

    const [err] = await this.userService.updateAvatar(
      Number(ctx.params.id),
      avatar_url
    );
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }

    ctx.body = successResponse({
      avatar_url,
    });
  }

  /**
   * 微信小程序登录
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async WXMinApplogin(ctx) {
    const {
      data,
    } = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${ctx.request.body.appid}&secret=${ctx.request.body.secret}&js_code=${ctx.request.body.js_code}&grant_type=authorization_code`);
    if (data.errcode) {
      ctx.body = errorResponse(data.errmsg);
      return;
    }
    const {
      openid,
    } = data;
    const [err, user] = await this.userService.WXMinAppLogin(openid);
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }

    if (!user) {
      ctx.body = response(
        httpState.INVALID_PARAMS, {
          openId: openid,
        },
        '登录失败,未查询到绑定用户!'
      );
      return;
    }

    // token内保存的数据包含`用户ID`和`权限ID拼成的字符串`和 openid.
    // { id: 1, roleId: "1,2,3", openid }
    ctx.body = responseWithToken(
      user,
      generateToken(user.id, user.role_id.join(','), openid)
    );
  }

  /**
   * 微信小程序用户绑定
   * @param {import('../../types').CustomContext} ctx 上下文
   */
  async BindWXMinApp(ctx) {
    const [err, result] = await this.userService.BindWXMinApp(
      ctx.request.body.stu_id,
      ctx.request.body.password,
      ctx.request.body.openId,
    );
    if (err) {
      ctx.body = errorResponse(err);
      return;
    }
    if (result[0] === 0) {
      ctx.body = response(httpState.INVALID_PARAMS, null, '绑定失败,账户信息有误!');
    } else {
      ctx.body = successResponse({
        result: '绑定成功',
      });
    }
  }
}
