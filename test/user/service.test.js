/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import initDB from '../../src/common/db';
import { UserService } from '../../src/modules/user';

describe('# 用户Service', () => {
  /**
   * @type UserService
   */
  let service;
  before(() => {
    initDB();
    service = new UserService();
  });

  it('adapterUserData() 数据适配 => user.team为字符串', () => {
    const user = service.adapterUserData({
      id: 1,
      name: '123',
      stu_id: '123',
      gender: 1,
      phone: '123',
      class_name: '123',
      avatar_url: '123',
      comment: '123',
      createdAt: new Date(),
      updatedAt: new Date(),
      team_id: 1,
      Team: { name: '123' },
    });
    expect(user.team).to.be.a('string');
  });

  it('findAll() 返回结果为数组', async () => {
    const [, result] = await service.findAll();
    expect(result).to.be.a('array');
  });

  it('findById() 获取到的id正确', async () => {
    const [, user] = await service.findById(1);
    expect(user.id).to.be.eq(1);
  });

  it('findById() 不存在的ID，查出来为空', async () => {
    const [, user] = await service.findById(123456798);
    expect(user).to.not.exist;
  });

  it('findById() ID为负数，查出来为空', async () => {
    const [, user] = await service.findById(-1);
    expect(user).to.not.exist;
  });

  it('findByStuId() 获取到正确的学号', async () => {
    const [, user] = await service.findByStuId('184804314');
    expect(user.stu_id).to.be.eq('184804314');
  });

  it('findByStuId() 不存在学号，结果为空', async () => {
    const [, user] = await service.findByStuId('000000001');
    expect(user).to.not.exist;
  });

  it('findByStuId() number类型的学号，仍能获取', async () => {
    const [, user] = await service.findByStuId(184804314);
    expect(user.stu_id).to.be.eq('184804314');
  });

  it('findByStuId() 过长的学号，结果为空', async () => {
    const [, user] = await service.findByStuId(
      '999999999999999999999999999999999999999999999999'
    );
    expect(user).to.not.exist;
  });

  it('findByCardId() 获取正确的用户', async () => {
    const [, user] = await service.findByCardId('1234567890');
    expect(user.id).to.be.eq(1);
  });

  it('register() 注册用户成功', async () => {
    const [, { result }] = await service.register({
      stu_id: `${Date.now()}`.slice(4),
      password: '123456',
      name: '测试',
      class_name: '2018.net2',
      team_id: 1,
    });
    expect(result).to.be.eq(true);
  });

  it('register() 相同学号，注册用户失败', async () => {
    const [err] = await service.register({
      stu_id: '184804314',
      password: '123456',
      name: '测试',
      class_name: '2018.net2',
      team_id: 1,
    });
    expect(err).to.exist;
  });

  it('register() 姓名长度超过15字符，注册用户失败', async () => {
    const [err] = await service.register({
      stu_id: `${Date.now()}`.slice(4),
      password: '123456',
      name: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试',
      class_name: '2018.net2',
      team_id: 1,
    });
    expect(err).to.exist;
  });

  it('register() 学号长度超过9字符，注册用户失败', async () => {
    const [err] = await service.register({
      stu_id: `${Date.now()}`.slice(3),
      password: '123456',
      name: '测试',
      class_name: '2018.net2',
      team_id: 1,
    });
    expect(err).to.exist;
  });

  it('login() 登录成功', async () => {
    const [, user] = await service.login('184804314', '123456');
    expect(user.id).to.be.eq(1);
  });

  it('login() 登录失败，返回结果为空', async () => {
    const [, user] = await service.login('184804314', '654987');
    expect(user).to.not.exist;
  });

  it('updateCardId() 修改卡号成功', async () => {
    const [, result] = await service.updateCardId(2, '1234567891');
    expect(result[0]).to.be.eq(1);
  });

  it('updateCardId() 修改卡号重复，失败', async () => {
    const [err] = await service.updateCardId(2, '1234567890');
    expect(err).to.exist;
  });

  it('updateCardId() 卡号长度超过10，失败', async () => {
    const [err] = await service.updateCardId(2, '12345678901');
    expect(err).to.exist;
  });

  it('updatePartial() 修改部分用户信息，成功', async () => {
    const [, result] = await service.updatePartial(2, {
      gender: 1,
      avatar_url: '123',
      phone: '12345678922',
      comment: 'service测试',
    });
    expect(result[0]).to.be.oneOf([0, 1]);
  });

  it('updatePartial() 修改部分用户，性别输入为`a`，失败', async () => {
    const [err] = await service.updatePartial(2, {
      gender: 'a',
      avatar_url: '123',
      phone: '12345678922',
      comment: 'service测试',
    });
    expect(err).to.exist;
  });

  it('updatePartial() 修改部分用户，电话号长度超过11，失败', async () => {
    const [err] = await service.updatePartial(2, {
      gender: 1,
      avatar_url: '123',
      phone: '1234567892211',
      comment: 'service测试',
    });
    expect(err).to.exist;
  });
});
