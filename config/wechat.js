/** 主要用于封装开发微信公众平台的所有方法  **/
const https = require('https'), //
    util = require('util'),   // 提供常用函数的集合:格式化字符串、对象的序列化、实现对象继承等常用方法
    fs = require('fs'), //node自带fs文件系统
    iconv = require("iconv-lite");   // 转换编码

const accessTokenJson = require('./access_token');

let WeChat = function (config) {
    this.config = config;
    this.token = config.token;
    this.appID = config.appID;
    this.appScrect = config.appScrect;
    this.apiDomain = config.apiDomain;
    this.apiURL = config.apiURL;

    // 处理https Get请求
    this.requestGet = function (url) {
        return new Promise(function (resolve, reject) {   // 将异步操作以同步操作的流程表达出来
            https.get(url, function (res) {
                var buffer = [],
                    size = 0,
                    result = '';
                res.on('data', function (data) {
                    buffer.push(data);
                    size += data.length;
                });
                res.on('end', function () {
                    var buff = Buffer.concat(buffer, size);
                    result = iconv.decode(buff, "utf8");
                    resolve(result);   // 返回最后结果
                });
            }).on('error', function (err) {
                reject(err);
            })
        });
    }
    // 获取微信access_token
    this.getAccessToken = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            var currentTime = new Date().getTime();   // 获取当前的时间戳
            url = util.format(that.apiURL.accessTokenApi, that.apiDomain, that.appID, that.appScrect);
            // 判断本地存储的access_token是否有效
            if (accessTokenJson.access_token === '' || accessTokenJson.expires_time < currentTime) {
                that.requestGet(url).then(function (data) {
                    var result = JSON.parse(data);
                    if (data.indexOf('errcode') < 0) {   // 成功
                        accessTokenJson.access_token = result.access_token;
                        accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
                        fs.writeFile('./access_token.json', JSON.stringify(accessTokenJson));  // 更新本地存储access_token和expires_time
                        resolve(accessTokenJson.access_token);   // 返回本地存储的access_token
                    } else {   // 失败
                        resolve(result);   // 将错误返回
                    }
                });
            } else {
                resolve(accessTokenJson.access_token);   // 返回本地存储的access_token
            }
        });
    }
}

module.exports = WeChat;