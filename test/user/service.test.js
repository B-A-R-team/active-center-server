import { expect } from 'chai';
import initDB from '../../src/common/db';
import { UserService } from '../../src/modules/user';

describe('# 用户Service', () => {
  let service;
  before(() => {
    initDB();
    service = new UserService();
  });

  it('findAll() 返回结果为数组', async () => {
    const [, result] = await service.findAll();
    expect(result).to.be.a('array');
  });
});
