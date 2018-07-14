var static = require('koa-static'),

    conf = require('../../conf');

module.exports = function () {
    return static(conf.root, {
        maxAge: conf.mode === 'prod' ? 30 * 24 * 3600 * 1000 : 0
    });
};
