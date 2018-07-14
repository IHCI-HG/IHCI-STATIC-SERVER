var fs = require('fs'),
	_ = require('underscore'),
    Handlebars = require('handlebars'),

	md5 = require('../md5/md5'),
	header = require('../header/header'),
    cache = require('../cache/cache').local();

require('../hbars-helper/compare');
require('../hbars-helper/label-combine');
require('../hbars-helper/date-format');
require('../hbars-helper/money');

/**
 * 处理html类型文件响应
 * @param  {Object}   req     请求对象
 * @param  {Object}   res     响应对象
 * @param  {function} next    路由指针
 * @param  {Object}   options 配置项
 *     options.filePath   String    必填项，指示读取html的全路径地址
 *     options.headers    Object    可选项，存在时，则将headers中的内容设置到res中作为响应头
 *     optinos.renderData       Object    可选项，存在时，会对Html内容作数据渲染注入（使用handlebars作为引擎）
 *     options.filVars          Object    可选项，存在时，会对Html中声明的变量作属性注入
 * @return {[type]}           [description]
 */
var handle = function (ctx, opts) {
    var options = opts || {},
        req = ctx.request,
        res = ctx.response;

	var filePath = options.filePath,
        pathname = req.path,
		cacheKey,
		html;

	// 生成缓存 key
    cacheKey = md5(pathname + filePath);

    try {
        html = cache.get(cacheKey);
        if (!html) {
            html = fs.readFileSync(filePath, 'utf8');
            cache.set(cacheKey, html);
        }
    } catch(e) {
        console.error('HTML Process Error', e);
        return;
    }

    // 无法正确读取 HTML
    // 交给后续的 404 处理
    if (!html) {
        console.error('empty html content');
        return;
    }

    // 对html作渲染处理（使用Handlebars渲染数据）
    if (options.renderData) {
        var template = Handlebars.compile(html);
        html = template(options.renderData || {});
    }

    // 对html注入相关变量
    if (options.fillVars) {
        html = fillHtmlVars(html, options.fillVars || {});
    }


    // 页面缓存时间固定为 10 分钟
    // header.cacheControl('10m', res);
    // header.expire('10m', res);

    // 设置文件类型
    header.contentType('html', res);

    // 读取 route 的配置并设置对应的 headers 信息
    var headers = options && options.headers;
    _.each(headers, function (value, key) {
        if (_.isFunction(value)) {
            value = value.call();
        }
        res.set(key, value);
    });

    // 返回网页
    res.status = 200;
    res.body = html;
};

/**
 * 将html文本中以[[keyname]]括起来的变量名用data中对应keyname的值作替换
 * @param  {[type]} html [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
var fillHtmlVars = function (html, data) {
    _.each(data, function (value, key) {
        var jsonV;
        if (_.isString(value)) {
            jsonV = value;
        } else {
            jsonV = JSON.stringify(value);
        }
        html = html.replace(new RegExp('\\[\\[' + key + '\\]\\]', 'g'), jsonV);
    });

    return html;
};


module.exports = handle;
