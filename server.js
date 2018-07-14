var koa = require('koa'),
    logger = require('koa-morgan'),
    _ = require('underscore'),
    bodyParser = require('koa-bodyparser'),
    jsonp = require('koa-jsonp'),
    path = require('path'),

    conf = require('./conf'),
    // api = require('./middleware/api/api'),
    route = require('./middleware/router/router'),

    dangerDetect = require('./middleware/danger-detect/danger-detect'),
    staticc = require('./middleware/static/static'),
    notFound = require('./middleware/not-found/not-found'),

    routesPath = path.resolve(__dirname, './routes'),

    app = koa();

/**
 * 初始化服务（启用中间件）
 * @return {[type]} [description]
 */
function init() {
    var name = conf.name,
        version = conf.version,
        mode = conf.mode,
        port = conf.serverPort;

    // 配置常用变量
    app.name = name;
    app.version = version;
    app.mode = mode;
    // app.enable('trust proxy');

    //set signed cookie keys
    app.keys = ['receiver', 'AsdEOooSMZW..@Fs212.'];

    // body-parser
    app.use(bodyParser());

    // Todo 日志打印
    /**
     * current date
     */

    logger.token('date', function getDateToken(req, res, format) {
        var date = new Date();
        switch (format || 'web') {
            case 'clf':
                return clfdate(date);
            case 'iso':
                return date.toISOString();
            case 'web':
                return date.toUTCString();
            case 'default':
                return date.toString();
        }
    });
    app.use(logger.middleware(':remote-addr - :remote-user [:date[default]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'));
    // app.use(logger('combined'));

    // 危险检测
    app.use(dangerDetect());

    // jsonp支持
    app.use(jsonp());

    // 启用API
    // var apiRouter = api();
    // app
    //   .use(apiRouter.routes())
    //   .use(apiRouter.allowedMethods());

    // 启用路由
    // var routeRouter = route(routesPath);
    // app
    //     .use(routeRouter.routes())
    //     .use(routeRouter.allowedMethods());

    // 启用静态文件
    app.use(staticc());

    // 页面不存在
    app.use(notFound());

    // 配置监听端口
    var serverOptions = [
        port
    ];

    // 配置监听host
    if (conf.host) {
        serverOptions.push(conf.host);
    }

    // 监听回调
    serverOptions.push(function () {
        console.log('[mode:', mode, '] listening on port ', port);
    });
    return app.listen.apply(app, serverOptions);
}

exports.app = app;
exports.init = init;
