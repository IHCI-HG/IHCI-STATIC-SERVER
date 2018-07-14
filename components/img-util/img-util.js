var gm = require('gm'),
    PngQuant = require('pngquant'),

    fs = require('fs'),
    path = require('path');


var syncCompressBuffer = function(ctx, filePath) {
    var params = ctx.request.body || {},
        gmStream = gm(filePath);

    for (var key in params) {
        var v = params[key];
        switch(key) {
            case 'resize':
                v = v.split(',');
                if (v.length < 2) {
                    break;

                // 使用^: 以最小边为剪裁依据
                } else if (v.length === 2) {
                    v.push('^');
                }
                gmStream.resize.apply(gmStream, v);
                gmStream
                    .gravity('Center')
                    .crop(v[0], v[1], '0', '0');
                break;
            case 'quality':
                // jpg、jpeg默认情况下压缩质量大概为75%，如非必要，不需要指定质量参数
                gmStream.quality(parseInt(v) || 80);
                break;
            case 'rotate':
                gmStream.rotate('rgba(255,255,255, 0)', parseInt(v));
                break;
        }
    }

    // 删除图片的EXIF, ICM等图片信息.
    gmStream.noProfile();

    return function(done) {

        // 可使用format方法，但效率不高使用identify效率高，且format参数可自由定制（此处为%m）
        // 具体参数可以参考gm官网:http://www.imagemagick.org/script/escape.php
        gmStream.identify('%m', function(err, format) {
            if (err) {
                console.error(err);
                done(err, null);
                return;
            }

            if ('PNG' === format) { 
                var pngQuantWriteStream = new PngQuant(),
                    buffers = [];

                pngQuantWriteStream.on('data', function(data) {
                    buffers.push(data);
                });

                pngQuantWriteStream.on('end', function(err, data) {
                    done(null, Buffer.concat(buffers));
                    gmStream = null;
                });      
                gmStream.stream().pipe(pngQuantWriteStream);
            } else {
                gmStream.toBuffer(function(e, buffer) {
                    if (e) {
                        console.error(e);
                        done(err, null);
                        return;
                    }

                    done(null, buffer);
                    gmStream = null;
                });
            }
        });
    };
};

var writeImgFileByGm = function (ctx, from, to, done) {
    var params = ctx.request.body || {},
        gmStream = gm(from);

    for (var key in params) {
        var v = params[key];
        switch(key) {
            case 'resize':
                v = v.split(',');
                if (v.length < 2) {
                    break;

                // 使用^: 以最小边为剪裁依据
                } else if (v.length === 2) {
                    v.push('^');
                }
                gmStream.resize.apply(gmStream, v);
                gmStream
                    .gravity('Center')
                    .crop(v[0], v[1], '0', '0');
                break;
            case 'quality':
                // jpg、jpeg默认情况下压缩质量大概为75%，如非必要，不需要指定质量参数
                gmStream.quality(parseInt(v) || 80);
                break;
            case 'rotate':
                gmStream.rotate('rgba(255,255,255, 0)', parseInt(v));
                break;
        }
    }

    // 删除图片的EXIF, ICM等图片信息.
    gmStream.noProfile();

    // 可使用format方法，但效率不高使用identify效率高，且format参数可自由定制（此处为%m）
    // 具体参数可以参考gm官网:http://www.imagemagick.org/script/escape.php
    gmStream.identify('%m', function(err, format) {
        if (err) {
            console.error(err);
            done && done(err, null);
            return;
        }

        var writeStream = fs.createWriteStream(to);

        if ('PNG' === format) {
            // try {
                gmStream.stream().pipe(new PngQuant()).pipe(writeStream);
            // } catch (e) {
            //     console.error(e);
            //     stdout.pipe(writeStream);
            // }
        } else {
            gmStream.stream().pipe(writeStream);
        }

        done && done(null, {
            success: true
        });

        // gmStream.stream(function(err1, stdout, stderr) {
        //     if (err1) {
        //         console.error(err1);
        //         return;
        //     }
        //     var writeStream = fs.createWriteStream(to);

        //     if ('PNG' === format) {
        //         // try {
        //             stdout.pipe(new PngQuant()).pipe(writeStream);
        //         // } catch (e) {
        //         //     console.error(e);
        //         //     stdout.pipe(writeStream);
        //         // }
        //     } else {
        //         stdout.pipe(writeStream);
        //     }

        //     gmStream = null;
        // });
    });

    console.log('from:', from, ' to:', to);
};

module.exports.writeImgByGm = writeImgFileByGm;
module.exports.syncCompressBuffer = syncCompressBuffer;
