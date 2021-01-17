import Router from '@koa/router';
import routerGroup from './common/utils/routerGroup';
import { TeamController } from './modules/team';
import { UserController } from './modules/user';
import { RoleController } from './modules/role';
import { PermissionController } from './modules/permission';

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
 * POST   api/v1/register 注册
 * POST   api/v1/login 登录
 */
const rootRoutes = routerGroup('/api/v1', (rootRouter) => {
  const baseApiController = new UserController();
  rootRouter.post('/register', (ctx) => baseApiController.register(ctx));
  rootRouter.post('/login', (ctx) => baseApiController.login(ctx));
  /**
   * 用户路由
   * GET      api/v1/user 查找全部用户
   * GET      api/v1/user?id 根据ID查找
   * GET      api/v1/user?card_id 根据卡号查找
   * GET      api/v1/user?stu_id 根据学号查找
   * GET      api/v1/user/:id 根据ID查找用户
   * PATCH    api/v1/user/:id 修改部分信息
   * PATCH    api/v1/user/:id?bind=true 绑定卡号
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
   * POST   api/v1/role 创建角色
   */
  const roleRoutes = routerGroup('/role', (roleRouter) => {
    const roleController = new RoleController();

    roleRouter.get('/', (ctx) => roleController.findAll(ctx));
    roleRouter.post('/', (ctx) => roleController.create(ctx));
  });

  /**
   * 权限路由
   * GET    api/v1/permission 获取权限
   * POST   api/v1/permission 创建权限
   */
  const permissionRoutes = routerGroup('/permission', (permissionRouter) => {
    const permissionController = new PermissionController();

    permissionRouter.get('/', (ctx) => permissionController.findAll(ctx));
    permissionRouter.post('/', (ctx) => permissionController.create(ctx));
  });

  /**
   * 团队路由
   * GET    api/v1/team 获取所有团队信息
   * POST   api/v1/team 创建团队
   */
  const teamRoutes = routerGroup('/team', (teamRouter) => {
    const teamController = new TeamController();

    teamRouter.get('/', (ctx) => teamController.findAll(ctx));
    teamRouter.post('/', (ctx) => teamController.create(ctx));
  });

  // 挂载所有路由
  rootRouter.use(
    userRoutes.routes(),
    roleRoutes.routes(),
    permissionRoutes.routes(),
    teamRoutes.routes()
  );
});

router.use(rootRoutes.routes());

export default router;
