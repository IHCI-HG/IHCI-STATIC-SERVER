var formidable = require('formidable'),
    mkdirp = require('mkdirp'),
    co = require('co'),
    fs = require('fs');

var parse = function(options, ctx) {
    if (!ctx) {
        ctx = options;
        options = {};
    }
    return function(done) {
        var form = options instanceof formidable.IncomingForm
            ? options: new formidable.IncomingForm(options);

        // 修正uploadDir不存在而报错的问题
        if (form.uploadDir && !(fs.existsSync(form.uploadDir, 0777))) {
            mkdirp.sync(form.uploadDir, 0777);
        }

        if (!form.encoding) {
            form.encoding = 'utf-8';
        }

        form.parse(ctx.req, function(err, fields, files) {
            if (err) {
                console.error('error in formidable middleware:', err);
                return done(err, {});
            }
            done(null, {
                fields: fields,
                files: files
            });
        });
    };
};

module.exports = function(options) {
    return function *(next) {
        var form = yield parse(options, this);
        this.request.body = form.fields;
        this.request.files = form.files;

        yield next;
    };
};
