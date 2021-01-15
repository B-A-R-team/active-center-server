import request from 'supertest';
import { expect } from 'chai';
import bootstrap from '../../src/main';

describe('# 用户Router', () => {
  let server;

  before(async () => {
    server = (await bootstrap()).listen(8088);
  });

  after(() => {
    server.close();
  });

  it('GET /api/v1/user', async () => {
    const res = await request(server).get('/api/v1/user');
    expect(res.body.code).to.be.eq(200);
  });
});
