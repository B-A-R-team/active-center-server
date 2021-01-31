import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import staticServe from 'koa-static';
import path from 'path';
import jwt from './common/middlewares/jwt';
import router from './router';

async function bootstrap() {
  const app = new Koa();

  app.use(cors());
  app.use(bodyParser());
  app.use(jwt());
  app.use(staticServe(path.join(__dirname, '../public')));

  app.use(router.routes()).use(router.allowedMethods());

  return app;
}

export default bootstrap;
