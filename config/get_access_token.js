const qs = require('querystring'); //请求querystring模块
const request = require('request'); //加载request组件
const fs = require('fs');//请求fs文件系统模块

//
let wechatToken = {

    awaitToken: function (options) {//获得组装后的数据
        return new Promise((resolve, reject) => {
            let currentTime = new Date().getTime();   // 获取当前的时间戳
            this.getToken().then((accessTokenJson) => {
                // console.log(accessTokenJson)
                // 判断本地存储的access_token是否有效
                if (accessTokenJson.access_token === '' || accessTokenJson.expires_time < currentTime) {//判断access_token.json中的access_token是否为空和当前的时间戳是否超过access_token的时间戳
                    return this.resquest(options, accessTokenJson)//请求微信的access_token接口
                } else {
                    resolve(accessTokenJson)   // 返回本地存储的access_token
                }
            }).then((data) => {
                resolve(data)//// 返回重组后的access_token数组
            }).catch(function (error) {
                console.log('error: ' + error);//catch err
            })
        });  
    },

    resquest: function (options, accessTokenJson) { //传入两个参数options包含请求的方式GET or POST，accessTokenJson为access_token.json中的所有
        var _this = this
        return new Promise((resolve, reject) => {
            request(options, async function (err, res, body) {
                var result = JSON.parse(body);
                if (!err) {   // 成功
                    accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
                    try {
                        let isSuccess = await _this.setToken(accessTokenJson, result)   //更新本地存储access_token和expires_time
                        isSuccess && resolve(accessTokenJson);
                    } catch (error) {
                        console.log('isSuccess Error')
                    }  
                } else {   // 失败
                    reject(err);
                }

                // if (res) {
                //     resolve(JSON.parse(body));
                // } else {
                //     reject(err);
                // }
            });
        });
    },
    //access_token保存
    getToken: function () {
        return new Promise((resolve, reject) => {
            fs.readFile(__dirname + '/access_token.json', { flag: 'r+', encoding: 'utf8' }, (err, res) => {
                if (!err) {
                    // this.setToken(res)
                    console.log(res)
                    resolve(JSON.parse(res))
                } else {
                    reject('err');
                }
            })
        })

    },

    //access_token更新
    setToken: function (data,result) {
        return new Promise((resolve, reject) => {
            data.access_token = result.access_token
            data.expires_in = result.expires_in
            fs.writeFile(__dirname + '/access_token.json', JSON.stringify(data), function (err) {
                if (!err) {
                    console.log('写入成功')
                    resolve('success')
                    // console.log(data)
                } else {
                    console.log(err)
                }
            })
        })
    }
}

getAccessToken = async function (req, res, next) {
    let config = {
        appId: 'wx4b1e5e809cf26a5d',
        appSecret: '09cf424f51846a4ab4bd2d5a4b45a8d1'
    },
        queryParams = {
            'grant_type': 'client_credential',
            'appid': config.appId,
            'secret': config.appSecret
        };

    let wxGetAccessTokenBaseUrl = 'https://api.weixin.qq.com/cgi-bin/token?' + qs.stringify(queryParams);
    let options = {
        method: 'GET',
        url: wxGetAccessTokenBaseUrl
    };
    let result = await wechatToken.awaitToken(options)
    if (result) {
        res.send(result)
    } else {
        res.send('something err')
    }
},


// 获取微信access_token
// this.getAccessToken = function () {
//     var that = this;
//     return new Promise(function (resolve, reject) {
//         var currentTime = new Date().getTime();   // 获取当前的时间戳
//         // 判断本地存储的access_token是否有效
//         if (accessTokenJson.access_token === '' || accessTokenJson.expires_time < currentTime) {
//             that.requestGet(url).then(function (data) {
//                 var result = JSON.parse(data);
//                 if (data.indexOf('errcode') < 0) {   // 成功
//                     accessTokenJson.access_token = result.access_token;
//                     accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
//                     fs.writeFile('./access_token.json', JSON.stringify(accessTokenJson));  // 更新本地存储access_token和expires_time
//                     resolve(accessTokenJson.access_token);   // 返回本地存储的access_token
//                 } else {   // 失败
//                     resolve(result);   // 将错误返回
//                 }
//             });
//         } else {
//             resolve(accessTokenJson.access_token);   // 返回本地存储的access_token
//         }
//     });
// }

module.exports = getAccessToken

