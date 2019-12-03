const express = require('express');
const app = express();
const { Logger } = require('./common');

require('./services/start')
  .start(app)
  .then(() => Logger.log(`Application running...`))
  .catch(error => {
    Logger.error([`Error to run application:`, error])
  });
