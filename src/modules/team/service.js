import catchAwaitErr from '../../common/utils/catchAwaitErr';
import Team from './entity';

export default class TeamService {
  constructor(InjectModel = Team) {
    this.team = InjectModel;
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
