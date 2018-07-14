

var getRawBody = function(ctx) {
    return function(done) {
        ctx.request.on('data', function(chunk) {
            ctx.rawBody += chunk.toString();
        });
        ctx.request.on('end', function() {
            done(null, {});
        });
    };
};

/**
 * 获取post text/plain数据，并以req.rawBody存储
 * 注： 该中间件需在body-parser前调用
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-03-29T10:43:47+0800
 * @param    {[type]}                           options [description]
 * @return   {[type]}                                   [description]
 */
module.exports = function (options) {
    // var opts = options || {};

    return function * (next) {
        yield getRawBody(this);
        yield next;
    };
};