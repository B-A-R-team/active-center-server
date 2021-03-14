import catchAwaitErr from '../../common/utils/catchAwaitErr';
import UserService from '../user/service';
import Team from './entity';

export default class TeamService {
  constructor(InjectModel = Team, InjectUserService = UserService) {
    this.team = InjectModel;
    this.userService = new InjectUserService();
  }

  /**
   * 获取所有团队
   */
  async findAll() {
    const [err, teams] = await catchAwaitErr(
      this.team.findAll({ where: { is_delete: false } })
    );
    try {
      const teamList = await Promise.all(
        teams.map(async (team) => {
          const [findUserErr, users] = await this.userService.findByTeam(
            team.id
          );
          if (findUserErr) {
            throw findUserErr;
          }
          return { ...team.dataValues, people_count: users.length };
        })
      );
      return [err, teamList];
    } catch (error) {
      return error;
    }
  }

  /**
   * 根据ID查找团队
   * @param {number} id 团队ID
   */
  async findById(id) {
    const result = await catchAwaitErr(
      this.team.findOne({ where: { id, is_delete: false } })
    );
    return result;
  }

  /**
   * 创建团队
   * @param {import('../../types').CreateTeamDto} team 团队
   */
  async create(team) {
    const result = await catchAwaitErr(this.team.create(team));
    return result;
  }
}
