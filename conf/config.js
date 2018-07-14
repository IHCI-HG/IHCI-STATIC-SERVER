module.exports = {
    "debug": false,

    // 请求超时配置
    "requestTimeout": 10000,

    // 默认服务端口
    "serverPort": 5001,

    // 实例开启个数（在开启cluster模式下有效）
    "clusterCount": 8,

    "lruMaxAge": 3600000,
    "lruMax": 500,

    "uploadTempDir": "/tmp/qlchat_h5/upload",
    "uploadCdnDir": "/data/res",
    // 默认cdn图片目录
    "defaultUploadCdnDir": 'upload',

    //默认静态资源目录
    "defaultStaticCdnDir": 'static',

    // aliyun oss 上传目录
    "defaultAliYunOssDir": "upload",

    // fis3上传文件大小限制
    "fis3MaxFileSize": 5 * 1024 * 1024,

    // 图片上传服务大小限制
    "maxImgFileSize": 5 * 1024 * 1024,
    "cdnUrl": "",

    aliyunOss: {
        "endPoint": "http://vpc100-oss-cn-hangzhou.aliyuncs.com/",
        "accessId": "",
        "accessKey": "",
        "bucketName": "",
        "cdnUrl": ""
    }
};
