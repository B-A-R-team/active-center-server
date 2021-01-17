import { expect } from 'chai';
import initDB from '../../src/common/db';
import { PermissionService } from '../../src/modules/permission';

describe('# 权限Service', () => {
  let service;
  before(() => {
    initDB();
    service = new PermissionService();
  });

  it('findAll() 返回结果为数组', async () => {
    const [, result] = await service.findAll();
    expect(result).to.be.a('array');
  });
});
