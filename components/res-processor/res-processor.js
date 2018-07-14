
/**
 * 数据以jsonp格式响应
 * @param  {Object} ctx
 * @param  {Array} data  响应的数据（json对象）
 * @return {null}
 */
var processJsonpResponse = function (ctx, data) {
    var req = ctx.request,
        res = ctx.response,
        callbackFn = req.query.callback;

    ctx.status = 200;

    if (callbackFn) {
        ctx.set('Content-Type', 'application/javascript');
        ctx.body = callbackFn + '(' + JSON.stringify(data) + ')';
    } else {
        ctx.body = JSON.stringify(data);
    }
};

/**
 * 缺少参数时的响应方法(带上data时以data数据响应。默认以缺少参数提示信息响应)
 * @param  {[type]} ctx  [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
var paramMissError = function (ctx, data) {
    var req = ctx.request,
        res = ctx.response;

    console.error('[param miss error] req path: ', req.path, ', query: ', req.query);

    if (!data || 'string' === typeof data) {
        data = {
            success: false,
            state: {
                code: 1,
                msg: data || '缺少必要参数'
            }
        };
    }

    processJsonpResponse(ctx, data);
};

/**
 * 以状态码200响应，默认带上ok标识，可用msg替代
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
var ok = function (ctx, msg) {
    var sendText = msg || 'ok';

    ctx.status = 200;
    ctx.body = sendText;
};

/**
 * 禁止访问
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var forbidden = function (ctx, msg) {
    ctx.status = 403;

    if (msg && 'object' === typeof msg) {
        processJsonpResponse(ctx, msg);
        return;
    }

    ctx.body = msg || '无访问权限';
};

/**
 * 500内部服务错误
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @param  {[type]}   msg  [description]
 * @return {[type]}        [description]
 */
var error500 = function (ctx, error, msg) {
    console.error('[server error] request path:', ctx.request.path, '. error:', error);
    ctx.status = 500;
    ctx.body = msg || '内部服务错误';
};


module.exports.processJsonp = processJsonpResponse;
module.exports.jsonp = processJsonpResponse;
module.exports.paramMissError = paramMissError;
module.exports.ok = ok;
module.exports.forbidden = forbidden;
module.exports.error500 = error500;
