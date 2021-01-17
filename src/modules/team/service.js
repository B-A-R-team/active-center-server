import catchAwaitErr from '../../common/utils/catchAwaitErr';
import Team from './entity';

export default class TeamService {
  constructor(InjectModel = Team) {
    this.team = InjectModel;
  }

  /**
   * 获取所有团队
   */
  async findAll() {
    const result = await catchAwaitErr(
      this.team.findAll({ where: { is_delete: false } })
    );
    return result;
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
