import { expect } from 'chai';
import initDB from '../../src/common/db';
import { SignService } from '../../src/modules/sign';

describe('# 签到Service', () => {
/** @type SignService */
  let service;
  before(() => {
    initDB();
    service = new SignService();
  });
  it('signIn() 添加签到记录', async () => {
    const [, result] = await service.signIn(2, 3);
    expect(result.user_id).to.equal(2);
  });

  it('findTodaySignByUserId() 根据用户ID返回当天的签到记录', async () => {
    const [, result] = await service.findTodaySignByUserId(3);
    expect(result).to.an('array');
  });

  it('findTeamList() 获取团队列表', async () => {
    const [, result] = await service.findTeamList();
    expect(result).to.be.an('array');
  });

  it('findUserListByTime() 获取时间段内所有成员签到总计', async () => {
    const [, result] = await service.findUserListByTime('2021-02-20', '2021-02-28');
    expect(result).to.be.an('array');
  });

  it('findTeamListByTime() 获取所有团队时间段内的签到总计', async () => {
    const [, result] = await service.findTeamListByTime('2021-02-20', '2021-02-28');
    expect(result).to.be.an('array');
  });

  it('findUserSignByTime() 获取时间段内指定用户签到记录', async () => {
    const [, result] = await service.findUserSignByTime('2021-02-20', '2021-02-28', 5);
    expect(result).to.be.an('array');
  });

  it('findUserTodayById() 获取指定用户指定日期的签到记录', async () => {
    const [, result] = await service.findUserTodayById(5, '2021-02-20');
    expect(result).to.be.an('array');
  });

  it('findTeamToadyById() 获取指定团队指定日期的签到记录', async () => {
    const [, result] = await service.findTeamToadyById(99, '2021-02-28');
    expect(result).to.be.an('array');
  });
});
