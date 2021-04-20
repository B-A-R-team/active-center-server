import Router from '@koa/router';
import multer from '@koa/multer';
import path from 'path';
import routerGroup from './common/utils/routerGroup';
import { TeamController } from './modules/team';
import { UserController } from './modules/user';
import { RoleController } from './modules/role';
import { PermissionController } from './modules/permission';
import { SignController } from './modules/sign';
import uploadConfig from './config/upload';

const avatarStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '..', uploadConfig.avatarDir));
  },
  filename(req, file, cb) {
    cb(
      null,
      file.fieldname +
        Date.now() +
        file.originalname.slice(file.originalname.indexOf('.'))
    );
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
});

const router = new Router();

// 显示所有路由
router.get('/', async (ctx) => {
  const routes = router.stack.map((item) => {
    const method = item.methods.filter((route) => route !== 'HEAD');
    return `${method} - ${item.path}`;
  });
  ctx.body = routes;
});

/**
 * 基础路由
 * POST   api/register 注册
 * POST   api/login 登录
 * POST   api/upload/avatar/:id 上传头像
 */
const rootRoutes = routerGroup('/api', (rootRouter) => {
  const baseApiController = new UserController();
  rootRouter.post('/register', (ctx) => baseApiController.register(ctx));
  rootRouter.post('/login', (ctx) => baseApiController.login(ctx));
  rootRouter.post('/upload/avatar/:id', uploadAvatar.single('avatar'), (ctx) =>
    baseApiController.uploadAvatar(ctx)
  );
  rootRouter.post('/wxminapplogin', (ctx) => baseApiController.WXMinApplogin(ctx));
  rootRouter.post('/bindwxminapp', (ctx) => baseApiController.BindWXMinApp(ctx));

  /**
   * 用户路由
   * GET      api/user 查找全部用户
   * GET      api/user?id 根据ID查找
   * GET      api/user?card_id 根据卡号查找
   * GET      api/user?stu_id 根据学号查找
   * GET      api/user/:id 根据ID查找用户
   * PATCH    api/user/:id 修改部分信息
   * PATCH    api/user/:id?bind=true 绑定卡号
   */
  const userRoutes = routerGroup('/user', (userRouter) => {
    const userController = new UserController();
    /**
     * 如果直接写成 userRouter.get('/', userController.findAll);
     * this指向会出问题 -> undefined
     * 或者可以写成 userRouter.get('/', userController.findAll.bind(userController))
     */
    userRouter.get('/', (ctx) => userController.findWhere(ctx));
    userRouter.get('/:id', (ctx) => userController.findById(ctx));
    userRouter.patch('/:id', (ctx) => userController.update(ctx));
  });

  /**
   * 角色路由
   * POST   api/role 创建角色
   */
  const roleRoutes = routerGroup('/role', (roleRouter) => {
    const roleController = new RoleController();

    roleRouter.get('/', (ctx) => roleController.findAll(ctx));
    roleRouter.post('/', (ctx) => roleController.create(ctx));
  });

  /**
   * 权限路由
   * GET    api/permission 获取权限
   * GET    api/permission/:id 根据ID获取权限
   * POST   api/permission 创建权限
   * PUT    api/permission/:id 修改权限
   */
  const permissionRoutes = routerGroup('/permission', (permissionRouter) => {
    const permissionController = new PermissionController();

    permissionRouter.get('/', (ctx) => permissionController.findAll(ctx));
    permissionRouter.get('/:id', (ctx) => permissionController.findById(ctx));
    permissionRouter.post('/', (ctx) => permissionController.create(ctx));
    permissionRouter.put('/:id', (ctx) => permissionController.update(ctx));
  });

  /**
   * 团队路由
   * GET    api/team 获取所有团队信息
   * POST   api/team 创建团队
   */
  const teamRoutes = routerGroup('/team', (teamRouter) => {
    const teamController = new TeamController();

    teamRouter.get('/', (ctx) => teamController.findAll(ctx));
    teamRouter.post('/', (ctx) => teamController.create(ctx));
  });

  /**
   * 签到路由
   * POST api/sign 添加签到记录
   * GET api/sign 获取所有团队一周内签到记录
   * GET api/sign/user/:id?type=today 根据用户ID查找当天签到数据
   * GET api/sign/user/:id?type=week 根据用户ID查找一周签到数据
   * GET api/sign/team/:id?type=today 根据团队ID查找当天签到数据
   * GET api/sign/team/:id?type=week 根据团队ID查找一周签到数据
   * GET api/sign/time?start='2021-01-12'&end='2021-01-20' 查找指定时间段内的签到数据
   *根据用户ID或团队ID查找指定时间段内的签到数据
   * GET api/sign/time?start='2021-01-12'&end='2021-01-20'&user_id=2
   * GET api/sign/time?start='2021-01-12'&end='2021-01-20'&team_id=16
   * GET api/sign/time?start='2021-01-12'&end='2021-01-20'&user_id=2&team_id=16
   */
  const signRoutes = routerGroup('/sign', (signRouter) => {
    const signController = new SignController();
    // 添加签到记录
    signRouter.post('/', (ctx) => signController.signIn(ctx));
    // 获取一周内的团队签到统计
    signRouter.get('/', (ctx) => signController.findTeamListByWeek(ctx));
    // 根据ID获取用户签到信息
    signRouter.get('/user/:id', (ctx) => signController.findUserSignById(ctx));
    // 根据ID获取团队签到信息
    signRouter.get('/team/:id', (ctx) => signController.findTeamSignById(ctx));
    // 获取一段时间内的签到统计
    signRouter.get('/time', (ctx) => signController.findTeamListByTime(ctx));
  });

  // 挂载所有路由
  rootRouter.use(
    userRoutes.routes(),
    roleRoutes.routes(),
    permissionRoutes.routes(),
    teamRoutes.routes(),
    signRoutes.routes()
  );
});

router.use(rootRoutes.routes());

export default router;
