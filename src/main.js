import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from './router';

async function bootstrap() {
  const app = new Koa();

  app.use(bodyParser());
  app.use(router.routes()).use(router.allowedMethods());

  return app;
}

export default bootstrap;
