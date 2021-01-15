const config = require('./package.json');

module.exports = {
  apps: [
    {
      name: config.name,
      script: 'dist/bin/start.js',
      interpreter: 'node',
      env: {
        PORT: '2048',
        MODE: 'prod',
      },
    },
  ],
};
