import request from 'supertest';
import { expect } from 'chai';
import bootstrap from '../../src/main';
import { generateToken } from '../../src/common/utils/tokenHelper';

describe('# 权限Router', () => {
  const token = generateToken(1, '1');
  let server;

  before(async () => {
    server = (await bootstrap()).listen(8088);
  });

  after(() => {
    server.close();
  });

  it('GET /api/permission', async () => {
    const res = await request(server)
      .get('/api/permission')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.code).to.be.eq(200);
  });
});
