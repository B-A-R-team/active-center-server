---
to: test/<%= h.changeCase.lcFirst(name) %>/router.test.js
---
import request from 'supertest';
import { expect } from 'chai';
import bootstrap from '../../src/main';
import { generateToken } from '../../src/common/utils/tokenHelper';

describe('# <%= name %>Router', () => {
  const token = generateToken(1, '1');
  let server;

  before(async () => {
    server = (await bootstrap()).listen(8088);
  });

  after(() => {
    server.close();
  });

  it('GET /api/v1/<%= h.changeCase.lcFirst(name) %>', async () => {
    const res = await request(server)
      .get('/api/v1/<%= h.changeCase.lcFirst(name) %>')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.code).to.be.eq(200);
  });
});
