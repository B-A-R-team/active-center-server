import request from 'supertest';
import {
  expect,
} from 'chai';
import bootstrap from '../../src/main';
import {
  generateToken,
} from '../../src/common/utils/tokenHelper';

describe('# 签到Router', () => {
  const token = generateToken(2, '2');
  let server;

  before(async () => {
    server = (await bootstrap()).listen(8088);
  });

  after(() => {
    server.close();
  });

  it('POST /api/sign 参数正常时', async () => {
    const res = await request(server)
      .post('/api/sign')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user_id: 5,
        admin_id: 3,
      });
    expect(res.body.code).to.be.eq(200);
  });

  it('POST /api/sign 参数缺失时', async () => {
    const res = await request(server)
      .post('/api/sign')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user_id: 5,
      });
    expect(res.body.code).to.be.eq(400);
  });

  it('GET /api/sign', async () => {
    const res = await request(server)
      .get('/api/sign')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.code).to.be.eq(200);
  });

  it('GET /api/sign/user/:id?type=today 参数type的值为today时', async () => {
    const res = await request(server)
      .get('/api/sign/user/5')
      .set('Authorization', `Bearer ${token}`)
      .query({
        type: 'today',
      });
    expect(res.body.code).to.be.eq(200);
  });

  it('GET /api/sign/user/5?type=week 参数type的值为week时', async () => {
    const res = await request(server)
      .get('/api/sign/user/5')
      .set('Authorization', `Bearer ${token}`)
      .query({
        type: 'week',
      });
    expect(res.body.code).to.be.eq(200);
  });

  it('GET /api/sign/user/5?type=kkkooo 参数type的值为其他字符串时', async () => {
    const res = await request(server)
      .get('/api/sign/user/5')
      .set('Authorization', `Bearer ${token}`)
      .query({
        type: 'kkkooo',
      });
    expect(res.body.code).to.be.eq(400);
  });

  it('GET /api/sign/user/g?type=today 动态路由参数非数字时', async () => {
    const res = await request(server)
      .get('/api/sign/user/g')
      .set('Authorization', `Bearer ${token}`)
      .query({
        type: 'today',
      });
    expect(res.body.code).to.be.eq(400);
  });

  it('GET /api/sign/team/1?type=toady 参数type的值为today时', async () => {
    const res = await request(server)
      .get('/api/sign/team/1')
      .set('Authorization', `Bearer ${token}`)
      .query({
        type: 'today',
      });
    expect(res.body.code).to.be.eq(200);
  });

  it('GET /api/sign/team/1?type=week 参数type的值为week时', async () => {
    const res = await request(server)
      .get('/api/sign/team/1')
      .set('Authorization', `Bearer ${token}`)
      .query({
        type: 'week',
      });
    expect(res.body.code).to.be.eq(200);
  });

  it('GET /api/sign/team/1?type=kkkooo 参数type的值为其他字符串时', async () => {
    const res = await request(server)
      .get('/api/sign/team/1')
      .set('Authorization', `Bearer ${token}`)
      .query({
        type: 'kkkooo',
      });
    expect(res.body.code).to.be.eq(400);
  });

  it('GET /api/sign/team/g?type=today 动态路由参数非数字时', async () => {
    const res = await request(server)
      .get('/api/sign/team/g')
      .set('Authorization', `Bearer ${token}`)
      .query({
        type: 'today',
      });
    expect(res.body.code).to.be.eq(400);
  });

  it('GET /api/sign/time 不传参数时', async () => {
    const res = await request(server)
      .get('/api/sign/time')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.code).to.be.eq(200);
  });

  it('GET /api/sign/time?start=2021-01-20 只传开始日期时', async () => {
    const res = await request(server)
      .get('/api/sign/time')
      .set('Authorization', `Bearer ${token}`)
      .query({
        start: '2021-01-02',
      });
    expect(res.body.code).to.be.eq(200);
  });

  it('GET /api/sign/time?end=2021-01-26 只传结束日期时', async () => {
    const res = await request(server)
      .get('/api/sign/time')
      .set('Authorization', `Bearer ${token}`)
      .query({
        end: '2021-01-12',
      });
    expect(res.body.code).to.be.eq(200);
  });

  it('GET /api/sign/time?start=2021-01-20&end=2021-01-29', async () => {
    const res = await request(server)
      .get('/api/sign/time')
      .set('Authorization', `Bearer ${token}`)
      .query({
        start: '2021-01-02',
        end: '2021-01-12',
      });
    expect(res.body.code).to.be.eq(200);
  });

  it('GET /api/sign/time?start=2021-01-20&end=2021-01-29&team_id=2', async () => {
    const res = await request(server)
      .get('/api/sign/time')
      .set('Authorization', `Bearer ${token}`)
      .query({
        start: '2021-01-20',
        end: '2021-01-29',
        team_id: 2,
      });
    expect(res.body.code).to.be.eq(200);
  });

  it('GET /api/sign/time?start=2021-01-20&end=2021-01-29&team_id=g 参数team_id的值为非数字时', async () => {
    const res = await request(server)
      .get('/api/sign/time')
      .set('Authorization', `Bearer ${token}`)
      .query({
        start: '2021-01-20',
        end: '2021-01-29',
        team_id: 'g',
      });
    expect(res.body.code).to.be.eq(400);
  });

  it('GET /api/sign/time?start=2021-01-20&end=2021-01-29&user_id=5', async () => {
    const res = await request(server)
      .get('/api/sign/time')
      .set('Authorization', `Bearer ${token}`)
      .query({
        start: '2021-01-20',
        end: '2021-01-29',
        user_id: 5,
      });
    expect(res.body.code).to.be.eq(200);
  });

  it('GET /api/sign/time?start=2021-01-20&end=2021-01-29&user_id=g 参数user_id的值为非数字时', async () => {
    const res = await request(server)
      .get('/api/sign/time')
      .set('Authorization', `Bearer ${token}`)
      .query({
        start: '2021-01-20',
        end: '2021-01-29',
        user_id: 'g',
      });
    expect(res.body.code).to.be.eq(400);
  });

  it('GET /api/sign/time?start=2021-01-20&end=2021-01-29&team_id=2&user_id=5', async () => {
    const res = await request(server)
      .get('/api/sign/time')
      .set('Authorization', `Bearer ${token}`)
      .query({
        start: '2021-01-20',
        end: '2021-01-29',
        team_id: 2,
        user_id: 5,
      });
    expect(res.body.code).to.be.eq(200);
  });
});
