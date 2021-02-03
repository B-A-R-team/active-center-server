import response, {
  errorResponse,
  successResponse,
  httpState,
} from '../../common/utils/response';
import SignService from './service';
import {
  getListByTime,
  TimeFitter,
  getTodayDate,
  getWeekDate,
  TeamDataAssembly,
  UserDataAssembly,
} from '../../common/utils/signHelper';

/**
 *签到策略
 * @param {Array}  _signList 当日签到数据列表
 * @param {String} type 签到策略
 * @return {*} { isAllowSign, message } { 是否允许签到, 消息 }
 */
function SignInStrategy(_signList, type) {
  const Strategy = {
    // 每日一次签到
    day_once(signList) {
      let isAllowSign = true;
      let message = '今日未签到';
      if (signList.length >= 1) {
        isAllowSign = false;
        message = '今日已签到,无须重复签到';
      }
      return { isAllowSign, message };
    },
    //
  };
  if (!Strategy[type]) return { isAllowSign: false, message: '没有该签到策略' };
  return Strategy[type](_signList);
}


export default class SignController {
  // 注入 signService
  constructor(InjectService = SignService) {
    this.signService = new InjectService();
  }

  /**
   *
   *添加签到记录
   */
  async signIn(ctx) {
    // 接收参数
    const {
      user_id,
      admin_id,
    } = ctx.request.body;
    if ((!user_id) || (!admin_id)) {
      ctx.body = response(httpState.INVALID_PARAMS, null, '参数缺失');
      return;
    }
    // 异步获取签到记录
    const [err, signList] = await this.signService.findToadySignByUserId(user_id);
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }
    // 根据签到策略检查是否允许签到
    const { isAllowSign, message } = SignInStrategy(signList, 'day_once');
    if (!isAllowSign) {
      ctx.body = successResponse(message);
      return;
    }
    // 异步添加签到记录
    const [signErr, SignData] = await this.signService.signIn(user_id, admin_id);
    if (signErr) {
      ctx.body = errorResponse(err.message);
      return;
    }
    ctx.body = successResponse(SignData);
  }

  /**
   *
   *获取一周内的团队签到统计
   */
  async findTeamListByWeek(ctx) {
    // 日期的格式化与容错处理
    const {
      startTime,
      endTime,
    } = getWeekDate();
    // 根据开始和结束时间生成列表
    const date_list = getListByTime(startTime, endTime);
    // 定义响应对象
    const result = {};
    // 挂载日期列表
    result.date_list = date_list;
    // 获取团队列表
    const [teamListerr, teamList] = await this.signService.findTeamList();
    if (teamListerr) {
      ctx.body = errorResponse(teamListerr.message);
      return;
    }
    // 异步获取所有团队签到源数据,该数据需进一步加工
    const [err, data] = await this.signService.findTeamListByTime(startTime, endTime);
    if (err) {
      ctx.body = errorResponse(err.message);
      return;
    }
    // 对团队签到的源数据进行加工
    const TeamData = TeamDataAssembly(teamList, data);
    // 所有团队签到总计
    result.team_list = TeamData;
    ctx.body = successResponse(result);
  }

  /**
   *
   *根据ID获取用户签到数据
   */
  async findUserSignById(ctx) {
    const {
      type,
    } = ctx.request.query;
    const {
      id,
    } = ctx.request.params;
    if (!Number.isFinite(id)) {
      ctx.body = response(httpState.INVALID_PARAMS, null, '参数错误');
      return;
    }
    if (type === 'today') {
      const date = getTodayDate();
      const [err, result] = await this.signService.findUserTodayById(id, date);
      if (err) {
        ctx.body = errorResponse(err.message);
        return;
      }
      ctx.body = successResponse(result);
    } else if (type === 'week') {
      const {
        startTime,
        endTime,
      } = getWeekDate();
      // 根据开始和结束时间生成列表
      const date_list = getListByTime(startTime, endTime);
      // 定义响应对象
      const result = {};
      // 挂载日期列表
      result.date_list = date_list;
      // 异步获取用户签到源数据
      const [usererr, userData] =
      await this.signService.findUserSignByTime(startTime, endTime, id);
      if (usererr) {
        ctx.body = errorResponse(usererr.message);
        return;
      }
      // 数据加工
      const Data = UserDataAssembly(date_list, userData);
      result.user_sign = Data;
      ctx.body = successResponse(result);
    } else {
      ctx.body = response(httpState.INVALID_PARAMS, null, '参数错误');
    }
  }

  /**
   *
   *根据ID获取团队详细签到数据
   */
  async findTeamSignById(ctx) {
    const {
      type,
    } = ctx.request.query;
    const {
      id,
    } = ctx.request.params;
    if (!Number.isFinite(id)) {
      ctx.body = response(httpState.INVALID_PARAMS, null, '参数错误');
      return;
    }
    if (type === 'today') {
      const date = getTodayDate();
      const [err, result] = await this.signService.findTeamToadyById(id, date);
      if (err) {
        ctx.body = errorResponse(err.message);
        return;
      }
      ctx.body = successResponse(result);
    } else if (type === 'week') {
      const {
        startTime,
        endTime,
      } = getWeekDate();
      // 根据开始和结束时间生成列表
      const date_list = getListByTime(startTime, endTime);
      // 定义响应对象
      const result = {};
      // 挂载日期列表
      result.date_list = date_list;
      // 获取团队列表
      const [teamListerr, teamList] = await this.signService.findTeamList();
      if (teamListerr) {
        ctx.body = errorResponse(teamListerr.message);
        return;
      }
      // 异步获取所有团队签到源数据,该数据需进一步加工
      const [err, data] = await this.signService.findTeamListByTime(startTime, endTime);
      if (err) {
        ctx.body = errorResponse(err.message);
        return;
      }
      // 对团队签到的源数据进行加工
      const TeamData = TeamDataAssembly(teamList, data);
      const Data = TeamData.filter((item) => (Number(item.id) === Number(id)));
      result.team_sign = Data;
      ctx.body = successResponse(result);
    } else {
      ctx.body = response(httpState.INVALID_PARAMS, null, '参数错误');
    }
  }

  /**
   *
   *获取所有团队时间段内签到总计
   */
  async findTeamListByTime(ctx) {
    // 获取开始时间和结束时间
    const {
      start,
      end,
    } = ctx.request.query;
    // 获取请求参数 user_id 和 team_id
    const {
      user_id,
      team_id,
    } = ctx.request.query;
    // 日期的格式化与容错处理
    const {
      startTime,
      endTime,
    } = TimeFitter(start, end);
    // 根据开始和结束时间生成列表
    const date_list = getListByTime(startTime, endTime);
    // 定义响应对象
    const result = {};
    // 挂载日期列表
    result.date_list = date_list;
    // 获取团队列表
    const [teamListerr, teamList] = await this.signService.findTeamList();
    if (teamListerr) {
      ctx.body = errorResponse(teamListerr.message);
      return;
    }
    // 未取得参数: user_id 和 team_id,执行默认查询
    if (!(user_id || team_id)) {
      // 异步获取所有团队签到源数据,该数据需进一步加工
      const [err, data] = await this.signService.findTeamListByTime(startTime, endTime);
      if (err) {
        ctx.body = errorResponse(err.message);
        return;
      }
      // 异步获取所有成员签到总计
      const [counterr, countData] = await this.signService.findUserListByTime(startTime, endTime);
      if (counterr) {
        ctx.body = errorResponse(counterr.message);
        return;
      }
      // 对团队签到的源数据进行加工
      const TeamData = TeamDataAssembly(teamList, data);
      // 挂载信息
      // 所有成员签到总计
      result.count_list = countData;
      // 所有团队签到总计
      result.team_list = TeamData;
    } else {
      if (user_id) {
        if (!(user_id * 1)) {
          ctx.body = response(httpState.INVALID_PARAMS, null, '参数错误');
          return;
        }
        // 异步获取用户签到源数据
        const [usererr, userData] =
        await this.signService.findUserSignByTime(startTime, endTime, user_id);
        if (usererr) {
          ctx.body = errorResponse(usererr.message);
          return;
        }
        // 数据加工
        const Data = UserDataAssembly(date_list, userData);
        // 数据挂载
        result.user_sign = Data;
      }
      if (team_id) {
        if (!(team_id * 1)) {
          ctx.body = response(httpState.INVALID_PARAMS, null, '参数错误');
          return;
        }
        // 异步获取所有团队签到源数据,该数据需进一步加工
        const [err, data] = await this.signService.findTeamListByTime(startTime, endTime);
        if (err) {
          ctx.body = errorResponse(err.message);
          return;
        }
        // 对团队签到的源数据进行加工
        const TeamData = TeamDataAssembly(teamList, data);
        const Data = TeamData.filter((item) => (Number(item.id) === Number(team_id)));
        result.team_sign = Data;
      }
    }
    ctx.body = successResponse(result);
  }
}

