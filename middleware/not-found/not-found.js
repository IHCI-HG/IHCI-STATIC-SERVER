// 统一 404 的情况下返回的内容
module.exports = function () {
    return function *(next) {
        this.throw(404, 'Page not Found!');
    };
};
