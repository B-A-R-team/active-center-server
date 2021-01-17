import { expect } from 'chai';
import initDB from '../../src/common/db';
import { RoleService } from '../../src/modules/role';

describe('# 角色Service', () => {
  let service;
  before(() => {
    initDB();
    service = new RoleService();
  });

  it('findAll() 返回结果为数组', async () => {
    const [, result] = await service.findAll();
    expect(result).to.be.a('array');
  });
});
