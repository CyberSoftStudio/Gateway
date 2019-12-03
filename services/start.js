const { ConfigService } = require('../services');
const { Logger } = require('../common');

async function start(app) {
    return startServer(app);
}

function startServer(app) {
    const http = require('http');
    const server = http.createServer(app);
    const routes = require(__dirname + '../../routes');
    app.use('/', routes);
      // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });    
    // error handler
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json(err.message);
    });
    //start server
    server.listen(ConfigService.port, function () {
        Logger.log('Service start on port: ' + server.address().port);
    });
    return app
}

module.exports = {
    start,
    startServer
};