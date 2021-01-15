import Router from '@koa/router';
import routerGroup from './common/utils/routerGroup';
import { UserController } from './modules/user';

const router = new Router();

// 显示所有路由
router.get('/', async (ctx) => {
  const routes = router.stack.map((item) => {
    const method = item.methods.filter((route) => route !== 'HEAD');
    return `${method} - ${item.path}`;
  });
  ctx.body = routes;
});

const rootRoutes = routerGroup('/api/v1', (rootRouter) => {
  /**
   * 用户路由
   * GET    api/v1/user 查找全部用户
   */
  const userRoutes = routerGroup('/user', (userRouter) => {
    const userController = new UserController();
    /**
     * 如果直接写成 userRouter.get('/', userController.findAll);
     * this指向会出问题 -> undefined
     * 或者可以写成 userRouter.get('/', userController.findAll.bind(userController))
     */
    userRouter.get('/', (ctx) => userController.findAll(ctx));
  });


  // 挂载所有路由
  rootRouter.use(userRoutes.routes());
});

router.use(rootRoutes.routes());

export default router;
