import http from 'http';
import bootstrap from '../main';

// eslint-disable-next-line no-console
console.log(`${process.env.MODE}环境`);

bootstrap().then((server) => {
  const httpServer = http.createServer(server.callback());
  httpServer.listen(process.env.PORT, () => {
    console.info(`running at port ${process.env.PORT}`);
  });
});
