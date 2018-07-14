var server = require('../../server'),
    conf = require('../../conf'),

    danger = require('./danger'),
    isXSS = danger.isXSS,

    app;

// 判断是否坏蛋
function detect(req, res) {
    return isXSS(req);
}

module.exports = function () {
    app = server.app;

    return function *(next) {
        var isDanger = detect(this.request, this.response);
        if (isDanger) {
            console.log('DANGER URL:', this.originalUrl);
            this.throw(403, '<h1>403</h1><h2>别闹了</h2>');
        } else {
            yield next;
        }
    };
};
