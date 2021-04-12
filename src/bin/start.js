import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import bootstrap from '../main';

// eslint-disable-next-line no-console
console.log(`${process.env.MODE}环境`);

const options = {
  key: fs.readFileSync(path.join(__dirname, '../../ssl/2_www.barteam.cn.key')),
  cert: fs.readFileSync(
    path.join(__dirname, '../../ssl/1_www.barteam.cn_bundle.crt')
  ),
};

bootstrap().then((server) => {
  if (process.env.HTTPS === 'https') {
    const httpsServer = https.createServer(options, server.callback());
    httpsServer.listen(process.env.PORT, () => {
      console.info(`[HTTPS] running at port ${process.env.PORT}`);
    });
  } else {
    const httpServer = http.createServer(server.callback());
    httpServer.listen(process.env.PORT, () => {
      console.info(`[HTTP] running at port ${process.env.PORT}`);
    });
  }
});
