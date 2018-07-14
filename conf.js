var fs = require('fs'),
    path = require('path'),

    _ = require('underscore'),

    // 开发配置文件
    devConf = require('./conf/config.dev'),
    // 生产配置文件
    prodConf = require('./conf/config');

var root = path.resolve(__dirname, './public/'),
    favicon = path.resolve(root, 'favicon.ico'),

    conf = {
        root: root,
        favicon: favicon
    };

/**
 * 初始化配置
 * @param  {object} options 配置选项，可配置项mode,可选值为[development, test, prod]
 * @return {null}
 */
function init(options) {
    // 根据不同的模式加载不同的配置
    var mode = options.mode;

    if (mode === 'development') {
        conf = _.extend(conf, devConf);
    } else if (mode === 'prod') {
        conf = _.extend(conf, prodConf);
    }

    // 将配置项 export 出去
    update(conf);
}

/**
 * 更新配置项
 * @param  {object} data 配置参数字典
 * @return {[type]}      [description]
 */
function update(data) {
    _.each(data, function (value, key) {
        exports[key] = value;
    });
}

exports.init = init;
exports.update = update;
