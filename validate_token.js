var express = require('express'),   // 引入express模块
    crypto = require('crypto'),    // 引入加密模块
    config = require('./config/access_token.json'),   // 引入配置文件
    tools = require('./config/tools');   // 方法库
 


/* GET home page. */
let validateToken = function (req, res, next) {
    var signature = req.query.signature,   // 微信加密签名，signature结合了开发者填写的token参数和请求中的timestamp参数、nonce参数。
        timestamp = req.query.timestamp,   // 时间戳
        nonce = req.query.nonce,           // 随机数
        echostr = req.query.echostr;       // 随机字符串

    // 1）将token、timestamp、nonce三个参数进行字典序排序
    var array = [config.token, timestamp, nonce];
    array.sort();

    // 2）将三个参数字符串拼接成一个字符串进行sha1加密
    var string = array.join(''),
        hashCode = crypto.createHash('sha1'),   // 创建加密类型
        resultCode = hashCode.update(string, 'utf8').digest('hex');  // 对字符串进行加密

    //3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if (resultCode === signature) {
        res.send(echostr);
    } else {
        res.send('error!!!');
    }
}

module.exports = validateToken;