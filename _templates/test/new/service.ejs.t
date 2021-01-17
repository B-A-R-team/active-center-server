---
to: test/<%= h.changeCase.lcFirst(name) %>/service.test.js
---
import { expect } from 'chai';
import initDB from '../../src/common/db';
import { <%= name %>Service } from '../../src/modules/<%= h.changeCase.lcFirst(name) %>';

describe('# <%= name %>Service', () => {
  let service;
  before(() => {
    initDB();
    service = new <%= name %>Service();
  });

  it('findAll() 返回结果为数组', async () => {
    const [, result] = await service.findAll();
    expect(result).to.be.a('array');
  });
});
