import request from 'supertest';
import { expect } from 'chai';
import bootstrap from '../../src/main';
import { generateToken } from '../../src/common/utils/tokenHelper';

describe('# 用户Router', () => {
  const token = generateToken(1, '1');
  let server;

  before(async () => {
    server = (await bootstrap()).listen(8088);
  });

  after(() => {
    server.close();
  });

  it('POST /api/register', async () => {
    const res = await request(server)
      .post('/api/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        stu_id: `${Date.now()}`.slice(4),
        password: '123456',
        name: '测试',
        class_name: '2018.net2',
        team_id: 1,
      });
    expect(res.body.code).to.be.eq(200);
  });

  it('POST /api/login', async () => {
    const res = await request(server)
      .post('/api/login')
      .set('Authorization', `Bearer ${token}`)
      .send({
        stu_id: '184804314',
        password: '123456',
      });
    expect(res.body.code).to.be.eq(200);
  });

  it('GET /api/user', async () => {
    const res = await request(server)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.code).to.be.eq(200);
  });

  it('GET /api/user/:id', async () => {
    const res = await request(server)
      .get('/api/user/1')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.code).to.be.eq(200);
  });

  it('GET /api/user?id=', async () => {
    const res = await request(server)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`)
      .query({ id: 1 });
    expect(res.body.code).to.be.eq(200);
  });

  it('GET /api/user?stu_id=', async () => {
    const res = await request(server)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`)
      .query({ stu_id: '184804314' });
    expect(res.body.code).to.be.eq(200);
  });

  it('GET /api/user?card_id=', async () => {
    const res = await request(server)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`)
      .query({ card_id: '1234567890' });
    expect(res.body.code).to.be.eq(200);
  });

  it('POST /api/user/:id', async () => {
    const res = await request(server)
      .patch('/api/user/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        gender: 1,
        avatar_url: 'http://www.barteam.cn/static/logo.jpg',
        phone: '12345678911',
        comment: '测试',
      });
    expect(res.body.code).to.be.eq(200);
  });
});
