import { expect } from 'chai';
import initDB from '../../src/common/db';
import { TeamService } from '../../src/modules/team';

describe('# 团队Service', () => {
  let service;
  before(() => {
    initDB();
    service = new TeamService();
  });

  it('findAll() 返回结果为数组', async () => {
    const [, result] = await service.findAll();
    expect(result).to.be.a('array');
  });
});
