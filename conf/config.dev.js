module.exports = {
    "debug": false,

    "requestTimeout": 10000,
    "serverPort": 5001,
    "clusterCount": 0,

    "lruMaxAge": 2,
    "lruMax": 2,

    "uploadTempDir": "/tmp/qlchat_h5_dev/upload",
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
    "cdnUrl": "http://dev.res.qlchat.com",

    // 阿里云oss配置
    aliyunOss: {
        "endPoint": "http://oss.aliyuncs.com/",
        "accessId": "",
        "accessKey": "",
        "bucketName": "",
        "cdnUrl": ""
    }
};
