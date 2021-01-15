import http from 'http';
import bootstrap from '../main';

bootstrap().then((server) => {
  const httpServer = http.createServer(server.callback());
  httpServer.listen(process.env.PORT, () => {
    console.info(`running at port ${process.env.PORT}`);
  });
});
