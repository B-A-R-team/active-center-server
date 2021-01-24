import {
  QueryTypes,
} from 'sequelize';
import Sign from './entity';
import catchAwaitErr from '../../common/utils/catchAwaitErr';
import initDB from '../../common/db';

const sequelize = initDB();

export default class SignService {
  constructor(InjectModel = Sign) {
    this.sign = InjectModel;
    this.sequelize = sequelize;
  }

  /**
   *添加签到记录
   */
  async signIn(user_id, admin_id) {
    const result = await catchAwaitErr(this.sign.create({
      user_id,
      admin_id,
    }));

    return result;
  }

  /**
   *
   *根据ID返回当天的用户签到信息
   */
  async findToadySignByUserId(id) {
    const result = await catchAwaitErr(this.sequelize.query(`SELECT user_id,user_name,sign_time FROM signs_users_teams WHERE user_id=${id} AND Date(sign_time)=Date(now());`, {
      type: QueryTypes.SELECT,
    }));
    return result;
  }

  /**
   *
   *获取团队列表
   */
  async findTeamList() {
    const result = await catchAwaitErr(this.sequelize.query('SELECT id, name FROM Teams;', {
      type: QueryTypes.SELECT,
    }));
    return result;
  }

  /**
   *
   *获取时间段内所有成员签到总计
   */
  async findUserListByTime(startTime, endTime) {
    const result = await catchAwaitErr(this.sequelize.query(`SELECT
    count,
    date 
  FROM
    day_signs_count_users 
    WHERE date BETWEEN '${startTime}' AND '${endTime}';`, {
      type: QueryTypes.SELECT,
    }));
    return result;
  }

  /**
   *
   *获取所有团队时间段内的签到总计
   */
  async findTeamListByTime(startTime, endTime) {
    const result = await catchAwaitErr(this.sequelize.query(`SELECT day_count,date,team_id,team_name FROM day_signs_count_team WHERE date BETWEEN '${startTime}' AND '${endTime}';`, {
      type: QueryTypes.SELECT,
    }));
    return result;
  }

  /**
   *
   *获取时间段内指定用户签到记录
   */
  async findUserSignByTime(startTime, endTime, user_id) {
    const result = await catchAwaitErr(this.sequelize.query(`SELECT date FROM day_signs_user WHERE user_id=${user_id} AND date BETWEEN '${startTime}' AND '${endTime}';`, {
      type: QueryTypes.SELECT,
    }));
    return result;
  }

  /**
   *
   *获取指定用户指定日期的签到记录
   */
  async findUserTodayById(id, Date) {
    const result = await catchAwaitErr(this.sequelize.query(`SELECT user_id,sign_time,user_name,team_name FROM signs_users_teams WHERE user_id=${id} AND Date(sign_time)='${Date}';`, {
      type: QueryTypes.SELECT,
    }));
    return result;
  }

  async findTeamToadyById(id, Date) {
    const result = await catchAwaitErr(this.sequelize.query(`SELECT user_id,sign_time,user_name,team_name,team_id FROM signs_users_teams WHERE team_id=${id} AND Date(sign_time)='${Date}';`, {
      type: QueryTypes.SELECT,
    }));
    return result;
  }
}
